// src/components/features/auth/RoleReminderButton.tsx
import { UserCog } from "lucide-react";

interface RoleReminderButtonProps {
  onClick: () => void;
}

export default function RoleReminderButton({
  onClick,
}: RoleReminderButtonProps) {
  return (
    <button
      onClick={onClick}
      className='fixed right-6 top-1/2 -translate-y-1/2 z-40 group'
      aria-label='Complete profile setup'
    >
      {/* Pulsing animation ring to draw attention */}
      <div className='absolute inset-0 bg-cyan-400 rounded-full opacity-75 animate-ping' />

      {/* Main button */}
      <div className='relative bg-gradient-to-br from-cyan-500 to-purple-600 p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110'>
        <UserCog size={24} className='text-white' />
      </div>

      {/* Tooltip that appears on hover */}
      <div className='absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
        <div className='bg-gray-900 border border-white/10 px-4 py-2 rounded-lg whitespace-nowrap'>
          <p className='text-white text-sm font-medium'>
            Complete Your Profile
          </p>
          <p className='text-white/60 text-xs'>Select your account type</p>
        </div>
        {/* Arrow pointing to the button */}
        <div className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-900' />
      </div>
    </button>
  );
}
