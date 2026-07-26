import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wordmark } from "@/components/site-header";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Startup Funeral" },
      { name: "description", content: "Choose a new password for your Startup Funeral account." },
      { property: "og:title", content: "Set a new password — Startup Funeral" },
      { property: "og:description", content: "Securely reset your Startup Funeral password." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated.");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="hero-glow flex min-h-screen flex-col items-center justify-center px-6">
      <Wordmark className="mb-10" />
      <form onSubmit={submit} className="surface-card w-full max-w-md space-y-5 p-8">
        <h1 className="font-display text-2xl font-semibold">Set a new password</h1>
        <div className="space-y-2">
          <Label htmlFor="pw">New password</Label>
          <Input
            id="pw"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 bg-elevated"
          />
        </div>
        <Button type="submit" disabled={loading} className="h-11 w-full rounded-lg">
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}