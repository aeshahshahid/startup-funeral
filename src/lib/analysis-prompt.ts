import type { InvestigationAnswers, StartupReport } from "./report";

export const ANALYSIS_MODEL = "google/gemini-3.5-flash";

export function buildAnalysisPrompt(
  answers: InvestigationAnswers,
  previous?: StartupReport | null,
) {
  return `You are an elite startup pre-mortem panel: a VC investor, a market analyst, a product strategist, a founder coach, a risk analyst, a target customer and a competitor.

Analyse the following startup honestly but constructively. Your purpose is to help the founder AVOID mistakes, never to simply say they will fail.

STARTUP DATA:
${Object.entries(answers)
  .map(([k, v]) => `${k}: ${v || "(not provided)"}`)
  .join("\n")}
${previous ? `\nPREVIOUS VERSION SCORE: ${previous.healthScore}. Previous top risks: ${previous.topRisks.map((r) => r.title).join(", ")}. Judge whether they improved.` : ""}

Return ONLY valid JSON (no markdown fences) matching exactly this shape:
{
  "healthScore": number 0-100,
  "confidence": number 0-100,
  "investmentReadiness": one of "Investment Ready" | "Requires Strategic Improvements" | "Early Validation Needed" | "High Risk — Not Investment Ready",
  "investmentReadinessReasoning": string (2-3 sentences),
  "biggestRisk": string,
  "biggestOpportunity": string,
  "scores": { "market": n, "execution": n, "differentiation": n, "revenue": n, "competition": n, "scalability": n, "funding": n },
  "executiveSummary": string (150-220 words),
  "topRisks": [{ "title": string, "description": string, "severity": "moderate"|"high"|"critical" }] (5 items),
  "hiddenAssumptions": [string] (5 items, each an unstated belief the founder is relying on),
  "criticalIssues": [string] (4 items),
  "growthOpportunities": [string] (4 items),
  "experts": [{ "role": string, "opinion": string, "reasoning": string, "recommendations": [string] }] with EXACTLY these roles in order: "Investor Perspective", "Customer Perspective", "Competitor Perspective", "Market Analyst", "Product Strategist", "Founder Coach", "Risk Analyst",
  "recoveryStrategy": string (100-160 words),
  "quickWins": [string] (5 items doable this week),
  "plan30": [string] (5 items),
  "plan60": [string] (5 items),
  "plan90": [string] (5 items),
  "projectedImprovement": { "score": number, "summary": string }
}
Never output the phrase "DO NOT INVEST". Be specific to this startup, cite its actual pricing, competitors and market.`;
}

export function parseReportJson(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  return JSON.parse(start >= 0 ? cleaned.slice(start, end + 1) : cleaned);
}