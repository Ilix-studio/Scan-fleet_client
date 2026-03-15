// src/redux-store/services/AdminCentrix/adminPurchaseAnalyticsApi.ts

import { baseApi } from "./baseApi";

// ─── Shared types ─────────────────────────────────────────────────────────────

export type GroupBy = "day" | "month" | "year";

export type UserRole =
  | "DEALERSHIP_OWNER"
  | "DEALERSHIP_SALESMAN"
  | "RENTAL_OWNER"
  | "DIRECT_CUSTOMER";

export type PurchaseType = "WALLET_TOPUP" | "DIRECT_ORDER";

export type PurchaseStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

// ─── Response types ───────────────────────────────────────────────────────────

export interface RevenueGroup {
  _id: {
    year: number;
    month?: number;
    day?: number;
  };
  totalRevenue: number;
  totalTokens: number;
  totalPurchases: number;
}

export interface RevenueSummaryData {
  groups: RevenueGroup[];
  totalRevenue: number;
  totalTokens: number;
  totalPurchases: number;
}

export interface RevenueByRoleItem {
  role: UserRole;
  totalRevenue: number;
  totalTokens: number;
  totalPurchases: number;
  avgOrderValue: number;
}

export interface TransactionUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  businessName?: string;
}

export interface Transaction {
  _id: string;
  userId: TransactionUser;
  totalAmount: number;
  tokenQuantity: number;
  purchaseType: PurchaseType;
  status: PurchaseStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsData {
  transactions: Transaction[];
  total: number;
  page: number;
  pages: number;
}

export interface OverviewPeriod {
  revenue: number;
  tokens: number;
  count: number;
}

export interface OverviewData {
  today: OverviewPeriod;
  thisMonth: OverviewPeriod;
  thisYear: OverviewPeriod;
  total: OverviewPeriod;
}

// ─── Query param types ────────────────────────────────────────────────────────

export interface RevenueSummaryParams {
  groupBy?: GroupBy;
  role?: UserRole;
  startDate?: string; // ISO string
  endDate?: string;
  purchaseType?: PurchaseType;
}

export interface RevenueByRoleParams {
  startDate?: string;
  endDate?: string;
  purchaseType?: PurchaseType;
}

export interface TransactionsParams {
  startDate?: string;
  endDate?: string;
  role?: UserRole;
  status?: PurchaseStatus;
  purchaseType?: PurchaseType;
  page?: number;
  limit?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildParams(obj: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined && val !== "") {
      params.append(key, String(val));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

// ─── API slice ────────────────────────────────────────────────────────────────

const adminPurchaseAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /api/admin/purchase-analytics/overview
     */
    getAnalyticsOverview: builder.query<OverviewData, void>({
      query: () => "/admin/purchase-analytics/overview",
      transformResponse: (res: { success: boolean; data: OverviewData }) =>
        res.data,
      providesTags: [{ type: "Analytics", id: "OVERVIEW" }],
    }),

    /**
     * GET /api/admin/purchase-analytics/revenue
     */
    getRevenueSummary: builder.query<RevenueSummaryData, RevenueSummaryParams>({
      query: (params) =>
        `/admin/purchase-analytics/revenue${buildParams(params as any)}`,
      transformResponse: (res: {
        success: boolean;
        data: RevenueSummaryData;
      }) => res.data,
      providesTags: [{ type: "Analytics", id: "REVENUE" }],
    }),

    /**
     * GET /api/admin/purchase-analytics/by-role
     */
    getRevenueByRole: builder.query<RevenueByRoleItem[], RevenueByRoleParams>({
      query: (params) =>
        `/admin/purchase-analytics/by-role${buildParams(params as any)}`,
      transformResponse: (res: {
        success: boolean;
        data: RevenueByRoleItem[];
      }) => res.data,
      providesTags: [{ type: "Analytics", id: "BY_ROLE" }],
    }),

    /**
     * GET /api/admin/purchase-analytics/transactions
     */
    getAnalyticsTransactions: builder.query<
      TransactionsData,
      TransactionsParams
    >({
      query: (params) =>
        `/admin/purchase-analytics/transactions${buildParams(params as any)}`,
      transformResponse: (res: { success: boolean; data: TransactionsData }) =>
        res.data,
      providesTags: (result, _error, params) =>
        result
          ? [
              { type: "Analytics", id: `TRANSACTIONS-p${params.page ?? 1}` },
              { type: "Analytics", id: "TRANSACTIONS" },
            ]
          : [{ type: "Analytics", id: "TRANSACTIONS" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAnalyticsOverviewQuery,
  useGetRevenueSummaryQuery,
  useGetRevenueByRoleQuery,
  useGetAnalyticsTransactionsQuery,
  useLazyGetRevenueSummaryQuery,
  useLazyGetRevenueByRoleQuery,
  useLazyGetAnalyticsTransactionsQuery,
} = adminPurchaseAnalyticsApi;

export { adminPurchaseAnalyticsApi };
