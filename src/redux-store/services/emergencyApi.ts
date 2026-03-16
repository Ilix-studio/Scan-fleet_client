// emergencyApi.ts
import { baseApi } from "./baseApi";

export interface EmergencyData {
  dealerName: string | null;
  maskedOwnerNumber: string;
  emergency1: string;
  emergency2: string;
  dealerNumber: string;
  vehicleInfo?: {
    registrationNumber: string;
    model?: string;
    color?: string;
    year?: number;
  };
  activatedAt: string;
}

export const emergencyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmergencyData: builder.query<EmergencyData, string>({
      query: (identifier) => `/emergency/${identifier}`,
      transformResponse: (res: { success: boolean; data: EmergencyData }) =>
        res.data,
    }),
  }),
  overrideExisting: false,
});

export const { useGetEmergencyDataQuery } = emergencyApi;
