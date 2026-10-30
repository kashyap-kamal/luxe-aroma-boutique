import { supabase } from "./supabase";
import {
  summarizeAnalyticsFunnel,
  type AnalyticsFunnelSummary,
  type AnalyticsEventRecord,
} from "./admin-reporting";

export type AnalyticsEventType =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase";

export interface TrackEventPayload {
  readonly eventType: AnalyticsEventType;
  readonly pagePath?: string;
  readonly productId?: string;
  readonly bundleId?: string;
  readonly itemName?: string;
  readonly orderId?: string;
  readonly valueInr?: number;
}

const SESSION_STORAGE_KEY = "aromeluxe_anon_session_id";

function getOrCreateSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing && existing.length >= 8) return existing;
    const generated =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `sess_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
    sessionStorage.setItem(SESSION_STORAGE_KEY, generated);
    return generated;
  } catch {
    return null;
  }
}

export function trackEvent(payload: TrackEventPayload): void {
  const sessionId = getOrCreateSessionId();
  if (!sessionId) return;

  const pagePath =
    payload.pagePath ??
    (typeof window !== "undefined" ? window.location.pathname : undefined);

  void supabase
    .from("analytics_events")
    .insert({
      event_type: payload.eventType,
      session_id: sessionId,
      page_path: pagePath ? pagePath.slice(0, 512) : null,
      product_id: payload.productId ?? null,
      bundle_id: payload.bundleId ?? null,
      item_name: payload.itemName ? payload.itemName.slice(0, 256) : null,
      order_id: payload.orderId ? payload.orderId.slice(0, 128) : null,
      value_inr: payload.valueInr ?? null,
    })
    .then(() => {});
}

export async function fetchAnalyticsFunnel(days = 30): Promise<AnalyticsFunnelSummary> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("analytics_events")
    .select("event_type, session_id, item_name")
    .gte("created_at", since)
    .limit(10000);

  if (error || !data) {
    return summarizeAnalyticsFunnel([]);
  }

  return summarizeAnalyticsFunnel(data as AnalyticsEventRecord[]);
}
