// src/redux-store/services/external/apiAccountApi.ts
import { baseApi } from "../baseApi";

interface WalletInfo {
  balance: number;
  lifetimePurchased: number;
  lifetimeUsed: number;
  lifetimeSpent: number;
}

interface SalesmenInfo {
  linkedCount: number;
  maxAllowed: number;
}

interface ApiAccountDetails {
  accountId: string;
  businessName?: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  apiEnabled: boolean;
  apiKey: string | null;
  apiCreatedAt?: string;
  apiLastUsedAt?: string;
  apiRequestCount: number;
  webhookUrl?: string;
  allowedIPs: string[];
  apiRateLimitPerHour: number;
  apiRateLimitPerDay: number;
  wallet: WalletInfo;
  salesmen: SalesmenInfo;
  createdAt: string;
  updatedAt: string;
}

interface ApiCredentials {
  apiKey: string;
  apiSecret: string;
  webhookSecret: string;
  accountId: string;
  businessName: string;
  email: string;
}

interface RegenerateSecretResponse {
  apiKey: string;
  apiSecret: string;
}

export const myApiAccountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyApiAccountDetails: builder.query<
      { success: boolean; data: ApiAccountDetails },
      void
    >({
      query: () => "/api-accounts/me",
      providesTags: [{ type: "ApiAccount", id: "ME" }],
    }),

    createMyApiAccount: builder.mutation<
      { success: boolean; data: ApiCredentials; message: string },
      void
    >({
      query: () => ({
        url: "/api-accounts",
        method: "POST",
      }),
      invalidatesTags: [{ type: "ApiAccount", id: "ME" }],
    }),

    regenerateMyApiSecret: builder.mutation<
      { success: boolean; data: RegenerateSecretResponse; message: string },
      void
    >({
      query: () => ({
        url: "/api-accounts/regenerate-secret",
        method: "POST",
      }),
      invalidatesTags: [{ type: "ApiAccount", id: "ME" }],
    }),

    enableMyApiAccess: builder.mutation<
      { success: boolean; message: string },
      void
    >({
      query: () => ({
        url: "/api-accounts/enable",
        method: "POST",
      }),
      invalidatesTags: [{ type: "ApiAccount", id: "ME" }],
    }),

    disableMyApiAccess: builder.mutation<
      { success: boolean; message: string },
      void
    >({
      query: () => ({
        url: "/api-accounts",
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ApiAccount", id: "ME" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyApiAccountDetailsQuery,
  useCreateMyApiAccountMutation,
  useRegenerateMyApiSecretMutation,
  useEnableMyApiAccessMutation,
  useDisableMyApiAccessMutation,
} = myApiAccountApi;
