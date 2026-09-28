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
  try {
    const promptPath = path.join(process.cwd(), "sytem-Prompt.md");
    if (fs.existsSync(promptPath)) {
      return fs.readFileSync(promptPath, "utf-8");
    }
  } catch (e) {
    console.error("Could not read sytem-Prompt.md:", e);
  }
  return "You are Pavan Jadhav's AI on his personal portfolio. Smart engineer. Short answers (2-3 sentences max). GitHub: https://github.com/Pavan-Jadhav261. LinkedIn: https://www.linkedin.com/in/pavan-jadhav261/. Email: pavanjadhav5331@gmail.com. Zero corporate cringe.";
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
  "what are your top projects?": "My top flagship projects are SchemeSathi (an AI-powered civic welfare discovery engine with a smart browser extension) and Text-to-3D (a procedural Blender Generative AI pipeline). Check them out in the Work section!",
  "what is your tech stack?": "Core stack: Python, TypeScript, PyTorch, YOLOv11, local LLMs (Gemma/Ollama), RAG, Next.js, FastAPI, and Docker. I specialize in post-training/fine-tuning & high-performance full-stack systems.",
  "tell me about schemesathi": "SchemeSathi simplifies discovering public welfare schemes matching citizen eligibility with vector RAG and an intelligent automated Chrome extension: https://github.com/Pavan-Jadhav261/SchemeSathi",
  "tell me about schemesatchi": "SchemeSathi simplifies discovering public welfare schemes matching citizen eligibility with vector RAG and an intelligent automated Chrome extension: https://github.com/Pavan-Jadhav261/SchemeSathi",
  "tell me about text to 3d": "Text-to-3D is a Blender-based Generative AI system that converts natural language descriptions into 3D procedural shapes and scenes: https://github.com/Pavan-Jadhav261/text-to-3d",
  "tell me about text-to-3d": "Text-to-3D is a Blender-based Generative AI system that converts natural language descriptions into 3D procedural shapes and scenes: https://github.com/Pavan-Jadhav261/text-to-3d",
  "tell me about mentora ai": "Mentora AI teaches students *how to think* rather than spoon-feeding answers. Built with local Gemma LLMs, Socratic prompts, AST algorithm visualizations, and RAG over coursework.",
  "how can i contact you?": "Hit me up directly at pavanjadhav5331@gmail.com or connect on LinkedIn at linkedin.com/in/pavan-jadhav261. Always open to talking AI engineering and hackathons!",
  "who are you?": "I'm Pavan Jadhav — CSE 3rd year at BITM, Ballari. 5× hackathon winner building at the intersection of local LLM fine-tuning, computer vision, and systems engineering.",
  "can you share his github?": "Here's my GitHub: https://github.com/Pavan-Jadhav261. You can check out 20+ open-source repos across SchemeSathi, Text-to-3D, and local LLMs.",
  "can you share your github?": "Here's my GitHub: https://github.com/Pavan-Jadhav261. You'll find 20+ open-source repos including SchemeSathi and Text-to-3D.",
  "what is your github?": "My GitHub is https://github.com/Pavan-Jadhav261 — 20+ repos covering SchemeSathi, Text-to-3D, local Gemma fine-tuning, and computer vision.",
  "what is his github?": "Here's my GitHub: https://github.com/Pavan-Jadhav261",
  "share github": "Here's my GitHub: https://github.com/Pavan-Jadhav261",
  "github link": "Explore all 20+ open-source repos on my GitHub: https://github.com/Pavan-Jadhav261",
  "github": "Explore all 20+ open-source repos on my GitHub: https://github.com/Pavan-Jadhav261",
  "can you give me his linkedin?": "Here's Pavan's LinkedIn: https://www.linkedin.com/in/pavan-jadhav261/",
  "can you share his linkedin?": "Here's Pavan's LinkedIn: https://www.linkedin.com/in/pavan-jadhav261/",
  "what is his linkedin?": "Here's Pavan's LinkedIn: https://www.linkedin.com/in/pavan-jadhav261/",
  "what is your linkedin?": "Here's my LinkedIn: https://www.linkedin.com/in/pavan-jadhav261/",
  "linkedin": "Here's Pavan's LinkedIn: https://www.linkedin.com/in/pavan-jadhav261/",
  "can you share his email?": "You can email Pavan at pavanjadhav5331@gmail.com",
  "what is your email?": "You can reach me directly at pavanjadhav5331@gmail.com",
  "what is his email?": "You can reach Pavan at pavanjadhav5331@gmail.com",
  "email": "You can email Pavan at pavanjadhav5331@gmail.com",
  "i want to participate a hackthon with pavan can you notify him?": "I can't notify Pavan directly. Reach him at pavanjadhav5331@gmail.com or on LinkedIn (https://www.linkedin.com/in/pavan-jadhav261/) and share the hackathon details!",
  "i want to participate in a hackathon with pavan": "I can't notify Pavan directly. Connect with him on LinkedIn (https://www.linkedin.com/in/pavan-jadhav261/) or email pavanjadhav5331@gmail.com with the hackathon info!",
  "instagram": "I can't share personal socials like Instagram or Snapchat. You can reach Pavan professionally via LinkedIn (https://www.linkedin.com/in/pavan-jadhav261/) or Email (pavanjadhav5331@gmail.com).",
  "snapchat": "I can't share personal socials like Snapchat or Instagram. You can contact Pavan on LinkedIn (https://www.linkedin.com/in/pavan-jadhav261/) or Email (pavanjadhav5331@gmail.com).",
  "can i get his instagram?": "I can't share personal socials like Instagram or Snapchat. You can reach Pavan on LinkedIn (https://www.linkedin.com/in/pavan-jadhav261/) or Email (pavanjadhav5331@gmail.com).",
  "can i get his snapchat?": "I can't share personal socials like Snapchat or Instagram. You can reach Pavan on LinkedIn (https://www.linkedin.com/in/pavan-jadhav261/) or Email (pavanjadhav5331@gmail.com)."
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
