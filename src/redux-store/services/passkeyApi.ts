import {
  CreatePasskeyRequest,
  CreatePasskeyResponse,
  GetLinkedSalesmenResponse,
  GetMyDealershipResponse,
  GetPasskeysResponse,
  PasskeyPaginationParams,
  RevokePasskeyResponse,
  UnlinkSalesmanResponse,
  UsePasskeyRequest,
  UsePasskeyResponse,
} from "@/types/passkeys.types";
import { baseApi } from "./baseApi";

export const passkeyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // DEALERSHIP_OWNER endpoints
    createPasskey: builder.mutation<
      CreatePasskeyResponse,
      CreatePasskeyRequest
    >({
      query: (body) => ({
        url: "/passkeys",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Passkeys"],
    }),

    getMyPasskeys: builder.query<GetPasskeysResponse, PasskeyPaginationParams>({
      query: (params) => ({
        url: "/passkeys",
        params,
      }),
      providesTags: ["Passkeys"],
    }),

    revokePasskey: builder.mutation<
      RevokePasskeyResponse,
      { code: string; reason?: string }
    >({
      query: ({ code, reason }) => ({
        url: `/passkeys/${code}`,
        method: "DELETE",
        body: { reason },
      }),
      invalidatesTags: ["Passkeys"],
    }),

    getLinkedSalesmen: builder.query<GetLinkedSalesmenResponse, void>({
      query: () => "/passkeys/salesmen",
      providesTags: ["LinkedSalesmen"],
    }),

    unlinkSalesman: builder.mutation<UnlinkSalesmanResponse, string>({
      query: (salesmanId) => ({
        url: `/passkeys/salesmen/${salesmanId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LinkedSalesmen"],
    }),

    // DEALERSHIP_SALESMAN endpoints
    usePasskey: builder.mutation<UsePasskeyResponse, UsePasskeyRequest>({
      query: (body) => ({
        url: "/passkeys/use",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MyDealership"],
    }),

    getMyDealership: builder.query<GetMyDealershipResponse, void>({
      query: () => "/passkeys/my-dealership",
      providesTags: ["MyDealership"],
    }),
  }),
});

export const {
  useCreatePasskeyMutation,
  useGetMyPasskeysQuery,
  useRevokePasskeyMutation,
  useGetLinkedSalesmenQuery,
  useUnlinkSalesmanMutation,
  useUsePasskeyMutation,
  useGetMyDealershipQuery,
} = passkeyApi;
