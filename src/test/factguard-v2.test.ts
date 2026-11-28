import { describe, expect, it } from "vitest";
import { normalizeEvidence, aggregateVerdict, preliminaryClaims, textSegments } from "../lib/factguard-evidence";
const src = [{ title: "Example", url: "https://example.com", content: "A literal excerpt from the retrieved source." }];
describe("FactGuard evidence", () => {
  it("rejects invented excerpts and out-of-range source indices", () => {
    const r = normalizeEvidence({ claims: [{ claim: "Claim", quote: "Claim", verdict: "supported", explanation: "Test", evidence: [{ sourceIndex: 1, excerpt: "An invented excerpt." }, { sourceIndex: 2, excerpt: src[0]?.content }] }] }, "Claim", src);
    expect(r.claims?.[0]?.verdict).toBe("unverified"); expect(r.claims?.[0]?.evidence).toEqual([]);
  });
  it("accepts literal evidence and only literal highlights", () => {
    const r = normalizeEvidence({ claims: [{ claim: "Claim", quote: "Invented", verdict: "supported", explanation: "Test", evidence: [{ sourceIndex: 1, excerpt: src[0]?.content }] }], signals: [{quote: "Act now!", explanation: "Urgency"}, {quote: "Not in input", explanation: "Bad"}] }, "Claim. Act now!", src);
    expect(r.claims?.[0]?.verdict).toBe("supported"); expect(r.claims?.[0]?.quote).toBe(""); expect(r.signals).toHaveLength(1);
  });
  it("does not treat preliminary claims as verified", () => expect(aggregateVerdict(preliminaryClaims(["Claim"]))).toBe("unverified"));
  it("preserves all original text without overlapping marks", () => {
    const original = "hello hello"; const parts = textSegments(original, [{ quote: "hello", explanation: "test", kind: "signal" }, { quote: "hell", explanation: "test", kind: "false" }]);
    expect(parts.map(p => p.text).join("")).toBe(original); expect(parts.filter(p => p.mark)).toHaveLength(2);
  });
});
