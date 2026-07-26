import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AnalysisLoader } from "@/components/analysis-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { generateStartupReport } from "@/lib/analysis.functions";
import { emptyAnswers, type InvestigationAnswers, type StartupReport } from "@/lib/report";
import { getInvestigation, listReports } from "@/lib/case-files";

export const Route = createFileRoute("/_authenticated/investigation/new")({
  validateSearch: (s: Record<string, unknown>): { caseId?: string } =>
    typeof s.caseId === "string" ? { caseId: s.caseId } : {},
  head: () => ({
    meta: [
      { title: "New Investigation — Startup Funeral" },
      {
        name: "description",
        content: "Answer 18 questions and get an investor-grade AI pre-mortem of your startup.",
      },
      { property: "og:title", content: "New Investigation — Startup Funeral" },
      { property: "og:description", content: "Start an AI startup pre-mortem investigation." },
    ],
  }),
  component: NewInvestigation,
});

type Field = {
  key: keyof InvestigationAnswers;
  label: string;
  hint: string;
  long?: boolean;
};

const STEPS: { title: string; subtitle: string; fields: Field[] }[] = [
  {
    title: "The basics",
    subtitle: "Tell us who you are and where you operate.",
    fields: [
      { key: "startupName", label: "Startup name", hint: "e.g. Rehearse AI" },
      { key: "stage", label: "Stage", hint: "Idea, MVP, pre-seed, seed, Series A…" },
      { key: "industry", label: "Industry", hint: "e.g. B2B SaaS, fintech, healthtech" },
      { key: "country", label: "Country / market", hint: "e.g. United Kingdom, primarily EU" },
    ],
  },
  {
    title: "Problem & solution",
    subtitle: "What are you solving, and how?",
    fields: [
      {
        key: "problem",
        label: "The problem",
        hint: "Who has this problem, how painful is it, what do they do today?",
        long: true,
      },
      {
        key: "solution",
        label: "Your solution",
        hint: "What does the product actually do?",
        long: true,
      },
      {
        key: "targetCustomers",
        label: "Target customers",
        hint: "Be specific — role, company size, segment.",
        long: true,
      },
    ],
  },
  {
    title: "Business & money",
    subtitle: "How the company makes money today.",
    fields: [
      { key: "businessModel", label: "Business model", hint: "B2B, B2C, marketplace, hybrid…", long: true },
      { key: "revenueModel", label: "Revenue model", hint: "Subscription, usage, one-off, commission" },
      { key: "pricing", label: "Pricing", hint: "Actual numbers and tiers, if any" },
    ],
  },
  {
    title: "Market position",
    subtitle: "Who else is in the room.",
    fields: [
      { key: "competitors", label: "Competitors", hint: "Name them, including the status quo.", long: true },
      {
        key: "differentiation",
        label: "Differentiation",
        hint: "Why would someone choose you and keep choosing you?",
        long: true,
      },
      {
        key: "traction",
        label: "Traction",
        hint: "Users, revenue, pilots, retention, waitlist — real numbers.",
        long: true,
      },
    ],
  },
  {
    title: "Team & resources",
    subtitle: "Who is building this, and with what.",
    fields: [
      { key: "foundingTeam", label: "Founding team", hint: "Names, roles, relevant background", long: true },
      { key: "technicalSkills", label: "Technical skills", hint: "In-house engineering, agency, no-code…" },
      { key: "funding", label: "Funding", hint: "Bootstrapped, grants, angels, raised amount, runway" },
    ],
  },
  {
    title: "Now & next",
    subtitle: "Where you're stuck and where you're heading.",
    fields: [
      {
        key: "challenges",
        label: "Current challenges",
        hint: "What is genuinely blocking you right now?",
        long: true,
      },
      {
        key: "goals",
        label: "Goals",
        hint: "What must be true in 3-6 months for this to be working?",
        long: true,
      },
    ],
  },
];

function NewInvestigation() {
  const { caseId } = Route.useSearch();
  const navigate = useNavigate();
  const runAnalysis = useServerFn(generateStartupReport);

  const [answers, setAnswers] = useState<InvestigationAnswers>(emptyAnswers);
  const [step, setStep] = useState(0);
  const [analysing, setAnalysing] = useState(false);
  const [loadingCase, setLoadingCase] = useState(!!caseId);

  useEffect(() => {
    if (!caseId) return;
    getInvestigation(caseId)
      .then((inv) => {
        if (inv) setAnswers({ ...emptyAnswers, ...inv.answers });
      })
      .finally(() => setLoadingCase(false));
  }, [caseId]);

  const current = STEPS[step];
  const canContinue = current.fields.every((f) => answers[f.key].trim().length > 0);
  const progress = ((step + 1) / STEPS.length) * 100;

  async function submit() {
    setAnalysing(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Session expired. Please log in again.");

      let investigationId = caseId;
      let nextVersion = 1;
      let previous: StartupReport | null = null;

      if (investigationId) {
        const existing = await listReports(investigationId);
        nextVersion = (existing[0]?.version ?? 0) + 1;
        previous = existing[0]?.content ?? null;
        const { error } = await supabase
          .from("investigations")
          .update({
            startup_name: answers.startupName,
            stage: answers.stage,
            industry: answers.industry,
            country: answers.country,
            answers: answers as never,
          })
          .eq("id", investigationId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("investigations")
          .insert({
            user_id: userId,
            startup_name: answers.startupName,
            stage: answers.stage,
            industry: answers.industry,
            country: answers.country,
            answers: answers as never,
          })
          .select()
          .single();
        if (error) throw error;
        investigationId = data.id;
      }

      const report = await runAnalysis({ data: { answers, previous } });

      const { error: repErr } = await supabase.from("reports").insert({
        investigation_id: investigationId!,
        user_id: userId,
        version: nextVersion,
        health_score: report.healthScore,
        content: report as never,
      });
      if (repErr) throw repErr;

      const { error: updErr } = await supabase
        .from("investigations")
        .update({ health_score: report.healthScore, current_version: nextVersion })
        .eq("id", investigationId!);
      if (updErr) throw updErr;

      navigate({ to: "/case/$id", params: { id: investigationId! } });
    } catch (err) {
      setAnalysing(false);
      toast.error(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    }
  }

  if (analysing) return <AnalysisLoader startupName={answers.startupName} />;

  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="uppercase tracking-[0.18em] text-primary">
            {caseId ? "Updated investigation" : "New investigation"}
          </span>
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-card">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="surface-card mt-8 p-8">
          <h1 className="font-display text-2xl font-semibold">{current.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{current.subtitle}</p>

          {loadingCase ? (
            <p className="mt-10 text-sm text-muted-foreground">Loading your answers…</p>
          ) : (
            <div className="mt-8 space-y-6">
              {current.fields.map((f) => (
                <div key={f.key} className="space-y-2">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  {f.long ? (
                    <Textarea
                      id={f.key}
                      value={answers[f.key]}
                      onChange={(e) => setAnswers({ ...answers, [f.key]: e.target.value })}
                      placeholder={f.hint}
                      maxLength={2000}
                      className="min-h-28 resize-none bg-elevated"
                    />
                  ) : (
                    <Input
                      id={f.key}
                      value={answers[f.key]}
                      onChange={(e) => setAnswers({ ...answers, [f.key]: e.target.value })}
                      placeholder={f.hint}
                      maxLength={200}
                      className="h-11 bg-elevated"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-9 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => (step === 0 ? navigate({ to: "/dashboard" }) : setStep(step - 1))}
              className="rounded-lg text-muted-foreground"
            >
              <ArrowLeft className="mr-1 size-4" /> {step === 0 ? "Cancel" : "Back"}
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canContinue}
                className="h-11 rounded-lg px-6"
              >
                Continue <ArrowRight className="ml-1 size-4" />
              </Button>
            ) : (
              <Button onClick={submit} disabled={!canContinue} className="h-11 rounded-lg px-6">
                Run Investigation
              </Button>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}