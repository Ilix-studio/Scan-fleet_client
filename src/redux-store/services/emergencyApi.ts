// replace entire emergencyApi.ts
import { baseApi } from "./baseApi";

export interface EmergencyData {
  maskedOwnerNumber: string;
  emergency1: string;
  emergency2: string;
  dealerNumber: string;
  vehicleInfo?: {
    registrationNumber?: string;
    model?: string;
    color?: string;
    year?: number;
  };
  dealerName: string | null;
  businessName: string | null;
  activatedAt: string;
}

export interface EmergencyPageResponse {
  success: boolean;
  activated: boolean;
  attachCode: string;
  data: EmergencyData | null;
}

export const emergencyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmergencyData: builder.query<EmergencyPageResponse, string>({
      query: (identifier) => `/emergency/${identifier}`,
    }),
  }),
  overrideExisting: false,
});

export const { useGetEmergencyDataQuery } = emergencyApi;
