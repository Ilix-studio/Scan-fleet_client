// redux-store/services/adminAuthApi.ts (update with onQueryStarted)

import { setAdminCredentials } from "@/redux-store/slices/adminAuthSlice";
import { baseApi } from "../baseApi";

interface AdminLoginRequest {
  email: string;
  password: string;
}

interface AdminSignupRequest {
  email: string;
  password: string;
  name: string;
}

interface AdminAuthResponse {
  token: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN";
  };
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
  isActive: boolean;
  firebaseUid: string;
  createdAt: string;
  updatedAt: string;
}

interface GetUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminGoogleAuth: builder.mutation<AdminAuthResponse, void>({
      query: () => ({
        url: "/admin-auth/google",
        method: "POST",
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAdminCredentials(data));
        } catch (err) {
          // Error handling in component
        }
      },
      invalidatesTags: ["Admin"],
    }),

    adminLogin: builder.mutation<AdminAuthResponse, AdminLoginRequest>({
      query: (credentials) => ({
        url: "/admin-auth/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAdminCredentials(data));
        } catch (err) {
          // Error handling in component
        }
      },
      invalidatesTags: ["Admin"],
    }),

    adminSignup: builder.mutation<AdminAuthResponse, AdminSignupRequest>({
      query: (data) => ({
        url: "/admin-auth/signup",
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAdminCredentials(data));
        } catch (err) {
          // Error handling in component
        }
      },
      invalidatesTags: ["Admin"],
    }),

    adminLogout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/admin-auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Admin"],
    }),

    getCurrentAdmin: builder.query<AdminAuthResponse["admin"], void>({
      query: () => "/admin-auth/me",
      providesTags: ["Admin"],
    }),

    getAllUsers: builder.query<
      GetUsersResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        return `/admin-auth/get-all-users?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useAdminGoogleAuthMutation,
  useAdminLoginMutation,
  useAdminSignupMutation,
  useAdminLogoutMutation,
  useGetCurrentAdminQuery,
  useGetAllUsersQuery,
} = adminAuthApi;
