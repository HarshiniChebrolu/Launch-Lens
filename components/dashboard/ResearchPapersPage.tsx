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

export default function ResearchPapersPage({
  startupIdea,
}: {
  startupIdea?: StartupIdea | null;
}) {
  const [topic, setTopic] = useState("");
  const [searchedTopic, setSearchedTopic] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSource, setActiveSource] = useState("All");
  const [sortBy, setSortBy] = useState<"relevance" | "source">("relevance");

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

  const availableSources = useMemo(() => {
    const found = new Set(papers.map((paper) => paper.source));

    return sourceFilters.filter(
      (source) => source === "All" || found.has(source)
    );
  }, [papers]);

  const filteredPapers = useMemo(() => {
    const filtered =
      activeSource === "All"
        ? [...papers]
        : papers.filter((paper) => paper.source === activeSource);

    if (sortBy === "source") {
      return filtered.sort((a, b) => a.source.localeCompare(b.source));
    }

    return filtered.sort(
      (a, b) =>
        (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0)
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

  const relatedTopics = useMemo(() => {
    const base = startupIdea?.industry || searchedTopic;

    return [
      `${base} machine learning`,
      `${base} recommendation systems`,
      `${base} user experience`,
      `${base} automation`,
    ].filter(Boolean);
  }, [startupIdea?.industry, searchedTopic]);

  return (
    <section className="researchHubPage">
      <div className="researchHubHero">
        <div className="researchHeroIcon">
          <GraduationCap size={30} />
        </div>

        <div className="researchHeroCopy">
          <span className="wizardBadge">
            <Sparkles size={14} />
            Academic Intelligence
          </span>

          <h1>Research Hub</h1>

          <p>
            Discover academic papers, technical studies and trusted research
            related to your startup idea.
          </p>
        </div>
      </div>

      <form className="researchSearchBar" onSubmit={submit}>
        <Search size={20} />

        <input
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="Search topics such as AI interview assessment, menu optimization..."
        />

        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <LoaderCircle className="paperSpinner" size={18} />
              Searching
            </>
          ) : (
            <>
              <Search size={18} />
              Find Papers
            </>
          )}
        </button>
      </form>

      {searchedTopic && (
        <div className="researchTopicBanner">
          <BookOpen size={18} />

          <div>
            <span>Currently researching</span>
            <strong>{searchedTopic}</strong>
          </div>
        </div>
      )}

      {error && <div className="paperSearchError">{error}</div>}

      {loading && (
        <div className="researchLoadingState">
          <LoaderCircle className="paperSpinner" size={34} />
          <h2>Searching academic sources</h2>
          <p>
            Looking across arXiv, IEEE, Semantic Scholar, PubMed and other
            trusted libraries.
          </p>
        </div>
      )}

      {!loading && papers.length > 0 && (
        <>
          <div className="researchStatsGrid">
            <StatCard
              icon={<FileText size={22} />}
              label="Papers found"
              value={String(papers.length)}
            />

            <StatCard
              icon={<Library size={22} />}
              label="Sources"
              value={String(sourceCount)}
            />

            <StatCard
              icon={<TrendingUp size={22} />}
              label="Average match"
              value={
                averageRelevance === null ? "N/A" : `${averageRelevance}%`
              }
            />

            <StatCard
              icon={<BookOpen size={22} />}
              label="Topic"
              value={searchedTopic}
              compact
            />
          </div>

          <div className="researchToolbar">
            <div className="researchFilters">
              {availableSources.map((source) => (
                <button
                  key={source}
                  type="button"
                  className={activeSource === source ? "active" : ""}
                  onClick={() => setActiveSource(source)}
                >
                  {source}
                </button>
              ))}
            </div>

            <label className="researchSort">
              <span>Sort by</span>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as "relevance" | "source")
                }
              >
                <option value="relevance">Most relevant</option>
                <option value="source">Source</option>
              </select>
            </label>
          </div>

          <div className="researchHubLayout">
            <div className="researchPaperGrid">
              {filteredPapers.map((paper, index) => (
                <article
                  className="researchPaperPremiumCard"
                  key={`${paper.url}-${index}`}
                >
                  <div className="paperCardHeader">
                    <span className="paperSourceBadge">{paper.source}</span>

                    {paper.relevanceScore !== null &&
                      paper.relevanceScore !== undefined && (
                        <span className="paperMatchBadge">
                          {paper.relevanceScore}% match
                        </span>
                      )}
                  </div>

                  <h2>{paper.title}</h2>

                  {paper.publishedDate && (
                    <span className="paperDate">
                      Published: {paper.publishedDate}
                    </span>
                  )}

                  <div className="paperAbstract">
                    <span>Abstract preview</span>
                    <p>{paper.summary}</p>
                  </div>

                  <div className="paperCardActions">
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Paper
                      <ExternalLink size={16} />
                    </a>

                    <a
                      className="googleScholarAction"
                      href={paper.googleScholarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google Scholar
                      <GraduationCap size={16} />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <aside className="relatedResearchPanel">
              <span className="eyebrowSmall">Explore further</span>
              <h2>Related topics</h2>

              <div className="relatedTopicList">
                {relatedTopics.map((relatedTopic) => (
                  <button
                    type="button"
                    key={relatedTopic}
                    onClick={() => {
                      setTopic(relatedTopic);
                      searchPapers(relatedTopic);
                    }}
                  >
                    <Search size={16} />
                    {relatedTopic}
                  </button>
                ))}
              </div>

              <div className="researchTipCard">
                <GraduationCap size={21} />

                <div>
                  <strong>Research tip</strong>
                  <p>
                    Open papers in Google Scholar to discover citations and
                    related academic work.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </>
      )}

      {!loading && !error && papers.length === 0 && (
        <div className="researchEmptyState">
          <div className="researchEmptyIcon">
            <GraduationCap size={42} />
          </div>

          <h2>Explore academic research</h2>

          <p>
            Enter a topic above or generate a startup report to discover
            relevant research papers.
          </p>

          <div className="researchExampleTopics">
            {[
              "Artificial intelligence",
              "Healthcare technology",
              "Recommendation systems",
              "EdTech",
            ].map((example) => (
              <button
                type="button"
                key={example}
                onClick={() => {
                  setTopic(example);
                  searchPapers(example);
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  compact = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="researchStatCard">
      <div className="researchStatIcon">{icon}</div>

      <div>
        <span>{label}</span>
        <strong className={compact ? "compact" : ""}>{value}</strong>
      </div>
    </div>
  );
}