import { describe, expect, it } from "vitest";
import { analysisInputSchema, normalizeRisk } from "@/lib/analysis-schema";

describe("Analysis inputs", () => {
  it("accepts text to analyze and rejects empty text", () => {
    expect(analysisInputSchema.safeParse({ mode: "text", content: "Земля обертається навколо Сонця." }).success).toBe(true);
    expect(analysisInputSchema.safeParse({ mode: "text", content: "" }).success).toBe(false);
  });
  it("accepts HTTPS links rather than local or unsafe protocols", () => {
    expect(analysisInputSchema.safeParse({ mode: "link", content: "https://www.bbc.com/news" }).success).toBe(true);
    expect(analysisInputSchema.safeParse({ mode: "link", content: "file:///etc/passwd" }).success).toBe(false);
  });
  it("accepts an image upload but rejects non-image content", () => {
    expect(analysisInputSchema.safeParse({ mode: "image", content: "data:image/png;base64,YWJj" }).success).toBe(true);
    expect(analysisInputSchema.safeParse({ mode: "image", content: "data:text/html;base64,YWJj" }).success).toBe(false);
  });
  it("keeps the manipulation scale between 0 and 100, without inventing missing scores", () => {
    expect(normalizeRisk(-20)).toBe(0);
    expect(normalizeRisk(120)).toBe(100);
    expect(normalizeRisk(null)).toBe(null);
  });
});