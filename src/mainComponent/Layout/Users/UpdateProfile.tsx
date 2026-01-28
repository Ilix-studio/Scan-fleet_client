// src/components/features/auth/UpdateProfile.tsx
import { useState } from "react";
import { X, Building2, Users, Car, User } from "lucide-react";
import { useUpdateUserRoleMutation } from "@/redux-store/services/userAuthApi";
import { Button } from "@/components/ui/button";

interface UpdateProfileProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

type UserRole =
  | "DEALERSHIP_OWNER"
  | "DEALERSHIP_SALESMAN"
  | "RENTAL_OWNER"
  | "DIRECT_CUSTOMER";

// I'm defining role configurations with icons and descriptions to make the selection more visual and informative
const roleConfigs = {
  DEALERSHIP_OWNER: {
    icon: Building2,
    title: "Dealership Owner",
    description:
      "Manage your dealership operations, purchase tokens in bulk, and oversee your sales team",
    features: [
      "Bulk token purchases at ₹299 for 6 stickers",
      "Manage salesmen with passkeys",
      "Resell to customers at ₹300-500",
    ],
  },
  DEALERSHIP_SALESMAN: {
    icon: Users,
    title: "Dealership Salesman",
    description: "Process customer orders using your dealership's token wallet",
    features: [
      "Use dealership tokens",
      "Process customer orders",
      "Link to dealership via passkey",
    ],
  },
  RENTAL_OWNER: {
    icon: Car,
    title: "Rental Owner",
    description:
      "Manage your rental fleet with dynamic QR codes that update automatically",
    features: [
      "Dynamic QR codes for rentals",
      "Update customer info remotely",
      "Fleet management features",
    ],
  },
  DIRECT_CUSTOMER: {
    icon: User,
    title: "Direct Customer",
    description: "Purchase stickers directly for your personal vehicles",
    features: [
      "Buy individual stickers",
      "Manage your own vehicles",
      "Direct purchase pricing",
    ],
  },
} as const;

export default function UpdateProfile({
  isOpen,
  onComplete,
  onSkip,
}: UpdateProfileProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("DIRECT_CUSTOMER");
  const [updateRole, { isLoading, error }] = useUpdateUserRoleMutation();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      await updateRole({ role: selectedRole }).unwrap();
      onComplete();
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative'>
        {/* This glow effect creates visual depth and draws attention to the modal */}
        <div className='absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50' />

        <div className='relative'>
          {/* Header section with skip button */}
          <div className='flex items-start justify-between mb-6'>
            <div>
              <h2 className='text-3xl font-bold text-white mb-2'>
                Complete Your Profile
              </h2>
              <p className='text-white/60'>
                Select your account type to unlock features tailored to your
                needs
              </p>
            </div>
            <button
              onClick={onSkip}
              disabled={isLoading}
              className='text-white/60 hover:text-white/80 transition-colors disabled:opacity-50'
              aria-label='Skip for now'
            >
              <X size={24} />
            </button>
          </div>

          {/* Error message display */}
          {error && (
            <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm'>
              Failed to update role. Please try again.
            </div>
          )}

          {/* Role selection grid - using a 2x2 grid for better visual hierarchy */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            {(Object.keys(roleConfigs) as UserRole[]).map((role) => {
              const config = roleConfigs[role];
              const Icon = config.icon;
              const isSelected = selectedRole === role;

              return (
                <label
                  key={role}
                  className={`flex flex-col gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className='flex items-start gap-3'>
                    <input
                      type='radio'
                      name='role'
                      value={role}
                      checked={isSelected}
                      onChange={(e) =>
                        setSelectedRole(e.target.value as UserRole)
                      }
                      className='mt-1 w-5 h-5 text-cyan-400 border-white/20 focus:ring-cyan-400 focus:ring-2'
                    />
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Icon
                          size={20}
                          className={
                            isSelected ? "text-cyan-400" : "text-white/60"
                          }
                        />
                        <span className='text-white font-semibold text-lg'>
                          {config.title}
                        </span>
                      </div>
                      <p className='text-white/70 text-sm mb-3'>
                        {config.description}
                      </p>
                      <ul className='space-y-1'>
                        {config.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className='text-white/50 text-xs flex items-start gap-2'
                          >
                            <span className='text-cyan-400 mt-0.5'>•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className='flex gap-3'>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className='flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            >
              {isLoading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Saving...
                </div>
              ) : (
                "Continue"
              )}
            </Button>
            <Button
              onClick={onSkip}
              disabled={isLoading}
              className='px-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-xl font-semibold transition-all disabled:opacity-50'
            >
              Skip for now
            </Button>
          </div>

          <p className='text-white/40 text-xs text-center mt-4'>
            You can change your account type later from settings
          </p>
        </div>
      </div>
    </div>
  );
}
