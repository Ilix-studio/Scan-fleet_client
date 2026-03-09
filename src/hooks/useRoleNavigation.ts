// src/hooks/useRoleNavigation.ts
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/redux-store/slices/authSlice";
import {
  selectCurrentAdmin,
  selectIsAdminAuthenticated,
} from "@/redux-store/slices/adminAuthSlice";
import { ROLE_HOME_ROUTES } from "@/config/ProtectedRoute";

export const useRoleNavigation = () => {
  const navigate = useNavigate();

  const isUserAuth = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const isAdminAuth = useSelector(selectIsAdminAuthenticated);
  const admin = useSelector(selectCurrentAdmin);

  const homeRoute: string = (() => {
    if (isAdminAuth && admin)
      return ROLE_HOME_ROUTES[admin.role] ?? "/admin-dashboard";
    if (isUserAuth && user) return ROLE_HOME_ROUTES[user.role] ?? "/";
    return "/";
  })();

  const navigateByRole = useCallback(
    (fallback?: string) => {
      navigate(fallback ?? homeRoute, { replace: true });
    },
    [navigate, homeRoute],
  );

  return { navigateByRole, homeRoute };
};
