import { NextResponse } from "next/server";

type TavilyResult = {
  title?: string;
  url?: string;
  content?: string;
  score?: number;
  published_date?: string;
};

const TRUSTED_DOMAINS = [
  "scholar.google.com",
  "arxiv.org",
  "semanticscholar.org",
  "ieeexplore.ieee.org",
  "dl.acm.org",
  "pubmed.ncbi.nlm.nih.gov",
  "ncbi.nlm.nih.gov",
  "springer.com",
  "sciencedirect.com",
];

function sourceName(url: string) {
  if (url.includes("arxiv.org")) return "arXiv";
  if (url.includes("semanticscholar.org")) return "Semantic Scholar";
  if (url.includes("ieeexplore.ieee.org")) return "IEEE Xplore";
  if (url.includes("dl.acm.org")) return "ACM";
  if (url.includes("pubmed") || url.includes("ncbi.nlm.nih.gov")) {
    return "PubMed";
  }
  if (url.includes("springer.com")) return "Springer";
  if (url.includes("sciencedirect.com")) return "ScienceDirect";

  return "Academic Source";
}

function scholarUrl(title: string) {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const idea = String(body.idea || "").trim();
    const industry = String(body.industry || "").trim();
    const customTopic = String(body.topic || "").trim();

    if (!idea && !customTopic) {
      return NextResponse.json(
        {
          success: false,
          error: "Enter a topic or generate a startup report first.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "TAVILY_API_KEY is missing from .env.local.",
        },
        { status: 500 }
      );
    }

    const topic = customTopic || idea;

    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: `${topic} ${industry} research papers academic study`,
        search_depth: "advanced",
        include_answer: false,
        include_raw_content: false,
        include_domains: TRUSTED_DOMAINS,
        max_results: 15,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Tavily search failed.");
    }

    const data = await response.json();

    const papers = ((data.results || []) as TavilyResult[])
      .filter((item) => item.title && item.url)
      .map((item) => {
        const title = item.title || "Untitled paper";
        const url = item.url || scholarUrl(title);

        return {
          title,
          url,
          source: sourceName(url),
          summary:
            item.content?.slice(0, 350) ||
            "Open the source to read the paper abstract and findings.",
          publishedDate: item.published_date || "",
          relevanceScore:
            typeof item.score === "number"
              ? Math.round(item.score * 100)
              : null,
          googleScholarUrl: scholarUrl(title),
        };
      });

    return NextResponse.json({
      success: true,
      topic,
      papers,
    });
  } catch (error) {
    console.error("Research papers error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Research paper search failed.",
      },
      { status: 500 }
    );
  }
}