'use client';

import Link from "next/link";
import RippleDistortion from "./components/RippleDistortion";
import PixelSwap from "./components/PixelSwap";

export default function Home() {
  const exploringTopics = [
    { name: "LLMs", desc: "Fine-tuning & Reasoning" },
    { name: "Multimodal AI", desc: "Vision-Language Architectures" },
    { name: "Computer Vision", desc: "Real-time Detection & Depth" },
    { name: "On-Device AI", desc: "Quantization & Edge Inference" },
    { name: "AI Agents", desc: "Autonomous Multi-Agent Systems" },
  ];

  return (
    <main className="relative w-full min-h-screen bg-black text-white font-gilroy selection:bg-[#ff2a5f] selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO LANDING (FULL VISIBLE HEIGHT WITH WEBGL BACKGROUND)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-screen min-h-[100dvh] overflow-hidden bg-black flex flex-col justify-between">
        {/* Background Interactive Ripple Distortion Effect */}
        <div className="absolute inset-0 z-0">
          <RippleDistortion
            src="/portfolio-landing.png"
            brushSize={50}
            fade={1.5}
            strength={0.2}
            swirl={1}
            rings={4}
            quality="high"
            grayscale={false}
            trigger="both"
            tintAmount={0}
            brightness={1.15}
            highlightColor="#ffffff"
          />
        </div>

        {/* Top Navigation */}
        <header className="relative z-10 w-full px-6 sm:px-12 md:px-16 lg:px-24 pt-8 md:pt-10 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-base md:text-lg font-bold tracking-tight text-white/90 hover:text-white transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff2a5f] shadow-[0_0_12px_#ff2a5f]" />
            <span className="tracking-wider uppercase font-bold text-sm md:text-base">
              PAVAN JADHAV
            </span>
          </Link>

          <nav className="flex items-center gap-6 md:gap-8">
            <div className="hidden sm:flex items-center gap-6 text-sm text-zinc-300 font-medium">
              <Link
                href="#about"
                className="hover:text-white transition-colors tracking-wide drop-shadow"
              >
                About
              </Link>
              <Link
                href="#overview"
                className="hover:text-white transition-colors tracking-wide drop-shadow"
              >
                Work
              </Link>
              <Link
                href="#contact"
                className="hover:text-white transition-colors tracking-wide drop-shadow"
              >
                Contact
              </Link>
            </div>

            <Link
              href="#contact"
              className="px-4 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold border border-white/20 bg-black/40 hover:bg-white hover:text-black backdrop-blur-md transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              Get In Touch
            </Link>
          </nav>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 sm:px-12 md:px-16 lg:px-24 pb-8 translate-y-0 sm:translate-y-[-8px] md:translate-y-[-16px] flex flex-col justify-start max-w-3xl pointer-events-none">
          <h1 className="text-[31px] sm:text-[43px] md:text-[55px] lg:text-[65px] font-bold text-white tracking-tight leading-[1.1] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            I build intelligent systems that turn curiosity into{" "}
            <span className="text-[#ff2a5f] font-extrabold inline-block drop-shadow-[0_0_30px_rgba(255,42,95,0.6)]">
              possibility.
            </span>
          </h1>
        </div>

        {/* Bottom Bar Details & Scroll Indicator */}
        <footer className="relative z-10 w-full px-6 sm:px-12 md:px-16 lg:px-24 pb-8 md:pb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs md:text-sm text-zinc-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span className="tracking-widest uppercase font-medium text-[11px] md:text-xs text-zinc-300">
              Building Next-Gen Systems
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:contact@example.com"
              className="hover:text-white transition-colors"
            >
              Email
            </a>
          </div>
        </footer>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: SCROLLABLE CARDS WITH PIXELSWAP EFFECT
         ───────────────────────────────────────────────────────────── */}
      <section
        id="overview"
        className="relative w-full min-h-screen bg-gradient-to-b from-[#050507] via-[#09090d] to-[#040406] border-t border-white/[0.08] py-24 sm:py-32 px-6 sm:px-12 md:px-16 lg:px-24"
      >
        {/* Subtle Ambient Glow matching theme */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#ff2a5f]/[0.035] blur-[160px] pointer-events-none rounded-full" />

        {/* Section Header */}
        <div className="relative z-10 max-w-6xl mx-auto text-center mb-16 md:mb-20">
          <p className="text-xs sm:text-sm tracking-[0.3em] text-zinc-400 uppercase font-mono font-medium inline-flex items-center gap-2">
            <span>PAVAN</span>
            <span className="text-[#ff2a5f]">/</span>
            <span>2026</span>
          </p>
        </div>

        {/* 3 Interactive Cards with PixelSwap */}
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* ── CARD 01: BUILDER ── */}
          <div className="rounded-[28px] border border-white/10 bg-[#0d0d12] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
            <PixelSwap
              aspectRatio="16 / 11"
              pattern="random"
              trigger="hover"
              pixelSize={32}
              gap={0}
              pixelRadius={50}
              pixelScale={0.35}
              pixelSpin={0}
              duration={700}
              pixelDuration={450}
              randomness={0}
              fade={true}
              firstContent={
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-[#0b0b10] select-none">
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 mb-3">
                    01 / BUILDER
                  </span>
                  <h3 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight font-gilroy">
                    10+ Projects
                  </h3>
                </div>
              }
              secondContent={
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-white text-zinc-950 select-none">
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2.5">
                    FULL-STACK &amp; AI
                  </span>
                  <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-zinc-950 tracking-tight font-gilroy mb-2">
                    Production Apps
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 max-w-[280px] leading-relaxed font-medium">
                    Shipped 10+ end-to-end intelligent applications and production-ready tools built from scratch.
                  </p>
                </div>
              }
            />
          </div>

          {/* ── CARD 02: HACKATHON ── */}
          <div className="rounded-[28px] border border-white/10 bg-[#0d0d12] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
            <PixelSwap
              aspectRatio="16 / 11"
              pattern="random"
              trigger="hover"
              pixelSize={32}
              gap={0}
              pixelRadius={50}
              pixelScale={0.35}
              pixelSpin={0}
              duration={700}
              pixelDuration={450}
              randomness={0}
              fade={true}
              firstContent={
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-[#0b0b10] select-none">
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 mb-3">
                    02 / HACKATHON
                  </span>
                  <h3 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight font-gilroy">
                    2&times; Podiums
                  </h3>
                </div>
              }
              secondContent={
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-white text-zinc-950 select-none">
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2.5">
                    COMPETITIVE WINS
                  </span>
                  <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-zinc-950 tracking-tight font-gilroy mb-2">
                    Podium Finishes
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 max-w-[280px] leading-relaxed font-medium">
                    Multiple podium placements in fast-paced hackathons, architecting working MVPs under 24&ndash;48h.
                  </p>
                </div>
              }
            />
          </div>

          {/* ── CARD 03: AI FOCUS ── */}
          <div className="rounded-[28px] border border-white/10 bg-[#0d0d12] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
            <PixelSwap
              aspectRatio="16 / 11"
              pattern="random"
              trigger="hover"
              pixelSize={32}
              gap={0}
              pixelRadius={50}
              pixelScale={0.35}
              pixelSpin={0}
              duration={700}
              pixelDuration={450}
              randomness={0}
              fade={true}
              firstContent={
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-[#0b0b10] select-none">
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 mb-3">
                    03 / AI FOCUS
                  </span>
                  <h3 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight font-gilroy">
                    AI Systems
                  </h3>
                </div>
              }
              secondContent={
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-white text-zinc-950 select-none">
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2.5">
                    SPECIALIZATION
                  </span>
                  <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-zinc-950 tracking-tight font-gilroy mb-2">
                    Intelligent Agents
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 max-w-[280px] leading-relaxed font-medium">
                    Specialized in autonomous multi-agent pipelines, fine-tuning LLMs, and real-time vision architectures.
                  </p>
                </div>
              }
            />
          </div>
        </div>

        {/* Divider Line from Image */}
        <div className="max-w-6xl mx-auto my-16 md:my-20">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>

        {/* CURRENTLY EXPLORING Section from Image */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#ff2a5f]" />
            <h3 className="text-xs sm:text-sm tracking-[0.25em] text-zinc-400 uppercase font-mono font-medium">
              CURRENTLY EXPLORING
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {exploringTopics.map((topic, i) => (
              <div
                key={i}
                className="group relative p-4 sm:p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#ff2a5f]/40 backdrop-blur-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] mb-2">
                    <span>0{i + 1}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-[#ff2a5f] transition-colors" />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-white transition-colors">
                    {topic.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                    {topic.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
