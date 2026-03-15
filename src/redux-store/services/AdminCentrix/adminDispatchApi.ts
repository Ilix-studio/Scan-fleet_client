// src/redux-store/services/AdminCentrix/adminDispatchApi.ts
import { baseApi } from "../baseApi";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PendingToken {
  _id: string;
  tokenId: string;
  status: string;
  attachCode?: string;
}

export interface PendingPurchaseGroup {
  purchaseId: string;
  userId: string;
  buyerName: string;
  buyerRole: "DEALERSHIP_OWNER" | "DEALERSHIP_SALESMAN" | "RENTAL_OWNER";
  businessName?: string;
  businessAddress?: string;
  phone: string;
  tokenCount: number;
  totalAmount: number;
  paidAt: string;
  tokens: PendingToken[];
}

export interface PendingPurchasesResponse {
  success: boolean;
  data: {
    groups: PendingPurchaseGroup[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface GeneratedAttachCode {
  tokenId: string;
  attachCode: string;
  qrId: string;
  qrUrl: string;
  shippingOrderId: string;
}

export interface GenerateAttachCodesResponse {
  success: boolean;
  data: {
    purchaseId: string;
    batchId: string;
    codesGenerated: number;
    attachCodes: GeneratedAttachCode[];
  };
}

export interface PrintCode {
  shippingOrderId: string;
  tokenId: string;
  attachCode: string;
  qrId: string;
  qrUrl: string;
}

export interface PrintDataResponse {
  success: boolean;
  data: {
    buyer: {
      name: string;
      businessName?: string;
      deliveryAddress: string;
      phone: string;
    };
    codes: PrintCode[];
  };
}

export interface ShippingOrder {
  _id: string;
  tokenId: { tokenId: string; stickerType: string; attachCode: string };
  attachCodeId: { attachCode: string; qrId: string };
  userId: { name: string; phone: string; role: string; businessName?: string };
  purchaseId: string;
  status: "PENDING" | "DISPATCHED" | "DELIVERED";
  shippingAddress: {
    name: string;
    businessName?: string;
    line1: string;
    locality?: string;
    district?: string;
    state?: string;
    pincode?: string;
    country: string;
    phone: string;
  };
  trackingNumber?: string;
  carrier?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface ShippingOrdersResponse {
  success: boolean;
  data: {
    orders: ShippingOrder[];
    total: number;
    page: number;
    pages: number;
  };
}

export interface MarkDispatchedRequest {
  orderId: string;
  trackingNumber: string;
  carrier: string;
}

export interface MarkDeliveredRequest {
  orderId: string;
}

export interface DispatchActionResponse {
  success: boolean;
  data: { updated: 1; orderId: string };
}

// ─── Attach code types ────────────────────────────────────────────────────────

export interface AttachCodeEntry {
  shippingOrderId: string;
  shippingStatus: "PENDING" | "DISPATCHED" | "DELIVERED";
  tokenId: string;
  tokenStatus: string;
  attachCode: string;
  qrId: string;
  qrUrl: string;
  attachCodeStatus: string;
  generatedAt: string;
  purchaseId: string;
  buyer: {
    name: string;
    phone: string;
    role: string;
    businessName?: string;
  };
}

export interface AllAttachCodesResponse {
  success: boolean;
  data: {
    codes: AttachCodeEntry[];
    total: number;
    page: number;
    pages: number;
  };
}

// Scoped to a single purchase — lighter shape, no buyer repeat
export interface PurchaseAttachCodeEntry {
  tokenId: string;
  tokenStatus: string;
  attachCode: string;
  qrId: string;
  qrUrl: string;
  attachCodeStatus: string;
  generatedAt: string;
}

export interface PurchaseAttachCodesResponse {
  success: boolean;
  data: PurchaseAttachCodeEntry[];
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const adminDispatchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /admin/dispatch/pending?page=1&limit=20
    getPendingPurchases: builder.query<
      PendingPurchasesResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) =>
        `/admin/dispatch/pending?page=${page}&limit=${limit}`,
      providesTags: ["Dispatch"],
    }),

    // POST /admin/dispatch/generate-attach-codes
    generateAttachCodes: builder.mutation<
      GenerateAttachCodesResponse,
      { purchaseId: string }
    >({
      query: (body) => ({
        url: "/admin/dispatch/generate-attach-codes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Dispatch"],
    }),

    // GET /admin/dispatch/purchase/:purchaseId/print-data
    getPrintData: builder.query<PrintDataResponse, string>({
      query: (purchaseId) =>
        `/admin/dispatch/purchase/${purchaseId}/print-data`,
      providesTags: (_result, _error, purchaseId) => [
        { type: "Dispatch", id: `print-${purchaseId}` },
      ],
    }),

    // GET /admin/dispatch/attach-codes?page=1&limit=20
    // All generated attach codes across all purchases
    getAllAttachCodes: builder.query<
      AllAttachCodesResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) =>
        `/admin/dispatch/attach-codes?page=${page}&limit=${limit}`,
      providesTags: [{ type: "Dispatch", id: "ALL_CODES" }],
    }),

    // GET /admin/dispatch/purchase/:purchaseId/attach-codes
    // Codes for a single purchase — used after generate to verify
    getAttachCodesForPurchase: builder.query<
      PurchaseAttachCodesResponse,
      string // purchaseId
    >({
      query: (purchaseId) =>
        `/admin/dispatch/purchase/${purchaseId}/attach-codes`,
      providesTags: (_result, _error, purchaseId) => [
        { type: "Dispatch", id: `codes-${purchaseId}` },
      ],
    }),

    // PATCH /admin/dispatch/:orderId/mark-dispatched
    markDispatched: builder.mutation<
      DispatchActionResponse,
      MarkDispatchedRequest
    >({
      query: ({ orderId, ...body }) => ({
        url: `/admin/dispatch/${orderId}/mark-dispatched`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Dispatch"],
    }),

    // PATCH /admin/dispatch/:orderId/mark-delivered
    markDelivered: builder.mutation<
      DispatchActionResponse,
      MarkDeliveredRequest
    >({
      query: ({ orderId }) => ({
        url: `/admin/dispatch/${orderId}/mark-delivered`,
        method: "PATCH",
      }),
      invalidatesTags: ["Dispatch"],
    }),

    // GET /admin/dispatch/shipping-orders?status=PENDING&page=1&limit=20
    getShippingOrders: builder.query<
      ShippingOrdersResponse,
      {
        status?: "PENDING" | "DISPATCHED" | "DELIVERED";
        page?: number;
        limit?: number;
      }
    >({
      query: ({ status = "PENDING", page = 1, limit = 20 } = {}) =>
        `/admin/dispatch/shipping-orders?status=${status}&page=${page}&limit=${limit}`,
      providesTags: (_result, _error, { status } = {}) => [
        { type: "Dispatch", id: status ?? "PENDING" },
      ],
    }),
  }),
});

export const {
  useGetPendingPurchasesQuery,
  useGenerateAttachCodesMutation,
  useGetPrintDataQuery,
  useGetAllAttachCodesQuery,
  useGetAttachCodesForPurchaseQuery,
  useMarkDispatchedMutation,
  useMarkDeliveredMutation,
  useGetShippingOrdersQuery,
} = adminDispatchApi;
