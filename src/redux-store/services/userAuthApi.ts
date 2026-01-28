// redux-store/services/userAuthApi.ts
import { baseApi } from "./baseApi";
import {
  setCredentials,
  logout,
  UserRole,
  UserStatus,
} from "../slices/authSlice";

// Request types
interface EmailLoginRequest {
  email: string;
  password: string;
}

interface EmailSignupRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  role?: UserRole;
  businessName?: string;
  businessAddress?: string;
  gstNumber?: string;
}

interface GoogleAuthRequest {
  idToken: string;
}

interface UpdateRoleRequest {
  role: UserRole;
}

// Response types
interface UserData {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  lifetimeTokensPurchased: number;
  businessName?: string;
  walletBalance?: number;
  createdAt?: string;
  lastLogin?: string;
}

interface AuthResponse {
  token: string;
  user: UserData;
}

interface ProfileResponse {
  success: boolean;
  user: UserData;
}

interface UpdateRoleResponse {
  success: boolean;
  user: UserData;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

export const userAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Google OAuth
    userGoogleAuth: builder.mutation<AuthResponse, GoogleAuthRequest>({
      query: (body) => ({
        url: "/user-auth/google",
        method: "POST",
        body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, token: data.token }));
        } catch {}
      },
      invalidatesTags: ["User"],
    }),

    // Email/Password Login
    userLogin: builder.mutation<AuthResponse, EmailLoginRequest>({
      query: (body) => ({
        url: "/user-auth/login",
        method: "POST",
        body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, token: data.token }));
        } catch {}
      },
      invalidatesTags: ["User"],
    }),

    // Email/Password Signup
    userSignup: builder.mutation<AuthResponse, EmailSignupRequest>({
      query: (body) => ({
        url: "/user-auth/signup",
        method: "POST",
        body,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, token: data.token }));
        } catch {}
      },
      invalidatesTags: ["User"],
    }),

    // Logout
    userLogout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/user-auth/logout",
        method: "POST",
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
        }
      },
      // Don't retry on 401
      extraOptions: {
        retry: false,
      },
      invalidatesTags: ["User"],
    }),

    // Get Profile
    getUserProfile: builder.query<UserData, void>({
      query: () => "/user-auth/me",
      transformResponse: (response: ProfileResponse) => response.user,
      providesTags: ["User"],
    }),

    // Update Role
    updateUserRole: builder.mutation<UpdateRoleResponse, UpdateRoleRequest>({
      query: (body) => ({
        url: "/user-auth/role",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useUserGoogleAuthMutation,
  useUserLoginMutation,
  useUserSignupMutation,
  useUserLogoutMutation,
  useGetUserProfileQuery,
  useUpdateUserRoleMutation,
} = userAuthApi;
