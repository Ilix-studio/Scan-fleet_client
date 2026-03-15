import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { Guard, AuthGuard, PageLoader } from "@/config/Guards";

// ── Eagerly loaded ─────────────────────────────────────────────────────────────
// Home: landing page — must be instant, no lazy penalty.
// Emergency page (QR scan entry): most latency-critical bystander flow —
// import eagerly so it renders without waiting for any JS chunk download.
import Home from "@/mainComponent/Home/Home";
import GetAllAcPage from "./mainComponent/Layout/Admin/Wrapper/GetAllAcPage";

// ── Lazy loaded ───────────────────────────────────────────────────────────────
// Auth
const Login = lazy(() => import("@/mainComponent/Pages/auth/Login"));
const Signup = lazy(() => import("@/mainComponent/Pages/auth/Signup"));
const AdminLogin = lazy(
  () => import("@/mainComponent/Layout/Admin/AdminLogin"),
);
const NotFound = lazy(() => import("@/mainComponent/Home/NotFound"));
const ApiDocs = lazy(() => import("@/mainComponent/Layout/External/APIDocs"));

// Role dashboards
const UserDashboardPage = lazy(
  () => import("@/mainComponent/Layout/Dashboard/Profile/UserDashboardPage"),
);
const DealerDashboardPage = lazy(
  () => import("@/mainComponent/Layout/Dashboard/Profile/DealerDashboardPage"),
);
const RentalDashboardPage = lazy(
  () => import("@/mainComponent/Layout/Dashboard/Profile/RentalDashboardPage"),
);
const AdminDashboardPage = lazy(
  () => import("@/mainComponent/Layout/Admin/Wrapper/AdminDashboardPage"),
);

const AdminDispatchPage = lazy(
  () => import("@/mainComponent/Layout/Admin/Wrapper/AdminDispatchPage"),
);
const GetPrintPage = lazy(
  () => import("@/mainComponent/Layout/Admin/Wrapper/GetPrintPage"),
);

// Shared authenticated
const SettingsPage = lazy(
  () => import("@/mainComponent/Layout/Dashboard/SettingPage"),
);
const WalletPage = lazy(
  () => import("@/mainComponent/Pages/dashboard/shared/WalletPage"),
);
const TokenDisplayPage = lazy(
  () => import("@/mainComponent/Pages/dashboard/shared/TokenDisplayPage"),
);
const PurchaseHistoryPage = lazy(
  () => import("@/mainComponent/Pages/dashboard/shared/PurchaseHistoryPage"),
);
const UseTokenPage = lazy(
  () => import("@/mainComponent/Pages/dashboard/shared/UseTokenPage"),
);
const TrackOrderPage = lazy(
  () => import("@/mainComponent/Pages/dashboard/shared/TrackOrderPage"),
);

// Sticker flow
const StickerStyle = lazy(
  () => import("@/mainComponent/Features/ProductCard/StickerStyle"),
);
const StickerProduct = lazy(
  () => import("@/mainComponent/Pages/sticker/StickerProduct"),
);
const StickerEditor = lazy(
  () => import("@/mainComponent/Features/StickerEditor"),
);
const FillDetails = lazy(
  () => import("@/mainComponent/Pages/sticker/FillDetails"),
);

// Dealer-specific
const CreatePasskeyPage = lazy(
  () =>
    import("@/mainComponent/Pages/dashboard/dealer/createP/CreatePasskeyPage"),
);
const ConnectSalesmanPage = lazy(
  () =>
    import("@/mainComponent/Pages/dashboard/dealer/connectSM/ConnectSalesmanPage"),
);
const MyDealershipPage = lazy(
  () =>
    import("@/mainComponent/Pages/dashboard/dealer/salesman/MyDealershipPage"),
);

// ─────────────────────────────────────────────────────────────────────────────

export const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* ── Public ─────────────────────────────────────────────────────────── */}
      <Route path='/' element={<Home />} />
      <Route path='/api-reference' element={<ApiDocs />} />

      {/* ── Auth — redirect if already authenticated ────────────────────────── */}
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

      {/* ── Admin ───────────────────────────────────────────────────────────── */}
      <Route
        element={
          <Guard roles={["ADMIN", "SUPER_ADMIN"]} loginPath='/admin-login' />
        }
      >
        <Route path='/admin-dashboard' element={<AdminDashboardPage />} />
        <Route path='/admin-dispatch' element={<AdminDispatchPage />} />
        <Route path='/get-print-sheet' element={<GetPrintPage />} />
        <Route path='/get-all-ac' element={<GetAllAcPage />} />
      </Route>

      {/* ── Role dashboards ─────────────────────────────────────────────────── */}
      <Route element={<Guard roles='DIRECT_CUSTOMER' />}>
        <Route path='/user-dashboard' element={<UserDashboardPage />} />
      </Route>

      <Route
        element={<Guard roles={["DEALERSHIP_OWNER", "DEALERSHIP_SALESMAN"]} />}
      >
        <Route path='/dealer-dashboard' element={<DealerDashboardPage />} />
      </Route>

      <Route element={<Guard roles='RENTAL_OWNER' />}>
        <Route path='/rental-dashboard' element={<RentalDashboardPage />} />
      </Route>

      {/* ── Dealer-specific ─────────────────────────────────────────────────── */}
      <Route
        element={<Guard roles={["DEALERSHIP_OWNER", "DEALERSHIP_SALESMAN"]} />}
      >
        <Route path='/create-passkeys' element={<CreatePasskeyPage />} />
        <Route path='/my-dealership' element={<MyDealershipPage />} />
      </Route>

      {/* Only DEALERSHIP_OWNER can invite colleagues */}
      <Route element={<Guard roles='DEALERSHIP_OWNER' />}>
        <Route path='/connect-colleague' element={<ConnectSalesmanPage />} />
      </Route>

      {/* ── Wallet / Token — DIRECT_CUSTOMER excluded ───────────────────────── */}
      {/*
        DIRECT_CUSTOMER pays per sticker via direct order flow.
        Accessing these routes as DIRECT_CUSTOMER redirects to /user-dashboard.
      */}
      <Route
        element={
          <Guard
            roles={["DEALERSHIP_OWNER", "DEALERSHIP_SALESMAN", "RENTAL_OWNER"]}
          />
        }
      >
        <Route path='/wallet' element={<WalletPage />} />
        <Route path='/what-is-token' element={<TokenDisplayPage />} />
        <Route path='/use-token' element={<UseTokenPage />} />
      </Route>

      {/* ── Shared authenticated (all non-admin roles) ──────────────────────── */}
      <Route element={<Guard roles='ANY_USER' />}>
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/purchase-history' element={<PurchaseHistoryPage />} />
        <Route path='/track-orders' element={<TrackOrderPage />} />
      </Route>

      {/* ── Sticker flow (any authenticated principal) ──────────────────────── */}
      <Route element={<Guard roles='ANY_AUTH' />}>
        <Route path='/sticker-style' element={<StickerStyle />} />
        <Route path='/sticker-select' element={<StickerProduct />} />
        <Route path='/sticker-editor' element={<StickerEditor />} />
        <Route path='/fill-details' element={<FillDetails />} />
      </Route>

      {/* ── Fallback ────────────────────────────────────────────────────────── */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  </Suspense>
);
