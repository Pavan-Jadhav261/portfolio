'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import RippleDistortion from "./components/RippleDistortion";
import PixelSwap from "./components/PixelSwap";
import LoadingScreen from "./components/LoadingScreen";
import GlareHover from "./components/GlareHover";
import ClickSpark from "./components/ClickSpark";
import FlipCard from "./components/FlipCard";
import WorkSection from "./components/WorkSection";
import AIAssistant from "./components/AIAssistant";
import AudioPlayer from "./components/AudioPlayer";
import WaterBalloon from "./components/WaterBalloon";
import { audioManager } from "./lib/audioManager";

export default function Home() {
  const [assetsReady, setAssetsReady] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const [landingPageAppeared, setLandingPageAppeared] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Actively preload the 1.6MB background image
    const preloadImage = new Promise<void>((resolve) => {
      const img = new window.Image();
      img.src = '/portfolio-landing.png';
      if (img.complete && img.naturalWidth > 0) {
        if (img.decode) {
          img.decode().then(resolve).catch(resolve);
        } else {
          resolve();
        }
        return;
      }
      img.onload = () => {
        if (img.decode) {
          img.decode().then(resolve).catch(resolve);
        } else {
          resolve();
        }
      };
      img.onerror = () => resolve();
    });

    // 2. Preload Gilroy & document fonts
    const preloadFonts = typeof document !== 'undefined' && 'fonts' in document
      ? document.fonts.ready.catch(() => {})
      : Promise.resolve();

    // 3. Preload and prime soundtrack via centralized AudioManager
    const preloadAudio = new Promise<void>((resolve) => {
      try {
        audioManager.init();
        resolve();
      } catch {
        resolve();
      }
    });

    // Ensure assets are downloaded before dismissing loader
    Promise.all([preloadImage, preloadFonts, preloadAudio]).then(() => {
      if (isMounted) {
        // Minimum time of 600ms so progress displays smoothly
        setTimeout(() => {
          if (isMounted) setAssetsReady(true);
        }, 600);
      }
    });

    // Fallback safety timeout (6.5s) in case of packet loss
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setAssetsReady(true);
        setWebglReady(true);
      }
    }, 6500);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, []);

  const isReady = assetsReady && webglReady;

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const exploringTopics = [
    {
      num: "01",
      name: "LLMs",
      desc: "Fine-tuning & Reasoning",
      info: "LoRA & QLoRA fine-tuning, reasoning distillation, and RLHF on foundation models."
    },
    {
      num: "02",
      name: "Multimodal AI",
      desc: "Vision-Language Architectures",
      info: "Vision-Language models, cross-attention fusion, and document visual reasoning."
    },
    {
      num: "03",
      name: "Computer Vision",
      desc: "Real-time Detection & Depth",
      info: "Sub-millisecond object detection, monocular depth estimation, and 3D Gaussian splatting."
    },
    {
      num: "04",
      name: "On-Device AI",
      desc: "Quantization & Edge Inference",
      info: "4-bit AWQ & GGUF quantization, optimizing local models for mobile and edge NPUs."
    },
    {
      num: "05",
      name: "AI Agents",
      desc: "Autonomous Multi-Agent Systems",
      info: "Autonomous agentic workflows, dynamic tool orchestration, and memory graphs."
    },
  ];

  return (
    <ClickSpark
      sparkColor="#fff"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <main className="relative w-full min-h-screen bg-black text-white font-gilroy selection:bg-[#ff2a5f] selection:text-white overflow-x-hidden">
        {/* Loading Screen - blocks until background image, WebGL texture, audio and fonts are ready */}
        <LoadingScreen
          isReady={isReady}
          onFadeStart={() => setLandingPageAppeared(true)}
        />

        {/* ─────────────────────────────────────────────────────────────
            SECTION 1: HERO LANDING (FULL VISIBLE HEIGHT WITH WEBGL BACKGROUND)
           ───────────────────────────────────────────────────────────── */}
        <section
          id="hero"
          aria-label="Hero and Introduction"
          className="relative w-full h-[100svh] min-h-[100svh] sm:h-screen sm:min-h-screen overflow-hidden bg-black flex flex-col justify-between"
        >
          {/* Background Interactive Ripple Distortion Effect - perfectly framed on mobile & desktop */}
          <div className="absolute top-0 left-0 w-full h-[65vh] sm:h-full z-0 overflow-hidden">
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
              onLoad={() => setWebglReady(true)}
            />
            {/* Mobile Bottom Fade - seamlessly merges portrait into black background */}
            <div className="absolute inset-x-0 bottom-0 h-44 sm:hidden bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
          </div>

          {/* Top Navigation */}
          <header className="relative z-10 w-full px-5 sm:px-12 md:px-16 lg:px-24 pt-6 sm:pt-8 md:pt-10 flex items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-2.5 text-base md:text-lg font-bold tracking-tight text-white/90 hover:text-white transition-colors"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff2a5f] shadow-[0_0_12px_#ff2a5f]" />
              <span className="tracking-wider uppercase font-bold text-sm md:text-base">
                PAVAN JADHAV
              </span>
            </Link>

            <nav className="flex items-center gap-3 sm:gap-6 md:gap-8">
              <div className="hidden sm:flex items-center gap-6 text-sm text-zinc-300 font-medium">
                <a
                  href="#about"
                  onClick={(e) => scrollTo(e, "about")}
                  className="hover:text-white transition-colors tracking-wide drop-shadow cursor-pointer"
                >
                  About
                </a>
                <a
                  href="#work"
                  onClick={(e) => scrollTo(e, "work")}
                  className="hover:text-white transition-colors tracking-wide drop-shadow cursor-pointer"
                >
                  Work
                </a>
                <a
                  href="#contact"
                  onClick={(e) => scrollTo(e, "contact")}
                  className="hover:text-white transition-colors tracking-wide drop-shadow cursor-pointer"
                >
                  Contact
                </a>
              </div>

              {/* Soundtrack Equalizer & Sound Toggle */}
              <AudioPlayer shouldPlay={landingPageAppeared} />

              <a
                href="mailto:pavanjadhav5331@gmail.com"
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-semibold border border-white/20 bg-black/40 hover:bg-white hover:text-black backdrop-blur-md transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer whitespace-nowrap"
              >
                Get In Touch
              </a>
            </nav>
          </header>

          {/* Hero Content - Placed cleanly in lower half on mobile below portrait, and bottom-left on desktop */}
          <div className="relative z-10 w-full px-5 sm:px-12 md:px-16 lg:px-24 pb-6 sm:pb-8 flex-1 sm:flex-initial flex flex-col justify-end sm:justify-start max-w-3xl pointer-events-none">
            <h1 className="text-[26px] min-[380px]:text-[29px] xs:text-[34px] sm:text-[43px] md:text-[55px] lg:text-[65px] font-bold text-white tracking-tight leading-[1.14] sm:leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              I build intelligent systems that turn curiosity into{" "}
              <span className="text-[#ff2a5f] font-extrabold inline-block drop-shadow-[0_0_30px_rgba(255,42,95,0.6)]">
                possibility.
              </span>
            </h1>
            <p className="sr-only">
              Pavan Jadhav is an AI Engineer and Full-Stack Developer specializing in Autonomous AI Agents, Large Language Model (LLM) Fine-Tuning, Computer Vision, and High-Performance Intelligent Systems.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 pt-4 sm:pt-6 pointer-events-auto">
              <a
                href="#work"
                onClick={(e) => scrollTo(e, "work")}
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-bold bg-[#ff2a5f] text-white shadow-[0_0_24px_rgba(255,42,95,0.45)] hover:bg-[#ff154f] hover:shadow-[0_0_30px_rgba(255,42,95,0.6)] transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <span>Explore My Work</span>
                <span className="text-sm font-mono">&rarr;</span>
              </a>
              <a
                href="#about"
                onClick={(e) => scrollTo(e, "about")}
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/15 transition-all duration-300 cursor-pointer"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Bottom Bar Details & Scroll Indicator */}
          <footer className="relative z-10 w-full px-5 sm:px-12 md:px-16 lg:px-24 pb-6 sm:pb-8 md:pb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 text-xs md:text-sm text-zinc-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              <span className="tracking-widest uppercase font-medium text-[11px] md:text-xs text-zinc-300">
                Building Next-Gen Systems
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/Pavan-Jadhav261"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/pavan-jadhav261/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="mailto:pavanjadhav5331@gmail.com"
                className="hover:text-white transition-colors"
              >
                Email
              </a>
            </div>
          </footer>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            SECTION 2: SCROLLABLE CARDS WITH PIXELSWAP EFFECT (ABOUT)
           ───────────────────────────────────────────────────────────── */}
        <section
          id="about"
          aria-label="About Pavan Jadhav and AI Research Focus"
          className="relative w-full min-h-screen bg-gradient-to-b from-[#050507] via-[#09090d] to-[#040406] border-t border-white/[0.08] py-20 sm:py-28 md:py-32 px-5 sm:px-12 md:px-16 lg:px-24 overflow-hidden scroll-mt-6"
        >
          <span id="overview" className="sr-only" />
          {/* Subtle Ambient Glow matching theme */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-[400px] bg-[#ff2a5f]/[0.035] blur-[160px] pointer-events-none rounded-full" />

          {/* Section Header */}
          <div className="relative z-10 max-w-6xl mx-auto text-center mb-14 sm:mb-16 md:mb-20">
            <p className="text-xs sm:text-sm tracking-[0.3em] text-zinc-400 uppercase font-mono font-medium inline-flex items-center gap-2">
              <span>PAVAN</span>
              <span className="text-[#ff2a5f]">/</span>
              <span>2026</span>
            </p>
          </div>

          {/* 3 Interactive Cards with PixelSwap */}
          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {/* ── CARD 01: BUILDER ── */}
            <div className="rounded-[24px] sm:rounded-[28px] border border-white/10 bg-[#0d0d12] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
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
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-[#0b0b10] select-none">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 mb-2 sm:mb-3">
                      01 / BUILDER
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-white tracking-tight font-gilroy mb-3 md:mb-0">
                      20+ Repos
                    </h3>
                    <div className="md:hidden mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-mono tracking-wider text-zinc-300 shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a5f] animate-pulse" />
                      <span>CURIOUS? TAP IT</span>
                    </div>
                  </div>
                }
                secondContent={
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-5 sm:p-8 bg-white text-zinc-950 select-none">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2">
                      OPEN-SOURCE &amp; AI
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-[34px] font-bold text-zinc-950 tracking-tight font-gilroy mb-1.5 sm:mb-2">
                      22 Repositories
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 max-w-[280px] leading-relaxed font-medium mb-3 md:mb-0">
                      Architected 20+ intelligent applications, local AI tools, and computer vision models on GitHub.
                    </p>
                    <div className="md:hidden mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-mono tracking-wider text-zinc-600">
                      <span>TAP TO FLIP BACK</span>
                      <span>↻</span>
                    </div>
                  </div>
                }
              />
            </div>

            {/* ── CARD 02: HACKATHON ── */}
            <div className="rounded-[24px] sm:rounded-[28px] border border-white/10 bg-[#0d0d12] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
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
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-[#0b0b10] select-none">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 mb-2 sm:mb-3">
                      02 / HACKATHON
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-white tracking-tight font-gilroy mb-3 md:mb-0">
                      5&times; Winners
                    </h3>
                    <div className="md:hidden mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-mono tracking-wider text-zinc-300 shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a5f] animate-pulse" />
                      <span>CURIOUS? TAP IT</span>
                    </div>
                  </div>
                }
                secondContent={
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-5 sm:p-8 bg-white text-zinc-950 select-none">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2">
                      COMPETITIVE WINS
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-[34px] font-bold text-zinc-950 tracking-tight font-gilroy mb-1.5 sm:mb-2">
                      Hackathon Winner
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 max-w-[280px] leading-relaxed font-medium mb-3 md:mb-0">
                      5&times; winner in fast-paced hackathons, architecting working MVPs under 24&ndash;48h.
                    </p>
                    <div className="md:hidden mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-mono tracking-wider text-zinc-600">
                      <span>TAP TO FLIP BACK</span>
                      <span>↻</span>
                    </div>
                  </div>
                }
              />
            </div>

            {/* ── CARD 03: AI FOCUS ── */}
            <div className="rounded-[24px] sm:rounded-[28px] border border-white/10 bg-[#0d0d12] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
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
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-[#0b0b10] select-none">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-400 mb-2 sm:mb-3">
                      03 / AI FOCUS
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-white tracking-tight font-gilroy mb-3 md:mb-0">
                      AI Systems
                    </h3>
                    <div className="md:hidden mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-mono tracking-wider text-zinc-300 shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a5f] animate-pulse" />
                      <span>CURIOUS? TAP IT</span>
                    </div>
                  </div>
                }
                secondContent={
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-5 sm:p-8 bg-white text-zinc-950 select-none">
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-zinc-500 mb-2">
                      SPECIALIZATION
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-[34px] font-bold text-zinc-950 tracking-tight font-gilroy mb-1.5 sm:mb-2">
                      Intelligent Agents
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 max-w-[280px] leading-relaxed font-medium mb-3 md:mb-0">
                      Specialized in autonomous multi-agent pipelines, fine-tuning LLMs, and real-time vision architectures.
                    </p>
                    <div className="md:hidden mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-mono tracking-wider text-zinc-600">
                      <span>TAP TO FLIP BACK</span>
                      <span>↻</span>
                    </div>
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
                <FlipCard
                  key={i}
                  axis="y"
                  flipOnClick={true}
                  draggable={true}
                  tilt={true}
                  tiltMax={10}
                  glare={true}
                  glareOpacity={0.22}
                  hoverScale={1.03}
                  perspective={1000}
                  stiffness={180}
                  damping={20}
                  width="100%"
                  height={175}
                  radius={18}
                  background="#0d0d12"
                  color="#ffffff"
                  backBackground="#ffffff"
                  backColor="#09090b"
                  shadow={true}
                  shadowColor="#000000"
                  shadowOpacity={0.4}
                  className="group w-full"
                  front={
                    <div className="w-full h-full p-4 sm:p-5 flex flex-col justify-between text-left select-none bg-[#0d0d12]">
                      <div>
                        <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] mb-2.5">
                          <span>{topic.num}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-[#ff2a5f] group-hover:shadow-[0_0_8px_#ff2a5f] transition-all" />
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-white tracking-tight font-gilroy mb-1">
                          {topic.name}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-zinc-400 leading-snug font-medium">
                          {topic.desc}
                        </p>
                      </div>
                      <div className="pt-2 text-[11px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors flex items-center gap-1.5">
                        <span className="sm:hidden text-zinc-300 font-semibold tracking-wider text-[10px]">CURIOUS? TAP IT</span>
                        <span className="hidden sm:inline">click to flip</span>
                        <span className="text-[12px] opacity-70">↻</span>
                      </div>
                    </div>
                  }
                  back={
                    <div className="w-full h-full p-4 sm:p-5 flex flex-col justify-between text-left select-none bg-white text-zinc-950">
                      <div>
                        <div className="flex items-center justify-between text-zinc-400 font-mono text-[11px] mb-2.5">
                          <span>{topic.num}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a5f] shadow-[0_0_8px_#ff2a5f]" />
                        </div>
                        <p className="text-xs sm:text-[13px] text-zinc-800 leading-relaxed font-semibold">
                          {topic.info}
                        </p>
                      </div>
                      <div className="pt-2 text-[11px] font-mono text-zinc-400 group-hover:text-zinc-600 transition-colors flex items-center gap-1.5">
                        <span className="sm:hidden text-zinc-500 font-medium tracking-wider text-[10px]">TAP TO FLIP BACK</span>
                        <span className="hidden sm:inline">click to flip</span>
                        <span className="text-[12px] opacity-70">↻</span>
                      </div>
                    </div>
                  }
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* ─────────────────────────────────────────────────────────────
            SECTION 3: SELECTED BUILDS, THE LAB, HOW IT HAPPENS, WHAT'S NEXT
           ───────────────────────────────────────────────────────────── */}
        <WorkSection />

        {/* Footer with real links */}
        <footer className="relative z-10 w-full border-t border-white/[0.08] bg-black py-10 px-5 sm:px-12 md:px-16 lg:px-24 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-[#ff2a5f]" />
            <span className="tracking-wider uppercase font-semibold text-white">PAVAN JADHAV</span>
            <span>&bull;</span>
            <span>2026</span>
          </div>

          <div className="flex items-center gap-6 text-zinc-400">
            <a
              href="https://github.com/Pavan-Jadhav261"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/pavan-jadhav261/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="mailto:pavanjadhav5331@gmail.com"
              className="hover:text-white transition-colors"
            >
              Email
            </a>
          </div>
        </footer>

        {/* Floating AI Assistant in bottom-right corner */}
        <AIAssistant />

        {/* Music-responsive Red Water Balloon that follows cursor across the entire website */}
        <WaterBalloon />
      </main>
    </ClickSpark>
  );
}
