import { supabase } from "@/integrations/supabase/client";
import type { InvestigationAnswers, StartupReport } from "./report";

export type Investigation = {
  id: string;
  user_id: string;
  startup_name: string;
  stage: string | null;
  industry: string | null;
  country: string | null;
  answers: InvestigationAnswers;
  health_score: number | null;
  current_version: number;
  created_at: string;
  updated_at: string;
};

export type ReportRow = {
  id: string;
  investigation_id: string;
  version: number;
  health_score: number | null;
  content: StartupReport;
  created_at: string;
};

export async function listInvestigations() {
  const { data, error } = await supabase
    .from("investigations")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Investigation[];
}

export async function getInvestigation(id: string) {
  const { data, error } = await supabase
    .from("investigations")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Investigation | null;
}

export async function listReports(investigationId: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("investigation_id", investigationId)
    .order("version", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as ReportRow[];
}

export async function deleteInvestigation(id: string) {
  const { error } = await supabase.from("investigations").delete().eq("id", id);
  if (error) throw error;
}

export async function listStrategyMessages(investigationId: string) {
  const { data, error } = await supabase
    .from("strategy_messages")
    .select("role, content, created_at")
    .eq("investigation_id", investigationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

async function _deleteInvestigationLegacy(id: string) {
  const { error } = await supabase.from("investigations").delete().eq("id", id);
  if (error) throw error;
}

export async function duplicateInvestigation(inv: Investigation) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not signed in");

  const { data, error } = await supabase
    .from("investigations")
    .insert({
      user_id: userId,
      startup_name: `${inv.startup_name} (Copy)`,
      stage: inv.stage,
      industry: inv.industry,
      country: inv.country,
      answers: inv.answers as never,
      health_score: null,
      current_version: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as Investigation;
}