"use client";

import React, { useState } from "react";
import { StartupReport } from "@/types/report";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Copy,
  Check,
  Sparkles,
  Presentation,
  Download,
} from "lucide-react";

export default function PitchDeck({ report }: { report: StartupReport }) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [copiedSlide, setCopiedSlide] = useState(false);

  const slides = report.pitchDeck?.slides || [];
  const currentSlide = slides[activeSlideIndex] || slides[0] || ({} as any);

  const nextSlide = () => {
    if (activeSlideIndex < slides.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  };

  const copySlideText = () => {
    if (currentSlide && typeof navigator !== "undefined") {
      const text = `${currentSlide.title}\n${currentSlide.subtitle}\n\n${(currentSlide.bullets || []).join("\n• ")}`;
      navigator.clipboard.writeText(text);
      setCopiedSlide(true);
      setTimeout(() => setCopiedSlide(false), 2000);
    }
  };

  if (!slides.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center text-xs text-slate-400">
        No slide deck compiled for this startup idea.
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 min-w-0">
      {/* 1. Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Presentation className="h-3.5 w-3.5" />
              10-Slide Pitch Deck Studio
            </span>
            <span className="text-xs text-slate-400">
              Slide {activeSlideIndex + 1} of {slides.length}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Investor Presentation Slides
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copySlideText}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            {copiedSlide ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Copy Slide</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Slide Canvas Stage */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 p-8 sm:p-14 shadow-2xl backdrop-blur-xl relative min-h-[380px] flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider font-mono">
              Slide 0{activeSlideIndex + 1}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {report.title}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {currentSlide.title}
            </h3>
            <p className="text-sm sm:text-base text-cyan-400 font-medium">
              {currentSlide.subtitle}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800/80 max-w-2xl">
            {(currentSlide.bullets || []).map((bullet: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Navigation Controls */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-800/80 mt-8">
          <button
            onClick={prevSlide}
            disabled={activeSlideIndex === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
              activeSlideIndex === 0
                ? "border-slate-800 text-slate-600 cursor-not-allowed"
                : "border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous Slide</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === activeSlideIndex
                    ? "w-6 bg-cyan-400"
                    : "w-2 bg-slate-700 hover:bg-slate-600"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={activeSlideIndex === slides.length - 1}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
              activeSlideIndex === slides.length - 1
                ? "border-slate-800 text-slate-600 cursor-not-allowed"
                : "border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white"
            }`}
          >
            <span>Next Slide</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3. Slide Thumbnails Tray */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        {slides.map((slide: any, idx: number) => {
          const isActive = idx === activeSlideIndex;
          return (
            <button
              key={idx}
              onClick={() => setActiveSlideIndex(idx)}
              className={`rounded-xl border p-3 text-left transition-all ${
                isActive
                  ? "border-cyan-500 bg-slate-900 shadow-md shadow-cyan-500/10"
                  : "border-slate-800 bg-slate-950/60 hover:border-slate-700 opacity-70 hover:opacity-100"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block font-mono">
                Slide 0{idx + 1}
              </span>
              <p className="text-xs font-semibold text-white truncate mt-1">
                {slide.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}