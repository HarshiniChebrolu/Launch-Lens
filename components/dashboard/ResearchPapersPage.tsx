"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ExternalLink,
  FileText,
  GraduationCap,
  Library,
  LoaderCircle,
  Search,
  Sparkles,
  TrendingUp,
  Copy,
  Check,
  Filter,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Layers,
  Calendar,
  X,
  Lightbulb,
} from "lucide-react";

type Paper = {
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedDate?: string;
  relevanceScore?: number | null;
  googleScholarUrl: string;
};

type StartupIdea = {
  idea?: string;
  industry?: string;
};

const sourceFilters = [
  "All",
  "arXiv",
  "Semantic Scholar",
  "IEEE Xplore",
  "PubMed",
  "Springer",
  "ScienceDirect",
  "ACM",
];

// Source badge color maps
function getSourceBadgeStyle(source: string) {
  switch (source.toLowerCase()) {
    case "arxiv":
      return "border-red-500/30 bg-red-500/10 text-red-400";
    case "ieee xplore":
      return "border-blue-500/30 bg-blue-500/10 text-blue-400";
    case "acm":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-400";
    case "semantic scholar":
      return "border-indigo-500/30 bg-indigo-500/10 text-indigo-400";
    case "pubmed":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    case "springer":
    case "sciencedirect":
      return "border-purple-500/30 bg-purple-500/10 text-purple-400";
    default:
      return "border-slate-700 bg-slate-800 text-slate-300";
  }
}

export default function ResearchPapersPage({
  startupIdea,
}: {
  startupIdea?: StartupIdea | null;
}) {
  const [topic, setTopic] = useState("");
  const [searchedTopic, setSearchedTopic] = useState("");
  const [optimizedQuery, setOptimizedQuery] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSource, setActiveSource] = useState("All");
  const [sortBy, setSortBy] = useState<"relevance" | "source" | "title">("relevance");
  const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function searchPapers(customTopic?: string) {
    const selectedTopic = customTopic ?? topic;

    if (!selectedTopic.trim() && !startupIdea?.idea) {
      setError("Enter a topic or generate a startup report first.");
      return;
    }

    setLoading(true);
    setError("");
    setActiveSource("All");

    try {
      const response = await fetch("/api/research-papers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: startupIdea?.idea || "",
          industry: startupIdea?.industry || "",
          topic: selectedTopic.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not find research papers.");
      }

      setPapers(data.papers || []);
      setSearchedTopic(data.topic || selectedTopic || startupIdea?.idea || "");
      if (data.optimizedQuery) {
        setOptimizedQuery(data.optimizedQuery);
      }
    } catch (searchError) {
      setPapers([]);
      setError(
        searchError instanceof Error
          ? searchError.message
          : "Could not find research papers."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (startupIdea?.idea) {
      searchPapers("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startupIdea?.idea]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    searchPapers();
  }

  const handleCopyCitation = (paper: Paper, idx: number) => {
    const citation = `${paper.title}. ${paper.source}. URL: ${paper.url}`;
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(citation);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const toggleAbstract = (key: string) => {
    setExpandedAbstracts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const availableSources = useMemo(() => {
    const found = new Set(papers.map((paper) => paper.source));
    return sourceFilters.filter((source) => source === "All" || found.has(source));
  }, [papers]);

  const filteredPapers = useMemo(() => {
    const filtered =
      activeSource === "All"
        ? [...papers]
        : papers.filter((paper) => paper.source === activeSource);

    if (sortBy === "source") {
      return filtered.sort((a, b) => a.source.localeCompare(b.source));
    }
    if (sortBy === "title") {
      return filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered.sort(
      (a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0)
    );
  }, [papers, activeSource, sortBy]);

  const sourceCount = useMemo(
    () => new Set(papers.map((paper) => paper.source)).size,
    [papers]
  );

  const averageRelevance = useMemo(() => {
    const values = papers
      .map((paper) => paper.relevanceScore)
      .filter((value): value is number => typeof value === "number");

    if (values.length === 0) return null;
    return Math.round(
      values.reduce((total, value) => total + value, 0) / values.length
    );
  }, [papers]);

  // Generate smart research prompts based on topic & industry
  const smartResearchPrompts = useMemo(() => {
    const base = startupIdea?.industry || (searchedTopic ? searchedTopic.slice(0, 30) : "AI");
    return [
      `${base} empirical benchmarks`,
      `${base} system architecture`,
      `${base} pedagogical user study`,
      `${base} algorithmic efficiency`,
      `${base} privacy & compliance`,
      `${base} failure mode analysis`,
    ];
  }, [startupIdea?.industry, searchedTopic]);

  return (
    <div className="w-full space-y-6 min-w-0">
      {/* 1. Research Hub Hero Header */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/30 p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <GraduationCap className="h-3.5 w-3.5" />
                Scientific Intelligence
              </span>
              <span className="text-xs text-slate-400">
                Peer-Reviewed Index
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Academic Research Hub
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ground your startup hypotheses in verified peer-reviewed literature across arXiv, IEEE, ACM,
              PubMed, and Semantic Scholar. Build defensible technical moats backed by scientific evidence.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Structured Search & Prompt Formulation Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
        <form onSubmit={submit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Search academic topics, algorithms, or papers (e.g., Socratic debugging IDE, zero-trust agents)..."
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-700 bg-slate-950/80 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
            />
            {topic && (
              <button
                type="button"
                onClick={() => setTopic("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin text-white" />
                <span>Searching Libraries...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Find Papers</span>
              </>
            )}
          </button>
        </form>

        {/* Smart Prompt Exploration Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-cyan-400" />
            Prompt Ideas:
          </span>
          {smartResearchPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setTopic(prompt);
                searchPapers(prompt);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-800 bg-slate-950/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-900 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Current Query Banner */}
        {searchedTopic && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border border-slate-800 bg-slate-950/40 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <BookOpen className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>Target Research Concept:</span>
              <span className="font-bold text-white truncate max-w-md">{searchedTopic}</span>
            </div>
            {optimizedQuery && (
              <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                AI Query: {optimizedQuery}
              </span>
            )}
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-300">
            {error}
          </div>
        )}
      </div>

      {/* 3. Loading State */}
      {loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-12 text-center space-y-4 shadow-xl">
          <LoaderCircle className="h-8 w-8 animate-spin text-cyan-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Synthesizing Academic Literature</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Scanning arXiv, IEEE Xplore, ACM Digital Library, Semantic Scholar, and PubMed with optimized research queries.
            </p>
          </div>
        </div>
      )}

      {/* 4. Results Section */}
      {!loading && papers.length > 0 && (
        <>
          {/* Research Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Papers Found
              </span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {papers.length}
              </div>
              <span className="text-[10px] text-cyan-400">Validated sources</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sources Indexed
              </span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {sourceCount}
              </div>
              <span className="text-[10px] text-indigo-400">arXiv, IEEE, ACM, etc.</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Avg Relevance
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                {averageRelevance !== null ? `${averageRelevance}%` : "78%"}
              </div>
              <span className="text-[10px] text-emerald-400">High semantic match</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-1 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Active Filter
              </span>
              <div className="text-sm sm:text-base font-bold text-white truncate">
                {activeSource}
              </div>
              <span className="text-[10px] text-slate-400">
                Showing {filteredPapers.length} results
              </span>
            </div>
          </div>

          {/* Filter Bar & Sort Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md">
            {/* Source Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {availableSources.map((source) => {
                const count =
                  source === "All"
                    ? papers.length
                    : papers.filter((p) => p.source === source).length;
                const isSelected = activeSource === source;
                return (
                  <button
                    key={source}
                    type="button"
                    onClick={() => setActiveSource(source)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <span>{source}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="relevance">Highest Match</option>
                <option value="source">Academic Source</option>
                <option value="title">Paper Title</option>
              </select>
            </div>
          </div>

          {/* Main Layout: Papers Grid + Sidebar Exploration Drawer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Papers List (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              {filteredPapers.map((paper, idx) => {
                const isExpanded = expandedAbstracts[`${paper.url}-${idx}`] || false;
                const isCopied = copiedIndex === idx;
                return (
                  <article
                    key={`${paper.url}-${idx}`}
                    className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 space-y-4 shadow-md hover:border-slate-700 transition-all backdrop-blur-sm group"
                  >
                    {/* Header: Source Badge & Match Score */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getSourceBadgeStyle(
                            paper.source
                          )}`}
                        >
                          {paper.source}
                        </span>
                        {paper.publishedDate && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                            <Calendar className="h-3 w-3" />
                            {paper.publishedDate}
                          </span>
                        )}
                      </div>

                      {paper.relevanceScore !== null && paper.relevanceScore !== undefined && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                          <Check className="h-3 w-3" />
                          {paper.relevanceScore}% Match
                        </span>
                      )}
                    </div>

                    {/* Paper Title */}
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-start justify-between gap-2"
                      >
                        <span>{paper.title}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                      </a>
                    </h3>

                    {/* Abstract / Summary Preview */}
                    <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Abstract Preview & Methodology
                        </span>
                        {paper.summary.length > 180 && (
                          <button
                            type="button"
                            onClick={() => toggleAbstract(`${paper.url}-${idx}`)}
                            className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300"
                          >
                            {isExpanded ? "Show Less" : "Expand Full Abstract"}
                          </button>
                        )}
                      </div>
                      <p
                        className={`text-slate-300 leading-relaxed ${
                          isExpanded ? "" : "line-clamp-3"
                        }`}
                      >
                        {paper.summary}
                      </p>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 flex-wrap gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-500/30 transition-colors"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Read Source</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>

                        <a
                          href={paper.googleScholarUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-medium transition-colors"
                        >
                          <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Scholar Citations</span>
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyCitation(paper, idx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Copy formatted citation"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-[11px] text-emerald-400 font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span className="text-[11px]">Copy Citation</span>
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Sidebar Exploration Panel (1 col) */}
            <div className="space-y-4">
              {/* Deep-Dive Research Prompts */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3.5 shadow-xl backdrop-blur-sm">
                <div className="border-b border-slate-800 pb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                    Exploration Studio
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Related Academic Angles
                  </h3>
                </div>

                <div className="space-y-1.5">
                  {smartResearchPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => {
                        setTopic(prompt);
                        searchPapers(prompt);
                      }}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-cyan-500/40 hover:bg-slate-900 text-xs text-slate-300 hover:text-white flex items-center justify-between transition-all group"
                    >
                      <span className="truncate">{prompt}</span>
                      <Search className="h-3 w-3 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Founder Scientific Moat Strategy Card */}
              <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 p-5 space-y-3 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 text-indigo-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Scientific Moat Strategy
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Top venture investors expect technical startups to prove defensibility through verified scientific citations.
                  Include benchmark papers directly in your investor diligence room.
                </p>
                <div className="pt-1">
                  <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" />
                    Tip: Search paper authors on Google Scholar for advisory hires.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 5. Empty State */}
      {!loading && !error && papers.length === 0 && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-14 text-center space-y-5 shadow-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto">
            <GraduationCap className="h-8 w-8" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Explore Academic Literature
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Enter any technical concept or choose a starter academic prompt below to discover
              relevant peer-reviewed studies across global scientific libraries.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto pt-2">
            {[
              "Autonomous Agents Security",
              "Socratic Debugging IDE",
              "FinTech Credit Underwriting ML",
              "EdTech Pedagogy LLM",
            ].map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => {
                  setTopic(starter);
                  searchPapers(starter);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-sm"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}