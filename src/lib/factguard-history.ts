import type { AnalysisReport } from "./analysis-schema";
import { verdictLabel } from "./factguard-evidence";
const KEY = "factguard.reports.v2";
export type SavedReport = { id: string; date: string; report: AnalysisReport };
export function readHistory(): SavedReport[] {
  if (typeof window === "undefined") return [];
  try { const data: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]"); return Array.isArray(data) ? data.filter(x => x && typeof x.id === "string" && typeof x.date === "string" && x.report && typeof x.report.summary === "string" && Array.isArray(x.report.sources)).slice(0, 20) : []; } catch { return []; }
}
export function saveReport(report: AnalysisReport) {
  const entry = { id: crypto.randomUUID(), date: new Date().toISOString(), report };
  localStorage.setItem(KEY, JSON.stringify([entry, ...readHistory()].slice(0, 20)));
}
export function removeReport(id: string) { localStorage.setItem(KEY, JSON.stringify(readHistory().filter(x => x.id !== id))); }
export function clearHistory() { localStorage.removeItem(KEY); }
export function reportText(r: AnalysisReport) {
  return ["FactGuard — звіт AI", `Висновок: ${verdictLabel[r.verdict]}`, `Маніпулятивні ознаки: ${r.risk === null ? "не оцінено" : r.risk + "%"} (не ймовірність правди)`, r.note ?? "", r.summary, ...r.findings.map(f => `${f.title}: ${f.explanation}`), ...(r.claims ?? []).map(c => `${c.claim} — ${verdictLabel[c.verdict]}\n${c.explanation}\n${c.evidence.map(e => `${e.title}: ${e.url}\n${e.excerpt}`).join("\n")}`), ...((r.signals ?? []).map(s => `${s.quote}: ${s.explanation}`)), `Рекомендація: ${r.recommendation}`, "Знайдені джерела (не всі є доказами):", ...r.sources.map(s => `${s.title}: ${s.url}`), "AI може помилятися. Перевір першоджерела."].filter(Boolean).join("\n\n");
}
export function printReport(report: AnalysisReport) {
  const frame = document.createElement("iframe");
  frame.title = "Друк звіту FactGuard"; frame.style.cssText = "position:fixed;width:0;height:0;border:0;right:0;bottom:0";
  document.body.appendChild(frame);
  const doc = frame.contentDocument, win = frame.contentWindow;
  if (!doc || !win) { frame.remove(); throw new Error("Print unavailable"); }
  doc.title = "FactGuard — звіт";
  const style = doc.createElement("style"); style.textContent = "@page{margin:18mm} body{font:12pt/1.5 Arial,sans-serif;color:#171717} pre{font:inherit;white-space:pre-wrap;overflow-wrap:anywhere}"; doc.head.append(style);
  const pre = doc.createElement("pre"); pre.textContent = reportText(report); doc.body.append(pre);
  win.addEventListener("afterprint", () => frame.remove(), { once: true });
  win.focus(); win.print();
}
