import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/site-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { mode: "login" }, replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Wordmark />
            <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
              <Link
                to="/dashboard"
                className="transition-colors hover:text-foreground [&.active]:text-foreground"
              >
                Dashboard
              </Link>
              <Link to="/sample-report" className="transition-colors hover:text-foreground">
                Sample Report
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="rounded-lg">
              <Link to="/investigation/new">
                <Plus className="mr-1 size-4" /> New Investigation
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              aria-label="Sign out"
              className="rounded-lg text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}