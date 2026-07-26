import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ANALYSIS_MODEL, buildAnalysisPrompt, parseReportJson } from "./analysis-prompt";
import type { InvestigationAnswers, StartupReport } from "./report";

export const generateStartupReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { answers: InvestigationAnswers; previous?: StartupReport | null }) => input,
  )
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured yet.");

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const { generateText } = await import("ai");
    const gateway = createLovableAiGatewayProvider(key);

    const { text } = await generateText({
      model: gateway(ANALYSIS_MODEL),
      prompt: buildAnalysisPrompt(data.answers, data.previous),
    });

    const report = parseReportJson(text) as StartupReport;
    report.startupName = data.answers.startupName;
    report.stage = data.answers.stage;
    report.healthScore = Math.max(0, Math.min(100, Math.round(report.healthScore ?? 50)));
    report.confidence = Math.max(0, Math.min(100, Math.round(report.confidence ?? 75)));
    return report as StartupReport;
  });