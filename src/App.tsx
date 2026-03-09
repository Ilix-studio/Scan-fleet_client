// src/App.tsx
import { Route, Routes, useLocation, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

import {
  selectIsAuthenticated,
  selectCurrentUser,
} from "@/redux-store/slices/authSlice";
import {
  selectIsAdminAuthenticated,
  selectCurrentAdmin,
} from "@/redux-store/slices/adminAuthSlice";

// Public / Auth pages
import Home from "./mainComponent/Home/Home";
import Signup from "./mainComponent/Pages/auth/Signup";
import Login from "./mainComponent/Pages/auth/Login";
import AdminLogin from "./mainComponent/Layout/Admin/AdminLogin";
import NotFound from "./mainComponent/Home/NotFound";
import ApiDocs from "./mainComponent/Layout/External/APIDocs";

// Role dashboards
import UserDashboardPage from "./mainComponent/Layout/Dashboard/Profile/UserDashboardPage";
import DealerDashboardPage from "./mainComponent/Layout/Dashboard/Profile/DealerDashboardPage";
import RentalDashboardPage from "./mainComponent/Layout/Dashboard/Profile/RentalDashboardPage";
import AdminDashboardPage from "./mainComponent/Layout/Admin/AdminDashboardPage";

// Admin-only pages
import AdminCreateTags from "./mainComponent/Layout/Admin/AdminCreateTags";

// Shared authenticated pages
import WalletPage from "./mainComponent/Pages/dashboard/shared/WalletPage";
import TokenDisplayPage from "./mainComponent/Pages/dashboard/shared/TokenDisplayPage";
import PurchaseHistoryPage from "./mainComponent/Pages/dashboard/shared/PurchaseHistoryPage";
import UseTokenPage from "./mainComponent/Pages/dashboard/shared/UseTokenPage";
import SettingsPage from "./mainComponent/Layout/Dashboard/SettingPage";

// Sticker flow
import StickerStyle from "./mainComponent/Features/ProductCard/StickerStyle";
import StickerProduct from "./mainComponent/Pages/sticker/StickerProduct";
import StickerEditor from "./mainComponent/Features/StickerEditor";
import FillDetails from "./mainComponent/Pages/sticker/FillDetails";

// Dealer-specific pages
import CreatePasskeyPage from "./mainComponent/Pages/dashboard/dealer/createP/CreatePasskeyPage";
import ConnectSalesmanPage from "./mainComponent/Pages/dashboard/dealer/connectSM/ConnectSalesmanPage";
import MyDealershipPage from "./mainComponent/Pages/dashboard/dealer/salesman/MyDealershipPage";
import ProtectedRoute, {
  ROLE_HOME_ROUTES,
  RouteRole,
} from "./config/ProtectedRoute";

import TrackOrderPage from "./mainComponent/Pages/dashboard/shared/TrackOrderPage";

// ── Layout route guard ─────────────────────────────────────────────────────────
// Pathless parent route — just enforces auth/role, renders children via <Outlet>.
const Guard = ({
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

// ── Bounce authenticated users away from login pages ──────────────────────────
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Toaster
        position='top-right'
        reverseOrder={false}
        gutter={8}
        containerStyle={{ top: 20, left: 20, bottom: 20, right: 20 }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#363636",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow:
              "0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)",
            fontSize: "14px",
            maxWidth: "420px",
            padding: "12px 16px",
            fontFamily: "system-ui,-apple-system,sans-serif",
          },
          success: {
            duration: 4000,
            iconTheme: { primary: "#10b981", secondary: "#fff" },
            style: {
              border: "1px solid #10b981",
              background: "#f0fdf4",
              color: "#065f46",
            },
          },
          error: {
            duration: 5000,
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
            style: {
              border: "1px solid #ef4444",
              background: "#fef2f2",
              color: "#991b1b",
            },
          },
          loading: {
            duration: Infinity,
            style: {
              border: "1px solid #3b82f6",
              background: "#eff6ff",
              color: "#1e40af",
            },
          },
        }}
      />

      <Routes>
        {/* ── Public ─────────────────────────────────────────────────────── */}
        <Route path='/' element={<Home />} />
        <Route path='/api-reference' element={<ApiDocs />} />

        {/* ── Auth pages (bounce if already authenticated) ────────────────── */}
        <Route
          path='/login'
          element={
            <AuthGuard>
              <Login />
            </AuthGuard>
          }
        />
        <Route
          path='/signup'
          element={
            <AuthGuard>
              <Signup />
            </AuthGuard>
          }
        />
        <Route
          path='/admin-login'
          element={
            <AuthGuard>
              <AdminLogin />
            </AuthGuard>
          }
        />

        {/* ── Admin ───────────────────────────────────────────────────────── */}
        <Route
          element={
            <Guard roles={["ADMIN", "SUPER_ADMIN"]} loginPath='/admin-login' />
          }
        >
          <Route path='/admin-dashboard' element={<AdminDashboardPage />} />
          <Route path='/admin-create-tags' element={<AdminCreateTags />} />
        </Route>

        {/* ── Role dashboards ─────────────────────────────────────────────── */}
        <Route element={<Guard roles='DIRECT_CUSTOMER' />}>
          <Route path='/user-dashboard' element={<UserDashboardPage />} />
        </Route>

        <Route
          element={
            <Guard roles={["DEALERSHIP_OWNER", "DEALERSHIP_SALESMAN"]} />
          }
        >
          <Route path='/dealer-dashboard' element={<DealerDashboardPage />} />
        </Route>

        <Route element={<Guard roles='RENTAL_OWNER' />}>
          <Route path='/rental-dashboard' element={<RentalDashboardPage />} />
        </Route>

        {/* ── Dealer-specific ─────────────────────────────────────────────── */}
        <Route
          element={
            <Guard roles={["DEALERSHIP_OWNER", "DEALERSHIP_SALESMAN"]} />
          }
        >
          <Route path='/create-passkeys' element={<CreatePasskeyPage />} />
          <Route path='/my-dealership' element={<MyDealershipPage />} />
        </Route>

        <Route element={<Guard roles='DEALERSHIP_OWNER' />}>
          <Route path='/connect-colleague' element={<ConnectSalesmanPage />} />
        </Route>

        {/* ── Shared user routes (any non-admin authenticated user) ────────── */}
        <Route element={<Guard roles='ANY_USER' />}>
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='/wallet' element={<WalletPage />} />
          <Route path='/what-is-token' element={<TokenDisplayPage />} />
          <Route path='/purchase-history' element={<PurchaseHistoryPage />} />
          <Route path='/use-token' element={<UseTokenPage />} />
        </Route>

        {/* ── Sticker flow (any authenticated principal) ───────────────────── */}
        <Route element={<Guard roles='ANY_AUTH' />}>
          <Route path='/sticker-style' element={<StickerStyle />} />
          <Route path='/sticker-select' element={<StickerProduct />} />
          <Route path='/sticker-editor' element={<StickerEditor />} />
          <Route path='/fill-details' element={<FillDetails />} />
          <Route path='/track-orders' element={<TrackOrderPage />} />
        </Route>

        {/* ── Fallback ────────────────────────────────────────────────────── */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
