export type InvestigationAnswers = {
  startupName: string;
  stage: string;
  industry: string;
  country: string;
  problem: string;
  solution: string;
  targetCustomers: string;
  businessModel: string;
  revenueModel: string;
  pricing: string;
  competitors: string;
  differentiation: string;
  traction: string;
  foundingTeam: string;
  technicalSkills: string;
  funding: string;
  challenges: string;
  goals: string;
};

export const emptyAnswers: InvestigationAnswers = {
  startupName: "",
  stage: "",
  industry: "",
  country: "",
  problem: "",
  solution: "",
  targetCustomers: "",
  businessModel: "",
  revenueModel: "",
  pricing: "",
  competitors: "",
  differentiation: "",
  traction: "",
  foundingTeam: "",
  technicalSkills: "",
  funding: "",
  challenges: "",
  goals: "",
};

export type ScoreKey =
  | "market"
  | "execution"
  | "differentiation"
  | "revenue"
  | "competition"
  | "scalability"
  | "funding";

export const SCORE_LABELS: Record<ScoreKey, string> = {
  market: "Market",
  execution: "Execution",
  differentiation: "Differentiation",
  revenue: "Revenue",
  competition: "Competition",
  scalability: "Scalability",
  funding: "Funding",
};

export const READINESS_OPTIONS = [
  "Investment Ready",
  "Requires Strategic Improvements",
  "Early Validation Needed",
  "High Risk — Not Investment Ready",
] as const;

export type ExpertView = {
  role: string;
  opinion: string;
  reasoning: string;
  recommendations: string[];
};

export type RiskItem = {
  title: string;
  description: string;
  severity: "healthy" | "moderate" | "high" | "critical";
};

export type StartupReport = {
  startupName: string;
  stage: string;
  healthScore: number;
  confidence: number;
  investmentReadiness: string;
  investmentReadinessReasoning: string;
  biggestRisk: string;
  biggestOpportunity: string;
  scores: Record<ScoreKey, number>;
  executiveSummary: string;
  topRisks: RiskItem[];
  hiddenAssumptions: string[];
  criticalIssues: string[];
  growthOpportunities: string[];
  experts: ExpertView[];
  recoveryStrategy: string;
  quickWins: string[];
  plan30: string[];
  plan60: string[];
  plan90: string[];
  projectedImprovement: { score: number; summary: string };
};

export function severityColor(score: number) {
  if (score >= 75) return "var(--success)";
  if (score >= 55) return "var(--warning)";
  if (score >= 35) return "var(--danger)";
  return "var(--critical)";
}

export function severityLabel(score: number) {
  if (score >= 75) return "Healthy";
  if (score >= 55) return "Needs Improvement";
  if (score >= 35) return "High Risk";
  return "Critical Risk";
}

export function riskColor(severity: RiskItem["severity"]) {
  switch (severity) {
    case "healthy":
      return "var(--success)";
    case "moderate":
      return "var(--warning)";
    case "high":
      return "var(--danger)";
    default:
      return "var(--critical)";
  }
}

export function reportContextString(answers: InvestigationAnswers, report: StartupReport) {
  return [
    `STARTUP: ${answers.startupName} (${answers.stage}, ${answers.industry}, ${answers.country})`,
    `Problem: ${answers.problem}`,
    `Solution: ${answers.solution}`,
    `Target customers: ${answers.targetCustomers}`,
    `Business model: ${answers.businessModel}`,
    `Revenue model: ${answers.revenueModel}`,
    `Pricing: ${answers.pricing}`,
    `Competitors: ${answers.competitors}`,
    `Differentiation: ${answers.differentiation}`,
    `Traction: ${answers.traction}`,
    `Founding team: ${answers.foundingTeam}`,
    `Technical skills: ${answers.technicalSkills}`,
    `Funding: ${answers.funding}`,
    `Current challenges: ${answers.challenges}`,
    `Goals: ${answers.goals}`,
    "",
    `HEALTH SCORE: ${report.healthScore}/100 (confidence ${report.confidence}%)`,
    `INVESTMENT READINESS: ${report.investmentReadiness} — ${report.investmentReadinessReasoning}`,
    `CATEGORY SCORES: ${Object.entries(report.scores)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ")}`,
    `EXECUTIVE SUMMARY: ${report.executiveSummary}`,
    `BIGGEST RISK: ${report.biggestRisk}`,
    `BIGGEST OPPORTUNITY: ${report.biggestOpportunity}`,
    `TOP RISKS: ${report.topRisks.map((r) => `${r.title} (${r.severity}) — ${r.description}`).join(" | ")}`,
    `HIDDEN ASSUMPTIONS: ${report.hiddenAssumptions.join(" | ")}`,
    `CRITICAL ISSUES: ${report.criticalIssues.join(" | ")}`,
    `GROWTH OPPORTUNITIES: ${report.growthOpportunities.join(" | ")}`,
    `QUICK WINS: ${report.quickWins.join(" | ")}`,
    `30-DAY PLAN: ${report.plan30.join(" | ")}`,
    `60-DAY PLAN: ${report.plan60.join(" | ")}`,
    `90-DAY PLAN: ${report.plan90.join(" | ")}`,
    `EXPERT PANEL: ${report.experts
      .map((e) => `${e.role}: ${e.opinion} Reasoning: ${e.reasoning}`)
      .join(" || ")}`,
  ].join("\n");
}