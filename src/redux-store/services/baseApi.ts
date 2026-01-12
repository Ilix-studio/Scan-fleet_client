// redux-store/services/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryApi } from "@reduxjs/toolkit/query";
import { logout, refreshAccessToken } from "../slices/authSlice";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

interface StateWithAuth {
  auth: AuthState;
}

export const API_CONFIG = {
  BASE_URL: "https://scanfleet-server-196058146900.europe-west1.run.app/api",
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as StateWithAuth;
    const token = state.auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

const baseQueryWithReauth = async (
  args: Parameters<typeof baseQuery>[0],
  api: BaseQueryApi,
  extraOptions: Parameters<typeof baseQuery>[2]
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState() as StateWithAuth;
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const responseData = refreshResult.data as { accessToken: string };
        api.dispatch(refreshAccessToken(responseData.accessToken));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const handleApiError = (error: any): string => {
  if (error.status === "FETCH_ERROR") {
    return "Network error. Please check your connection and try again.";
  }
  if (error.data?.message) {
    return error.data.message;
  }
  return "An unexpected error occurred. Please try again later.";
};

export const baseApi = createApi({
  reducerPath: "scanfleet-api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Token", "Sticker", "Purchase", "Analytics", "ApiAccount"],
  endpoints: () => ({}),
});
