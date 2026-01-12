// frontend/src/redux-store/services/purchaseApi.ts
import {
  CreateOrderRequest,
  CreateOrderResponse,
  Purchase,
  PurchaseHistoryResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "@/types/razorpay";
import { baseApi } from "./baseApi";

export const purchaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (data) => ({
        url: "/purchases/create-order",
        method: "POST",
        body: data,
      }),
    }),

    verifyPayment: builder.mutation<
      VerifyPaymentResponse,
      VerifyPaymentRequest
    >({
      query: (data) => ({
        url: "/purchases/verify-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "Token", "Purchase"],
    }),

    getPurchaseHistory: builder.query<
      PurchaseHistoryResponse,
      { page?: number; limit?: number; status?: string }
    >({
      query: ({ page = 1, limit = 10, status }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (status) params.append("status", status);
        return `/purchases?${params.toString()}`;
      },
      providesTags: ["Purchase"],
    }),

    getPurchase: builder.query<{ success: boolean; data: Purchase }, string>({
      query: (purchaseId) => `/purchases/${purchaseId}`,
      providesTags: (_result, _error, id) => [{ type: "Purchase", id }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useGetPurchaseHistoryQuery,
  useGetPurchaseQuery,
} = purchaseApi;
