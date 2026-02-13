// src/components/ConnectSalesman.tsx

import {
  useCreatePasskeyMutation,
  useGetMyPasskeysQuery,
} from "@/redux-store/services/passkeyApi";
import { useState } from "react";

import { Copy, Check, Clock, AlertCircle } from "lucide-react";

type TabType = "ACTIVE" | "USED" | "EXPIRED" | "REVOKED";

const CreatePasskey = () => {
  const [activeTab, setActiveTab] = useState<TabType>("ACTIVE");
  const [label, setLabel] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [createPasskey, { isLoading: isCreating, data: createdPasskey }] =
    useCreatePasskeyMutation();
  const { data: passkeysData, isLoading: isFetching } = useGetMyPasskeysQuery({
    status: activeTab,
    page: 1,
    limit: 20,
  });

  const handleCreatePasskey = async () => {
    try {
      await createPasskey({ label, expiresInDays }).unwrap();
      setLabel("");
    } catch (error: any) {
      console.error("Failed to create passkey:", error);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const tabs: TabType[] = ["ACTIVE", "EXPIRED"];

  const getStatusColor = (status: TabType) => {
    const colors = {
      ACTIVE: "text-green-500",
      USED: "text-blue-500",
      EXPIRED: "text-orange-500",
      REVOKED: "text-red-500",
    };
    return colors[status];
  };

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-6'>
      {/* Create Passkey Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-gray-900 border border-gray-800 rounded-lg p-6'>
          <h2 className='text-xl font-semibold text-white mb-4'>
            Create Passkey
          </h2>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-400 mb-2'>
                Label (Optional)
              </label>
              <input
                type='text'
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder='Sales Team Q1'
                className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-400 mb-2'>
                Expires In (Days)
              </label>
              <input
                type='number'
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(Number(e.target.value))}
                min={1}
                max={30}
                className='w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <button
              onClick={handleCreatePasskey}
              disabled={isCreating}
              className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors'
            >
              {isCreating ? "Creating..." : "Create Passkey"}
            </button>
          </div>
        </div>

        {/* Display Created Passkey */}
        <div className='bg-gray-900 border border-gray-800 rounded-lg p-6'>
          <h2 className='text-xl font-semibold text-white mb-4'>
            Here it will display
          </h2>

          {createdPasskey ? (
            <div className='space-y-4'>
              <div className='bg-gray-800 border border-gray-700 rounded-lg p-4'>
                <p className='text-sm text-gray-400 mb-2'>Passkey Code</p>
                <div className='flex items-center justify-between'>
                  <code className='text-2xl font-mono text-green-400'>
                    {createdPasskey.data.code}
                  </code>
                  <button
                    onClick={() => copyToClipboard(createdPasskey.data.code)}
                    className='p-2 hover:bg-gray-700 rounded-lg transition-colors'
                  >
                    {copiedCode === createdPasskey.data.code ? (
                      <Check className='text-green-500' size={20} />
                    ) : (
                      <Copy className='text-gray-400' size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className='text-sm text-gray-400 space-y-2'>
                {createdPasskey.data.passkey.label && (
                  <p>
                    Label:{" "}
                    <span className='text-white'>
                      {createdPasskey.data.passkey.label}
                    </span>
                  </p>
                )}
                <p>
                  Expires:{" "}
                  <span className='text-white'>
                    {new Date(
                      createdPasskey.data.passkey.expiresAt,
                    ).toLocaleDateString()}
                  </span>
                </p>
              </div>

              <p className='text-sm text-gray-500'>
                Share this code with your salesman to link them to your
                dealership.
              </p>
            </div>
          ) : (
            <div className='flex items-center justify-center h-40 text-gray-600'>
              <p>Create a passkey to see the code here</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div className='bg-gray-900 border border-gray-800 rounded-lg'>
        <div className='border-b border-gray-800'>
          <div className='flex space-x-1 p-2'>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Passkeys List */}
        <div className='p-4'>
          {isFetching ? (
            <div className='flex items-center justify-center py-12'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500' />
            </div>
          ) : passkeysData?.data.length ? (
            <div className='space-y-3'>
              {passkeysData.data.map((passkey) => (
                <div
                  key={passkey._id}
                  className='bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <code className='text-lg font-mono text-white'>
                          {passkey.code}
                        </code>
                        <span
                          className={`text-sm font-medium ${getStatusColor(passkey.status)}`}
                        >
                          {passkey.status}
                        </span>
                      </div>

                      {passkey.label && (
                        <p className='text-sm text-gray-400 mb-2'>
                          {passkey.label}
                        </p>
                      )}

                      <div className='flex items-center gap-4 text-xs text-gray-500'>
                        <div className='flex items-center gap-1'>
                          <Clock size={14} />
                          <span>
                            Expires:{" "}
                            {new Date(passkey.expiresAt).toLocaleDateString()}
                          </span>
                        </div>

                        {passkey.usedBy && (
                          <div className='flex items-center gap-1'>
                            <Check size={14} />
                            <span>Used by: {passkey.usedBy.name}</span>
                          </div>
                        )}

                        {passkey.revokedReason && (
                          <div className='flex items-center gap-1'>
                            <AlertCircle size={14} />
                            <span>{passkey.revokedReason}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(passkey.code)}
                      className='p-2 hover:bg-gray-700 rounded-lg transition-colors'
                    >
                      {copiedCode === passkey.code ? (
                        <Check className='text-green-500' size={18} />
                      ) : (
                        <Copy className='text-gray-400' size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex items-center justify-center py-12 text-gray-500'>
              <p>No {activeTab.toLowerCase()} passkeys</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePasskey;
