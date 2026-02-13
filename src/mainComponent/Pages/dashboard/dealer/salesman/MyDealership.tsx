// src/components/MyDealership.tsx

import {
  useGetMyDealershipQuery,
  useUsePasskeyMutation,
} from "@/redux-store/services/passkeyApi";
import { useState } from "react";
import {
  Check,
  Building,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
} from "lucide-react";

const MyDealership = () => {
  const [passkeyCode, setPasskeyCode] = useState("");

  const { data: dealershipData, isLoading } = useGetMyDealershipQuery();
  const [usePasskey, { isLoading: isLinking, error }] = useUsePasskeyMutation();

  const handleLinkDealership = async () => {
    if (!passkeyCode.trim()) return;

    try {
      await usePasskey({ code: passkeyCode.toUpperCase() }).unwrap();
      setPasskeyCode("");
    } catch (error: any) {
      console.error("Failed to link dealership:", error);
    }
  };

  const isLinked = !!dealershipData?.data;

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='bg-gray-900 border border-gray-800 rounded-lg p-6'>
        <h2 className='text-2xl font-bold text-white mb-6'>My Dealership</h2>

        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500' />
          </div>
        ) : isLinked ? (
          <div className='space-y-6'>
            {/* Success Banner */}
            <div className='bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3'>
              <Check className='text-green-500 mt-1' size={20} />
              <div>
                <h3 className='text-green-500 font-semibold mb-1'>
                  Successfully Linked
                </h3>
                <p className='text-sm text-gray-400'>
                  You are connected to{" "}
                  {dealershipData.data?.dealership.businessName ||
                    dealershipData.data?.dealership.name}
                </p>
              </div>
            </div>

            {/* Dealership Details */}
            <div className='bg-gray-800 border border-gray-700 rounded-lg p-6'>
              <div className='flex items-start gap-4'>
                <div className='p-3 bg-blue-500/10 rounded-lg'>
                  <Building className='text-blue-500' size={24} />
                </div>

                <div className='flex-1 space-y-3'>
                  <h3 className='text-xl font-semibold text-white'>
                    {dealershipData.data?.dealership.businessName ||
                      dealershipData.data?.dealership.name}
                  </h3>

                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center gap-2 text-gray-400'>
                      <Mail size={14} />
                      <span>{dealershipData.data?.dealership.email}</span>
                    </div>

                    {dealershipData.data?.dealership.phone && (
                      <div className='flex items-center gap-2 text-gray-400'>
                        <Phone size={14} />
                        <span>{dealershipData.data?.dealership.phone}</span>
                      </div>
                    )}

                    {dealershipData.data?.linkedAt && (
                      <div className='flex items-center gap-2 text-gray-400'>
                        <Calendar size={14} />
                        <span>
                          Linked on{" "}
                          {new Date(
                            dealershipData.data?.linkedAt || "",
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Here show the deafault sticker design from the dealership */}
          </div>
        ) : (
          <div className='space-y-6'>
            {/* Not Linked State */}
            <div className='bg-gray-800 border border-gray-700 rounded-lg p-8 text-center'>
              <Building className='mx-auto text-gray-600 mb-4' size={48} />
              <h3 className='text-lg font-semibold text-white mb-2'>
                Not Linked to Any Dealership
              </h3>
              <p className='text-gray-400 mb-6'>
                Enter a passkey code from your dealership owner to get started
              </p>

              <div className='max-w-md mx-auto space-y-4'>
                <div>
                  <input
                    type='text'
                    value={passkeyCode}
                    onChange={(e) =>
                      setPasskeyCode(e.target.value.toUpperCase())
                    }
                    placeholder='PK-XXXXXXXXXX'
                    className='w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-center text-lg font-mono placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    maxLength={13}
                  />
                </div>

                {error && (
                  <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2'>
                    <AlertCircle className='text-red-500 mt-0.5' size={16} />
                    <p className='text-sm text-red-500'>
                      {(error as any)?.data?.message ||
                        "Failed to link dealership"}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleLinkDealership}
                  disabled={!passkeyCode.trim() || isLinking}
                  className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors'
                >
                  {isLinking ? "Linking..." : "Link to Dealership"}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className='bg-gray-800/50 border border-gray-700/50 rounded-lg p-4'>
              <h4 className='text-sm font-semibold text-white mb-2'>
                How it works:
              </h4>
              <ol className='text-sm text-gray-400 space-y-1 list-decimal list-inside'>
                <li>Ask your dealership owner for a passkey code</li>
                <li>Enter the code in the field above</li>
                <li>Click "Link to Dealership" to complete the connection</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDealership;
