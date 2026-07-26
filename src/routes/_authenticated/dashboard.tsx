import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Copy,
  FileSearch,
  MessagesSquare,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import {
  deleteInvestigation,
  duplicateInvestigation,
  listInvestigations,
  type Investigation,
} from "@/lib/case-files";
import { severityColor, severityLabel } from "@/lib/report";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Startup Funeral" },
      { name: "description", content: "Your saved startup case files, reports and strategy rooms." },
      { property: "og:title", content: "Dashboard — Startup Funeral" },
      { property: "og:description", content: "Manage your AI startup investigations." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Investigation | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });

  const { data: cases, isLoading } = useQuery({
    queryKey: ["investigations"],
    queryFn: listInvestigations,
  });

  const remove = useMutation({
    mutationFn: deleteInvestigation,
    onSuccess: () => {
      toast.success("Case file deleted");
      queryClient.invalidateQueries({ queryKey: ["investigations"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const duplicate = useMutation({
    mutationFn: duplicateInvestigation,
    onSuccess: () => {
      toast.success("Case file duplicated");
      queryClient.invalidateQueries({ queryKey: ["investigations"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cases ?? [];
    return (cases ?? []).filter((c) =>
      [c.startup_name, c.industry, c.stage, c.country]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q)),
    );
  }, [cases, search]);

  const analysed = (cases ?? []).filter((c) => c.current_version > 0);
  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "founder";
  const avgScore = analysed.length
    ? Math.round(analysed.reduce((s, c) => s + (c.health_score ?? 0), 0) / analysed.length)
    : null;

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Welcome back</p>
            <h1 className="mt-2 font-display text-3xl font-bold capitalize">{firstName}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Continue improving your startup, or open a new investigation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatCard label="Case files" value={String(cases?.length ?? 0)} />
            <StatCard label="Analysed" value={String(analysed.length)} />
            <StatCard
              label="Avg. health"
              value={avgScore === null ? "—" : String(avgScore)}
              color={avgScore === null ? undefined : severityColor(avgScore)}
            />
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <button
            onClick={() => navigate({ to: "/investigation/new" })}
            className="surface-card group flex items-center gap-4 p-6 text-left transition-colors hover:border-primary/40"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
              <Plus className="size-5" />
            </span>
            <span>
              <span className="block font-display text-sm font-semibold">New Investigation</span>
              <span className="block text-xs text-muted-foreground">Start a fresh pre-mortem</span>
            </span>
          </button>

          <QuickCard
            icon={<MessagesSquare className="size-5" />}
            title="Continue Strategy Session"
            subtitle={analysed[0]?.startup_name ?? "No analysed case yet"}
            disabled={!analysed[0]}
            onClick={() =>
              analysed[0] &&
              navigate({ to: "/case/$id/strategy", params: { id: analysed[0].id } })
            }
          />
          <QuickCard
            icon={<FileSearch className="size-5" />}
            title="Recent Report"
            subtitle={analysed[0] ? `Version ${analysed[0].current_version}` : "No reports yet"}
            disabled={!analysed[0]}
            onClick={() => analysed[0] && navigate({ to: "/case/$id", params: { id: analysed[0].id } })}
          />
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold">Saved Case Files</h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case files…"
              className="h-10 bg-card pl-9"
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {isLoading &&
            [0, 1, 2].map((i) => <Skeleton key={i} className="h-24 w-full rounded-xl bg-card" />)}

          {!isLoading && filtered.length === 0 && (
            <div className="surface-card p-14 text-center">
              <h3 className="font-display text-lg font-semibold">No case files yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Run your first investigation to get a health score, an expert panel review and a
                working strategy room.
              </p>
              <Button asChild className="mt-6 h-11 rounded-xl px-6">
                <Link to="/investigation/new">Start Investigation</Link>
              </Button>
            </div>
          )}

          {filtered.map((c) => (
            <div
              key={c.id}
              className="surface-card flex flex-wrap items-center gap-5 p-5 transition-colors hover:border-primary/30"
            >
              <div className="flex items-center gap-4">
                <div
                  className="grid size-14 shrink-0 place-items-center rounded-xl border text-lg font-semibold"
                  style={{
                    borderColor:
                      c.health_score !== null ? severityColor(c.health_score) : "var(--border)",
                    color: c.health_score !== null ? severityColor(c.health_score) : undefined,
                  }}
                >
                  {c.health_score ?? "—"}
                </div>
                <div>
                  <Link
                    to="/case/$id"
                    params={{ id: c.id }}
                    className="font-display text-base font-semibold hover:text-primary"
                  >
                    {c.startup_name}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {[c.stage, c.industry, c.country].filter(Boolean).join(" · ") || "Draft"}
                    {c.current_version > 0
                      ? ` · Version ${c.current_version}`
                      : " · Not analysed yet"}
                  </p>
                  {c.health_score !== null && (
                    <p className="mt-1 text-xs" style={{ color: severityColor(c.health_score) }}>
                      {severityLabel(c.health_score)}
                    </p>
                  )}
                </div>
              </div>

              <div className="ml-auto flex flex-wrap items-center gap-2">
                <Button asChild variant="outline" size="sm" className="rounded-lg bg-elevated">
                  <Link to="/case/$id" params={{ id: c.id }}>
                    Open <ArrowUpRight className="ml-1 size-3.5" />
                  </Link>
                </Button>
                <Button asChild size="sm" className="rounded-lg" disabled={c.current_version === 0}>
                  <Link to="/case/$id/strategy" params={{ id: c.id }}>
                    Strategy Room
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Duplicate"
                  onClick={() => duplicate.mutate(c)}
                  className="rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <Copy className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete"
                  onClick={() => setPendingDelete(c)}
                  className="rounded-lg text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this case file?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.startup_name} and its reports and strategy conversations will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-elevated">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) remove.mutate(pendingDelete.id);
                setPendingDelete(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="surface-card min-w-[112px] px-5 py-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold" style={color ? { color } : undefined}>
        {value}
      </p>
    </div>
  );
}

function QuickCard({
  icon,
  title,
  subtitle,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="surface-card flex items-center gap-4 p-6 text-left transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="grid size-11 place-items-center rounded-xl bg-elevated text-primary">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-sm font-semibold">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>
      </span>
    </button>
  );
}