import { providerFetch, logAI, type Execution } from "./telemetry.server";
const TAVILY_URL = "https://api.tavily.com/search";

export type SearchSource = { title: string; url: string; content: string; score: number };

async function searchOne(query: string, apiKey: string, execution?: Execution): Promise<SearchSource[]> {
  try {
    const response = await providerFetch("Tavily", "advanced", TAVILY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({ query, search_depth: "advanced", max_results: 5, topic: "general" }),
    }, execution);
    if (!response.ok) {
      return [];
    }
    const data = (await response.json()) as { results?: unknown[] };
    return (data.results ?? []).flatMap((raw) => {
      const item = raw as Record<string, unknown>;
      const url = typeof item["url"] === "string" ? item["url"] : "";
      if (!url.startsWith("https://")) return [];
      return [{
        title: typeof item["title"] === "string" && item["title"] ? item["title"] : new URL(url).hostname,
        url,
        content: typeof item["content"] === "string" ? item["content"].slice(0, 800) : "",
        score: typeof item["score"] === "number" ? item["score"] : 0,
      }];
    });
  } catch {
    logAI("Tavily", "advanced", Date.now(), null, "invalid_response");
    return [];
  }
}

/** Never throws: a failed query just contributes no sources. */
export async function searchWithTavily(queries: string[], execution?: Execution): Promise<SearchSource[]> {
  const apiKey = process.env["TAVILY_API_KEY"];
  if (!apiKey || queries.length === 0) { logAI("Tavily", "advanced", Date.now(), null, "configuration"); return []; }
  const results = await Promise.all(queries.slice(0, 5).map((q) => searchOne(q, apiKey, execution)));
  const unique = new Map<string, SearchSource>();
  for (const s of results.flat()) if (!unique.has(s.url)) unique.set(s.url, s);
  return Array.from(unique.values()).sort((a, b) => b.score - a.score).slice(0, 15);
}
