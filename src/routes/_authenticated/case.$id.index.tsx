import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, MessagesSquare, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ReportView } from "@/components/report-view";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getInvestigation, listReports } from "@/lib/case-files";
import { severityColor } from "@/lib/report";

export const Route = createFileRoute("/_authenticated/case/$id/")({
  head: () => ({
    meta: [
      { title: "Case File — Startup Funeral" },
      {
        name: "description",
        content: "Your AI pre-mortem report, risk analysis, expert panel and recovery roadmap.",
      },
      { property: "og:title", content: "Case File — Startup Funeral" },
      { property: "og:description", content: "AI startup investigation report and version history." },
    ],
  }),
  component: CaseFile,
});

function CaseFile() {
  const { id } = Route.useParams();
  const [versionId, setVersionId] = useState<string | null>(null);

  const { data: investigation, isLoading: loadingCase } = useQuery({
    queryKey: ["investigation", id],
    queryFn: () => getInvestigation(id),
  });
  const { data: reports, isLoading: loadingReports } = useQuery({
    queryKey: ["reports", id],
    queryFn: () => listReports(id),
  });

  const selected = reports?.find((r) => r.id === versionId) ?? reports?.[0] ?? null;
  const loading = loadingCase || loadingReports;

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Dashboard
        </Link>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Case file</p>
            <h1 className="mt-2 font-display text-3xl font-bold">
              {loading ? "Loading…" : (investigation?.startup_name ?? "Not found")}
            </h1>
            {investigation && (
              <p className="mt-2 text-sm text-muted-foreground">
                {[investigation.stage, investigation.industry, investigation.country]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-lg bg-elevated">
              <Link to="/investigation/new" search={{ caseId: id }}>
                <RefreshCw className="mr-1.5 size-4" /> Run Updated Investigation
              </Link>
            </Button>
            <Button asChild className="rounded-lg">
              <Link to="/case/$id/strategy" params={{ id }}>
                <MessagesSquare className="mr-1.5 size-4" /> Strategy Room
              </Link>
            </Button>
          </div>
        </div>

        {reports && reports.length > 1 && (
          <div className="surface-card mt-8 p-5">
            <h2 className="font-display text-sm font-semibold">Version history</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {reports.map((r, i) => {
                const prev = reports[i + 1];
                const delta =
                  prev && r.health_score !== null && prev.health_score !== null
                    ? r.health_score - prev.health_score
                    : null;
                const active = (selected?.id ?? "") === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setVersionId(r.id)}
                    className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                      active ? "border-primary/50 bg-primary/10" : "border-border bg-elevated"
                    }`}
                  >
                    <span className="block text-xs text-muted-foreground">
                      Version {r.version} · {new Date(r.created_at).toLocaleDateString()}
                    </span>
                    <span className="mt-1 flex items-center gap-2">
                      <span
                        className="font-display text-lg font-bold"
                        style={{ color: severityColor(r.health_score ?? 0) }}
                      >
                        {r.health_score ?? "—"}
                      </span>
                      {delta !== null && delta !== 0 && (
                        <span
                          className="flex items-center gap-0.5 text-xs"
                          style={{ color: delta > 0 ? "var(--success)" : "var(--danger)" }}
                        >
                          {delta > 0 ? (
                            <TrendingUp className="size-3" />
                          ) : (
                            <TrendingDown className="size-3" />
                          )}
                          {delta > 0 ? "+" : ""}
                          {delta}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8">
          {loading && <Skeleton className="h-96 w-full rounded-2xl bg-card" />}
          {!loading && !selected && (
            <div className="surface-card p-14 text-center">
              <h3 className="font-display text-lg font-semibold">No report yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This case file hasn't been analysed. Run the investigation to generate a report.
              </p>
              <Button asChild className="mt-6 h-11 rounded-xl px-6">
                <Link to="/investigation/new" search={{ caseId: id }}>
                  Run Investigation
                </Link>
              </Button>
            </div>
          )}
          {selected && <ReportView report={selected.content} />}
        </div>
      </main>
    </AppShell>
  );
}