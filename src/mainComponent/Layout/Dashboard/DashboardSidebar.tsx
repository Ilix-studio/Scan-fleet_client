// src/components/layouts/DashboardSidebar.tsx
import { NavLink } from "react-router-dom";
import { NavigationSection } from "./dashboardNavigation";

interface DashboardSidebarProps {
  navigation: NavigationSection[];
}

export default function DashboardSidebar({
  navigation,
}: DashboardSidebarProps) {
  return (
    <nav className='space-y-6'>
      {navigation.map((section, sectionIdx) => (
        <div key={sectionIdx}>
          {/* Section title */}
          <h3 className='text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-3'>
            {section.title}
          </h3>

          {/* Navigation items in this section */}
          <div className='space-y-1'>
            {section.items.map((item, itemIdx) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                  title={item.description}
                >
                  <Icon size={20} className='flex-shrink-0' />
                  <span className='flex-1 text-sm font-medium'>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className='px-2 py-0.5 text-xs font-semibold bg-cyan-500 text-white rounded-full'>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
