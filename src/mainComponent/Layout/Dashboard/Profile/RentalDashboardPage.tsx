// src/pages/dashboard/RentalDashboardPage.tsx
import { useGetUserProfileQuery } from "@/redux-store/services/userAuthApi";
import DashboardSidebar from "../DashboardSidebar";
import DashboardLayout from "../DashboardLayout";
import { rentalOwnerNavigation } from "../dashboardNavigation";

export default function RentalDashboardPage() {
  const { data: profile, isLoading } = useGetUserProfileQuery();

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black'>
        <div className='w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin' />
      </div>
    );
  }

  return (
    <DashboardLayout
      sidebar={<DashboardSidebar navigation={rentalOwnerNavigation} />}
    >
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold text-white mb-2'>
            Rental Fleet Management
          </h1>
          <p className='text-white/60'>
            Manage your rental vehicles with dynamic QR codes
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <div className='text-white/60 text-sm mb-2'>Total Vehicles</div>
            <div className='text-3xl font-bold text-white'>0</div>
          </div>

          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <div className='text-white/60 text-sm mb-2'>Active Rentals</div>
            <div className='text-3xl font-bold text-white'>0</div>
          </div>

          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <div className='text-white/60 text-sm mb-2'>Wallet Balance</div>
            <div className='text-3xl font-bold text-white'>
              {profile?.walletBalance || 0}
            </div>
          </div>

          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <div className='text-white/60 text-sm mb-2'>Dynamic QR Codes</div>
            <div className='text-3xl font-bold text-white'>0</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
