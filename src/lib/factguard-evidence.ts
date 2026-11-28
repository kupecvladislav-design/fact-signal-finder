export type CheckDepth = "quick" | "deep";
export type FactVerdict = "supported" | "false" | "mixed" | "unverified";
export type Evidence = { title: string; url: string; excerpt: string };
export type CheckedClaim = { claim: string; quote: string; verdict: FactVerdict; explanation: string; evidence: Evidence[] };
export type TextSignal = { quote: string; explanation: string };
export type ReportExtras = { depth?: CheckDepth; claims?: CheckedClaim[]; signals?: TextSignal[]; note?: string };
type SearchHit = { title: string; url: string; content: string };
export const verdictLabel: Record<FactVerdict, string> = { supported: "Підтверджено", false: "Спростовано", mixed: "Суперечливе", unverified: "Недостатньо доказів" };
const object = (v: unknown): Record<string, unknown> => v && typeof v === "object" ? v as Record<string, unknown> : {};
const text = (v: unknown, max = 1000) => typeof v === "string" ? v.trim().slice(0, max) : "";
const list = (v: unknown): unknown[] => Array.isArray(v) ? v : [];
const norm = (v: string) => v.replace(/\s+/g, " ").trim();
export function httpsUrl(v: string) { try { return new URL(v).protocol === "https:"; } catch { return false; } }
export function preliminaryClaims(claims: string[]): CheckedClaim[] {
  return claims.slice(0, 10).filter(Boolean).map(claim => ({ claim, quote: "", verdict: "unverified", explanation: "Окремої перевірки доказів для цього твердження немає.", evidence: [] }));
}
// A model may only point to numbered search results and quote literal retrieved excerpts.
// This validates provenance, not truth or whether the excerpt logically entails the claim.
export function normalizeEvidence(raw: unknown, original: string, sources: SearchHit[]): ReportExtras {
  const r = object(raw);
  const claims: CheckedClaim[] = list(r["claims"]).slice(0, 10).flatMap(item => {
    const x = object(item), claim = text(x["claim"], 500);
    if (!claim) return [];
    const quote = text(x["quote"], 500);
    const evidence: Evidence[] = list(x["evidence"]).slice(0, 5).flatMap(item => {
      const e = object(item), n = e["sourceIndex"], excerpt = text(e["excerpt"], 500);
      if (typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > sources.length) return [];
      const source = sources[n - 1];
      if (!source || !httpsUrl(source.url) || excerpt.length < 15 || !norm(source.content).includes(norm(excerpt))) return [];
      return [{ title: source.title, url: source.url, excerpt }];
    });
    const distinct = new Map(evidence.map(e => [e.url, e]));
    const requested = x["verdict"];
    const verdict: FactVerdict = distinct.size && (requested === "supported" || requested === "false" || requested === "mixed") ? requested : "unverified";
    return [{ claim, quote: quote && original.includes(quote) ? quote : "", verdict, explanation: verdict === "unverified" ? "Достатніх прив’язаних доказів немає. " + text(x["explanation"]) : text(x["explanation"]), evidence: [...distinct.values()] }];
  });
  const signals: TextSignal[] = list(r["signals"]).slice(0, 12).flatMap(item => {
    const x = object(item), quote = text(x["quote"], 250), explanation = text(x["explanation"], 500);
    return quote && explanation && original.includes(quote) ? [{ quote, explanation }] : [];
  });
  return { depth: "deep", claims, signals };
}
export function aggregateVerdict(claims: CheckedClaim[]): FactVerdict {
  if (!claims.length || claims.every(c => c.verdict === "unverified")) return "unverified";
  if (claims.every(c => c.verdict === "supported")) return "supported";
  if (claims.every(c => c.verdict === "false")) return "false";
  if (claims.some(c => c.verdict === "mixed") || (claims.some(c => c.verdict === "supported") && claims.some(c => c.verdict === "false"))) return "mixed";
  return "unverified";
}
// Exact substrings only; no regex built from user input. Overlapping marks are skipped.
export function textSegments(original: string, marks: { quote: string; explanation: string; kind: FactVerdict | "signal" }[]) {
  type Mark = typeof marks[number];
  const ranges: { start: number; end: number; mark: Mark }[] = [];
  for (const mark of marks) {
    if (!mark.quote) continue;
    let start = original.indexOf(mark.quote);
    while (start !== -1 && ranges.length < 300) {
      const end = start + mark.quote.length;
      if (!ranges.some(r => start < r.end && end > r.start)) ranges.push({ start, end, mark });
      start = original.indexOf(mark.quote, end);
    }
  }
  ranges.sort((a, b) => a.start - b.start);
  const parts: { text: string; mark?: Mark }[] = [];
  let at = 0;
  for (const r of ranges) { if (at < r.start) parts.push({ text: original.slice(at, r.start) }); parts.push({ text: original.slice(r.start, r.end), mark: r.mark }); at = r.end; }
  if (at < original.length) parts.push({ text: original.slice(at) });
  return parts;
}
