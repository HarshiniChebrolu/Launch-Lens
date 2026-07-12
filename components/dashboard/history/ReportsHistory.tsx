"use client";

import { useMemo, useState } from "react";
import {
  deleteReportFromSupabase,
  duplicateReportInSupabase,
  toggleReportFavorite,
  updateReportInSupabase,
} from "@/lib/reports-db";
import SearchBar from "./SearchBar";
import ReportCard from "./ReportCard";
import EmptyState from "./EmptyState";
import CompareReports from "./CompareReports";
import HistoryAnalytics from "./HistoryAnalytics";

export default function ReportsHistory({
  reports,
  externalQuery = "",
  loading = false,
  onOpen,
  onCreate,
  refresh,
}: {
  reports: any[];
  externalQuery?: string;
  loading?: boolean;
  onOpen: (report: any) => void;
  onCreate: () => void;
  refresh: () => void;
}) {
  const [localQuery, setLocalQuery] = useState("");

  const query = `${externalQuery} ${localQuery}`.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!query) return reports;

    return reports.filter((item) => {
      const searchable = {
        title: item.title,
        idea: item.idea,
        report: {
          summary: item.report?.summary,
          market: item.report?.market,
          competitors: item.report?.competitors,
          business: item.report?.business,
          techStack: item.report?.techStack,
          technicalBlueprint: item.report?.technicalBlueprint,
        },
      };

      return JSON.stringify(searchable).toLowerCase().includes(query);
    });
  }, [reports, query]);

  async function remove(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmed) return;

    const success = await deleteReportFromSupabase(id);

    if (!success) {
      alert("The report could not be deleted.");
      return;
    }

    refresh();
  }

  async function duplicate(id: string) {
    const result = await duplicateReportInSupabase(id);

    if (!result) {
      alert("The report could not be duplicated.");
      return;
    }

    refresh();
  }

  async function favorite(item: any) {
    const success = await toggleReportFavorite(
      item.id,
      Boolean(item.favorite)
    );

    if (!success) {
      alert("Favorite status could not be updated.");
      return;
    }

    refresh();
  }

  async function regenerate(item: any) {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item.idea),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || "Regeneration failed.");
      }

      await updateReportInSupabase(item.id, json.report);
      refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "The report could not be regenerated."
      );
    }
  }

  if (loading) {
    return (
      <div className="reportCard">
        <h2>Loading reports...</h2>
        <p>Your saved startup reports are being retrieved.</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return <EmptyState onCreate={onCreate} />;
  }

  return (
    <section className="historyPage">
      <div className="sectionTitleRow">
        <div>
          <span className="eyebrowSmall">Saved intelligence</span>
          <h2>Your Startup Reports</h2>
        </div>
      </div>

      <SearchBar value={localQuery} onChange={setLocalQuery} />

      <HistoryAnalytics reports={reports} />

      <CompareReports reports={reports} />

      {filtered.length === 0 ? (
        <div className="reportCard">
          <h2>No matching reports</h2>
          <p>
            No saved report matches “{externalQuery || localQuery}”.
          </p>
        </div>
      ) : (
        <div className="historyGrid">
          {filtered.map((item) => (
            <ReportCard
              key={item.id}
              item={item}
              onOpen={() => onOpen(item.report)}
              onDelete={() => remove(item.id)}
              onDuplicate={() => duplicate(item.id)}
              onFavorite={() => favorite(item)}
              onRegenerate={() => regenerate(item)}
            />
          ))}
        </div>
      )}
    </section>
  );
}