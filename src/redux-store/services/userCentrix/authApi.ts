// redux-store/services/authApi.ts

import { setCredentials } from "@/redux-store/slices/authSlice";
import { baseApi } from "../baseApi";

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  userType: "dealer" | "common";
  dealerInfo?: {
    companyName: string;
    gstNumber: string;
    address: string;
  };
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    userType: "dealer" | "common";
    dealerId?: string;
    tokensAvailable: number;
    createdAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      // Automatically update auth state on success
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (err) {
          // Error handling done in component
        }
      },
      invalidatesTags: ["User"],
    }),

    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (err) {
          // Error handling done in component
        }
      },
      invalidatesTags: ["User"],
    }),

    // Passkey authentication
    passkeyChallenge: builder.mutation<
      { challenge: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/auth/passkey/challenge",
        method: "POST",
        body,
      }),
    }),

    passkeyVerify: builder.mutation<
      AuthResponse,
      { email: string; credential: any }
    >({
      query: (body) => ({
        url: "/auth/passkey/verify",
        method: "POST",
        body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (err) {
          // Error handling done in component
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  usePasskeyChallengeMutation,
  usePasskeyVerifyMutation,
  useLogoutMutation,
} = authApi;
