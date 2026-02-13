// src/pages/dashboard/DealerDashboardPage.tsx

import { useGetUserProfileQuery } from "@/redux-store/services/userAuthApi";
import {
  dealershipOwnerNavigation,
  dealershipSalesmanNavigation,
} from "../dashboardNavigation";
import DashboardSidebar from "../DashboardSidebar";
import DashboardLayout from "../DashboardLayout";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Users,
  Package,
  TrendingUp,
  Key,
  Plus,
  ArrowRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DealerDashboardPage() {
  const { data: profile, isLoading } = useGetUserProfileQuery();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black'>
        <div className='w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin' />
      </div>
    );
  }

  const isOwner = profile?.role === "DEALERSHIP_OWNER";
  const navigation = isOwner
    ? dealershipOwnerNavigation
    : dealershipSalesmanNavigation;

  return (
    <DashboardLayout sidebar={<DashboardSidebar navigation={navigation} />}>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-white mb-2'>
            {isOwner ? "Dealership Management" : "Salesman Dashboard"}
          </h1>
          <p className='text-white/60'>
            {isOwner
              ? "Manage your dealership operations and team"
              : "Process customer orders and manage delegations"}
          </p>
        </div>

        {isOwner ? (
          <OwnerDashboard profile={profile} />
        ) : (
          <SalesmanDashboard profile={profile} />
        )}
      </div>
    </DashboardLayout>
  );
}

function OwnerDashboard({ profile }: { profile: any }) {
  const walletBalance = profile?.walletBalance ?? 0;

  return (
    <>
      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <StatCard
          label='Wallet Balance'
          value={walletBalance}
          subtext='tokens available'
          icon={<Wallet className='text-cyan-400' size={20} />}
          highlight
        />

        <StatCard
          label='This Month'
          value={profile?.lifetimeTokensUsed ?? 0}
          subtext='orders processed'
          icon={<Package className='text-green-400' size={20} />}
        />
        <StatCard
          label='Total Spent'
          value={`₹${(profile?.lifetimeSpent ?? 0).toLocaleString()}`}
          subtext='lifetime'
          icon={<TrendingUp className='text-orange-400' size={20} />}
        />
        <StatCard
          label='Connect Account'
          value={profile?.linkedSalesmenCount ?? 0}
          subtext={`of ${profile?.maxLinkedSalesmen ?? 10} slots`}
          icon={<Users className='text-purple-400' size={20} />}
        />
      </div>

      {/* Investment & Returns Card */}
      <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
        <CardContent className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='md:col-span-2'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='p-2 rounded-lg bg-cyan-500/20'>
                  <TrendingUp className='text-cyan-400' size={20} />
                </div>
                <h3 className='text-lg font-semibold text-white'>
                  Investment Summary
                </h3>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-white/60'>Total Investment</span>
                  <span className='text-xl font-bold text-white'>
                    ₹
                    {(
                      (profile?.lifetimeTokensPurchased ?? 0) * 299
                    ).toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-white/60'>Tokens Purchased</span>
                  <span className='font-semibold text-white'>
                    {profile?.lifetimeTokensPurchased ?? 0}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-white/60'>Cost per Token</span>
                  <span className='font-semibold text-cyan-400'>₹299</span>
                </div>
              </div>
            </div>

            <div className='md:col-span-2'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='p-2 rounded-lg bg-green-500/20'>
                  <Package className='text-green-400' size={20} />
                </div>
                <h3 className='text-lg font-semibold text-white'>
                  Sales & Returns
                </h3>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-white/60'>Stickers Activated</span>
                  <span className='text-xl font-bold text-white'>
                    {profile?.lifetimeTokensUsed ?? 0}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-white/60'>
                    Potential Revenue (₹400/tag)
                  </span>
                  <span className='font-semibold text-green-400'>
                    ₹
                    {(
                      (profile?.lifetimeTokensUsed ?? 0) * 400
                    ).toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-white/60'>Est. Profit</span>
                  <span className='font-semibold text-green-400'>
                    ₹
                    {(
                      (profile?.lifetimeTokensUsed ?? 0) * 101
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className='mt-6 pt-4 border-t border-white/10'>
            <div className='flex justify-between text-sm mb-2'>
              <span className='text-white/60'>Token Utilization</span>
              <span className='text-white'>
                {profile?.lifetimeTokensUsed ?? 0} /{" "}
                {profile?.lifetimeTokensPurchased ?? 0}
              </span>
            </div>
            <div className='w-full h-2 bg-white/10 rounded-full overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full transition-all'
                style={{
                  width: `${
                    profile?.lifetimeTokensPurchased
                      ? (profile.lifetimeTokensUsed /
                          profile.lifetimeTokensPurchased) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <QuickActionCard
          title='Generate Passkey'
          description='Create access code for new salesman'
          icon={<Key className='text-cyan-400' size={24} />}
          href='/create-passkeys'
        />

        <QuickActionCard
          title='View All Orders'
          description='Track order status and history'
          icon={<Package className='text-green-400' size={24} />}
          href='/dealer-dashboard/orders'
        />
      </div>

      {/* Recent Activity */}
      <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-white'>Recent Activity</CardTitle>
            <Button
              asChild
              variant='ghost'
              size='sm'
              className='text-cyan-400 hover:text-cyan-300 hover:bg-white/5'
            >
              <Link to='/dealer-dashboard/orders'>
                View All <ArrowRight size={14} className='ml-1' />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState message='No recent activity. Start by purchasing tokens or processing orders.' />
        </CardContent>
      </Card>
    </>
  );
}

function SalesmanDashboard({ profile }: { profile: any }) {
  return (
    <>
      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <StatCard
          label='My Orders'
          value={0}
          icon={<Package className='text-cyan-400' size={20} />}
        />
        <StatCard
          label='Pending Loads'
          value={0}
          icon={<Clock className='text-yellow-400' size={20} />}
        />
        <StatCard
          label='Available Tokens'
          value={profile?.walletBalance ?? 0}
          icon={<Wallet className='text-green-400' size={20} />}
        />
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <QuickActionCard
          title='Process Order'
          description='Create new order for customer'
          icon={<Plus className='text-cyan-400' size={24} />}
          href='/dealer-dashboard/process-order'
          primary
        />
        <QuickActionCard
          title='View Delegations'
          description='Check tokens delegated to you'
          icon={<Users className='text-purple-400' size={24} />}
          href='/dealer-dashboard/received-loads'
        />
      </div>

      {/* My Recent Orders */}
      <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-white'>My Recent Orders</CardTitle>
            <Button
              asChild
              variant='ghost'
              size='sm'
              className='text-cyan-400 hover:text-cyan-300 hover:bg-white/5'
            >
              <Link to='/dealer-dashboard/my-orders'>
                View All <ArrowRight size={14} className='ml-1' />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState message='No orders yet. Process your first customer order to get started.' />
        </CardContent>
      </Card>
    </>
  );
}

function StatCard({
  label,
  value,
  subtext,
  icon,
  highlight,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-6 border ${
        highlight
          ? "bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-400/30"
          : "bg-white/5 border-white/10"
      }`}
    >
      <div className='flex items-center justify-between mb-2'>
        <span className='text-white/60 text-sm'>{label}</span>
        {icon}
      </div>
      <div className='text-3xl font-bold text-white'>{value}</div>
      {subtext && <div className='text-xs text-white/60 mt-1'>{subtext}</div>}
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
  primary,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  primary?: boolean;
}) {
  return (
    <Link
      to={href}
      className={`group rounded-xl p-6 border transition-all ${
        primary
          ? "bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-400/30 hover:border-cyan-400/50"
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
      }`}
    >
      <div className='flex items-start gap-4'>
        <div className='p-3 rounded-lg bg-white/5'>{icon}</div>
        <div className='flex-1'>
          <h3 className='font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors'>
            {title}
          </h3>
          <p className='text-sm text-white/60'>{description}</p>
        </div>
        <ArrowRight
          size={20}
          className='text-white/40 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all'
        />
      </div>
    </Link>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='p-4 rounded-full bg-white/5 mb-4'>
        <AlertCircle size={32} className='text-white/40' />
      </div>
      <p className='text-white/60 max-w-sm'>{message}</p>
    </div>
  );
}
