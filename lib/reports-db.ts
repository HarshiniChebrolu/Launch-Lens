import { supabase } from "@/lib/supabase";
import { IdeaInput, StartupReport } from "@/types/report";

export async function saveReportToSupabase(
  idea: IdeaInput,
  report: StartupReport
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("reports")
    .insert({
      user_id: user.id,
      title: report.title,
      idea,
      report,
    })
    .select()
    .single();

  if (error) {
    console.error("Save report error:", error);
    return null;
  }

  return data;
}

export async function getReportsFromSupabase() {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("favorite", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch reports error:", error);
    return [];
  }

  return data || [];
}

export async function deleteReportFromSupabase(id: string) {
  const { error } = await supabase.from("reports").delete().eq("id", id);

  if (error) {
    console.error("Delete report error:", error);
    return false;
  }

  return true;
}

export async function duplicateReportInSupabase(id: string) {
  const { data: existing, error: fetchError } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    console.error("Fetch duplicate source error:", fetchError);
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("reports")
    .insert({
      user_id: user.id,
      title: `${existing.title} Copy`,
      idea: existing.idea,
      report: existing.report,
    })
    .select()
    .single();

  if (error) {
    console.error("Duplicate report error:", error);
    return null;
  }

  return data;
}

export async function toggleReportFavorite(id: string, current: boolean) {
  const { error } = await supabase
    .from("reports")
    .update({ favorite: !current })
    .eq("id", id);

  if (error) {
    console.error("Favorite update error:", error);
    return false;
  }

  return true;
}

export async function updateReportInSupabase(id: string, report: StartupReport) {
  const { error } = await supabase
    .from("reports")
    .update({
      title: report.title,
      report,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Update report error:", error);
    return false;
  }

  return true;
}