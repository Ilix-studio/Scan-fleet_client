// frontend/src/redux-store/services/directOrderApi.ts

import {
  CreateDirectOrderRequest,
  CreateDirectOrderResponse,
  VerifyDirectOrderRequest,
  VerifyDirectOrderResponse,
  TrackOrderResponse,
  GuestOrdersResponse,
} from "@/types/directOrder.types";
import { baseApi } from "../baseApi";

export const directOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create direct order (guest or logged-in)
    createDirectOrder: builder.mutation<
      CreateDirectOrderResponse,
      CreateDirectOrderRequest
    >({
      query: (data) => ({
        url: "/direct-order/create",
        method: "POST",
        body: data,
      }),
    }),

    // Verify payment
    verifyDirectOrder: builder.mutation<
      VerifyDirectOrderResponse,
      VerifyDirectOrderRequest
    >({
      query: (data) => ({
        url: "/direct-order/verify",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "Token"],
    }),

    // Track order by token ID
    trackOrder: builder.query<
      TrackOrderResponse,
      { tokenId: string; email?: string }
    >({
      query: ({ tokenId, email }) => {
        const params = email ? `?email=${encodeURIComponent(email)}` : "";
        return `/direct-order/track/${tokenId}${params}`;
      },
      providesTags: (_result, _error, { tokenId }) => [
        { type: "Token", id: tokenId },
      ],
    }),

    // Get guest orders by email
    getGuestOrders: builder.mutation<GuestOrdersResponse, { email: string }>({
      query: (data) => ({
        url: "/direct-order/guest-orders",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateDirectOrderMutation,
  useVerifyDirectOrderMutation,
  useTrackOrderQuery,
  useLazyTrackOrderQuery,
  useGetGuestOrdersMutation,
} = directOrderApi;
