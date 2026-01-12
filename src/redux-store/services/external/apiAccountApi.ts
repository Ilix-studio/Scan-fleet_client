// redux-store/services/external/apiAccountApi.ts

import { baseApi } from "../baseApi";

interface CreateApiAccountRequest {
  businessName: string;
  email: string;
  phone: string;
  businessAddress?: string;
  gstNumber?: string;
  maxLinkedSalesmen?: number;
  apiRateLimitPerHour?: number;
  apiRateLimitPerDay?: number;
  allowedIPs?: string[];
  webhookUrl?: string;
}

interface ApiAccountCredentials {
  apiKey: string;
  apiSecret: string;
  webhookSecret: string;
  accountId: string;
  businessName: string;
  email: string;
}

interface ApiAccount {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  apiKey: string;
  apiEnabled: boolean;
  status: "ACTIVE" | "SUSPENDED";
  apiRequestCount: number;
  apiLastUsedAt?: string;
  linkedSalesmenCount: number;
  maxLinkedSalesmen: number;
  walletBalance: number;
  apiRateLimitPerHour: number;
  apiRateLimitPerDay: number;
  allowedIPs: string[];
  webhookUrl?: string;
  createdAt: string;
}

interface RegenerateSecretResponse {
  apiKey: string;
  apiSecret: string;
}

interface UpdateApiAccountSettingsRequest {
  apiRateLimitPerHour?: number;
  apiRateLimitPerDay?: number;
  allowedIPs?: string[];
  webhookUrl?: string;
  maxLinkedSalesmen?: number;
}

export const apiAccountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new DEALERSHIP_APP API account
    createApiAccount: builder.mutation<
      ApiAccountCredentials,
      CreateApiAccountRequest
    >({
      query: (data: CreateApiAccountRequest) => ({
        url: "/api-accounts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ApiAccount"],
    }),

    // List all API accounts (admin only)
    listApiAccounts: builder.query<
      { accounts: ApiAccount[]; total: number; page: number; limit: number },
      { page?: number; limit?: number; status?: "ACTIVE" | "SUSPENDED" }
    >({
      query: ({ page = 1, limit = 20, status }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (status) params.append("status", status);
        return {
          url: `/api-accounts?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.accounts.map(({ id }) => ({
                type: "ApiAccount" as const,
                id,
              })),
              { type: "ApiAccount", id: "LIST" },
            ]
          : [{ type: "ApiAccount", id: "LIST" }],
    }),

    // Get details of a specific API account
    getApiAccountDetails: builder.query<ApiAccount, string>({
      query: (accountId: string) => `/api-accounts/${accountId}`,
      providesTags: (_result, _error, accountId) => [
        { type: "ApiAccount", id: accountId },
      ],
    }),

    // Regenerate API secret (returns the new secret only once)
    regenerateApiSecret: builder.mutation<RegenerateSecretResponse, string>({
      query: (accountId: string) => ({
        url: `/api-accounts/${accountId}/regenerate-secret`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, accountId) => [
        { type: "ApiAccount", id: accountId },
      ],
    }),

    // Toggle account status (activate/suspend)
    toggleApiAccountStatus: builder.mutation<
      { success: boolean; newStatus: string },
      { accountId: string; activate: boolean }
    >({
      query: ({ accountId, activate }) => ({
        url: `/api-accounts/${accountId}/status`,
        method: "PATCH",
        body: { activate },
      }),
      invalidatesTags: (_result, _error, { accountId }) => [
        { type: "ApiAccount", id: accountId },
        { type: "ApiAccount", id: "LIST" },
      ],
    }),

    // Update API account settings
    updateApiAccountSettings: builder.mutation<
      ApiAccount,
      { accountId: string; updates: UpdateApiAccountSettingsRequest }
    >({
      query: ({ accountId, updates }) => ({
        url: `/api-accounts/${accountId}/settings`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (_result, _error, { accountId }) => [
        { type: "ApiAccount", id: accountId },
      ],
    }),

    // Delete API account
    deleteApiAccount: builder.mutation<void, string>({
      query: (accountId: string) => ({
        url: `/api-accounts/${accountId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, accountId) => [
        { type: "ApiAccount", id: accountId },
        { type: "ApiAccount", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateApiAccountMutation,
  useListApiAccountsQuery,
  useGetApiAccountDetailsQuery,
  useRegenerateApiSecretMutation,
  useToggleApiAccountStatusMutation,
  useUpdateApiAccountSettingsMutation,
  useDeleteApiAccountMutation,
} = apiAccountApi;
