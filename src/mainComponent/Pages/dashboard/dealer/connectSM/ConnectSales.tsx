// src/components/ConnectSales.tsx

import {
  useGetLinkedSalesmenQuery,
  useUnlinkSalesmanMutation,
} from "@/redux-store/services/passkeyApi";
import { useState } from "react";
import { Users, Mail, Phone, Calendar, UserMinus } from "lucide-react";

type TabType = "linked" | "unlink";

const ConnectSales = () => {
  const [activeTab, setActiveTab] = useState<TabType>("linked");
  const [selectedSalesman, setSelectedSalesman] = useState<string | null>(null);

  const { data: salesmenData, isLoading } = useGetLinkedSalesmenQuery();
  const [unlinkSalesman, { isLoading: isUnlinking }] =
    useUnlinkSalesmanMutation();

  const handleUnlink = async (salesmanId: string) => {
    if (!confirm("Are you sure you want to unlink this salesman?")) return;

    try {
      await unlinkSalesman(salesmanId).unwrap();
      setSelectedSalesman(null);
    } catch (error) {
      console.error("Failed to unlink salesman:", error);
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <div className='bg-gray-900 border border-gray-800 rounded-lg'>
        {/* Tabs */}
        <div className='border-b border-gray-800'>
          <div className='flex space-x-1 p-2'>
            <button
              onClick={() => setActiveTab("linked")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "linked"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              Get Linked Account
            </button>
            <button
              onClick={() => setActiveTab("unlink")}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "unlink"
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              Unlink Account
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          {isLoading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500' />
            </div>
          ) : (
            <>
              {/* Stats Header */}
              <div className='mb-6 flex items-center justify-between'>
                <div className='flex items-center gap-2 text-gray-400'>
                  <Users size={20} />
                  <span className='text-sm'>
                    {salesmenData?.data.count || 0} /{" "}
                    {salesmenData?.data.maxAllowed || 0} Salesmen Linked
                  </span>
                </div>
                {salesmenData?.data.canLinkMore && (
                  <span className='text-xs bg-green-500/10 text-green-500 px-3 py-1 rounded-full'>
                    Can link more
                  </span>
                )}
              </div>

              {/* Salesmen List */}
              {activeTab === "linked" ? (
                <div className='space-y-3'>
                  {salesmenData?.data.salesmen.length ? (
                    salesmenData.data.salesmen.map((salesman) => (
                      <div
                        key={salesman._id}
                        className='bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors'
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <h3 className='text-lg font-semibold text-white mb-2'>
                              {salesman.name}
                            </h3>

                            <div className='space-y-2 text-sm text-gray-400'>
                              <div className='flex items-center gap-2'>
                                <Mail size={14} />
                                <span>{salesman.email}</span>
                              </div>

                              {salesman.phone && (
                                <div className='flex items-center gap-2'>
                                  <Phone size={14} />
                                  <span>{salesman.phone}</span>
                                </div>
                              )}

                              {salesman.linkedAt && (
                                <div className='flex items-center gap-2'>
                                  <Calendar size={14} />
                                  <span>
                                    Linked:{" "}
                                    {new Date(
                                      salesman.linkedAt,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className='mt-3 flex items-center gap-4'>
                              <div className='text-sm'>
                                <span className='text-gray-500'>Wallet: </span>
                                <span className='text-green-400 font-semibold'>
                                  ₹{salesman.walletBalance.toLocaleString()}
                                </span>
                              </div>
                              <div className='text-sm'>
                                <span className='text-gray-500'>Status: </span>
                                <span
                                  className={`font-medium ${
                                    salesman.status === "ACTIVE"
                                      ? "text-green-500"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {salesman.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='flex flex-col items-center justify-center py-12 text-gray-500'>
                      <Users size={48} className='mb-3 opacity-50' />
                      <p>No accounts linked yet</p>
                      <p className='text-sm mt-1'>
                        Create a passkey to connect accounts
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className='space-y-3'>
                  {salesmenData?.data.salesmen.length ? (
                    salesmenData.data.salesmen.map((salesman) => (
                      <div
                        key={salesman._id}
                        className='bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-red-900 transition-colors'
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex-1'>
                            <h3 className='text-lg font-semibold text-white mb-1'>
                              {salesman.name}
                            </h3>
                            <p className='text-sm text-gray-400'>
                              {salesman.email}
                            </p>
                          </div>

                          <button
                            onClick={() => handleUnlink(salesman._id)}
                            disabled={
                              isUnlinking && selectedSalesman === salesman._id
                            }
                            className='flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors'
                          >
                            <UserMinus size={16} />
                            {isUnlinking && selectedSalesman === salesman._id
                              ? "Unlinking..."
                              : "Unlink"}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='flex flex-col items-center justify-center py-12 text-gray-500'>
                      <Users size={48} className='mb-3 opacity-50' />
                      <p>No accounts to unlink</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectSales;
