// src/pages/dashboard/UserDashboardPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserProfileQuery } from "@/redux-store/services/userAuthApi";
import DashboardLayout from "../DashboardLayout";
import DashboardSidebar from "../DashboardSidebar";
import { directCustomerNavigation } from "../dashboardNavigation";
import UpdateProfile from "../../Users/UpdateProfile";
import { Minus, Plus } from "lucide-react";

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='currentColor'
      className={className}
      {...rest}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v12m6-6H6' />
    </svg>
  );
};

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const { data: profile, isLoading, refetch } = useGetUserProfileQuery();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [hasCheckedRole, setHasCheckedRole] = useState(false);

  useEffect(() => {
    if (profile && !hasCheckedRole) {
      setHasCheckedRole(true);

      const needsRoleSelection =
        profile.role === "DIRECT_CUSTOMER" &&
        profile.walletBalance === 0 &&
        profile.lifetimeTokensPurchased === 0;

      if (needsRoleSelection) {
        const hasSkippedBefore = sessionStorage.getItem("roleModalSkipped");
        if (!hasSkippedBefore) {
          setShowRoleModal(true);
        } else {
          setShowReminder(true);
        }
      }
    }
  }, [profile, hasCheckedRole]);

  const handleRoleComplete = async () => {
    setShowRoleModal(false);
    setShowReminder(false);
    sessionStorage.removeItem("roleModalSkipped");

    const { data: updatedProfile } = await refetch();

    if (updatedProfile && updatedProfile.role !== "DIRECT_CUSTOMER") {
      const roleRoutes: Record<string, string> = {
        DEALERSHIP_OWNER: "/dealer-dashboard",
        DEALERSHIP_SALESMAN: "/dealer-dashboard",
        RENTAL_OWNER: "/rental-dashboard",
      };
      navigate(roleRoutes[updatedProfile.role] || "/user-dashboard");
    }
  };

  const handleSkip = () => {
    setShowRoleModal(false);
    setShowReminder(true);
    sessionStorage.setItem("roleModalSkipped", "true");
  };

  const handleReminderClick = () => {
    setShowReminder(false);
    setShowRoleModal(true);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black'>
        <div className='w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin' />
      </div>
    );
  }

  return (
    <>
      <DashboardLayout
        sidebar={<DashboardSidebar navigation={directCustomerNavigation} />}
        showRoleReminder={showReminder}
        onRoleReminderClick={handleReminderClick}
      >
        {/* This is the actual dashboard content - notice how clean this is! */}
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>
              Welcome back, {profile?.name}
            </h1>
            <p className='text-white/60'>Manage your vehicle safety stickers</p>
          </div>

          {/* Dashboard content widgets go here */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Example stat cards */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='text-white/60 text-sm mb-2'>Active Stickers</div>
              <div className='text-3xl font-bold text-white'>0</div>
            </div>

            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='text-white/60 text-sm mb-2'>Total Orders</div>
              <div className='text-3xl font-bold text-white'>0</div>
            </div>

            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='text-white/60 text-sm mb-2'>Pending Delivery</div>
              <div className='text-3xl font-bold text-white'>0</div>
            </div>
          </div>
        </div>
        <br />
        <div className='flex gap-4 items-center justify-center h-[30rem] w-full max-w-[1200px] mx-auto bg-black'>
          <div className='border border-white/[0.2] dark:border-white/[0.2] flex flex-col items-start max-w-sm mx-auto p-4 relative h-[30rem]'>
            <div>
              <Plus className='absolute h-6 w-6 -top-3 -left-3 text-white' />
              <Plus className='absolute h-6 w-6 -bottom-3 -left-3 text-white' />
              <Plus className='absolute h-6 w-6 -top-3 -right-3 text-white' />
              <Plus className='absolute h-6 w-6 -bottom-3 -right-3 text-white' />

              <h2 className='dark:text-white text-black mt-4 text-sm font-light'>
                Hover over this card to reveal an awesome effect. Running out of
                copy here.
              </h2>
              <p className='text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5'>
                Watch me hover
              </p>
            </div>
            <button className='mt-4 bg-white/5 border border-white/10 rounded-xl p-2'>
              Default Sticker
            </button>
          </div>
          <div className='border border-white/[0.2] dark:border-white/[0.2] flex flex-col items-start max-w-sm mx-auto p-4 relative h-[30rem]'>
            <Minus className='absolute h-6 w-6 -top-3 -left-3 text-white' />
            <Minus className='absolute h-6 w-6 -bottom-3 -left-3 text-white' />
            <Minus className='absolute h-6 w-6 -top-3 -right-3 text-white' />
            <Minus className='absolute h-6 w-6 -bottom-3 -right-3 text-white' />

            <h2 className='dark:text-white text-black mt-4 text-sm font-light'>
              Hover over this card to reveal an awesome effect. Running out of
              copy here.
            </h2>
            <p className='text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5'>
              Watch me hover
            </p>
            <button className='mt-4 bg-white/5 border border-white/10 rounded-xl p-2'>
              Default Sticker
            </button>
          </div>
        </div>
      </DashboardLayout>

      <UpdateProfile
        isOpen={showRoleModal}
        onComplete={handleRoleComplete}
        onSkip={handleSkip}
      />
    </>
  );
}
