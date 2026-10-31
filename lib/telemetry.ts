/**
 * lib/telemetry.ts
 * 
 * Privacy-conscious usage metrics and operational telemetry for LaunchLens.
 * Strictly avoids logging raw startup ideas, full prompts, personal data, or credentials.
 * Tracks aggregated performance, latency quantiles (p50, p95), fallback rates,
 * and semantic positioning success rates.
 */

export interface TelemetryEvent {
  type: 
    | "analysis_requested"
    | "analysis_completed"
    | "report_validation_failed"
    | "gemini_failed"
    | "fallback_used"
    | "tavily_failed"
    | "rate_limit_triggered"
    | "positioning_completed"
    | "positioning_failed";
  timestamp: number;
  durationMs?: number;
  userType: "authenticated" | "guest";
  userIdHash?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface OperationalMetrics {
  measurementPeriodStart: string;
  totalRequests: number;
  successfulReports: number;
  fallbackCount: number;
  validationFailures: number;
  rateLimitHits: number;
  positioningRuns: number;
  positioningFailures: number;
  uniqueUsers: number;
  // Computed Rates
  reportSuccessRate: number; // percentage (0 - 100)
  fallbackRate: number; // percentage (0 - 100)
  positioningSuccessRate: number; // percentage (0 - 100)
  // Latency Quantiles (ms)
  medianLatencyMs: number;
  p95LatencyMs: number;
  // Error Breakdown
  errorsByType: Record<string, number>;
}

class TelemetryStore {
  private events: TelemetryEvent[] = [];
  private uniqueUserHashes: Set<string> = new Set();
  private latenciesMs: number[] = [];
  private readonly startTime = new Date().toISOString();
  private readonly maxStoredEvents = 2000;

  /**
   * Log a privacy-sanitized telemetry event
   */
  public logEvent(event: Omit<TelemetryEvent, "timestamp">) {
    const fullEvent: TelemetryEvent = {
      ...event,
      timestamp: Date.now(),
    };

    if (event.userIdHash) {
      this.uniqueUserHashes.add(event.userIdHash);
    }

    if (event.durationMs && typeof event.durationMs === "number" && event.durationMs > 0) {
      this.latenciesMs.push(Math.round(event.durationMs));
      // Keep latencies sorted or cap size
      if (this.latenciesMs.length > 5000) {
        this.latenciesMs.shift();
      }
    }

    this.events.push(fullEvent);
    if (this.events.length > this.maxStoredEvents) {
      this.events.shift();
    }
  }

  /**
   * Compute empirical percentiles (p50, p95) from recorded latencies.
   */
  private getPercentile(p: number): number {
    if (this.latenciesMs.length === 0) return 0;
    const sorted = [...this.latenciesMs].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, Math.min(sorted.length - 1, index))];
  }

  /**
   * Aggregate operational metrics
   */
  public getMetrics(): OperationalMetrics {
    const totalRequests = this.events.filter((e) => e.type === "analysis_requested").length;
    const successfulReports = this.events.filter((e) => e.type === "analysis_completed").length;
    const fallbackCount = this.events.filter((e) => e.type === "fallback_used").length;
    const validationFailures = this.events.filter((e) => e.type === "report_validation_failed").length;
    const rateLimitHits = this.events.filter((e) => e.type === "rate_limit_triggered").length;
    const positioningRuns = this.events.filter((e) => e.type === "positioning_completed").length;
    const positioningFailures = this.events.filter((e) => e.type === "positioning_failed").length;

    const errorsByType: Record<string, number> = {};
    for (const ev of this.events) {
      if (
        ev.type === "gemini_failed" ||
        ev.type === "tavily_failed" ||
        ev.type === "report_validation_failed" ||
        ev.type === "positioning_failed"
      ) {
        errorsByType[ev.type] = (errorsByType[ev.type] || 0) + 1;
      }
    }

    const reportSuccessRate = totalRequests > 0 
      ? Number(((successfulReports / totalRequests) * 100).toFixed(2)) 
      : 0;

    const fallbackRate = successfulReports > 0 
      ? Number(((fallbackCount / successfulReports) * 100).toFixed(2)) 
      : 0;

    const totalPos = positioningRuns + positioningFailures;
    const positioningSuccessRate = totalPos > 0 
      ? Number(((positioningRuns / totalPos) * 100).toFixed(2)) 
      : 100;

    return {
      measurementPeriodStart: this.startTime,
      totalRequests,
      successfulReports,
      fallbackCount,
      validationFailures,
      rateLimitHits,
      positioningRuns,
      positioningFailures,
      uniqueUsers: Math.max(1, this.uniqueUserHashes.size),
      reportSuccessRate,
      fallbackRate,
      positioningSuccessRate,
      medianLatencyMs: this.getPercentile(50),
      p95LatencyMs: this.getPercentile(95),
      errorsByType,
    };
  }
}

// Global singleton instance
export const telemetry = new TelemetryStore();
