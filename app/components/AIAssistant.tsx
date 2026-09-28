'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  links?: { label: string; url: string }[];
}

const KNOWLEDGE_BASE = [
  {
    keywords: ['project', 'build', 'work', 'portfolio', 'created', 'made'],
    response: "I've built 20+ open-source repositories and production tools! Key highlights include:\n\n• **Mentora AI**: Socratic AI learning platform using local LLMs & algorithm visualization.\n• **SchemeSathi**: Citizen scheme discovery engine with an intelligent Chrome extension.\n• **ABHA+**: Ayushman Bharat healthcare stack with triage & FHIR normalization.\n• **Flower Detector**: Real-time YOLOv11 computer vision model trained from scratch.\n• **Text-to-3D**: Procedural Blender generative 3D pipeline.",
    links: [
      { label: "View Mentora AI", url: "https://github.com/Pavan-Jadhav261/mentoraAi" },
      { label: "View SchemeSathi", url: "https://github.com/Pavan-Jadhav261/SchemeSathi" }
    ]
  },
  {
    keywords: ['mentora', 'tutor', 'learning', 'education'],
    response: "**Mentora AI** is an intelligent learning companion designed to teach students *how to think* rather than giving direct answers. It uses local LLMs (Gemma), RAG over coursework, AST code visualization, and Socratic prompting.",
    links: [{ label: "Mentora AI on GitHub", url: "https://github.com/Pavan-Jadhav261/mentoraAi" }]
  },
  {
    keywords: ['schemesathi', 'scheme', 'government', 'civic'],
    response: "**SchemeSathi** simplifies discovering public welfare schemes based on personalized eligibility criteria (income, student status, state). Includes an automated browser extension for instant application guidance.",
    links: [{ label: "SchemeSathi on GitHub", url: "https://github.com/Pavan-Jadhav261/SchemeSathi" }]
  },
  {
    keywords: ['abha', 'health', 'hospital', 'medical'],
    response: "**ABHA+** integrates with India's Ayushman Bharat Digital Mission (ABDM) to unify digital health IDs, parse medical records via OCR into FHIR JSON, and streamline patient triage.",
    links: [{ label: "ABHA+ on GitHub", url: "https://github.com/Pavan-Jadhav261/ABHA-" }]
  },
  {
    keywords: ['vision', 'yolo', 'cv', 'flower', 'camera', 'detection'],
    response: "I do deep work in Computer Vision! For **Flower Detector**, I trained a YOLO architecture from scratch for 100 epochs, reaching sub-14ms edge inference with OpenCV and PyTorch.",
    links: [{ label: "Flower Detector Repo", url: "https://github.com/Pavan-Jadhav261/flower-detector-yolo" }]
  },
  {
    keywords: ['stack', 'skill', 'tech', 'language', 'python', 'typescript', 'framework'],
    response: "My core technical stack includes:\n\n• **Languages**: TypeScript, Python, C, JavaScript\n• **AI & ML**: Local LLMs (Gemma, LLaMA), RAG, YOLOv11, OpenCV, PyTorch, LangGraph\n• **Full-Stack**: Next.js (App Router), React, FastAPI, Node.js, Tailwind CSS\n• **Tools**: WebGL, Docker, Git, Blender API",
    links: [{ label: "Browse GitHub Repos", url: "https://github.com/Pavan-Jadhav261" }]
  },
  {
    keywords: ['contact', 'email', 'hire', 'reach', 'message', 'touch', 'talk', 'linkedin'],
    response: "You can reach me directly anytime! I'm always open to discussing AI engineering roles, ambitious hackathons, and high-impact projects.\n\n• **Email**: pavanjadhav5331@gmail.com\n• **LinkedIn**: linkedin.com/in/pavan-jadhav261\n• **GitHub**: github.com/Pavan-Jadhav261",
    links: [
      { label: "Send Email", url: "mailto:pavanjadhav5331@gmail.com" },
      { label: "LinkedIn Profile", url: "https://www.linkedin.com/in/pavan-jadhav261/" }
    ]
  },
  {
    keywords: ['hackathon', 'award', 'podium', 'competition', 'win', 'winner'],
    response: "I'm a **5× Hackathon Winner**, building complete full-stack AI MVPs under tight 24–48 hour deadlines with real-time architectures and working prototypes.",
    links: [{ label: "View Experience", url: "#overview" }]
  },
  {
    keywords: ['who', 'about', 'pavan', 'yourself', 'background'],
    response: "I'm Pavan Jadhav — an AI & Full-Stack developer passionate about building high-performance systems. From fine-tuning local LLMs and agentic workflows to real-time computer vision and 3D generative pipelines, I love shipping tools that solve real problems.",
    links: [{ label: "GitHub Profile", url: "https://github.com/Pavan-Jadhav261" }]
  }
];

function getBotResponse(input: string): { text: string; links?: { label: string; url: string }[] } {
  const query = input.toLowerCase().trim();

  for (const item of KNOWLEDGE_BASE) {
    if (item.keywords.some(k => query.includes(k))) {
      return { text: item.response, links: item.links };
    }
  }

  return {
    text: "Thanks for asking! I'm Pavan's AI digital assistant. I can tell you all about his projects (Mentora AI, SchemeSathi, YOLO models), his tech stack (TypeScript, Python, Local LLMs, CV), or connect you directly with him at pavanjadhav5331@gmail.com.",
    links: [
      { label: "Send Pavan an Email", url: "mailto:pavanjadhav5331@gmail.com" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/pavan-jadhav261/" }
    ]
  };
}

const QUICK_PROMPTS = [
  "What are your top projects?",
  "What is your tech stack?",
  "Tell me about Mentora AI",
  "How can I contact you?"
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hey! I'm Pavan's AI assistant. Ask me anything about my projects, tech stack, or how we can build something together.",
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Rate-limit countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = async (userText: string) => {
    const textToSend = userText.trim().slice(0, 240);
    if (!textToSend || isTyping || cooldown > 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();

      // Handle 429 Rate Limit
      if (res.status === 429 || data?.rateLimited) {
        setCooldown(data?.retryAfter || 60);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data?.reply || "Rate limit reached. Please wait a moment before sending another message to save resources!",
          timestamp: 'Just now'
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        return;
      }

      if (res.ok && data?.reply) {
        const matchedKnowledge = getBotResponse(textToSend);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply,
          timestamp: 'Just now',
          links: matchedKnowledge.links,
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn("Backend chat route error, using local fallback:", err);
    }

    // Fallback to local knowledge base if API is unreachable
    setTimeout(() => {
      const response = getBotResponse(textToSend);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.text,
        timestamp: 'Just now',
        links: response.links
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 350);
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          FLOATING AI BUTTON IN BOTTOM RIGHT CORNER
         ───────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
        {/* Subtle Tooltip when closed */}
        {!isOpen && hasUnread && (
          <div className="mb-2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0d0d12] border border-white/10 text-[11px] font-mono text-zinc-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] animate-bounce">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a5f] animate-pulse" />
            <span>Ask Pavan AI</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI Assistant"
          className="relative group w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#0d0d12] border border-white/15 hover:border-[#ff2a5f] p-0 flex items-center justify-center text-white shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_25px_rgba(255,42,95,0.35)] transition-all duration-300"
        >
          {/* Active online pulse dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#ff2a5f] border-2 border-black flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
          </span>

          {isOpen ? (
            <svg className="w-5 h-5 transition-transform group-hover:rotate-90 duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <svg className="w-6 h-6 text-[#ff2a5f] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          FLOATING AI CHAT TERMINAL / MODAL
         ───────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[340px] sm:w-[390px] h-[520px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-7rem)] rounded-2xl bg-[#09090e]/95 backdrop-blur-xl border border-white/15 shadow-[0_16px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Terminal Header */}
          <div className="px-4 py-3.5 border-b border-white/10 bg-[#0d0d14] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-[#ff2a5f]/15 border border-[#ff2a5f]/40 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#ff2a5f] shadow-[0_0_8px_#ff2a5f]" />
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white font-gilroy tracking-tight">
                    PAVAN AI
                  </h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    online
                  </span>
                </div>
                <p className="text-[10px] font-mono text-zinc-500">
                  Digital Twin &bull; Autonomous Knowledge
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs text-left scrollbar-thin scrollbar-thumb-white/10">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#ff2a5f] text-white rounded-br-none shadow-[0_2px_12px_rgba(255,42,95,0.3)]'
                      : 'bg-[#13131c] text-zinc-200 border border-white/10 rounded-bl-none font-normal'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Optional Actionable Links in response */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                      {msg.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-[10px] font-mono text-white transition-colors"
                        >
                          <span>{link.label}</span>
                          <span>&rarr;</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[10px] py-1 px-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a5f] animate-pulse" />
                <span>Pavan AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips - Scrollbar completely hidden with smooth horizontal swipe/scroll */}
          <div
            className="px-3 py-2 border-t border-white/5 bg-[#0b0b12] flex items-center gap-1.5 overflow-x-auto overflow-y-hidden no-scrollbar select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={isTyping || cooldown > 0}
                className="shrink-0 whitespace-nowrap text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box with Token-Saver limit and Rate-Limit Cooldown */}
          <form
            onSubmit={e => {
              e.preventDefault();
              if (!isTyping && cooldown === 0) handleSend(input);
            }}
            className="p-3 border-t border-white/10 bg-[#0d0d14] flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                maxLength={240}
                disabled={isTyping || cooldown > 0}
                onChange={e => setInput(e.target.value)}
                placeholder={
                  cooldown > 0
                    ? `Cooldown active (${cooldown}s)...`
                    : isTyping
                    ? "Pavan AI is thinking..."
                    : "Ask anything about Pavan..."
                }
                className="flex-1 bg-black/60 border border-white/10 focus:border-[#ff2a5f]/60 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 outline-none transition-colors font-mono disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping || cooldown > 0}
                className="w-8 h-8 rounded-xl bg-[#ff2a5f] disabled:bg-zinc-800 disabled:opacity-40 text-white flex items-center justify-center transition-all hover:shadow-[0_0_12px_#ff2a5f] shrink-0"
                aria-label="Send message"
              >
                {cooldown > 0 ? (
                  <span className="text-[10px] font-mono font-bold text-white">{cooldown}s</span>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>

            {/* Subtle token saver hint & char counter when user types */}
            {input.length > 0 && (
              <div className="flex justify-between items-center px-1 text-[9px] font-mono text-zinc-500">
                <span>Token saver: max 240 chars</span>
                <span className={input.length > 200 ? "text-amber-400 font-bold" : "text-zinc-500"}>
                  {input.length}/240
                </span>
              </div>
            )}
          </form>

        </div>
      )}
    </>
  );
}
