import { baseApi } from "../baseApi";

const myApiAccountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyApiAccountDetails: builder.query<
      {
        success: boolean;
        data: {
          apiKey: string;
          apiEnabled: boolean;
          status: "ACTIVE" | "SUSPENDED";
          apiRequestCount: number;
          apiLastUsedAt?: string;
          webhookUrl?: string;
          allowedIPs: string[];
          apiRateLimitPerHour: number;
          apiRateLimitPerDay: number;
        } | null;
      },
      void
    >({
      query: () => "/api-accounts/me",
      providesTags: [{ type: "ApiAccount", id: "ME" }],
    }),
    enableMyApiAccess: builder.mutation<
      { success: boolean; message: string },
      void
    >({
      query: () => ({ url: "/api-accounts/enable", method: "POST" }),
      invalidatesTags: [{ type: "ApiAccount", id: "ME" }],
    }),
    disableMyApiAccess: builder.mutation<
      { success: boolean; message: string },
      void
    >({
      query: () => ({ url: "/api-accounts", method: "DELETE" }),
      invalidatesTags: [{ type: "ApiAccount", id: "ME" }],
    }),
    regenerateMyApiSecret: builder.mutation<
      { success: boolean; data: { apiKey: string; apiSecret: string } },
      void
    >({
      query: () => ({ url: "/api-accounts/regenerate-secret", method: "POST" }),
      invalidatesTags: [{ type: "ApiAccount", id: "ME" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMyApiAccountDetailsQuery,
  useEnableMyApiAccessMutation,
  useDisableMyApiAccessMutation,
  useRegenerateMyApiSecretMutation,
} = myApiAccountApi;
