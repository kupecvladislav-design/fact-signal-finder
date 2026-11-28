import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
// Only a report excerpt and question are sent, never an API key or original upload.
const input = z.object({ question: z.string().trim().min(3).max(500), context: z.string().max(10000) });
export const askFactGuard = createServerFn({ method: "POST" })
  .inputValidator((value: unknown) => input.parse(value))
  .handler(async ({ data }) => {
    const { followupBudget } = await import("./ai/telemetry.server");
    if (!followupBudget()) return { ok: false as const, error: "Забагато уточнень. Спробуй пізніше." };
    const { explainReport } = await import("./ai/followup.server");
    return explainReport(data);
  });
