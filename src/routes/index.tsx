import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Gauge,
  Users,
  ShieldAlert,
  Sparkles,
  Target,
  LineChart,
} from "lucide-react";
import { SiteHeader, Wordmark } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Startup Funeral — AI Startup Pre-Mortem Platform" },
      {
        name: "description",
        content:
          "Stress-test your startup before customers and investors do. AI-powered pre-mortem analysis, investor-grade reports and a working strategy room.",
      },
      { property: "og:title", content: "Startup Funeral — AI Startup Pre-Mortem Platform" },
      {
        property: "og:description",
        content:
          "Reveal hidden risks, challenge assumptions and build a stronger startup with AI-powered analysis.",
      },
    ],
  }),
  component: Index,
});

const FEATURES = [
  {
    icon: ShieldAlert,
    title: "Hidden risk detection",
    body: "Surface the failure modes founders systematically miss — market timing, unit economics, distribution and defensibility.",
  },
  {
    icon: Users,
    title: "Seven-expert panel",
    body: "Investor, customer, competitor, market analyst, product strategist, founder coach and risk analyst — each with reasoning.",
  },
  {
    icon: Gauge,
    title: "Startup health scoring",
    body: "Seven weighted dimensions scored 0-100 with investment readiness and analysis confidence.",
  },
  {
    icon: Sparkles,
    title: "Working strategy room",
    body: "A real AI workspace that already knows your report. Improve pricing, GTM or funding without repeating yourself.",
  },
  {
    icon: Target,
    title: "Scenario simulator",
    body: "Model pivots before you commit them. See projected score changes, trade-offs and a clear recommendation.",
  },
  {
    icon: LineChart,
    title: "Version history",
    body: "Re-run the investigation after each iteration and track exactly what improved and what still needs work.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="hero-glow relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-6 pb-28 pt-24 text-center md:pt-32">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-subtle-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              AI Startup Pre-Mortem Platform
            </div>

            <h1 className="text-gradient mt-9 font-display text-[clamp(2.75rem,11vw,7rem)] font-bold leading-[0.95] tracking-[-0.03em]">
              STARTUP FUNERAL
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-subtle-foreground">
              Reveal hidden risks, challenge assumptions, receive expert-level feedback, and build a
              stronger startup with AI-powered analysis.
            </p>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Generate an investor-style startup investigation, uncover hidden weaknesses, receive
              practical recommendations, and continuously improve your startup through AI-guided
              strategy.
            </p>

            <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-xl px-7 text-sm font-medium">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Start Investigation <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-border bg-card px-7 text-sm font-medium hover:bg-elevated"
              >
                <Link to="/sample-report">View Sample Report</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-28">
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="surface-card group p-7 transition-colors hover:border-primary/30"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-28">
          <div className="surface-card overflow-hidden p-10 text-center md:p-16">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              Run the funeral before it happens.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
              Trusted by founders, accelerators, incubators and startup consultants to pressure-test
              a business before customers and investors do it for them.
            </p>
            <Button asChild size="lg" className="mt-8 h-12 rounded-xl px-7">
              <Link to="/auth" search={{ mode: "signup" }}>
                Start Investigation
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <Wordmark />
          <p>© {new Date().getFullYear()} Startup Funeral. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
