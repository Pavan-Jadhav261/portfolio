'use client';

import React, { useState } from 'react';

interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  visualType: string;
  link?: string;
}

const projects: Project[] = [
  {
    id: "01",
    name: "MENTORA AI",
    category: "AI / EDUCATION",
    description: "An AI learning system designed to teach students how to think — not simply give them answers.",
    tags: ["GEMMA", "RAG", "AI TUTOR", "CODE VISUALIZATION"],
    visualType: "mentora",
    link: "#"
  },
  {
    id: "02",
    name: "ABHA+",
    category: "AI / HEALTHCARE",
    description: "Unified healthcare data pipeline with intelligent patient triage and secure EHR synchronization.",
    tags: ["FASTAPI", "OCR", "HEALTH LLM", "SECURE EHR"],
    visualType: "abha",
    link: "#"
  },
  {
    id: "03",
    name: "SMART FAQ",
    category: "CIVIC / AI",
    description: "Instant civic query assistance and multilingual public scheme retrieval powered by grounded LLMs.",
    tags: ["MULTILINGUAL", "VECTOR SEARCH", "EMBEDDINGS", "NEXT.JS"],
    visualType: "smartfaq",
    link: "#"
  },
  {
    id: "04",
    name: "FLOWER DETECTOR",
    category: "COMPUTER VISION",
    description: "Sub-millisecond botanical classification and disease diagnosis executing high-FPS inference on edge devices.",
    tags: ["YOLOV11", "OPENCV", "TENSORFLOW LITE", "EDGE CV"],
    visualType: "flower",
    link: "#"
  },
  {
    id: "05",
    name: "AI DATA AGENT",
    category: "MULTIMODAL AI",
    description: "Autonomous multi-agent orchestration for dynamic SQL generation, dataset synthesis, and visual charts.",
    tags: ["LANGGRAPH", "PYTHON", "MULTIMODAL", "AUTONOMOUS"],
    visualType: "dataagent",
    link: "#"
  }
];

const labExperiments = [
  { id: "EXP / 001", name: "LOCAL GEMMA", status: "ACTIVE", statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  { id: "EXP / 002", name: "RAG PIPELINE", status: "WORKING", statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  { id: "EXP / 003", name: "YOLO + OPENCV", status: "WORKING", statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  { id: "EXP / 004", name: "MULTIMODAL AI", status: "TESTING", statusColor: "text-sky-400 bg-sky-500/10 border-sky-500/30" },
  { id: "EXP / 005", name: "QLoRA / POST-TRAINING", status: "EXPLORING", statusColor: "text-[#ff2a5f] bg-[#ff2a5f]/10 border-[#ff2a5f]/30" },
];

const steps = [
  { label: "THINK", sub: "Formulate problem & agent architecture" },
  { label: "BUILD", sub: "Develop working model & pipelines" },
  { label: "BREAK", sub: "Stress-test edge cases & hallucinations" },
  { label: "REBUILD", sub: "Distill weights & optimize latency" },
  { label: "SHIP", sub: "Deploy production-grade system" },
];

export default function WorkSection() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeProject = projects[activeProjectIndex];

  return (
    <section id="work" className="relative w-full bg-black text-white py-24 sm:py-32 px-5 sm:px-12 md:px-16 lg:px-24 overflow-hidden border-t border-white/[0.08]">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] max-w-full h-[500px] bg-[#ff2a5f]/[0.025] blur-[180px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-28 sm:space-y-36">

        {/* ─────────────────────────────────────────────────────────────
            02 / SELECTED BUILDS
           ───────────────────────────────────────────────────────────── */}
        <div>
          {/* Section Header with underline */}
          <div className="flex flex-col items-start mb-12 sm:mb-16">
            <h2 className="text-xs sm:text-sm font-mono tracking-[0.25em] text-white uppercase font-bold">
              02 / SELECTED BUILDS
            </h2>
            <div className="w-16 h-[1.5px] bg-white/40 mt-2.5" />
          </div>

          {/* Interactive Project List (matching Image 4) */}
          <div className="space-y-2 sm:space-y-3 mb-12 sm:mb-16">
            {projects.map((p, idx) => {
              const isActive = activeProjectIndex === idx;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProjectIndex(idx)}
                  className={`w-full text-left group transition-all duration-300 py-3.5 sm:py-4 px-2 sm:px-4 rounded-xl ${
                    isActive
                      ? "bg-white/[0.05] border-white/20"
                      : "hover:bg-white/[0.02] border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm font-mono tracking-wider mb-2.5">
                    <div className="flex items-center gap-4 sm:gap-8">
                      <span className={`${isActive ? "text-[#ff2a5f]" : "text-zinc-500 group-hover:text-zinc-300"} transition-colors font-bold`}>
                        {p.id}
                      </span>
                      <span className={`text-sm sm:text-base font-gilroy font-bold uppercase tracking-tight ${
                        isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
                      } transition-colors`}>
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[11px] sm:text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors uppercase">
                      {p.category}
                    </span>
                  </div>

                  {/* Horizontal line ending with arrow */}
                  <div className="relative w-full flex items-center">
                    <div className={`h-[1px] w-full transition-all duration-300 ${
                      isActive ? "bg-white/40" : "bg-white/10 group-hover:bg-white/25"
                    }`} />
                    <span className={`pl-2 font-mono text-sm transition-all duration-300 ${
                      isActive
                        ? "text-[#ff2a5f] translate-x-1"
                        : "text-zinc-600 group-hover:text-white group-hover:translate-x-1"
                    }`}>
                      &rarr;
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Featured Project Card (matching Image 5) */}
          <div className="w-full rounded-2xl border border-dashed border-white/20 bg-[#0d0d12] p-6 sm:p-10 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col justify-between min-h-[380px] sm:min-h-[440px]">
              <div>
                {/* Project Number */}
                <span className="text-xs sm:text-sm font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                  {activeProject.id}
                </span>

                {/* Project Title with underline */}
                <div className="inline-block mb-6">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight font-gilroy uppercase">
                    {activeProject.name}
                  </h3>
                  <div className="w-12 h-[1px] bg-white/40 mt-1.5" />
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-medium max-w-2xl mb-6">
                  {activeProject.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-zinc-400 tracking-wider mb-8">
                  {activeProject.tags.map((tag, i) => (
                    <React.Fragment key={i}>
                      <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-zinc-300">
                        {tag}
                      </span>
                      {i < activeProject.tags.length - 1 && <span className="text-zinc-600">&bull;</span>}
                    </React.Fragment>
                  ))}
                </div>

                {/* Interactive Project Visual Area */}
                <div className="w-full my-6 p-6 sm:p-8 rounded-xl border border-dashed border-white/15 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs uppercase tracking-[0.25em] mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a5f] animate-pulse" />
                    <span>PROJECT VISUAL</span>
                  </div>

                  {/* Dynamic Visual Mock for Selected Project */}
                  <div className="w-full max-w-xl font-mono text-left text-xs bg-[#0b0b10] border border-white/10 rounded-lg p-4 sm:p-5 shadow-inner">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px] text-zinc-500">
                      <span className="text-zinc-400">~/projects/{activeProject.name.toLowerCase().replace(/\s+/g, '-')}</span>
                      <span className="text-emerald-400">● live</span>
                    </div>

                    {activeProject.visualType === "mentora" && (
                      <div className="space-y-2 text-zinc-300">
                        <p className="text-zinc-500">// Real-time Socratic Dialogue &amp; Execution Graph</p>
                        <p><span className="text-[#ff2a5f]">&gt;</span> Student: &quot;Why does my binary search loop infinitely?&quot;</p>
                        <p><span className="text-emerald-400">&gt;</span> Mentora: &quot;Notice condition (low &lt;= high). What happens when high equals low + 1 without mid offset?&quot;</p>
                        <p className="text-[10px] text-zinc-500 pt-1">[AST Node: LoopInvariant &bull; Context Confidence: 99.4%]</p>
                      </div>
                    )}

                    {activeProject.visualType === "abha" && (
                      <div className="space-y-2 text-zinc-300">
                        <p className="text-zinc-500">// National Health Stack &amp; Triage Engine</p>
                        <p><span className="text-[#ff2a5f]">&gt;</span> ABHA-ID: <span className="text-white">91-4821-9021-4412</span> [Verified]</p>
                        <p><span className="text-emerald-400">&gt;</span> Ingestion: Clinical Records OCR &rarr; FHIR JSON normalized</p>
                        <p><span className="text-sky-400">&gt;</span> AI Triage: Vitals stable &bull; Prioritized for OPD consultation</p>
                      </div>
                    )}

                    {activeProject.visualType === "smartfaq" && (
                      <div className="space-y-2 text-zinc-300">
                        <p className="text-zinc-500">// Grounded RAG Civic Portal</p>
                        <p><span className="text-[#ff2a5f]">&gt;</span> Query: &quot;How to claim agricultural subsidy in Marathi?&quot;</p>
                        <p><span className="text-emerald-400">&gt;</span> Vector Search: 3 relevant clauses retrieved (cosine sim: 0.94)</p>
                        <p><span className="text-purple-400">&gt;</span> Response synthesized with official state portal citations</p>
                      </div>
                    )}

                    {activeProject.visualType === "flower" && (
                      <div className="space-y-2 text-zinc-300">
                        <p className="text-zinc-500">// Edge Computer Vision Pipeline</p>
                        <p><span className="text-[#ff2a5f]">&gt;</span> Input Stream: 1080p @ 60 FPS &bull; Inference Latency: 13.8ms</p>
                        <p><span className="text-emerald-400">&gt;</span> Detected: Hibiscus rosa-sinensis [Confidence: 99.2%]</p>
                        <p><span className="text-amber-400">&gt;</span> Health Status: Healthy foliage &bull; No fungal pathogen detected</p>
                      </div>
                    )}

                    {activeProject.visualType === "dataagent" && (
                      <div className="space-y-2 text-zinc-300">
                        <p className="text-zinc-500">// Autonomous Multi-Agent Query Loop</p>
                        <p><span className="text-[#ff2a5f]">&gt;</span> Planner: Decomposed &quot;Analyze Q3 revenue vs customer churn&quot;</p>
                        <p><span className="text-emerald-400">&gt;</span> Tool Call: Executed safe SQL aggregation across 4 tables</p>
                        <p><span className="text-sky-400">&gt;</span> Chart Engine: Interactive scatter visual compiled in 180ms</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* View Project Action */}
              <div className="flex justify-end pt-4 border-t border-white/10">
                <a
                  href={activeProject.link || "#"}
                  className="group inline-flex items-center gap-2 text-xs sm:text-sm font-mono tracking-wider text-white hover:text-[#ff2a5f] transition-colors"
                >
                  <span className="font-semibold uppercase">VIEW PROJECT</span>
                  <span className="transition-transform group-hover:translate-x-1.5">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            05 / THE LAB
           ───────────────────────────────────────────────────────────── */}
        <div className="pt-8">
          {/* Header */}
          <div className="flex flex-col items-start mb-10">
            <h2 className="text-xs sm:text-sm font-mono tracking-[0.25em] text-white uppercase font-bold">
              05 / THE LAB
            </h2>
            <div className="w-16 h-[1.5px] bg-white/40 mt-2.5" />
          </div>

          {/* Table / Terminal List (matching Image 3) */}
          <div className="rounded-2xl border border-white/10 bg-[#0d0d12] overflow-hidden divide-y divide-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {labExperiments.map((exp, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 sm:p-5 hover:bg-white/[0.025] transition-colors font-mono text-xs sm:text-sm"
              >
                {/* Exp Number */}
                <span className="text-zinc-500 font-medium tracking-wider w-24 sm:w-32">
                  {exp.id}
                </span>

                {/* Exp Name */}
                <span className="text-white font-semibold tracking-wider flex-1 px-3">
                  {exp.name}
                </span>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] sm:text-xs tracking-widest uppercase font-mono ${exp.statusColor}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span>{exp.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            06 / HOW IT HAPPENS
           ───────────────────────────────────────────────────────────── */}
        <div className="pt-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-xs sm:text-sm font-mono tracking-[0.25em] text-white uppercase font-bold">
              06 / HOW IT HAPPENS
            </h2>
            <div className="w-16 h-[1.5px] bg-white/40 mt-2.5" />
          </div>

          {/* Flow Pipeline (matching Image 2) */}
          <div className="flex flex-col items-center">
            {steps.map((step, idx) => (
              <React.Fragment key={step.label}>
                {/* Step Item */}
                <div className="group flex flex-col items-center text-center">
                  <div className="px-6 py-2.5 rounded-lg border border-white/10 bg-[#0d0d12] group-hover:border-[#ff2a5f]/40 group-hover:shadow-[0_0_20px_rgba(255,42,95,0.15)] transition-all">
                    <span className="font-mono text-sm sm:text-base font-bold text-white tracking-[0.25em] uppercase">
                      {step.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 mt-1 max-w-[220px]">
                    {step.sub}
                  </span>
                </div>

                {/* Downward Connector Line & Arrow */}
                {idx < steps.length - 1 && (
                  <div className="flex flex-col items-center my-3 text-zinc-600">
                    <div className="w-[1.5px] h-6 bg-gradient-to-b from-white/30 to-white/10" />
                    <span className="text-xs -mt-1 font-mono text-zinc-500">&darr;</span>
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Connecting Arrow from SHIP into WHAT'S NEXT */}
            <div className="flex flex-col items-center my-6 text-zinc-500">
              <div className="w-[1.5px] h-10 bg-gradient-to-b from-white/40 to-white/10" />
              <span className="text-sm -mt-1 font-mono text-[#ff2a5f]">&darr;</span>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                WHAT'S NEXT? (matching Image 1)
               ───────────────────────────────────────────────────────────── */}
            <div className="w-full max-w-2xl rounded-2xl border border-dashed border-white/25 bg-[#0d0d12] p-8 sm:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              <div className="flex flex-col space-y-6 text-left">
                <span className="text-xs sm:text-sm font-mono tracking-[0.25em] text-zinc-400 uppercase font-bold">
                  WHAT&apos;S NEXT?
                </span>

                <div className="text-lg sm:text-2xl font-bold text-white font-gilroy tracking-tight leading-snug">
                  Probably something<br />
                  I haven&apos;t built yet.
                </div>

                <div className="flex justify-end pt-4">
                  <a
                    href="mailto:jadhavpavan135@gmail.com"
                    className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-lg border border-white/20 bg-white/[0.04] hover:bg-[#ff2a5f] hover:border-[#ff2a5f] hover:text-white transition-all duration-300 font-mono text-xs sm:text-sm tracking-wider uppercase font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                  >
                    <span>LET&apos;S BUILD IT</span>
                    <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
