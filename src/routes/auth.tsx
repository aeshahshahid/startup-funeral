import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wordmark } from "@/components/site-header";

type Mode = "login" | "signup" | "forgot";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: Mode } => {
    const mode = search.mode;
    return mode === "signup" || mode === "login" || mode === "forgot" ? { mode } : {};
  },
  head: () => ({
    meta: [
      { title: "Sign in — Startup Funeral" },
      {
        name: "description",
        content: "Log in or create your Startup Funeral account to run AI startup investigations.",
      },
      { property: "og:title", content: "Sign in — Startup Funeral" },
      { property: "og:description", content: "Access your startup case files and strategy rooms." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode: initialMode } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(initialMode ?? "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset link sent. Check your inbox.");
        setMode("login");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Account created. Welcome to Startup Funeral.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  const title =
    mode === "signup" ? "Create your account" : mode === "forgot" ? "Reset password" : "Welcome back";

  return (
    <div className="hero-glow flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <Wordmark className="mb-10" />
      <div className="surface-card w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "forgot"
            ? "We'll email you a secure link to set a new password."
            : "Continue building a stronger startup."}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ada Lovelace"
                className="h-11 bg-elevated"
                maxLength={100}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-11 bg-elevated"
              maxLength={255}
            />
          </div>
          {mode !== "forgot" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 bg-elevated"
              />
            </div>
          )}

          <Button type="submit" disabled={loading} className="h-11 w-full rounded-lg">
            {loading
              ? "Please wait…"
              : mode === "signup"
                ? "Create account"
                : mode === "forgot"
                  ? "Send reset link"
                  : "Log in"}
          </Button>
        </form>

        {mode !== "forgot" && (
          <>
            <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              OR
              <span className="h-px flex-1 bg-border" />
            </div>
            <Button
              variant="outline"
              onClick={handleGoogle}
              disabled={loading}
              className="h-11 w-full rounded-lg border-border bg-elevated hover:bg-accent"
            >
              <svg className="mr-2 size-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.7 4.1-5.35 4.1-3.22 0-5.85-2.66-5.85-5.95S8.78 6.5 12 6.5c1.84 0 3.07.78 3.77 1.45l2.57-2.48C16.7 3.96 14.55 3.05 12 3.05c-4.98 0-9 4.03-9 9s4.02 9 9 9c5.2 0 8.64-3.65 8.64-8.8 0-.6-.07-1.05-.29-1.15Z"
                />
              </svg>
              Continue with Google
            </Button>
          </>
        )}

        <p className="mt-7 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account?" : "New to Startup Funeral?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            className="font-medium text-primary hover:underline"
          >
            {mode === "signup" ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>

      <Link to="/" className="mt-8 text-xs text-muted-foreground hover:text-foreground">
        ← Back to home
      </Link>
    </div>
  );
}