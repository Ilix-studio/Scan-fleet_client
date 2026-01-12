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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DashboardSidebarProps {
  userType: "admin" | "user";
}

export default function DashboardSidebar({ userType }: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const adminLinks = [
    { to: "#", label: "Dashboard", icon: LayoutDashboard },
    { to: "#", label: "User Management", icon: Users },
    { to: "#", label: "Transactions", icon: CreditCard },
    { to: "#", label: "Analytics", icon: BarChart3 },
    { to: "#", label: "Support Tickets", icon: MessageSquare },
    { to: "#", label: "Settings", icon: Settings },
  ];

  const userLinks = [
    { to: "#", label: "Dashboard", icon: LayoutDashboard },
    { to: "#", label: "Token Wallet", icon: Wallet },
    { to: "#", label: "Smart Stickers", icon: Zap },
    { to: "#", label: "Call Logs", icon: BarChart3 },
    { to: "#", label: "Profile", icon: Settings },
  ];

  const links = userType === "admin" ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed top-4 left-4 z-50 md:hidden p-2 bg-card rounded-lg border border-border'
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-card border-r border-border transition-transform duration-300 z-40 md:relative md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className='p-6 border-b border-border'>
          <Link to='/' className='flex items-center gap-2 font-bold text-xl'>
            <div className='w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold'>
              SF
            </div>
            <span>ScanFleet</span>
          </Link>
        </div>

        <nav className='p-4 space-y-2'>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                to={link.to}
                className='flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-primary/10 text-foreground hover:text-primary transition-colors'
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className='absolute bottom-6 left-4 right-4'>
          <Button
            variant='outline'
            className='w-full flex items-center gap-2 justify-center bg-transparent'
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-30 md:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
