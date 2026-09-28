'use client';

import Link from "next/link";
import RippleDistortion from "./components/RippleDistortion";

export default function Home() {
  return (
    <main className="relative w-full h-screen min-h-[100dvh] overflow-hidden bg-black flex flex-col justify-between text-white font-gilroy">
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
              href="#work"
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

      {/* Hero Content - Shifted 5px down, 5px smaller font */}
      <section className="relative z-10 w-full px-6 sm:px-12 md:px-16 lg:px-24 pb-8 translate-y-0 sm:translate-y-[-8px] md:translate-y-[-16px] flex flex-col justify-start max-w-3xl pointer-events-none">
        {/* Main Headline */}
        <h1 className="text-[31px] sm:text-[43px] md:text-[55px] lg:text-[65px] font-bold text-white tracking-tight leading-[1.1] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          I build intelligent systems that turn curiosity into{" "}
          <span className="text-[#ff2a5f] font-extrabold inline-block drop-shadow-[0_0_30px_rgba(255,42,95,0.6)]">
            possibility.
          </span>
        </h1>
      </section>

      {/* Bottom Footer Details */}
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
    </main>
  );
}
