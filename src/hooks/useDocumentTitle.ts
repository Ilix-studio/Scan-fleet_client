// hooks/useDocumentTitle.ts
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ROUTE_TITLES: Record<string, string> = {
  "/": "ScanFleet – Vehicle Safety Platform",
  "/login": "Login | ScanFleet",
  "/signup": "Sign Up | ScanFleet",
  "/dealer-dashboard": "Dealer Dashboard | ScanFleet",
  "/rental-dashboard": "Rental Dashboard | ScanFleet",
  "/user-dashboard": "User Dashboard | ScanFleet",
  "/admin-dashboard": "Admin | ScanFleet",
  "/wallet": "Wallet | ScanFleet",
  "/what-is-token": "Purchase Tokens | ScanFleet",
  "/purchase-history": "Purchase History | ScanFleet",
  "/use-token": "Token Usage | ScanFleet",
  "/sticker-editor": "Sticker Editor | ScanFleet",
  "/sticker-select": "Select Sticker | ScanFleet",
  "/fill-details": "Fill Details | ScanFleet",
  "/create-passkeys": "Create Passkey | ScanFleet",
  "/connect-colleague": "Connect Salesman | ScanFleet",
  "/my-dealership": "My Dealership | ScanFleet",
  "/api-reference": "API Reference | ScanFleet",
  "/settings": "Settings | ScanFleet",
  "/admin-login": "Admin Login | ScanFleet",
  "/admin-create-tags": "Create Tags | ScanFleet",
  "/sticker-style": "Sticker Style | ScanFleet",
};

const DEFAULT_TITLE = "ScanFleet";

export function useDocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Exact match first, then prefix match for nested routes
    const title =
      ROUTE_TITLES[pathname] ??
      Object.entries(ROUTE_TITLES).find(
        ([route]) => pathname.startsWith(route) && route !== "/",
      )?.[1] ??
      DEFAULT_TITLE;

    document.title = title;
  }, [pathname]);
}
