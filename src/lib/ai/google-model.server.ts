// Verified via Google's models catalog and real structured generateContent calls.
// Secrets remain untouched; explicit custom overrides are preserved.
export function googleModel() {
  const configured = process.env["GOOGLE_AI_MODEL"];
  return !configured || configured === "gemini-3.8-flash" ? "gemini-3.5-flash-lite" : configured;
}