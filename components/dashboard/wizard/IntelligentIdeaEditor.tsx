"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
  RotateCcw,
  Wand2,
  Check,
  X,
  Plus,
  Sliders,
  DollarSign,
  Layers,
  Target,
  Cpu,
  Bookmark,
  Compass,
} from "lucide-react";
import { IdeaInput } from "@/types/report";
import { IdeaImprovementResult } from "@/app/api/idea/improve/route";
import { ContextualSuggestionsResult } from "@/app/api/idea/suggestions/route";

const INDUSTRIES = [
  "AI SaaS",
  "FinTech",
  "HealthTech",
  "EdTech",
  "Agriculture and AgriTech",
  "ClimateTech",
  "Cybersecurity",
  "Developer Tools",
  "Productivity",
  "E-commerce",
  "Logistics",
  "Accessibility",
  "Smart Cities",
  "Small Business Solutions",
  "Personal Finance",
];

const GOALS = ["Startup Venture", "MVP / Prototype", "Hackathon", "College Project", "Angel / Seed Round"];

interface IntelligentIdeaEditorProps {
  initialIdea?: Partial<IdeaInput & { title?: string; constraints?: string }>;
  onValidate: (data: IdeaInput) => void;
  onExploreLibrary?: () => void;
  initialMode?: "direct" | "improve" | "find";
}

export default function IntelligentIdeaEditor({
  initialIdea,
  onValidate,
  onExploreLibrary,
  initialMode = "direct",
}: IntelligentIdeaEditorProps) {
  // Form fields
  const [title, setTitle] = useState(initialIdea?.title || "");
  const [idea, setIdea] = useState(initialIdea?.idea || "");
  const [users, setUsers] = useState(initialIdea?.users || "");
  const [problem, setProblem] = useState(initialIdea?.problem || "");
  const [industry, setIndustry] = useState(initialIdea?.industry || "AI SaaS");
  const [budget, setBudget] = useState(initialIdea?.budget || "Bootstrapped (< $1,000)");
  const [goal, setGoal] = useState(initialIdea?.goal || "Startup Venture");
  const [constraints, setConstraints] = useState(initialIdea?.constraints || "");

  // Voice-to-text state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceError, setVoiceError] = useState("");
  const recognitionRef = useRef<any>(null);

  // AI Refinement Preview state
  const [isImproving, setIsImproving] = useState(false);
  const [improvedPreview, setImprovedPreview] = useState<IdeaImprovementResult | null>(null);
  const [refineError, setRefineError] = useState("");
  const originalBackupRef = useRef<{ idea: string; users: string; problem: string; title: string }>({
    idea: "",
    users: "",
    problem: "",
    title: "",
  });

  // Contextual suggestions state
  const [suggestions, setSuggestions] = useState<ContextualSuggestionsResult | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Status message
  const [draftSavedMsg, setDraftSavedMsg] = useState("");

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setVoiceSupported(false);
      } else {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setIdea((prev) => (prev ? `${prev} ${currentTranscript}` : currentTranscript));
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setVoiceError(`Voice error: ${event.error}`);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Update when initialIdea changes
  useEffect(() => {
    if (initialIdea) {
      if (initialIdea.title !== undefined) setTitle(initialIdea.title);
      if (initialIdea.idea !== undefined) setIdea(initialIdea.idea);
      if (initialIdea.users !== undefined) setUsers(initialIdea.users);
      if (initialIdea.problem !== undefined) setProblem(initialIdea.problem);
      if (initialIdea.industry !== undefined) setIndustry(initialIdea.industry);
      if (initialIdea.budget !== undefined) setBudget(initialIdea.budget);
      if (initialIdea.goal !== undefined) setGoal(initialIdea.goal);
    }
  }, [initialIdea]);

  // Load saved draft on initial mount if empty
  useEffect(() => {
    try {
      const saved = localStorage.getItem("launch_lens_idea_draft");
      if (saved && !initialIdea?.idea) {
        const parsed = JSON.parse(saved);
        if (parsed.idea) setIdea(parsed.idea);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.problem) setProblem(parsed.problem);
        if (parsed.industry) setIndustry(parsed.industry);
        if (parsed.budget) setBudget(parsed.budget);
        if (parsed.goal) setGoal(parsed.goal);
      }
    } catch (e) {}
  }, [initialIdea?.idea]);

  // Debounced Contextual Suggestions as user types
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!idea || idea.trim().length < 10) {
      setSuggestions(null);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch("/api/idea/suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea, industry, problem }),
        });
        const json = await res.json();
        if (json.success && json.suggestions) {
          setSuggestions(json.suggestions);
        }
      } catch (err) {
        console.warn("Suggestions fetch failed:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 600);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [idea, industry, problem]);

  function toggleVoiceRecording() {
    setVoiceError("");
    if (!voiceSupported || !recognitionRef.current) {
      setVoiceError("Voice-to-text is not supported in this browser. Please type directly.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn("Start recording error:", err);
        setIsRecording(false);
      }
    }
  }

  function saveDraft() {
    try {
      const draft = { title, idea, users, problem, industry, budget, goal, constraints };
      localStorage.setItem("launch_lens_idea_draft", JSON.stringify(draft));
      setDraftSavedMsg("Draft saved successfully to local workspace!");
      setTimeout(() => setDraftSavedMsg(""), 3000);
    } catch (e) {
      setDraftSavedMsg("Could not save draft.");
    }
  }

  // Trigger AI Refinement
  async function handleImproveWithAI() {
    if (!idea.trim()) {
      setRefineError("Please write at least one sentence describing your idea before improving.");
      return;
    }

    setRefineError("");
    setIsImproving(true);

    // Save backup of original work so user never loses it
    originalBackupRef.current = { idea, users, problem, title };

    try {
      const res = await fetch("/api/idea/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          idea,
          users,
          problem,
          industry,
          budget,
          constraints,
        }),
      });

      const json = await res.json();
      if (!json.success || !json.result) {
        throw new Error(json.error || "Failed to refine idea");
      }

      setImprovedPreview(json.result);
    } catch (err: any) {
      setRefineError(err.message || "AI refinement could not be completed. Original text preserved.");
    } finally {
      setIsImproving(false);
    }
  }

  function acceptImprovedVersion() {
    if (!improvedPreview) return;
    if (improvedPreview.title) setTitle(improvedPreview.title);
    if (improvedPreview.summary) setIdea(improvedPreview.summary);
    if (improvedPreview.targetAudience) setUsers(improvedPreview.targetAudience);
    if (improvedPreview.coreProblem) setProblem(improvedPreview.coreProblem);
    setImprovedPreview(null);
    setDraftSavedMsg("Improved version accepted into your editor!");
    setTimeout(() => setDraftSavedMsg(""), 3000);
  }

  function keepOriginal() {
    setImprovedPreview(null);
  }

  function insertSuggestion(text: string, targetField: "idea" | "problem" | "users") {
    if (targetField === "problem") {
      setProblem((prev) => (prev ? `${prev}\n• ${text}` : text));
    } else if (targetField === "users") {
      setUsers((prev) => (prev ? `${prev}, ${text}` : text));
    } else {
      setIdea((prev) => (prev ? `${prev}\n• ${text}` : text));
    }
  }

  function handleSubmit() {
    if (!idea.trim()) {
      alert("Please describe your startup concept.");
      return;
    }

    const payload: IdeaInput = {
      idea: idea.trim(),
      users: users.trim() || "Early-stage adopters & tech-enabled professionals",
      problem: problem.trim() || `Users experience acute workflow friction trying to execute: ${idea.slice(0, 100)}`,
      industry: industry || "AI SaaS",
      budget: budget || "Low MVP budget (< $1,000)",
      goal: goal || "Startup Venture",
    };

    onValidate(payload);
  }

  return (
    <div className="w-full space-y-6">
      {/* Draft Notification Banner */}
      {draftSavedMsg && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{draftSavedMsg}</span>
        </div>
      )}

      {/* 1. Main Intelligent Editor Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
              AI-Augmented Concept Workspace
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Craft & Refine Your Startup Concept
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Start with a single sentence or bullet points. Our AI engine refines your market positioning as you type.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={saveDraft}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Draft</span>
            </button>

            {onExploreLibrary && (
              <button
                type="button"
                onClick={onExploreLibrary}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-colors"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Idea Library</span>
              </button>
            )}
          </div>
        </div>

        {/* Working Title (Optional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 block">
            Startup or Product Title <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. PatentLens AI, FlowInvoice, SubSqueeze"
            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
        </div>

        {/* Core Concept Text Area + Voice Input & AI Improve Toolbar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">
              What are you building? <span className="text-cyan-400 font-normal">* (Start with one sentence)</span>
            </label>

            {/* Voice-to-Text Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isRecording
                    ? "bg-rose-500/20 border border-rose-500/40 text-rose-300 animate-pulse"
                    : "border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                }`}
                title={isRecording ? "Click to stop recording" : "Dictate your idea using microphone"}
              >
                {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                <span>{isRecording ? "Listening..." : "Dictate Voice"}</span>
              </button>
            </div>
          </div>

          {voiceError && (
            <p className="text-[11px] text-amber-400">{voiceError}</p>
          )}

          <div className="relative">
            <textarea
              rows={4}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. An AI platform that analyzes medical bills and insurance policies to automatically detect overbilling and generate appeal letters..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 leading-relaxed transition-all"
            />

            {/* Floating "Improve with AI" Button in Corner */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleImproveWithAI}
                disabled={isImproving || !idea.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                <span>{isImproving ? "Refining Concept..." : "Improve with AI"}</span>
              </button>
            </div>
          </div>

          {refineError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{refineError}</span>
            </div>
          )}
        </div>

        {/* 2. AI Improvement Proposal Preview Card (Conditional) */}
        {improvedPreview && (
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Wand2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    AI-Enhanced Venture Proposal Preview
                  </h3>
                  <p className="text-[11px] text-cyan-300">
                    Review the structured proposal before accepting or editing.
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-400 uppercase">
                Proposal Ready
              </span>
            </div>

            {/* Proposal Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                  Refined Title
                </span>
                <p className="text-white font-bold text-sm">{improvedPreview.title}</p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                  Target Beachhead Segment
                </span>
                <p className="text-slate-200">{improvedPreview.targetAudience}</p>
              </div>

              <div className="md:col-span-2 space-y-1">
                <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                  Core Problem Statement
                </span>
                <p className="text-slate-300 leading-relaxed">{improvedPreview.coreProblem}</p>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                  Day-1 MVP Features
                </span>
                <ul className="space-y-1 text-slate-300">
                  {improvedPreview.mvpFeatures?.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                  Strategic Differentiators
                </span>
                <ul className="space-y-1 text-slate-300">
                  {improvedPreview.differentiators?.map((d, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-slate-300">
                <span className="font-bold text-xs text-white block mb-0.5">Executive Summary</span>
                <p className="leading-relaxed">{improvedPreview.summary}</p>
              </div>
            </div>

            {/* Proposal Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-cyan-500/20">
              <button
                type="button"
                onClick={keepOriginal}
                className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Keep Original
              </button>

              <button
                type="button"
                onClick={handleImproveWithAI}
                disabled={isImproving}
                className="px-3.5 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={acceptImprovedVersion}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-xs font-bold text-white shadow-md hover:from-cyan-400 hover:to-indigo-500"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Accept Improved Version</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Progressive Details: Users, Problem, Industry, Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Target Audience */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Target Audience / Beachhead Users</span>
              <span className="text-[11px] text-slate-500 font-normal">Who pays or uses this?</span>
            </label>
            <input
              type="text"
              value={users}
              onChange={(e) => setUsers(e.target.value)}
              placeholder="e.g. Solo physicians, freelance developers, SMB owners"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
          </div>

          {/* Industry Vertical */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Industry Vertical
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all cursor-pointer"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind} className="bg-slate-900 text-slate-200">
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Problem Statement */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Specific Pain Point or Problem Statement</span>
              <span className="text-[11px] text-slate-500 font-normal">Why do current tools fail?</span>
            </label>
            <textarea
              rows={2}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. Current EHR systems require 2.5 hours of manual note typing per day, causing high clinician burnout and billing delays..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 leading-relaxed transition-all"
            />
          </div>

          {/* Budget & Constraints */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Runway or Budget Constraint
            </label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. Free open-source tools only, $5k angel budget"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
          </div>

          {/* Target Milestone / Goal */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Validation Objective
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all cursor-pointer"
            >
              {GOALS.map((g) => (
                <option key={g} value={g} className="bg-slate-900 text-slate-200">
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Contextual AI Suggestions Tray (As User Types) */}
        {suggestions && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Live Contextual Hypotheses (Click any chip to insert)
              </span>
              <span className="text-[10px] text-slate-500">
                AI Hypotheses • Not verified data
              </span>
            </div>

            <div className="space-y-2">
              {/* Problem suggestions */}
              {suggestions.problemStatements?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">
                    Refined Problems
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.problemStatements.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => insertSuggestion(item, "problem")}
                        className="inline-flex items-center gap-1 text-[11px] rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all text-left"
                      >
                        <Plus className="h-3 w-3 text-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Customer suggestions */}
              {suggestions.targetCustomers?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">
                    Target Segments
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.targetCustomers.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => insertSuggestion(item, "users")}
                        className="inline-flex items-center gap-1 text-[11px] rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all text-left"
                      >
                        <Plus className="h-3 w-3 text-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* MVP Features */}
              {suggestions.mvpFeatures?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">
                    MVP Scope Ideas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.mvpFeatures.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => insertSuggestion(item, "idea")}
                        className="inline-flex items-center gap-1 text-[11px] rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all text-left"
                      >
                        <Plus className="h-3 w-3 text-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. Submit Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            LaunchLens will query live market data, rival gap pricing, and generate a 21-module investor dossier.
          </p>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Validate Idea & Build Dossier</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
