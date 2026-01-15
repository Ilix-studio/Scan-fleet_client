// redux-store/services/userAuthApi.ts (corrected userGoogleAuth mutation)
import { baseApi } from "./baseApi";
import { setCredentials, logout } from "../slices/authSlice";

interface UserLoginRequest {
  idToken: string;
}

interface UserSignupRequest {
  idToken: string;
  name?: string;
  phone?: string;
}

interface GoogleAuthRequest {
  idToken: string;
}

interface UserAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role:
      | "DEALERSHIP_OWNER"
      | "DEALERSHIP_SALESMAN"
      | "RENTAL_OWNER"
      | "DIRECT_CUSTOMER";
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  };
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role:
    | "DEALERSHIP_OWNER"
    | "DEALERSHIP_SALESMAN"
    | "RENTAL_OWNER"
    | "DIRECT_CUSTOMER";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  walletBalance: number;
  lifetimeTokensPurchased: number;
  lifetimeTokensUsed: number;
  createdAt: string;
}

interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}

interface UpdateRoleRequest {
  role:
    | "DEALERSHIP_OWNER"
    | "DEALERSHIP_SALESMAN"
    | "RENTAL_OWNER"
    | "DIRECT_CUSTOMER";
}

export const userAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // FIXED: Changed from void to GoogleAuthRequest
    userGoogleAuth: builder.mutation<UserAuthResponse, GoogleAuthRequest>({
      query: (credentials) => ({
        url: "/user-auth/google",
        method: "POST",
        body: credentials, // Send idToken in request body
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                phone: data.user.phone,
                userType: "common",
                tokensAvailable: 0,
                createdAt: "",
              },
              accessToken: data.token,
              refreshToken: data.token,
            })
          );
        } catch (err) {
          // Error handling in component
        }
      },
      invalidatesTags: ["User"],
    }),

    userLogin: builder.mutation<UserAuthResponse, UserLoginRequest>({
      query: (credentials) => ({
        url: "/user-auth/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                phone: data.user.phone,
                userType: "common",
                tokensAvailable: 0,
                createdAt: "",
              },
              accessToken: data.token,
              refreshToken: data.token,
            })
          );
        } catch (err) {
          // Error handling in component
        }
      },
      invalidatesTags: ["User"],
    }),

    userSignup: builder.mutation<UserAuthResponse, UserSignupRequest>({
      query: (data) => ({
        url: "/user-auth/signup",
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                phone: data.user.phone,
                userType: "common",
                tokensAvailable: 0,
                createdAt: "",
              },
              accessToken: data.token,
              refreshToken: data.token,
            })
          );
        } catch (err) {
          // Error handling in component
        }
      },
      invalidatesTags: ["User"],
    }),

    userLogout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/user-auth/logout",
        method: "POST",
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (err) {
          dispatch(logout());
        }
      },
      invalidatesTags: ["User"],
    }),

    getUserProfile: builder.query<UserProfile, void>({
      query: () => "/user-auth/me",
      providesTags: ["User"],
    }),

    updateUserProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (data) => ({
        url: "/user-auth/profile",
        method: "PATCH",
        body: data,
      }),
      onQueryStarted: async (updates, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          userAuthApi.util.updateQueryData(
            "getUserProfile",
            undefined,
            (draft) => {
              Object.assign(draft, updates);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["User"],
    }),

    updateUserRole: builder.mutation<UserAuthResponse, UpdateRoleRequest>({
      query: (data) => ({
        url: "/user-auth/role",
        method: "PATCH",
        body: data,
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
  useUpdateUserProfileMutation,
  useUpdateUserRoleMutation,
} = userAuthApi;
