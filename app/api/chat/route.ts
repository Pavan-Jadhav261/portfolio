import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

// ─────────────────────────────────────────────────────────────────────────────
// 1. TOKEN SAVING CONFIGURATION & SYSTEM PROMPT CACHE
// ─────────────────────────────────────────────────────────────────────────────
const MAX_INPUT_CHARS = 240;      // Cut off giant spam inputs to save input tokens
const MAX_OUTPUT_TOKENS = 120;     // Strictly limit output tokens to 120 (~60-80 words)
const CACHE_TTL_MS = 60 * 60 * 1000; // 1-hour in-memory cache for common questions

let cachedSystemPrompt: string | null = null;

function getSystemPrompt(): string {
  if (cachedSystemPrompt) return cachedSystemPrompt;
  try {
    const promptPath = path.join(process.cwd(), "sytem-Prompt.md");
    if (fs.existsSync(promptPath)) {
      cachedSystemPrompt = fs.readFileSync(promptPath, "utf-8");
      return cachedSystemPrompt;
    }
  } catch (e) {
    console.error("Could not read sytem-Prompt.md:", e);
  }
  return "You are Pavan Jadhav's AI on his personal portfolio. Smart engineer. Short answers (2-3 sentences max). Real personality. Zero corporate cringe.";
}

// In-memory response cache to serve repeated queries with 0 token spend
const responseCache = new Map<string, { reply: string; timestamp: number }>();

// ─────────────────────────────────────────────────────────────────────────────
// 2. IN-MEMORY RATE LIMITER (Per IP, sliding 1-minute window)
// ─────────────────────────────────────────────────────────────────────────────
interface RateLimitRecord {
  timestamps: number[];
}

const ipRequestMap = new Map<string, RateLimitRecord>();
const MAX_REQUESTS_PER_MINUTE = 5;
const RATE_WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const record = ipRequestMap.get(ip) || { timestamps: [] };

  // Keep only timestamps within the rolling window
  const recent = record.timestamps.filter(t => now - t < RATE_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_MINUTE) {
    const oldest = recent[0];
    const retryAfter = Math.max(1, Math.ceil((RATE_WINDOW_MS - (now - oldest)) / 1000));
    return { limited: true, retryAfter };
  }

  recent.push(now);
  ipRequestMap.set(ip, { timestamps: recent });

  // Cleanup stale IPs if map grows large
  if (ipRequestMap.size > 1000) {
    for (const [key, val] of ipRequestMap.entries()) {
      if (val.timestamps.every(t => now - t > RATE_WINDOW_MS)) {
        ipRequestMap.delete(key);
      }
    }
  }

  return { limited: false, retryAfter: 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ZERO-TOKEN FAQ FAST-PATH
// Handles common portfolio queries locally without touching OpenAI API
// ─────────────────────────────────────────────────────────────────────────────
const FAQ_LOOKUP: Record<string, string> = {
  "what are your top projects?": "My top builds are Mentora AI (Socratic learning platform with local Gemma LLMs & AST visualizer), SchemeSathi (civic welfare discovery engine), and an edge-trained YOLO flower detector. Check the Work section for repos!",
  "what is your tech stack?": "Core stack: Python, TypeScript, PyTorch, YOLOv11, local LLMs (Gemma/Ollama), RAG, Next.js, FastAPI, and Docker. I specialize in post-training/fine-tuning & high-performance full-stack systems.",
  "tell me about mentora ai": "Mentora AI teaches students *how to think* rather than spoon-feeding answers. Built with local Gemma LLMs, Socratic prompts, AST algorithm visualizations, and RAG over coursework.",
  "how can i contact you?": "Hit me up directly at pavanjadhav5331@gmail.com or connect on LinkedIn at linkedin.com/in/pavan-jadhav261. Always open to talking AI engineering and hackathons!",
  "who are you?": "I'm Pavan Jadhav — CSE 3rd year at BITM, Ballari. 5× hackathon winner building at the intersection of local LLM fine-tuning, computer vision, and systems engineering."
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN CHAT HANDLER
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    // Determine client IP for rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";

    // 1. RATE LIMIT CHECK
    const { limited, retryAfter } = checkRateLimit(ip);
    if (limited) {
      return NextResponse.json(
        {
          reply: `Whoa, slow down! Rate limit hit (max ${MAX_REQUESTS_PER_MINUTE} msgs/min). Even GPUs need cooldown 💀 Wait ${retryAfter}s before asking again to save resources.`,
          rateLimited: true,
          retryAfter
        },
        { status: 429 }
      );
    }

    // 2. INPUT TOKEN TRIMMING (Max 240 chars to save tokens & block spam)
    const cleanMessage = message.trim().slice(0, MAX_INPUT_CHARS);
    const normalizedKey = cleanMessage.toLowerCase().replace(/[^\w\s]/gi, '').trim();

    // 3. ZERO-TOKEN CHECK: Pre-computed FAQs
    if (FAQ_LOOKUP[cleanMessage.toLowerCase().trim()]) {
      return NextResponse.json({
        reply: FAQ_LOOKUP[cleanMessage.toLowerCase().trim()],
        cached: true,
        tokensSaved: true
      });
    }

    // 4. ZERO-TOKEN CHECK: In-memory LRU Cache
    const cached = responseCache.get(normalizedKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        reply: cached.reply,
        cached: true,
        tokensSaved: true
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const isApiKeyConfigured = apiKey && apiKey !== "your_openai_api_key_here" && apiKey.trim() !== "";

    // If API key is not yet set, provide a clean notice
    if (!isApiKeyConfigured) {
      return NextResponse.json({
        reply: "OpenAI API key isn't configured in `.env.local` yet. Add `OPENAI_API_KEY` to test live queries with `gpt-6-luna`! In the meantime, I'm using local knowledge.",
        needsKey: true
      });
    }

    const systemPrompt = getSystemPrompt();

    // Initialize OpenAI client
    const client = new OpenAI({ apiKey });

    let finalReply = "";

    try {
      // 5. CALL OPENAI WITH STRICT TOKEN LIMITS (max_output_tokens: 120)
      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-6-luna",
        instructions: `${systemPrompt}\n\nSTRICT TOKEN SAVING RULE: Answer in 2-3 short, punchy sentences maximum. No filler words.`,
        input: cleanMessage,
        max_output_tokens: MAX_OUTPUT_TOKENS,
      } as any);

      finalReply =
        (response as any).output_text ||
        (response as any).output?.[0]?.content?.[0]?.text ||
        (typeof response === "string" ? response : JSON.stringify(response));

    } catch (apiError: any) {
      console.warn("client.responses.create error, falling back to chat completions with token limits:", apiError?.message);

      // Fallback to chat completions with strict max_tokens
      const chatCompletion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `${systemPrompt}\n\nKeep answers strictly under 2-3 sentences. Save tokens.` },
          { role: "user", content: cleanMessage },
        ],
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.7,
      });

      finalReply = chatCompletion.choices[0]?.message?.content || "No response received.";
    }

    // Cache the response to save future tokens
    if (finalReply) {
      responseCache.set(normalizedKey, { reply: finalReply, timestamp: Date.now() });
      if (responseCache.size > 200) {
        // Drop oldest entries
        const firstKey = responseCache.keys().next().value;
        if (firstKey) responseCache.delete(firstKey);
      }
    }

    return NextResponse.json({ reply: finalReply });

  } catch (error: any) {
    console.error("Chat API route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate AI response." },
      { status: 500 }
    );
  }
}
