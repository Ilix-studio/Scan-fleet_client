// src/components/features/auth/UpdateProfile.tsx
import { useState } from "react";
import { Briefcase, Car, Building2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUpdateUserRoleMutation } from "@/redux-store/services/userAuthApi";

interface UpdateProfileProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole?: string;
}

const UpdateProfile = ({
  isOpen,
  onClose,
  currentRole,
}: UpdateProfileProps) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [updateRole, { isLoading }] = useUpdateUserRoleMutation();

  const roles = [
    {
      value: "DEALERSHIP_OWNER",
      label: "Dealership Owner",
      description: "Manage dealership, salesmen, and bulk token purchases",
      icon: Building2,
      dashboard: "/dealership-dashboard",
    },
    {
      value: "DEALERSHIP_SALESMAN",
      label: "Dealership Salesman",
      description: "Process customer orders using dealership tokens",
      icon: Briefcase,
      dashboard: "/salesman-dashboard",
    },
    {
      value: "RENTAL_OWNER",
      label: "Rental Service Owner",
      description: "Manage rental fleet with dynamic QR codes",
      icon: Car,
      dashboard: "/rental-dashboard",
    },
  ];

  const handleSubmit = async () => {
    if (!selectedRole) return;

    try {
      await updateRole({ role: selectedRole as any }).unwrap();

      const targetRole = roles.find((r) => r.value === selectedRole);
      navigate(targetRole?.dashboard || "/user-dashboard");
      onClose();
    } catch (err: any) {
      console.error("Role update failed:", err);
    }
  };

  if (!isOpen || currentRole !== "DIRECT_CUSTOMER") return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'>
      <div className='relative w-full max-w-2xl mx-4'>
        <div className='bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 shadow-2xl'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full mb-4'>
              <User size={32} className='text-white' />
            </div>
            <h2 className='text-3xl font-bold text-white mb-2'>
              Choose Your Role
            </h2>
            <p className='text-white/60'>
              Select your account type to get started
            </p>
          </div>

          {/* Role Selection */}
          <div className='space-y-4 mb-8'>
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  disabled={isLoading}
                  className={`w-full p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedRole === role.value
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className='flex items-start gap-4'>
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                        selectedRole === role.value
                          ? "bg-cyan-500"
                          : "bg-white/10"
                      }`}
                    >
                      <Icon
                        size={24}
                        className={
                          selectedRole === role.value
                            ? "text-white"
                            : "text-white/60"
                        }
                      />
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-lg font-semibold text-white mb-1'>
                        {role.label}
                      </h3>
                      <p className='text-sm text-white/60'>
                        {role.description}
                      </p>
                    </div>
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedRole === role.value
                          ? "border-cyan-500 bg-cyan-500"
                          : "border-white/20"
                      }`}
                    >
                      {selectedRole === role.value && (
                        <div className='w-2 h-2 bg-white rounded-full' />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedRole || isLoading}
            className='w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                Updating...
              </div>
            ) : (
              "Continue"
            )}
          </Button>

          {/* Info Text */}
          <p className='text-center text-xs text-white/40 mt-4'>
            You can only change your role before making any purchases
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
