import DashboardSidebar from "../DashboardSidebar";
import UserDashboard from "./User-Dashboard";
import { useNavigate } from "react-router-dom";
import { useGetUserProfileQuery } from "@/redux-store/services/userAuthApi";
import { useEffect, useState } from "react";
import UpdateProfile from "./UpdateProfile";
import RoleReminderButton from "./RoleReminderButton";

// This helper function determines which dashboard URL to use based on the user's role
const getRoleBasedDashboard = (role: string): string => {
  switch (role) {
    case "DEALERSHIP_OWNER":
    case "DEALERSHIP_SALESMAN":
      return "/dealer-dashboard";
    case "RENTAL_OWNER":
      return "/rental-dashboard";
    case "DIRECT_CUSTOMER":
    default:
      return "/user-dashboard";
  }
};

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const { data: profile, isLoading, refetch } = useGetUserProfileQuery();

  // Modal state management
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [hasCheckedRole, setHasCheckedRole] = useState(false);

  useEffect(() => {
    // This effect runs when the profile loads, checking if the user needs to select a role
    if (profile && !hasCheckedRole) {
      setHasCheckedRole(true);

      // Check if user still has the default DIRECT_CUSTOMER role and hasn't made any purchases
      // This indicates they're a new user who hasn't completed their profile
      const needsRoleSelection =
        profile.role === "DIRECT_CUSTOMER" &&
        profile.walletBalance === 0 &&
        profile.lifetimeTokensPurchased === 0;

      if (needsRoleSelection) {
        // Check if they've previously dismissed the modal in this session
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

    // Instead of reloading, we refetch the profile to get the updated role
    const { data: updatedProfile } = await refetch();

    if (updatedProfile) {
      // Navigate to the appropriate dashboard based on their new role
      const targetDashboard = getRoleBasedDashboard(updatedProfile.role);

      // Only navigate if they should be on a different dashboard
      if (targetDashboard !== "/user-dashboard") {
        navigate(targetDashboard);
      }
      // If they stay on user-dashboard, the component will just re-render with updated data
    }
  };

  const handleSkip = () => {
    setShowRoleModal(false);
    setShowReminder(true);
    // Remember that user skipped in this session
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
    <div className='min-h-screen w-full relative bg-black'>
      {/* Aurora Background */}
      <div
        className='absolute inset-0 z-0'
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 20, 147, 0.15), transparent 50%),
            radial-gradient(ellipse 160% 130% at 10% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
            radial-gradient(ellipse 160% 130% at 90% 90%, rgba(138, 43, 226, 0.18), transparent 65%),
            radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
            #000000
          `,
        }}
      />

      {/* Dashboard Layout */}
      <div className='relative z-10 flex'>
        <DashboardSidebar userType='user' />
        <main className='flex-1 overflow-auto'>
          <div className='p-6 md:p-8 max-w-7xl mx-auto'>
            <UserDashboard />
          </div>
        </main>
      </div>
      {/* Role selection modal */}
      <UpdateProfile
        isOpen={showRoleModal}
        onComplete={handleRoleComplete}
        onSkip={handleSkip}
      />

      {/* Sticky reminder button */}
      {showReminder && <RoleReminderButton onClick={handleReminderClick} />}
    </div>
  );
}
