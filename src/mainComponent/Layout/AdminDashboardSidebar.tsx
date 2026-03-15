// AdminDashboardSidebar.tsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { adminLogout } from "@/redux-store/slices/adminAuthSlice";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ScanQrCode,
  Tags,
  Binary,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, NavLink, useNavigate } from "react-router-dom";

const adminLinks = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
  { label: "Tags Requests", icon: Tags, path: "/admin-dispatch" },
  { label: "Attach Codes", icon: Binary, path: "/get-all-ac" },
];

export default function AdminDashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/admin-login");
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed top-4 left-4 z-50 md:hidden p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all'
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 z-40 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className='p-6 border-b border-white/10'>
          <Link
            to='/'
            className='flex items-center gap-3 hover:scale-105 transition-transform duration-200'
          >
            <div className='relative'>
              <div className='w-10 h-10 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg'>
                <ScanQrCode size={20} />
              </div>
              <div className='absolute -inset-1 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl blur opacity-30' />
            </div>
            <span className='text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
              ScanFleet
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className='p-4 space-y-1'>
          {adminLinks.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 w-full ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-400/30"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} className={isActive ? "text-cyan-400" : ""} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className='absolute bottom-6 left-4 right-4'>
          <Button
            variant='outline'
            onClick={handleLogout}
            className='w-full flex items-center gap-2 justify-center bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all'
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
