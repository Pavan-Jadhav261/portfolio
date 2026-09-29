'use client';

import React, { useState } from 'react';
import LiquidTarget from './LiquidTarget';

interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  visualType: string;
  repoUrl: string;
}

const projects: Project[] = [
  {
    id: "01",
    name: "SCHEMESATHI",
    category: "CIVIC / AI",
    description: "AI-powered platform that helps users discover government schemes based on their eligibility, with benefits, documents, and application guidance. Includes an intelligent browser extension.",
    tags: ["TYPESCRIPT", "BROWSER EXTENSION", "VECTOR RAG", "ELIGIBILITY ENGINE"],
    visualType: "schemesathi",
    repoUrl: "https://github.com/Pavan-Jadhav261/SchemeSathi"
  },
  {
    id: "02",
    name: "TEXT TO 3D",
    category: "3D GENERATIVE AI",
    description: "A Blender-based Text-to-3D system that converts natural language descriptions into 3D shapes and procedural scenes using AI prompts.",
    tags: ["TYPESCRIPT", "PYTHON", "BLENDER API", "GENERATIVE 3D"],
    visualType: "text3d",
    repoUrl: "https://github.com/Pavan-Jadhav261/text-to-3d"
  },
  {
    id: "03",
    name: "MENTORA AI",
    category: "AI / EDUCATION",
    description: "An AI-powered learning platform that uses local LLMs to provide personalized tutoring, interactive concept explanations, algorithm visualization, and coding assistance.",
    tags: ["LOCAL LLMS", "RAG", "ALGORITHM VIZ", "TYPESCRIPT"],
    visualType: "mentora",
    repoUrl: "https://github.com/Pavan-Jadhav261/mentoraAi"
  },
  {
    id: "04",
    name: "ABHA+",
    category: "AI / HEALTHCARE",
    description: "Ayushman Bharat Digital Mission (ABHA) healthcare system, integrating digital health IDs, clinical record triage, and secure citizen EHR access.",
    tags: ["TYPESCRIPT", "HEALTHCARE AI", "FHIR API", "SECURE EHR"],
    visualType: "abha",
    repoUrl: "https://github.com/Pavan-Jadhav261/ABHA-"
  },
  {
    id: "05",
    name: "FLOWER DETECTOR",
    category: "COMPUTER VISION",
    description: "YOLO computer vision flower detection and botanical classification model trained from scratch for 100 epochs, optimized for high-FPS edge inference.",
    tags: ["PYTHON", "YOLO", "OPENCV", "EDGE INFERENCE"],
    visualType: "flower",
    repoUrl: "https://github.com/Pavan-Jadhav261/flower-detector-yolo"
  }
];

const labExperiments = [
  { id: "EXP / 001", name: "SCHEMESATHI RAG PIPELINE", status: "WORKING", statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30", repo: "https://github.com/Pavan-Jadhav261/SchemeSathi" },
  { id: "EXP / 002", name: "BLENDER TEXT-TO-3D PIPELINE", status: "TESTING", statusColor: "text-sky-400 bg-sky-500/10 border-sky-500/30", repo: "https://github.com/Pavan-Jadhav261/text-to-3d" },
  { id: "EXP / 003", name: "LOCAL GEMMA (MENTORA AI)", status: "ACTIVE", statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", repo: "https://github.com/Pavan-Jadhav261/mentoraAi" },
  { id: "EXP / 004", name: "YOLO FLOWER & OBJECT DETECTOR", status: "WORKING", statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30", repo: "https://github.com/Pavan-Jadhav261/flower-detector-yolo" },
  { id: "EXP / 005", name: "LEETCODE AI ASSISTANT EXTENSION", status: "WORKING", statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", repo: "https://github.com/Pavan-Jadhav261/chrome-extension-leetcodeAssistant" },
];

const steps = [
  { label: "THINK", sub: "Formulate problem & agent architecture" },
  { label: "BUILD", sub: "Develop working model & pipelines" },
  { label: "BREAK", sub: "Stress-test edge cases & hallucinations" },
  { label: "REBUILD", sub: "Distill weights & optimize latency" },
  { label: "SHIP", sub: "Deploy production-grade system" },
];

const projectLiquidColors = ['cyan', 'violet', 'emerald', 'amber', 'rose'] as const;
const stepLiquidColors = ['blue', 'indigo', 'amber', 'teal', 'ruby'] as const;

export default function WorkSection() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeProject = projects[activeProjectIndex];

  return (
    <section
      id="work"
      aria-label="Selected Builds and Engineering Portfolio"
      className="relative w-full bg-black text-white py-24 sm:py-32 px-5 sm:px-12 md:px-16 lg:px-24 overflow-hidden border-t border-white/[0.08]"
    >
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
                <LiquidTarget
                  key={p.id}
                  id={`project-${p.name.toLowerCase().replace(/\s+/g, '-')}`}
                  color={projectLiquidColors[idx % projectLiquidColors.length]}
                  as="button"
                  onClick={() => setActiveProjectIndex(idx)}
                  className={`w-full text-left group py-3.5 sm:py-4 px-2 sm:px-4 rounded-xl border transition-colors ${
                    isActive
                      ? "bg-white/[0.05] border-white/20"
                      : "border-transparent"
                  }`}
                >
                  {({ isMerged }) => (
                    <>
                      <div className="flex items-center justify-between text-xs sm:text-sm font-mono tracking-wider mb-2.5">
                        <div className="flex items-center gap-4 sm:gap-8">
                          <span className={`font-mono text-xs sm:text-sm font-bold tracking-wider transition-colors ${
                            isMerged ? "text-white" : isActive ? "text-[#ff2a5f]" : "text-zinc-500 group-hover:text-zinc-300"
                          }`}>
                            {p.id}
                          </span>
                          <span className={`text-sm sm:text-base font-gilroy font-bold uppercase tracking-tight transition-colors ${
                            isMerged ? "text-white" : isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
                          }`}>
                            {p.name}
                          </span>
                        </div>
                        <span className={`text-[11px] sm:text-xs uppercase transition-colors ${
                          isMerged ? "text-white/90 font-medium" : "text-zinc-500 group-hover:text-zinc-400"
                        }`}>
                          {p.category}
                        </span>
                      </div>

                      {/* Horizontal line ending with arrow */}
                      <div className="relative w-full flex items-center">
                        <div className={`h-[1px] w-full transition-all duration-300 ${
                          isMerged ? "bg-white/60" : isActive ? "bg-white/40" : "bg-white/10 group-hover:bg-white/25"
                        }`} />
                        <span className={`pl-2 font-mono text-sm transition-all duration-300 ${
                          isMerged
                            ? "text-white translate-x-1.5 font-bold"
                            : isActive
                            ? "text-[#ff2a5f] translate-x-1 font-bold"
                            : "text-zinc-600 group-hover:text-white group-hover:translate-x-1"
                        }`}>
                          &rarr;
                        </span>
                      </div>
                    </>
                  )}
                </LiquidTarget>
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
                      <span className="text-zinc-400">~/github/Pavan-Jadhav261/{activeProject.name.toLowerCase().replace(/\s+/g, '-')}</span>
                      <span className="text-emerald-400">● public repo</span>
                    </div>

                    {activeProject.visualType === "mentora" && (
                      <div className="space-y-2 text-zinc-300">
                        <p className="text-zinc-500">// Local LLM Socratic Dialogue &amp; Algorithm Visualization</p>
                        <p><span className="text-[#ff2a5f]">&gt;</span> Student: &quot;Why does my binary search loop infinitely?&quot;</p>
                        <p><span className="text-emerald-400">&gt;</span> Mentora AI: &quot;Look at line 14: (low &lt;= high). What happens when high equals low + 1 without mid offset?&quot;</p>
                        <p className="text-[10px] text-zinc-500 pt-1">[AST Node: BinarySearchInvariant &bull; Latency: 18ms &bull; Model: Local Gemma]</p>
                      </div>
                    )}

                    {activeProject.visualType === "schemesathi" && (
                      <div className="space-y-2 text-zinc-300">
                        <p className="text-zinc-500">// Citizen Eligibility Engine &amp; Extension Assistant</p>
                        <p><span className="text-[#ff2a5f]">&gt;</span> User Profile: Student &bull; State: Maharashtra &bull; Income: &lt; 2.5 LPA</p>
                        <p><span className="text-emerald-400">&gt;</span> Match: PM Vidyalaxmi Scheme [Eligibility Score: 98.6%]</p>
                        <p><span className="text-purple-400">&gt;</span> Action: 4 required verification documents automatically checklist-generated</p>
                      </div>
                    )}

                    {activeProject.visualType === "abha" && (
                      <div className="space-y-2 text-zinc-300">
                        <p className="text-zinc-500">// National Health Stack (ABDM) Integration</p>
                        <p><span className="text-[#ff2a5f]">&gt;</span> ABHA-ID: <span className="text-white">91-4821-9021-4412</span> [ABDM Authenticated]</p>
                        <p><span className="text-emerald-400">&gt;</span> EHR Ingestion: Clinical Diagnostic Records &rarr; FHIR JSON normalized</p>
                        <p><span className="text-sky-400">&gt;</span> Secure Triage: Vitals synchronized across primary healthcare network</p>
                      </div>
                    )}

                    {activeProject.visualType === "flower" && (
                      <div className="space-y-2 text-zinc-300">
                        <p className="text-zinc-500">// YOLO Object Detection &amp; Edge Inference (100 Epochs)</p>
                        <p><span className="text-[#ff2a5f]">&gt;</span> Stream: OpenCV 1080p @ 60 FPS &bull; Inference Latency: 13.8ms</p>
                        <p><span className="text-emerald-400">&gt;</span> BBox Detection: Hibiscus rosa-sinensis [Confidence: 99.2%]</p>
                        <p><span className="text-amber-400">&gt;</span> Model Weights: Custom trained from scratch with PyTorch / YOLO</p>
                      </div>
                    )}

                    {activeProject.visualType === "text3d" && (
                      <div className="space-y-2 text-zinc-300">
                        <p className="text-zinc-500">// Procedural Blender Text-to-3D Synthesis</p>
                        <p><span className="text-[#ff2a5f]">&gt;</span> Input Prompt: &quot;Low-poly futuristic communication satellite&quot;</p>
                        <p><span className="text-emerald-400">&gt;</span> Python Blender API: 14 mesh primitives generated &amp; UV unwrapped</p>
                        <p><span className="text-sky-400">&gt;</span> Render Output: .OBJ / .GLTF export compiled in 1.4s</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* View Project Action linking to real GitHub repo */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-[11px] font-mono text-zinc-500">
                  github.com/Pavan-Jadhav261/{activeProject.name.toLowerCase().replace(/\s+/g, '-')}
                </span>
                <a
                  href={activeProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
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
              <a
                key={i}
                href={exp.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 sm:p-5 hover:bg-white/[0.025] transition-colors font-mono text-xs sm:text-sm group"
              >
                {/* Exp Number */}
                <span className="text-zinc-500 font-medium tracking-wider w-24 sm:w-32 group-hover:text-zinc-400">
                  {exp.id}
                </span>

                {/* Exp Name */}
                <span className="text-white font-semibold tracking-wider flex-1 px-3 group-hover:text-zinc-200">
                  {exp.name}
                </span>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] sm:text-xs tracking-widest uppercase font-mono ${exp.statusColor}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span>{exp.status}</span>
                  </span>
                </div>
              </a>
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
                  <LiquidTarget
                    id={`step-${step.label.toLowerCase()}`}
                    color={stepLiquidColors[idx % stepLiquidColors.length]}
                    as="div"
                    className="px-6 py-2.5 rounded-lg border border-white/10 bg-[#0d0d12] transition-colors cursor-pointer"
                  >
                    {({ isMerged }) => (
                      <span className="font-mono text-sm sm:text-base font-bold tracking-[0.25em] uppercase text-white transition-colors">
                        {step.label}
                      </span>
                    )}
                  </LiquidTarget>
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
            <div id="contact" className="w-full max-w-2xl rounded-2xl border border-dashed border-white/25 bg-[#0d0d12] p-8 sm:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              <div className="flex flex-col space-y-6 text-left">
                <span className="text-xs sm:text-sm font-mono tracking-[0.25em] text-zinc-400 uppercase font-bold">
                  WHAT&apos;S NEXT?
                </span>

                <div className="text-lg sm:text-2xl font-bold text-white font-gilroy tracking-tight leading-snug">
                  Probably something<br />
                  I haven&apos;t built yet.
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                    <a
                      href="https://github.com/Pavan-Jadhav261"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      github.com/Pavan-Jadhav261
                    </a>
                    <span>&bull;</span>
                    <a
                      href="https://www.linkedin.com/in/pavan-jadhav261/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      linkedin/pavan-jadhav261
                    </a>
                  </div>
                  <a
                    href="mailto:pavanjadhav5331@gmail.com"
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
