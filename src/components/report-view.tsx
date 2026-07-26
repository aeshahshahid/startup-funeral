import {
  SCORE_LABELS,
  riskColor,
  severityColor,
  severityLabel,
  type ScoreKey,
  type StartupReport,
} from "@/lib/report";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ScoreRing({ score, size = 132 }: { score: number; size?: number }) {
  const r = size / 2 - 9;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--elevated)" strokeWidth="9" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={severityColor(score)}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * score) / 100}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-3xl font-bold">{score}</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">/ 100</div>
      </div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-subtle-foreground">{label}</span>
        <span className="font-display font-semibold">{value}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, backgroundColor: severityColor(value) }}
        />
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`surface-card p-7 ${className}`}>
      {title && <h3 className="font-display text-lg font-semibold">{title}</h3>}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </section>
  );
}

function List({ items, marker = "•" }: { items: string[]; marker?: string }) {
  return (
    <ul className="space-y-2.5">
      {items?.map((i, idx) => (
        <li key={idx} className="flex gap-3 text-sm leading-relaxed text-subtle-foreground">
          <span className="mt-0.5 shrink-0 text-primary">{marker}</span>
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

export function ReportView({ report }: { report: StartupReport }) {
  return (
    <div className="space-y-5">
      <div className="surface-card p-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="min-w-[240px] flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Case File</p>
            <h2 className="mt-2 font-display text-3xl font-bold">{report.startupName}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Stage: {report.stage}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span
                className="rounded-full px-3 py-1.5 text-xs font-medium"
                style={{
                  backgroundColor: `color-mix(in oklab, ${severityColor(report.healthScore)} 16%, transparent)`,
                  color: severityColor(report.healthScore),
                }}
              >
                {severityLabel(report.healthScore)}
              </span>
              <span className="rounded-full bg-primary/12 px-3 py-1.5 text-xs font-medium text-primary">
                {report.investmentReadiness}
              </span>
              <span className="rounded-full bg-elevated px-3 py-1.5 text-xs text-subtle-foreground">
                Analysis confidence {report.confidence}%
              </span>
            </div>
          </div>
          <ScoreRing score={report.healthScore} />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-elevated p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Biggest risk</p>
            <p className="mt-2 text-sm leading-relaxed text-subtle-foreground">{report.biggestRisk}</p>
          </div>
          <div className="rounded-xl border border-border bg-elevated p-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Biggest opportunity
            </p>
            <p className="mt-2 text-sm leading-relaxed text-subtle-foreground">
              {report.biggestOpportunity}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-primary/25 bg-primary/8 p-5">
          <p className="text-xs uppercase tracking-widest text-primary">Investment readiness</p>
          <p className="mt-2 text-sm leading-relaxed text-subtle-foreground">
            {report.investmentReadinessReasoning}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-card p-1.5">
          {[
            ["overview", "Overview"],
            ["risks", "Risks & Assumptions"],
            ["panel", "Expert Panel"],
            ["plan", "Recovery Plan"],
          ].map(([v, l]) => (
            <TabsTrigger
              key={v}
              value={v}
              className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-5 space-y-5">
          <Panel title="Health scores">
            <div className="grid gap-5 sm:grid-cols-2">
              {(Object.keys(SCORE_LABELS) as ScoreKey[]).map((k) => (
                <Bar key={k} label={SCORE_LABELS[k]} value={report.scores?.[k] ?? 0} />
              ))}
            </div>
          </Panel>
          <Panel title="Executive summary">
            <p className="whitespace-pre-line text-sm leading-relaxed text-subtle-foreground">
              {report.executiveSummary}
            </p>
          </Panel>
          <div className="grid gap-5 md:grid-cols-2">
            <Panel title="Growth opportunities">
              <List items={report.growthOpportunities} marker="↗" />
            </Panel>
            <Panel title="Critical issues">
              <List items={report.criticalIssues} marker="!" />
            </Panel>
          </div>
        </TabsContent>

        <TabsContent value="risks" className="mt-5 space-y-5">
          <Panel title="Top risks">
            <div className="space-y-3">
              {report.topRisks?.map((r, i) => (
                <div key={i} className="rounded-xl border border-border bg-elevated p-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: riskColor(r.severity) }}
                    />
                    <h4 className="font-display text-sm font-semibold">{r.title}</h4>
                    <span
                      className="ml-auto text-[10px] uppercase tracking-widest"
                      style={{ color: riskColor(r.severity) }}
                    >
                      {r.severity}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {r.description}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Hidden assumptions">
            <List items={report.hiddenAssumptions} marker="?" />
          </Panel>
        </TabsContent>

        <TabsContent value="panel" className="mt-5 grid gap-5 md:grid-cols-2">
          {report.experts?.map((e, i) => (
            <Panel key={i}>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                <h3 className="font-display text-base font-semibold">{e.role}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-subtle-foreground">{e.opinion}</p>
              <p className="mt-3 border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground">
                {e.reasoning}
              </p>
              <div className="mt-4">
                <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                  Recommendations
                </p>
                <List items={e.recommendations} marker="→" />
              </div>
            </Panel>
          ))}
        </TabsContent>

        <TabsContent value="plan" className="mt-5 space-y-5">
          <Panel title="Recovery strategy">
            <p className="whitespace-pre-line text-sm leading-relaxed text-subtle-foreground">
              {report.recoveryStrategy}
            </p>
          </Panel>
          <Panel title="Quick wins">
            <List items={report.quickWins} marker="✓" />
          </Panel>
          <div className="grid gap-5 md:grid-cols-3">
            <Panel title="30-day plan">
              <List items={report.plan30} marker="1" />
            </Panel>
            <Panel title="60-day plan">
              <List items={report.plan60} marker="2" />
            </Panel>
            <Panel title="90-day plan">
              <List items={report.plan90} marker="3" />
            </Panel>
          </div>
          <Panel title="Projected improvement">
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-muted-foreground">
                    {report.healthScore}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Today
                  </div>
                </div>
                <span className="text-primary">→</span>
                <div className="text-center">
                  <div
                    className="font-display text-2xl font-bold"
                    style={{ color: severityColor(report.projectedImprovement?.score ?? 0) }}
                  >
                    {report.projectedImprovement?.score}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    After plan
                  </div>
                </div>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-subtle-foreground">
                {report.projectedImprovement?.summary}
              </p>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}