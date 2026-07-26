import { useEffect, useState } from "react";

const MESSAGES = [
  "Analyzing market...",
  "Reviewing competitors...",
  "Evaluating positioning...",
  "Interviewing virtual customers...",
  "Simulating investor review...",
  "Preparing recommendations...",
];

export function AnalysisLoader({ startupName }: { startupName: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, MESSAGES.length - 1)), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-glow flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative grid size-24 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <span className="absolute inset-2 rounded-full border border-primary/40" />
        <span className="size-3 rounded-full bg-primary" />
      </div>

      <h1 className="mt-10 font-display text-2xl font-semibold">
        Investigating {startupName || "your startup"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Seven expert perspectives are reviewing your case file. This usually takes under a minute.
      </p>

      <div className="mt-10 w-full max-w-sm space-y-3 text-left">
        {MESSAGES.map((m, i) => (
          <div
            key={m}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-500 ${
              i < step
                ? "border-border bg-card text-muted-foreground"
                : i === step
                  ? "border-primary/40 bg-primary/8 text-foreground"
                  : "border-transparent text-muted-foreground/40"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                i < step ? "bg-success" : i === step ? "animate-pulse bg-primary" : "bg-border"
              }`}
            />
            {m}
          </div>
        ))}
      </div>
    </div>
  );
}