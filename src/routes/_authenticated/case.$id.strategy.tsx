import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { UIMessage } from "ai";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StrategyRoom } from "@/components/strategy-room";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getInvestigation, listReports } from "@/lib/case-files";
import { reportContextString } from "@/lib/report";

export const Route = createFileRoute("/_authenticated/case/$id/strategy")({
  head: () => ({
    meta: [
      { title: "Strategy Room — Startup Funeral" },
      {
        name: "description",
        content: "Chat with an AI advisor that already knows your startup's full case file.",
      },
      { property: "og:title", content: "Strategy Room — Startup Funeral" },
      { property: "og:description", content: "Continuous AI strategy sessions for founders." },
    ],
  }),
  component: StrategyPage,
});

function StrategyPage() {
  const { id } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["strategy", id],
    queryFn: async () => {
      const [investigation, reports, user, history] = await Promise.all([
        getInvestigation(id),
        listReports(id),
        supabase.auth.getUser(),
        supabase
          .from("strategy_messages")
          .select("*")
          .eq("investigation_id", id)
          .order("created_at", { ascending: true }),
      ]);

      const messages: UIMessage[] = (history.data ?? []).map((m) => ({
        id: m.id,
        role: m.role === "user" ? "user" : "assistant",
        parts: [{ type: "text", text: m.content }],
      }));

      return {
        investigation,
        report: reports[0] ?? null,
        userId: user.data.user?.id ?? "",
        messages,
      };
    },
  });

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link
          to="/case/$id"
          params={{ id }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to case file
        </Link>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.18em] text-primary">Strategy room</p>
          <h1 className="mt-2 font-display text-3xl font-bold">
            {data?.investigation?.startup_name ?? "Loading…"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your advisor has read the full report and every answer you gave.
          </p>
        </div>

        <div className="mt-8">
          {isLoading && <Skeleton className="h-[72vh] w-full rounded-2xl bg-card" />}
          {!isLoading && data && !data.report && (
            <div className="surface-card p-14 text-center">
              <h3 className="font-display text-lg font-semibold">Run the investigation first</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The Strategy Room needs a generated report to advise you properly.
              </p>
              <Button asChild className="mt-6 h-11 rounded-xl px-6">
                <Link to="/investigation/new" search={{ caseId: id }}>
                  Run Investigation
                </Link>
              </Button>
            </div>
          )}
          {!isLoading && data?.report && data.investigation && (
            <StrategyRoom
              investigationId={id}
              userId={data.userId}
              context={reportContextString(data.investigation.answers, data.report.content)}
              initialMessages={data.messages}
            />
          )}
        </div>
      </main>
    </AppShell>
  );
}