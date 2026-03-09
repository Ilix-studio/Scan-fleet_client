// src/config/dashboardNavigation.ts
import {
  Home,
  Wallet,
  ShoppingCart,
  Users,
  Key,
  FileText,
  TrendingUp,
  Package,
  Truck,
  UserPlus,
  Settings,
  BarChart3,
  LucideIcon,
  BadgeHelp,
  Blend,
  PhoneCall,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: string | number; // For showing notification counts or status indicators
  description?: string; // Helpful tooltips for complex features
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

// Each role gets its own navigation configuration
// This makes it incredibly easy to add, remove, or modify menu items for specific roles

export const dealershipOwnerNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: Home, path: "/dealer-dashboard" },
      {
        label: "What is Token?",
        icon: BadgeHelp,
        path: "/what-is-token",
      },
    ],
  },
  {
    title: "Token Management",
    items: [
      {
        label: "Wallet",
        icon: Wallet,
        path: "/wallet",
        description: "View balance and purchase tokens",
      },
      {
        label: "Purchase History",
        icon: ShoppingCart,
        path: "/purchase-history",
      },
      {
        label: "Token Usage",
        icon: TrendingUp,
        path: "/use-token",
      },
      {
        label: "Track Orders",
        icon: FileText,
        path: "/track-orders",
      },
    ],
  },

  {
    title: "Team Management",
    items: [
      {
        label: "Create Passkeys",
        icon: Users,
        path: "/create-passkeys",
        description: "Link passkeys for colleagues",
      },
      {
        label: "Connect Colleagues",
        icon: Key,
        path: "/connect-colleague",
        description: "Generate passkeys for colleagues",
      },
    ],
  },
  {
    title: "Other Features",
    items: [{ label: "Own number", icon: PhoneCall, path: "/own-number" }],
  },
];

export const dealershipSalesmanNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: Home, path: "/dealer-dashboard" },
      {
        label: "What is Token?",
        icon: BadgeHelp,
        path: "/what-is-token",
      },
    ],
  },
  {
    title: "Token Management",
    items: [
      {
        label: "Wallet",
        icon: Wallet,
        path: "/wallet",
        description: "View balance and purchase tokens",
      },
      {
        label: "Purchase History",
        icon: ShoppingCart,
        path: "/purchase-history",
      },
      {
        label: "Token Usage",
        icon: TrendingUp,
        path: "/use-token",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "My Orders",
        icon: FileText,
        path: "/dealer-dashboard/my-orders",
      },
      {
        label: "Delegations",
        icon: UserPlus,
        path: "/dealer-dashboard/received-loads",
        description: "Orders delegated to you",
      },
    ],
  },
  {
    title: "Dealership",
    items: [
      {
        label: "My Dealership",
        icon: Users,
        path: "/my-dealership",
        description: "View dealership info",
      },
      {
        label: "Shared Design",
        icon: Blend,
        path: "/dealer-dashboard/shared-design",
      },
    ],
  },
];

export const rentalOwnerNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: Home, path: "/rental-dashboard" },
      {
        label: "Analytics",
        icon: BarChart3,
        path: "/rental-dashboard/analytics",
      },
    ],
  },
  {
    title: "Fleet Management",
    items: [
      {
        label: "Vehicles",
        icon: Truck,
        path: "/rental-dashboard/vehicles",
        description: "Manage rental fleet",
      },
      {
        label: "Active Rentals",
        icon: Key,
        path: "/rental-dashboard/active-rentals",
      },
      {
        label: "QR Codes",
        icon: Package,
        path: "/rental-dashboard/qr-codes",
        description: "Dynamic QR management",
      },
    ],
  },
  {
    title: "Tokens",
    items: [
      { label: "Wallet", icon: Wallet, path: "/rental-dashboard/wallet" },
      {
        label: "Purchase History",
        icon: ShoppingCart,
        path: "/rental-dashboard/purchases",
      },
    ],
  },
];

export const directCustomerNavigation: NavigationSection[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", icon: Home, path: "/user-dashboard" }],
  },
  {
    title: "My Stickers",
    items: [
      {
        label: "Purchase Stickers",
        icon: ShoppingCart,
        path: "/user-dashboard/purchase",
        description: "Buy new stickers",
      },
      { label: "My Orders", icon: Package, path: "/user-dashboard/orders" },
      { label: "Track Order", icon: Truck, path: "/user-dashboard/track" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Settings", icon: Settings, path: "/user-dashboard/settings" },
      {
        label: "Caller History",
        icon: PhoneCall,
        path: "/user-dashboard/caller-display",
      },
    ],
  },
];
