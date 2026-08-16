import { IdeaInput } from "@/types/report";

type ResearchResult = {
  topic: string;
  query: string;
  answer?: string;
  results?: any[];
};

async function tavilySearch(
  topic: string,
  query: string
): Promise<ResearchResult> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    return {
      topic,
      query,
      answer: "Tavily key missing.",
      results: [],
    };
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        search_depth: "advanced",
        include_answer: true,
        include_raw_content: false,
        max_results: 5,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(
        `Tavily API returned ${response.status} for ${topic}`
      );

      return {
        topic,
        query,
        answer: "Search failed.",
        results: [],
      };
    }

    const data = await response.json();

    return {
      topic,
      query,
      answer: data.answer,
      results: data.results || [],
    };
  } catch (error) {
    console.error(`Tavily search failed for ${topic}:`, error);

    return {
      topic,
      query,
      answer: "Search failed.",
      results: [],
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function researchWithTavily(input: IdeaInput) {
  const idea = input.idea || "startup idea";
  const industry = input.industry || "startup";
  const users = input.users || "target users";

  const searches = [
    tavilySearch(
      "market",
      `${idea} ${industry} market size growth demand trends`
    ),

    tavilySearch(
      "competitors",
      `${idea} competitors alternatives companies serving ${users}`
    ),

    tavilySearch(
      "pricing",
      `${industry} SaaS pricing monetization business model examples`
    ),

    tavilySearch(
      "trends",
      `${industry} technology trends startup opportunities latest`
    ),

    tavilySearch(
      "security",
      `${industry} app security privacy compliance risks`
    ),
  ];

  const results = await Promise.all(searches);

  return {
    idea,
    industry,
    users,
    generatedAt: new Date().toISOString(),
    research: results,
  };
}