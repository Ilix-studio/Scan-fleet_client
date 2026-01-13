import { useState } from "react";

import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  MessageSquare,
  Wallet,
  Zap,
  Settings,
  LogOut,
  ScanQrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

interface DashboardSidebarProps {
  userType: "admin" | "user";
}

export default function DashboardSidebar({ userType }: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Dashboard");
  const navigate = useNavigate();

  const adminLinks = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      action: () => navigate("/admin-dashboard"),
    },
    {
      label: "User Management",
      icon: Users,
      action: () => navigate("/admin-user-management"),
    },
    {
      label: "Transactions",
      icon: CreditCard,
      action: () => navigate("/admin-transactions"),
    },
    {
      label: "Analytics",
      icon: BarChart3,
      action: () => navigate("/admin-analytics"),
    },
    {
      label: "Support Tickets",
      icon: MessageSquare,
      action: () => navigate("/admin-support-tickets"),
    },
    {
      label: "Settings",
      icon: Settings,
      action: () => navigate("/admin-settings"),
    },
  ];

  const userLinks = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      action: () => navigate("/user-dashboard"),
    },
    {
      label: "Token Wallet",
      icon: Wallet,
      action: () => navigate("/token-wallet"),
    },
    {
      label: "Smart Stickers",
      icon: Zap,
      action: () => navigate("/user-smart-stickers"),
    },
    {
      label: "Call Logs",
      icon: BarChart3,
      action: () => navigate("/user-call-logs"),
    },
    {
      label: "Profile",
      icon: Settings,
      action: () => navigate("/user-profile"),
    },
  ];

  const links = userType === "admin" ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile Menu Button */}
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
        {/* Logo Section */}
        <div className='p-6 border-b border-white/10'>
          <Link
            to='/'
            className='flex items-center gap-3 hover:scale-105 transition-transform duration-200'
          >
            <div className='relative'>
              <div className='w-10 h-10 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg'>
                <ScanQrCode size={20} />
              </div>
              <div className='absolute -inset-1 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl blur opacity-30'></div>
            </div>
            <span className='text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
              ScanFleet
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className='p-4 space-y-2'>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = activeLink === link.label;
            return (
              <button
                key={link.label}
                onClick={() => {
                  link.action?.();
                  setActiveLink(link.label);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 w-full text-left ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-400/30"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={20} className={isActive ? "text-cyan-400" : ""} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className='absolute bottom-6 left-4 right-4'>
          <Button
            variant='outline'
            className='w-full flex items-center gap-2 justify-center bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all'
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
