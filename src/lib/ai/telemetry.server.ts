export type Provider = "Gemini" | "Groq" | "Tavily" | "Lovable AI";
export type Category = "none" | "configuration" | "authentication" | "permission" | "rate_limit" | "unavailable_model" | "invalid_request" | "provider_failure" | "timeout" | "network" | "invalid_response";
export function statusCategory(status: number): Category {
  if (status >= 200 && status < 300) return "none";
  if (status === 401) return "authentication";
  if (status === 403) return "permission";
  if (status === 429) return "rate_limit";
  if (status === 404) return "unavailable_model";
  if (status === 400) return "invalid_request";
  return "provider_failure";
}
export function logAI(provider: Provider, model: string, started: number, status: number | null, category: Category, fallbackReason?: Category | "no_sources" | "no_preanalysis" | "image_input") {
  console.info("factguard_ai", JSON.stringify({ provider, model, status, durationMs: Date.now() - started, category, ...(fallbackReason ? { fallbackReason } : {}) }));
}
export type Execution = { providers: Provider[]; sourceSearch: "not_run" | "completed" | "failed"; fallback: boolean };
export function createExecution(): Execution { return { providers: [], sourceSearch: "not_run", fallback: false }; }
export async function providerFetch(provider: Provider, model: string, url: string, init: RequestInit, execution?: Execution) {
  const started = Date.now();
  try {
    const response = await fetch(url, init);
    logAI(provider, model, started, response.status, statusCategory(response.status));
    if (provider === "Tavily" && execution) execution.sourceSearch = response.ok ? "completed" : execution.sourceSearch === "completed" ? "completed" : "failed";
    return response;
  } catch (error) {
    const category = error instanceof Error && /timeout|abort/i.test(error.name) ? "timeout" : "network";
    logAI(provider, model, started, null, category);
    if (provider === "Tavily" && execution && execution.sourceSearch !== "completed") execution.sourceSearch = "failed";
    throw error;
  }
}

// Deliberately best-effort per isolate; no personal information or submitted content retained.
export function createBudget(limit: number, windowMs = 60_000) {
  let start = 0, calls = 0;
  return (now = Date.now()) => {
    if (now - start >= windowMs) { start = now; calls = 0; }
    if (calls >= limit) return false;
    calls++; return true;
  };
}
export const analysisBudget = createBudget(12);
export const followupBudget = createBudget(20);