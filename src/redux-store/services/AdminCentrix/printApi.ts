// src/redux-store/services/AdminCentrix/printApi.ts
import { baseApi } from "../baseApi";

export const printApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    downloadPrintSheet: builder.query<Blob, string>({
      query: (tokenId) => ({
        url: `/print/sheet/${tokenId}`,
        responseHandler: (response) => response.blob(),
        cache: "no-cache",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLazyDownloadPrintSheetQuery } = printApi;
