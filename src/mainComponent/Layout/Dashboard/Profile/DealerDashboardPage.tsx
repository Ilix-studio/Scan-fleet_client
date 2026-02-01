// src/pages/dashboard/DealerDashboardPage.tsx
import { useGetUserProfileQuery } from "@/redux-store/services/userAuthApi";
import {
  dealershipOwnerNavigation,
  dealershipSalesmanNavigation,
} from "../dashboardNavigation";
import DashboardSidebar from "../DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "../DashboardLayout";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export default function DealerDashboardPage() {
  const { data: profile, isLoading } = useGetUserProfileQuery();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black'>
        <div className='w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin' />
      </div>
    );
  }

  // This is a beautiful example of role-based rendering
  // We select the appropriate navigation based on whether they're an owner or salesman
  const navigation =
    profile?.role === "DEALERSHIP_OWNER"
      ? dealershipOwnerNavigation
      : dealershipSalesmanNavigation;

  const dashboardTitle =
    profile?.role === "DEALERSHIP_OWNER"
      ? "Dealership Management"
      : "Salesman Dashboard";

  return (
    <DashboardLayout sidebar={<DashboardSidebar navigation={navigation} />}>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold text-white mb-2'>
            {dashboardTitle}
          </h1>
          <p className='text-white/60'>
            {profile?.role === "DEALERSHIP_OWNER"
              ? "Manage your dealership operations and team"
              : "Process customer orders and manage delegations"}
          </p>
        </div>

        {/* Role-specific dashboard content */}
        {profile?.role === "DEALERSHIP_OWNER" ? (
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='text-white/60 text-sm mb-2'>Wallet Balance</div>
              <div className='text-3xl font-bold text-white'>
                {profile.walletBalance}
              </div>
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
              <div className='text-3xl font-bold text-white'>
                {profile?.walletBalance || 0}
              </div>
            </div>
          </div>
        )}
        {/* Token Wallet Card */}
        <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-white'>
              <Wallet size={24} className='text-cyan-400' />
              Token Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='md:col-span-2'>
                <div className='bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-cyan-400/30 space-y-4'>
                  <div className='space-y-2'>
                    <p className='text-white/60 text-sm'>Available Balance</p>
                    <p className='text-4xl font-bold text-white'>45 Tokens</p>
                  </div>
                  <p className='text-sm text-white/60'>₹13,500 value</p>
                </div>
              </div>
              <div className='space-y-2'>
                <Button className='w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0'>
                  Buy Tokens
                </Button>
                <Button
                  variant='outline'
                  className='w-full border-white/20 text-white hover:bg-white/10 bg-transparent'
                >
                  Token History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
