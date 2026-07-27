import { jsPDF } from "jspdf";
import { SCORE_LABELS, type ScoreKey, type StartupReport } from "./report";
import type { Investigation } from "./case-files";

export type StrategyMessage = { role: string; content: string; created_at: string };

const MARGIN = 48;
const INK = "#111111";
const MUTED = "#666666";
const ACCENT = "#6D28D9";

export function buildCaseFilePdf(opts: {
  investigation: Investigation;
  report: StartupReport | null;
  version: number | null;
  messages: StrategyMessage[];
}) {
  const { investigation, report, version, messages } = opts;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const width = pageW - MARGIN * 2;
  let y = MARGIN;

  const space = (n: number) => {
    y += n;
    if (y > pageH - MARGIN) newPage();
  };

  function newPage() {
    doc.addPage();
    y = MARGIN;
  }

  function ensure(h: number) {
    if (y + h > pageH - MARGIN) newPage();
  }

  function text(
    value: string,
    { size = 10.5, color = INK, style = "normal" as "normal" | "bold", indent = 0, gap = 5 } = {},
  ) {
    if (!value) return;
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(value, width - indent) as string[];
    for (const line of lines) {
      ensure(size + 4);
      doc.text(line, MARGIN + indent, y);
      y += size * 1.35;
    }
    y += gap;
  }

  function heading(value: string) {
    ensure(52);
    space(16);
    doc.setDrawColor(ACCENT);
    doc.setLineWidth(2);
    doc.line(MARGIN, y - 16, MARGIN + 28, y - 16);
    text(value.toUpperCase(), { size: 12, style: "bold", gap: 8 });
  }

  function bullets(items: string[] | undefined, marker = "•") {
    (items ?? []).forEach((item) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(ACCENT);
      const lines = doc.splitTextToSize(item, width - 16) as string[];
      ensure(14);
      doc.text(marker, MARGIN, y);
      doc.setTextColor(INK);
      lines.forEach((line, i) => {
        if (i > 0) ensure(14);
        doc.text(line, MARGIN + 16, y);
        y += 14;
      });
      y += 3;
    });
    y += 4;
  }

  // Cover header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(ACCENT);
  doc.text("STARTUP FUNERAL — PRE-MORTEM CASE FILE", MARGIN, y);
  y += 26;
  doc.setFontSize(26);
  doc.setTextColor(INK);
  doc.text(investigation.startup_name, MARGIN, y);
  y += 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(MUTED);
  doc.text(
    [investigation.stage, investigation.industry, investigation.country].filter(Boolean).join("  ·  ") ||
      "—",
    MARGIN,
    y,
  );
  y += 14;
  doc.text(
    `${version ? `Version ${version}` : "No version"}  ·  Exported ${new Date().toLocaleDateString()}`,
    MARGIN,
    y,
  );
  y += 20;
  doc.setDrawColor("#DDDDDD");
  doc.setLineWidth(1);
  doc.line(MARGIN, y, pageW - MARGIN, y);
  y += 24;

  if (report) {
    // Score block
    ensure(70);
    doc.setFillColor("#F4F1FE");
    doc.roundedRect(MARGIN, y - 4, width, 62, 8, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(ACCENT);
    doc.text(`${report.healthScore}`, MARGIN + 18, y + 34);
    doc.setFontSize(9);
    doc.setTextColor(MUTED);
    doc.text("/100 HEALTH", MARGIN + 18 + doc.getTextWidth(`${report.healthScore}`) + 26, y + 34);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(INK);
    doc.text(
      doc.splitTextToSize(
        `${report.investmentReadiness} · Confidence ${report.confidence}%`,
        width - 200,
      ) as string[],
      MARGIN + 200,
      y + 28,
    );
    y += 78;

    text(report.investmentReadinessReasoning, { color: MUTED });

    heading("Executive summary");
    text(report.executiveSummary);

    heading("Health scores");
    (Object.keys(SCORE_LABELS) as ScoreKey[]).forEach((k) => {
      const v = report.scores?.[k] ?? 0;
      ensure(20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(INK);
      doc.text(SCORE_LABELS[k], MARGIN, y);
      doc.setFillColor("#EDEDED");
      doc.roundedRect(MARGIN + 140, y - 8, 240, 8, 4, 4, "F");
      doc.setFillColor(ACCENT);
      doc.roundedRect(MARGIN + 140, y - 8, Math.max(4, (240 * v) / 100), 8, 4, 4, "F");
      doc.text(`${v}`, MARGIN + 396, y);
      y += 18;
    });
    y += 6;

    heading("Biggest risk");
    text(report.biggestRisk);
    heading("Biggest opportunity");
    text(report.biggestOpportunity);

    heading("Top risks");
    (report.topRisks ?? []).forEach((r) => {
      text(`${r.title}  (${r.severity})`, { style: "bold", gap: 2 });
      text(r.description, { color: MUTED });
    });

    heading("Hidden assumptions");
    bullets(report.hiddenAssumptions, "?");
    heading("Critical issues");
    bullets(report.criticalIssues, "!");
    heading("Growth opportunities");
    bullets(report.growthOpportunities);

    heading("Expert panel");
    (report.experts ?? []).forEach((e) => {
      text(e.role, { style: "bold", gap: 2 });
      text(e.opinion);
      text(e.reasoning, { color: MUTED });
      bullets(e.recommendations, "→");
    });

    heading("Recovery strategy");
    text(report.recoveryStrategy);
    heading("Quick wins");
    bullets(report.quickWins, "✓");
    heading("30-day plan");
    bullets(report.plan30);
    heading("60-day plan");
    bullets(report.plan60);
    heading("90-day plan");
    bullets(report.plan90);

    if (report.projectedImprovement) {
      heading("Projected improvement");
      text(`${report.healthScore} → ${report.projectedImprovement.score}`, { style: "bold", gap: 3 });
      text(report.projectedImprovement.summary, { color: MUTED });
    }
  } else {
    text("No analysis has been generated for this case file yet.", { color: MUTED });
  }

  heading("Strategy room summary");
  if (!messages.length) {
    text("No strategy room conversation recorded.", { color: MUTED });
  } else {
    text(
      `${messages.length} messages · ${new Date(messages[0].created_at).toLocaleDateString()} – ${new Date(
        messages[messages.length - 1].created_at,
      ).toLocaleDateString()}`,
      { color: MUTED, size: 9 },
    );
    messages.forEach((m) => {
      text(m.role === "user" ? "Founder" : "Strategy Advisor", {
        style: "bold",
        size: 9.5,
        color: m.role === "user" ? INK : ACCENT,
        gap: 2,
      });
      text(stripMarkdown(m.content), { color: m.role === "user" ? INK : MUTED });
    });
  }

  // Footer page numbers
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(MUTED);
    doc.text(`${investigation.startup_name} — Startup Funeral`, MARGIN, pageH - 24);
    doc.text(`${p} / ${pages}`, pageW - MARGIN, pageH - 24, { align: "right" });
  }

  return doc;
}

function stripMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, (b) => b.replace(/```/g, ""))
    .replace(/[*_`>#]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function fileNameFor(name: string, version: number | null) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "case-file";
  return `startup-funeral-${slug}${version ? `-v${version}` : ""}.pdf`;
}
