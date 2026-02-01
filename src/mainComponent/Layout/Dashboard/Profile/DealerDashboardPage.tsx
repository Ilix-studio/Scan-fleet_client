// src/pages/dashboard/DealerDashboardPage.tsx
import { Outlet, useLocation } from "react-router-dom";
import { useGetUserProfileQuery } from "@/redux-store/services/userAuthApi";
import {
  dealershipOwnerNavigation,
  dealershipSalesmanNavigation,
} from "../dashboardNavigation";
import DashboardSidebar from "../DashboardSidebar";
import DashboardLayout from "../DashboardLayout";

// Default content rendered when no child route matches
const DealerDashboardHome = ({ role }: { role: string }) => (
  <div className='space-y-6'>
    <div>
      <h1 className='text-3xl font-bold text-white mb-2'>
        {role === "DEALERSHIP_SALESMAN"
          ? "Salesman Dashboard"
          : "Dealership Management"}
      </h1>
      <p className='text-white/60'>
        {role === "DEALERSHIP_OWNER"
          ? "Manage your dealership operations and team"
          : "Process customer orders and manage delegations"}
      </p>
    </div>

    {role === "DEALERSHIP_OWNER" ? (
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
          <div className='text-white/60 text-sm mb-2'>Wallet Balance</div>
          <div className='text-3xl font-bold text-white'>0</div>
          <div className='text-cyan-400 text-xs mt-2'>tokens available</div>
        </div>
        <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
          <div className='text-white/60 text-sm mb-2'>Active Salesmen</div>
          <div className='text-3xl font-bold text-white'>0</div>
        </div>
        <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
          <div className='text-white/60 text-sm mb-2'>This Month</div>
          <div className='text-3xl font-bold text-white'>0</div>
          <div className='text-white/60 text-xs mt-2'>orders processed</div>
        </div>
        <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
          <div className='text-white/60 text-sm mb-2'>Total Revenue</div>
          <div className='text-3xl font-bold text-white'>₹0</div>
        </div>
      </div>
    ) : (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
          <div className='text-white/60 text-sm mb-2'>My Orders</div>
          <div className='text-3xl font-bold text-white'>0</div>
        </div>
        <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
          <div className='text-white/60 text-sm mb-2'>Pending Loads</div>
          <div className='text-3xl font-bold text-white'>0</div>
        </div>
        <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
          <div className='text-white/60 text-sm mb-2'>Available Tokens</div>
          <div className='text-3xl font-bold text-white'>0</div>
        </div>
      </div>
    )}
  </div>
);

export default function DealerDashboardPage() {
  const { data: profile, isLoading } = useGetUserProfileQuery();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black'>
        <div className='w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin' />
      </div>
    );
  }

  const navigation =
    profile?.role === "DEALERSHIP_SALESMAN"
      ? dealershipSalesmanNavigation
      : dealershipOwnerNavigation;

  // Show home content only on the base dashboard route
  const isBaseDashboard = location.pathname === "/dealer-dashboard";

  return (
    <DashboardLayout sidebar={<DashboardSidebar navigation={navigation} />}>
      {isBaseDashboard ? (
        <DealerDashboardHome role={profile?.role || ""} />
      ) : (
        <Outlet />
      )}
    </DashboardLayout>
  );
}
