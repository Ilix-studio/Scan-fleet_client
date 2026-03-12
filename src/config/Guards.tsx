import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectIsAuthenticated,
  selectCurrentUser,
} from "@/redux-store/slices/authSlice";
import {
  selectIsAdminAuthenticated,
  selectCurrentAdmin,
} from "@/redux-store/slices/adminAuthSlice";

import ProtectedRoute, {
  ROLE_HOME_ROUTES,
  RouteRole,
} from "@/config/ProtectedRoute";

// ── Full-page spinner shown while lazy chunks download ────────────────────────
export const PageLoader = () => (
  <div className='min-h-screen flex items-center justify-center bg-black'>
    <div className='w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin' />
  </div>
);

// ── Pathless layout route: enforces auth + role, renders children via <Outlet> ─
export const Guard = ({
  roles,
  loginPath,
}: {
  roles?: RouteRole | RouteRole[];
  loginPath?: string;
}) => (
  <ProtectedRoute allowedRoles={roles} loginPath={loginPath}>
    <Outlet />
  </ProtectedRoute>
);

// ── Redirects already-authenticated users away from login/signup pages ─────────
export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isUserAuth = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const isAdminAuth = useSelector(selectIsAdminAuthenticated);
  const admin = useSelector(selectCurrentAdmin);

  if (isAdminAuth && admin) {
    return (
      <Navigate
        to={ROLE_HOME_ROUTES[admin.role] ?? "/admin-dashboard"}
        replace
      />
    );
  }
  if (isUserAuth && user) {
    return <Navigate to={ROLE_HOME_ROUTES[user.role] ?? "/"} replace />;
  }
  return <>{children}</>;
};
