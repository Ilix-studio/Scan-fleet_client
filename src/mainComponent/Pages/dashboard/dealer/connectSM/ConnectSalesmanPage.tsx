// src/pages/dashboard/WalletPage.tsx
import { useGetUserProfileQuery } from "@/redux-store/services/userAuthApi";

import DashboardLayout from "@/mainComponent/Layout/Dashboard/DashboardLayout";
import DashboardSidebar from "@/mainComponent/Layout/Dashboard/DashboardSidebar";

import {
  rentalOwnerNavigation,
  dealershipOwnerNavigation,
  dealershipSalesmanNavigation,
} from "@/mainComponent/Layout/Dashboard/dashboardNavigation";
import ConnectSales from "./ConnectSales";

const NAV_BY_ROLE: Record<string, typeof dealershipOwnerNavigation> = {
  DEALERSHIP_OWNER: dealershipOwnerNavigation,
  DEALERSHIP_SALESMAN: dealershipSalesmanNavigation,
  RENTAL_OWNER: rentalOwnerNavigation,
};

export default function ConnectSalesmanPage() {
  const { data: profile, isLoading } = useGetUserProfileQuery();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black'>
        <div className='w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin' />
      </div>
    );
  }

  const navigation =
    NAV_BY_ROLE[profile?.role ?? ""] ?? dealershipOwnerNavigation;

  return (
    <DashboardLayout sidebar={<DashboardSidebar navigation={navigation} />}>
      <ConnectSales />
    </DashboardLayout>
  );
}
