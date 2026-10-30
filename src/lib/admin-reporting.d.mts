export interface RevenueBucket {
  readonly dateKey: string;
  readonly label: string;
  readonly revenue: number;
  readonly orders: number;
}

export interface TopSoldItem {
  readonly name: string;
  readonly units: number;
  readonly revenue: number;
}

export interface TopViewedItem {
  readonly name: string;
  readonly views: number;
}

export interface AnalyticsFunnelSummary {
  readonly uniqueVisitors: number;
  readonly productViews: number;
  readonly addToCarts: number;
  readonly checkoutsStarted: number;
  readonly purchases: number;
  readonly conversionRate: number;
  readonly topViewed: readonly TopViewedItem[];
}

export interface AnalyticsEventRecord {
  readonly event_type: string;
  readonly session_id: string;
  readonly item_name?: string | null;
}

export function toIstDateKey(dateInput: Date | string): string;
export function isPaidOrder(order: {
  readonly order_status?: string | null;
  readonly payment_status?: string | null;
} | null | undefined): boolean;
export function buildIstRevenueSeries(
  orders: readonly Record<string, unknown>[],
  days?: number,
  now?: Date
): RevenueBucket[];
export function computeTopSoldItems(
  orders: readonly Record<string, unknown>[],
  limit?: number
): TopSoldItem[];
export function summarizeAnalyticsFunnel(
  events: readonly AnalyticsEventRecord[],
  topLimit?: number
): AnalyticsFunnelSummary;
export function escapeCsvCell(raw: unknown): string;
export function ordersToCsv(orders: readonly Record<string, unknown>[]): string;
