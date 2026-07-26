import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { ReportView } from "@/components/report-view";
import { SAMPLE_REPORT } from "@/lib/sample-report";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sample-report")({
  head: () => ({
    meta: [
      { title: "Sample Startup Investigation Report — Startup Funeral" },
      {
        name: "description",
        content:
          "See a full investor-grade AI pre-mortem: health scores, seven expert perspectives, hidden assumptions and a 90-day recovery plan.",
      },
      { property: "og:title", content: "Sample Startup Investigation Report" },
      {
        property: "og:description",
        content: "A complete example of a Startup Funeral AI pre-mortem report.",
      },
    ],
  }),
  component: SampleReport,
});

function SampleReport() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Sample report</p>
            <h1 className="mt-2 font-display text-3xl font-bold">
              A complete startup investigation
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              This is a real example of what Startup Funeral produces. Your own report is generated
              from your answers and comes with a working strategy room.
            </p>
          </div>
          <Button asChild className="h-11 rounded-xl px-6">
            <Link to="/auth" search={{ mode: "signup" }}>
              Start your investigation
            </Link>
          </Button>
        </div>
        <ReportView report={SAMPLE_REPORT} />
      </main>
    </div>
  );
}