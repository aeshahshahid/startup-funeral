import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <span className="grid size-7 place-items-center rounded-md bg-primary/15 text-primary">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 20V9a8 8 0 1 1 16 0v11" strokeLinecap="round" />
          <path d="M9 20v-5h6v5" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display text-[13px] font-semibold tracking-[0.16em] text-foreground">
        STARTUP FUNERAL
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(!!session));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Wordmark />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/sample-report" className="transition-colors hover:text-foreground">
            Sample Report
          </Link>
          <span className="flex items-center gap-2">
            Pricing
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] tracking-wide text-muted-foreground">
              COMING SOON
            </span>
          </span>
        </nav>
        <div className="flex items-center gap-2">
          {signedIn ? (
            <Button asChild size="sm" className="rounded-lg">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-lg text-subtle-foreground">
                <Link to="/auth" search={{ mode: "login" }}>
                  Login
                </Link>
              </Button>
              <Button asChild size="sm" className="rounded-lg">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}