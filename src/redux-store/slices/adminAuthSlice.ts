// redux-store/slices/adminAuthSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Admin {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN";
}

export interface AdminAuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AdminAuthState = {
  admin: null,
  token: null,
  isAuthenticated: false,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminCredentials: (
      state,
      action: PayloadAction<{ admin: Admin; token: string }>
    ) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    adminLogout: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAdminCredentials, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;

export const selectCurrentAdmin = (state: { adminAuth: AdminAuthState }) =>
  state.adminAuth.admin;
export const selectIsAdminAuthenticated = (state: {
  adminAuth: AdminAuthState;
}) => state.adminAuth.isAuthenticated;
export const selectAdminToken = (state: { adminAuth: AdminAuthState }) =>
  state.adminAuth.token;
