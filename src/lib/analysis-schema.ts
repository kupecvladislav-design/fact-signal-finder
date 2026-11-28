import type { ReportExtras } from "./factguard-evidence";
import { z } from "zod";

export const analysisInputSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("text"), intent: z.enum(["material", "question"]).optional(), depth: z.enum(["quick", "deep"]).optional(), content: z.string().trim().min(10, "Додай щонайменше 10 символів.").max(12000, "Текст завеликий: максимум 12 000 символів.") }),
  z.object({ mode: z.literal("link"), content: z.string().url("Вкажи повне посилання на статтю.").max(2048).refine((value) => value.startsWith("https://"), "Посилання має починатися з https://.") }),
  z.object({ mode: z.literal("image"), content: z.string().max(7000000).regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/, "Додай зображення PNG, JPG або WEBP.") }),
]);

export const analysisOutputSchema = z.object({
  verdict: z.enum(["supported", "false", "mixed", "unverified"]),
  risk: z.number().nullable(),
  summary: z.string(),
  findings: z.array(z.object({ title: z.string(), explanation: z.string() })),
  recommendation: z.string(),
});

export type AnalysisInput = z.infer<typeof analysisInputSchema>;
export type AnalysisExecution = { mode: "quick" | "deep"; providers: string[]; fallback: boolean; durationMs: number; sourceSearch: "not_run" | "completed" | "failed" };
export type AnalysisReport = z.infer<typeof analysisOutputSchema> & ReportExtras & { sources: { title: string; url: string }[]; execution?: AnalysisExecution; riskExplanation?: string };

export function normalizeRisk(value: number | null) {
  return value === null ? null : Math.round(Math.min(100, Math.max(0, value)));
}
export type AnalysisResponse = { ok: true; report: AnalysisReport } | { ok: false; error: string };
