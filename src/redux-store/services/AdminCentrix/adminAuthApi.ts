// src/redux-store/services/AdminCentrix/adminAuthApi.ts
import { setAdminCredentials } from "@/redux-store/slices/adminAuthSlice";
import { baseApi } from "../baseApi";

interface AdminLoginRequest {
  email: string;
  password: string;
}

interface AdminAuthResponse {
  token: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: "SUPER_ADMIN";
  };
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN";
  isActive: boolean;
  lastLogin?: string;
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
          console.error("Login error:", err);
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
      query: ({ page = 1, limit = 10 }) =>
        `/admin-auth/get-all-users?page=${page}&limit=${limit}`,
      providesTags: ["Admin"],
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useGetCurrentAdminQuery,
  useGetAllUsersQuery,
} = adminAuthApi;
