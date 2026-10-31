"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Sparkles,
  ArrowRight,
  Star,
  Check,
  Eye,
  Sliders,
  Cpu,
  Layers,
  DollarSign,
  TrendingUp,
  X,
  Plus,
  Compass,
  Bookmark,
  Share2,
  CheckCircle2,
  Wand2,
} from "lucide-react";
import { DiscoveryIdea, IDEA_CATEGORIES, STARTER_IDEAS } from "@/lib/idea-library";

interface IdeaDiscoveryLibraryProps {
  onSelectIdea: (idea: DiscoveryIdea, expansionDirective?: string) => void;
  onClose?: () => void;
}

export default function IdeaDiscoveryLibrary({
  onSelectIdea,
  onClose,
}: IdeaDiscoveryLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeModalIdea, setActiveModalIdea] = useState<DiscoveryIdea | null>(null);
  const [selectedExpansion, setSelectedExpansion] = useState<string>("");

  // Load favorites from local storage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("launch_lens_favorite_ideas");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  function toggleFavorite(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("launch_lens_favorite_ideas", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }

  // Filter ideas by category and search
  const filteredIdeas = useMemo(() => {
    return STARTER_IDEAS.filter((item) => {
      const matchCat =
        selectedCategory === "All Categories" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.problem.toLowerCase().includes(q) ||
        item.proposedSolution.toLowerCase().includes(q) ||
        item.intendedUsers.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const expansionActions = [
    { label: "Add an AI capability", directive: "Enhance this idea with a proprietary AI/LLM capability and automated workflow intelligence." },
    { label: "Simplify the MVP", directive: "Strip this idea down to a lean, single-feature MVP that can launch in under 2 weeks." },
    { label: "Explore different customer segment", directive: "Pivot this product to target enterprise B2B teams instead of consumers, or vice versa." },
    { label: "Improve accessibility", directive: "Redesign the UX and delivery channels to be maximally accessible and voice-first." },
    { label: "Reduce implementation cost", directive: "Re-architect this concept to run on free or low-cost serverless tools with zero initial burn." },
    { label: "Alternative monetization", directive: "Explore high-margin usage-based pricing or marketplace transaction fee business models." },
  ];

  return (
    <div className="w-full space-y-6">
      {/* 1. Header & Search Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
              <Compass className="h-3.5 w-3.5" />
              <span>Venture Opportunity Library</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Explore Pre-Validated Startup Concepts
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Browse 15 curated high-growth industries. Pick any concept, customize it with AI, or build directly on top of it.
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="self-start md:self-auto px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Back to Editor
            </button>
          )}
        </div>

        {/* Search & Favorites Counter */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts by keywords, problem, tech stack, or audience..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <span className="text-xs text-slate-400">
              Showing <b>{filteredIdeas.length}</b> concept{filteredIdeas.length === 1 ? "" : "s"}
            </span>
            {favorites.length > 0 && (
              <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs text-amber-400 font-medium">
                ★ {favorites.length} Pinned
              </span>
            )}
          </div>
        </div>

        {/* 15 Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {IDEA_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20"
                    : "border border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Idea Grid (3 columns on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIdeas.map((idea) => {
          const isFav = favorites.includes(idea.id);
          const complexityColor =
            idea.implementationComplexity === "Low"
              ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
              : idea.implementationComplexity === "Medium"
              ? "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
              : "text-amber-400 border-amber-500/30 bg-amber-500/10";

          return (
            <div
              key={idea.id}
              className="group relative rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-sm hover:border-slate-700 hover:bg-slate-900 transition-all flex flex-col justify-between space-y-4"
            >
              {/* Top Meta Bar */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full border border-slate-800 bg-slate-950 px-2.5 py-0.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {idea.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${complexityColor}`}
                    >
                      {idea.implementationComplexity} Complexity
                    </span>

                    <button
                      onClick={(e) => toggleFavorite(idea.id, e)}
                      title={isFav ? "Remove favorite" : "Pin to favorites"}
                      className={`p-1 rounded-lg border transition-colors ${
                        isFav
                          ? "border-amber-500/40 bg-amber-500/20 text-amber-400"
                          : "border-slate-800 text-slate-500 hover:text-amber-400 hover:border-slate-700"
                      }`}
                    >
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    {idea.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {idea.problem}
                  </p>
                </div>

                {/* Target Audience */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-2.5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Target Beachhead
                  </span>
                  <p className="text-xs text-slate-300 font-medium">
                    {idea.intendedUsers}
                  </p>
                </div>

                {/* Proposed Solution snippet */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  <strong className="text-slate-300">Solution: </strong>
                  {idea.proposedSolution}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {idea.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-slate-800 bg-slate-950/60 px-2 py-0.5 text-[10px] text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveModalIdea(idea)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-all"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                    <span>Explore</span>
                  </button>

                  <button
                    onClick={() => onSelectIdea(idea)}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-md hover:from-cyan-400 hover:to-indigo-500 transition-all hover:scale-[1.02]"
                  >
                    <span>Use Idea</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredIdeas.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-300">No ideas found matching your filter</p>
          <p className="text-xs text-slate-500">Try selecting &quot;All Categories&quot; or clearing your search keywords.</p>
          <button
            onClick={() => {
              setSelectedCategory("All Categories");
              setSearchQuery("");
            }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 3. Detailed Idea Exploration Modal */}
      {activeModalIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-400">
                  {activeModalIdea.category}
                </span>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">
                  {activeModalIdea.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalIdea(null)}
                className="rounded-xl border border-slate-800 p-2 text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
                <h4 className="font-bold text-slate-300 uppercase text-[11px] tracking-wider text-rose-400">
                  Core Problem Statement
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {activeModalIdea.problem}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
                <h4 className="font-bold text-slate-300 uppercase text-[11px] tracking-wider text-emerald-400">
                  Proposed Solution & Mechanism
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {activeModalIdea.proposedSolution}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <h4 className="font-bold text-slate-300 uppercase text-[11px] tracking-wider text-cyan-400">
                    MVP Scope Features
                  </h4>
                  <ul className="space-y-1 text-slate-300 text-xs">
                    {activeModalIdea.mvpFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <h4 className="font-bold text-slate-300 uppercase text-[11px] tracking-wider text-indigo-400">
                    Strategic Differentiators
                  </h4>
                  <ul className="space-y-1 text-slate-300 text-xs">
                    {activeModalIdea.differentiators.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                <h4 className="font-bold text-slate-300 uppercase text-[11px] tracking-wider text-amber-400">
                  Revenue Models & Economics
                </h4>
                <ul className="space-y-1 text-slate-300 text-xs">
                  {activeModalIdea.revenueModels.map((r, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expansion Action Selector */}
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 space-y-2">
                <h4 className="font-bold text-purple-300 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Wand2 className="h-3.5 w-3.5 text-purple-400" />
                  Optional: AI Expansion Action
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {expansionActions.map((act) => (
                    <button
                      key={act.label}
                      type="button"
                      onClick={() =>
                        setSelectedExpansion(
                          selectedExpansion === act.directive ? "" : act.directive
                        )
                      }
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                        selectedExpansion === act.directive
                          ? "bg-purple-500/30 border-purple-400 text-white font-semibold"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveModalIdea(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const idea = activeModalIdea;
                  const exp = selectedExpansion;
                  setActiveModalIdea(null);
                  onSelectIdea(idea, exp);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition-all hover:scale-[1.02]"
              >
                <span>Populate Editor with This Concept</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
