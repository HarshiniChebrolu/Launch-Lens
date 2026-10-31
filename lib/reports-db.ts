import { supabase } from "@/lib/supabase";
import { IdeaInput, StartupReport } from "@/types/report";

const STORAGE_KEY = "launch_lens_reports";

function getLocalReports(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Local storage read error:", e);
    return [];
  }
}

function saveLocalReports(reports: any[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error("Local storage save error:", e);
  }
}

export async function saveReportToSupabase(
  idea: IdeaInput,
  report: StartupReport
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
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

      if (!error && data) {
        return data;
      }
    }
  } catch (error) {
    console.warn("Supabase save report failed, using local storage:", error);
  }

  // Fallback to local storage
  const localReport = {
    id: "local_" + Date.now(),
    title: report.title,
    idea,
    report,
    favorite: false,
    created_at: new Date().toISOString(),
  };

  const existing = getLocalReports();
  saveLocalReports([localReport, ...existing]);
  return localReport;
}

export async function getReportsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("favorite", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (error) {
    console.warn("Supabase fetch reports failed, using local storage:", error);
  }

  return getLocalReports();
}

export async function deleteReportFromSupabase(id: string) {
  try {
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (!error) {
      // Also clean from local cache
      const existing = getLocalReports().filter((r) => r.id !== id);
      saveLocalReports(existing);
      return true;
    }
  } catch (error) {
    console.warn("Supabase delete failed, updating local storage:", error);
  }

  const existing = getLocalReports().filter((r) => r.id !== id);
  saveLocalReports(existing);
  return true;
}

export async function duplicateReportInSupabase(id: string) {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    if (!fetchError && existing) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
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

        if (!error && data) {
          return data;
        }
      }
    }
  } catch (error) {
    console.warn("Supabase duplicate failed, using local storage:", error);
  }

  // Local storage duplicate
  const localList = getLocalReports();
  const source = localList.find((r) => r.id === id);
  if (!source) return null;

  const copy = {
    ...source,
    id: "local_" + Date.now(),
    title: `${source.title} Copy`,
    created_at: new Date().toISOString(),
  };

  saveLocalReports([copy, ...localList]);
  return copy;
}

export async function toggleReportFavorite(id: string, current: boolean) {
  try {
    const { error } = await supabase
      .from("reports")
      .update({ favorite: !current })
      .eq("id", id);

    if (!error) {
      const list = getLocalReports().map((r) =>
        r.id === id ? { ...r, favorite: !current } : r
      );
      saveLocalReports(list);
      return true;
    }
  } catch (error) {
    console.warn("Supabase toggle favorite failed, updating local storage:", error);
  }

  const list = getLocalReports().map((r) =>
    r.id === id ? { ...r, favorite: !current } : r
  );
  saveLocalReports(list);
  return true;
}

export async function updateReportInSupabase(id: string, report: StartupReport) {
  try {
    const { error } = await supabase
      .from("reports")
      .update({
        title: report.title,
        report,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (!error) {
      const list = getLocalReports().map((r) =>
        r.id === id ? { ...r, title: report.title, report, updated_at: new Date().toISOString() } : r
      );
      saveLocalReports(list);
      return true;
    }
  } catch (error) {
    console.warn("Supabase update failed, updating local storage:", error);
  }

  const list = getLocalReports().map((r) =>
    r.id === id ? { ...r, title: report.title, report, updated_at: new Date().toISOString() } : r
  );
  saveLocalReports(list);
  return true;
}