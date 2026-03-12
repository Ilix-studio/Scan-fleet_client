// src/mainComponent/routing/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/redux-store/slices/authSlice";
import {
  selectCurrentAdmin,
  selectIsAdminAuthenticated,
} from "@/redux-store/slices/adminAuthSlice";

export type RouteRole =
  | "DEALERSHIP_OWNER"
  | "DEALERSHIP_SALESMAN"
  | "RENTAL_OWNER"
  | "DIRECT_CUSTOMER"
  | "ADMIN"
  | "SUPER_ADMIN"
  | "ANY_USER" // any non-admin authenticated user
  | "ANY_AUTH"; // admin or user

export const ROLE_HOME_ROUTES: Record<string, string> = {
  DEALERSHIP_OWNER: "/dealer-dashboard",
  DEALERSHIP_SALESMAN: "/dealer-dashboard",
  RENTAL_OWNER: "/rental-dashboard",
  DIRECT_CUSTOMER: "/user-dashboard",
  ADMIN: "/admin-dashboard",
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Which role(s) may access this route.
   * Omit to allow any authenticated principal.
   */
  allowedRoles?: RouteRole | RouteRole[];
  /** Where to redirect unauthenticated visitors. Defaults to /login */
  loginPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  loginPath = "/login",
}) => {
  const location = useLocation();

  const isUserAuth = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const isAdminAuth = useSelector(selectIsAdminAuthenticated);
  const admin = useSelector(selectCurrentAdmin);

  const isAuthenticated = isUserAuth || isAdminAuth;

  // ── Not authenticated ──────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Navigate to={loginPath} state={{ from: location.pathname }} replace />
    );
  }

  // ── No role restriction ────────────────────────────────────────────────────
  if (!allowedRoles) return <>{children}</>;

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // ── Build effective role set for current principal ─────────────────────────
  const effectiveRoles = new Set<string>();

  if (isAdminAuth && admin) {
    effectiveRoles.add(admin.role); // "ADMIN" | "SUPER_ADMIN"
    effectiveRoles.add("ANY_AUTH");
  }

  if (isUserAuth && user) {
    effectiveRoles.add(user.role); // "DEALERSHIP_OWNER" | "DEALERSHIP_SALESMAN" | etc.
    effectiveRoles.add("ANY_USER");
    effectiveRoles.add("ANY_AUTH");
  }

  const allowed = roles.some((r) => effectiveRoles.has(r));

  if (allowed) return <>{children}</>;

  // ── Redirect to appropriate home on access denial ─────────────────────────
  const homeRoute = admin
    ? (ROLE_HOME_ROUTES[admin.role] ?? "/admin-dashboard")
    : user
      ? (ROLE_HOME_ROUTES[user.role] ?? "/")
      : "/";

  return <Navigate to={homeRoute} replace />;
};

export default ProtectedRoute;
