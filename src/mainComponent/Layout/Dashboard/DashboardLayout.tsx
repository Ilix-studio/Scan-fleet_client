// src/components/layouts/DashboardLayout.tsx
import { ReactNode, useState } from "react";
import { Menu, X, Bell, Settings, LogOut, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetUserProfileQuery,
  useUserLogoutMutation,
} from "@/redux-store/services/userAuthApi";
import RoleReminderButton from "../Users/RoleReminderButton";
import { useDispatch } from "react-redux";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode; // This allows each dashboard to provide its own sidebar content
  showRoleReminder?: boolean; // Controls whether the role selection reminder appears
  onRoleReminderClick?: () => void;
}

export default function DashboardLayout({
  children,
  sidebar,
  showRoleReminder = false,
  onRoleReminderClick,
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: profile } = useGetUserProfileQuery();
  const [logout] = useUserLogoutMutation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if the API call fails, we still want to clear the auth state
      dispatch({ type: "auth/logout" });
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className='min-h-screen bg-black text-white'>
      {/* This is the shared header that appears across all dashboards */}
      <header className='fixed top-0 left-0 right-0 h-16 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 z-40'>
        <div className='flex items-center justify-between h-full px-4'>
          {/* Left side - Menu toggle and branding */}
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className='p-2 hover:bg-white/10 rounded-lg transition-colors'
              aria-label='Toggle sidebar'
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-lg' />
              <span className='font-bold text-lg'>ScanFleet</span>
            </div>
          </div>

          {/* Right side - User info and actions */}
          <div className='flex items-center gap-4'>
            <button className='p-2 hover:bg-white/10 rounded-lg transition-colors relative'>
              <Bell size={20} />
              <span className='absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full' />
            </button>

            {/* User menu dropdown */}
            <div className='relative'>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className='flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors'
              >
                <div className='w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-bold'>
                    {profile?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className='text-left hidden md:block'>
                  <div className='text-sm font-medium'>{profile?.name}</div>
                  <div className='text-xs text-white/60'>
                    {profile?.role?.replace(/_/g, " ")}
                  </div>
                </div>
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className='absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-lg shadow-xl overflow-hidden'>
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowUserMenu(false);
                    }}
                    className='w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left'
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowUserMenu(false);
                    }}
                    className='w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left'
                  >
                    <UserCog size={18} />
                    <span>Profile</span>
                  </button>
                  <div className='border-t border-white/10' />
                  <button
                    onClick={handleLogout}
                    className='w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-400 transition-colors text-left'
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main layout container with sidebar and content */}
      <div className='pt-16 flex'>
        {/* Sidebar - this is where role-specific navigation gets injected */}
        <aside
          className={`fixed left-0 top-16 bottom-0 bg-gray-900/95 backdrop-blur-sm border-r border-white/10 transition-all duration-300 z-30 ${
            isSidebarOpen ? "w-64" : "w-0"
          } overflow-hidden`}
        >
          <div className='p-4'>{sidebar}</div>
        </aside>

        {/* Main content area */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <div className='p-6'>{children}</div>
        </main>
      </div>

      {/* Role reminder button - only shows when needed */}
      {showRoleReminder && onRoleReminderClick && (
        <RoleReminderButton onClick={onRoleReminderClick} />
      )}
    </div>
  );
}
