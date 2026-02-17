import { useState, useCallback } from "react";
import { useGetUserProfileQuery } from "@/redux-store/services/userAuthApi";
import DashboardLayout from "@/mainComponent/Layout/Dashboard/DashboardLayout";
import DashboardSidebar from "@/mainComponent/Layout/Dashboard/DashboardSidebar";
import {
  rentalOwnerNavigation,
  dealershipOwnerNavigation,
  dealershipSalesmanNavigation,
  directCustomerNavigation,
} from "@/mainComponent/Layout/Dashboard/dashboardNavigation";
import {
  User,
  Key,
  Bell,
  Shield,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Power,
  Calendar,
  Activity,
  Globe,
  Lock,
  Zap,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useGetMyApiAccountDetailsQuery,
  useCreateMyApiAccountMutation,
  useDisableMyApiAccessMutation,
  useEnableMyApiAccessMutation,
  useRegenerateMyApiSecretMutation,
} from "@/redux-store/services/external/apiAccountApi";

type UserRole =
  | "DEALERSHIP_OWNER"
  | "DEALERSHIP_SALESMAN"
  | "RENTAL_OWNER"
  | "DIRECT_CUSTOMER";
type SettingsTab = "profile" | "api-access" | "security" | "notifications";

interface TabConfig {
  id: SettingsTab;
  label: string;
  icon: React.ElementType;
  roles: UserRole[] | "all";
}

const NAV_BY_ROLE: Record<string, typeof dealershipOwnerNavigation> = {
  DEALERSHIP_OWNER: dealershipOwnerNavigation,
  DEALERSHIP_SALESMAN: dealershipSalesmanNavigation,
  RENTAL_OWNER: rentalOwnerNavigation,
  DIRECT_CUSTOMER: directCustomerNavigation,
};

const TABS: TabConfig[] = [
  { id: "profile", label: "Profile", icon: User, roles: "all" },
  {
    id: "api-access",
    label: "API Access",
    icon: Key,
    roles: ["DEALERSHIP_OWNER"],
  },
  { id: "security", label: "Security", icon: Shield, roles: "all" },
  { id: "notifications", label: "Notifications", icon: Bell, roles: "all" },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <button
      onClick={handleCopy}
      className='p-1.5 rounded-md text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors'
      title='Copy to clipboard'
    >
      {copied ? (
        <CheckCircle className='w-4 h-4 text-green-400' />
      ) : (
        <Copy className='w-4 h-4' />
      )}
    </button>
  );
}

function MaskedSecret({ value, label }: { value: string; label: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className='flex flex-col gap-1.5'>
      <span className='text-xs text-gray-500 font-medium uppercase tracking-wider'>
        {label}
      </span>
      <div className='flex items-center gap-2 bg-black/60 border border-white/10 rounded-lg px-3 py-2.5'>
        <code className='flex-1 text-sm text-cyan-300 font-mono break-all'>
          {visible ? value : "•".repeat(Math.min(value.length, 40))}
        </code>
        <button
          onClick={() => setVisible((v) => !v)}
          className='p-1 text-gray-400 hover:text-cyan-400 transition-colors'
        >
          {visible ? (
            <EyeOff className='w-4 h-4' />
          ) : (
            <Eye className='w-4 h-4' />
          )}
        </button>
        <CopyButton value={value} />
      </div>
    </div>
  );
}

function ProfileTab() {
  const { data: profile } = useGetUserProfileQuery();

  const roleBadgeColors: Record<UserRole, string> = {
    DEALERSHIP_OWNER: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
    DEALERSHIP_SALESMAN:
      "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    RENTAL_OWNER: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    DIRECT_CUSTOMER:
      "bg-green-500/10 text-green-400 border border-green-500/20",
  };

  const roleLabels: Record<UserRole, string> = {
    DEALERSHIP_OWNER: "Dealership Owner",
    DEALERSHIP_SALESMAN: "Dealership Salesman",
    RENTAL_OWNER: "Rental Owner",
    DIRECT_CUSTOMER: "Direct Customer",
  };

  const fields = [
    { label: "Full Name", value: profile?.name ?? "—", icon: User },
    { label: "Email", value: profile?.email ?? "—", icon: Globe },
    { label: "Phone", value: profile?.phone ?? "—", icon: Activity },
    ...(profile?.businessName
      ? [{ label: "Business Name", value: profile.businessName, icon: User }]
      : []),
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold text-white'>
          Profile Information
        </h2>
        <p className='text-sm text-gray-400 mt-0.5'>
          Your account details and role configuration.
        </p>
      </div>

      <div className='flex items-center gap-3'>
        <span className='text-sm text-gray-400'>Current Role:</span>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full ${roleBadgeColors[profile?.role as UserRole]}`}
        >
          {roleLabels[profile?.role as UserRole]}
        </span>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {fields.map(({ label, value, icon: Icon }) => (
          <div key={label} className='space-y-1.5'>
            <label className='text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-1.5'>
              <Icon className='w-3.5 h-3.5' />
              {label}
            </label>
            <div className='bg-black/40 border border-white/10 rounded-lg px-3 py-2.5'>
              <span className='text-sm text-white'>{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApiAccessTab() {
  const {
    data: accountRes,
    isLoading,
    isError,
    refetch,
  } = useGetMyApiAccountDetailsQuery();
  const [createApiAccount, { isLoading: isCreating }] =
    useCreateMyApiAccountMutation();
  const [regenerateSecret, { isLoading: isRegenerating }] =
    useRegenerateMyApiSecretMutation();
  const [disableAccess, { isLoading: isDisabling }] =
    useDisableMyApiAccessMutation();
  const [enableAccess, { isLoading: isEnabling }] =
    useEnableMyApiAccessMutation();

  const [newCredentials, setNewCredentials] = useState<{
    apiKey: string;
    apiSecret: string;
    webhookSecret?: string;
  } | null>(null);

  const account = accountRes?.data ?? null;
  const hasApiKey = !!account?.apiKey;

  const handleCreate = useCallback(async () => {
    try {
      const res = await createApiAccount().unwrap();
      setNewCredentials({
        apiKey: res.data.apiKey,
        apiSecret: res.data.apiSecret,
        webhookSecret: res.data.webhookSecret,
      });
      toast.success("API credentials generated — save them now");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to enable API access");
    }
  }, [createApiAccount, refetch]);

  const handleRegenerate = useCallback(async () => {
    if (!confirm("Regenerating will invalidate your current secret. Continue?"))
      return;
    try {
      const res = await regenerateSecret().unwrap();
      setNewCredentials({
        apiKey: res.data.apiKey,
        apiSecret: res.data.apiSecret,
      });
      toast.success("New secret generated — save it now");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to regenerate secret");
    }
  }, [regenerateSecret, refetch]);

  const handleToggle = useCallback(async () => {
    try {
      if (account?.apiEnabled) {
        await disableAccess().unwrap();
        toast.success("API access disabled");
      } else {
        await enableAccess().unwrap();
        toast.success("API access enabled");
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Operation failed");
    }
  }, [account?.apiEnabled, disableAccess, enableAccess, refetch]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Delete API credentials? All integrations will stop working."))
      return;
    try {
      await disableAccess().unwrap();
      setNewCredentials(null);
      toast.success("API credentials deleted");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete credentials");
    }
  }, [disableAccess, refetch]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-16'>
        <Loader2 className='w-6 h-6 text-cyan-400 animate-spin' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold text-white'>API Access</h2>
        <p className='text-sm text-gray-400 mt-0.5'>
          Integrate ScanFleet with your dealership platform
        </p>
      </div>

      {newCredentials && (
        <div className='bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-5 space-y-4'>
          <div className='flex items-start gap-3'>
            <AlertCircle className='w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0' />
            <div className='flex-1 space-y-1'>
              <p className='text-sm text-amber-300 font-semibold'>
                Save these credentials now
              </p>
              <p className='text-xs text-amber-200/80'>
                The secret cannot be retrieved after dismissing this banner.
              </p>
            </div>
          </div>
          <MaskedSecret value={newCredentials.apiKey} label='API Key' />
          <MaskedSecret value={newCredentials.apiSecret} label='API Secret' />
          {newCredentials.webhookSecret && (
            <MaskedSecret
              value={newCredentials.webhookSecret}
              label='Webhook Secret'
            />
          )}
          <button
            onClick={() => setNewCredentials(null)}
            className='text-xs text-amber-400/80 hover:text-amber-300 transition-colors font-medium'
          >
            I've saved my credentials — dismiss
          </button>
        </div>
      )}

      {!hasApiKey && !newCredentials && (
        <div className='bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-5 text-center'>
          <div className='w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center'>
            <Key className='w-8 h-8 text-cyan-400' />
          </div>
          <div>
            <p className='text-white font-semibold text-lg'>
              Enable API Integration
            </p>
            <p className='text-sm text-gray-400 mt-2 max-w-md'>
              Generate credentials to connect your dealership systems with
              ScanFleet.
            </p>
          </div>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className='flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold text-sm px-6 py-3 rounded-lg transition-colors shadow-lg shadow-cyan-500/20'
          >
            {isCreating ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Zap className='w-4 h-4' />
            )}
            Enable API Access
          </button>
        </div>
      )}

      {hasApiKey && account && (
        <div className='space-y-5'>
          <div className='bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4 justify-between'>
              <div className='space-y-2'>
                <span className='text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-1.5'>
                  <Power className='w-3.5 h-3.5' />
                  API Status
                </span>
                <div className='flex items-center gap-2.5'>
                  <span
                    className={`inline-flex items-center gap-2 text-sm font-semibold ${account.apiEnabled ? "text-green-400" : "text-red-400"}`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${account.apiEnabled ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
                    />
                    {account.apiEnabled ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className='flex items-center gap-2 flex-wrap'>
                <button
                  onClick={handleToggle}
                  disabled={isDisabling || isEnabling}
                  className={`flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-lg border transition-all font-medium ${
                    account.apiEnabled
                      ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                      : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                  } disabled:opacity-50`}
                >
                  {isDisabling || isEnabling ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <Power className='w-4 h-4' />
                  )}
                  {account.apiEnabled ? "Disable" : "Enable"}
                </button>

                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className='flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 disabled:opacity-50 transition-all font-medium'
                >
                  {isRegenerating ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <RefreshCw className='w-4 h-4' />
                  )}
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          <div className='bg-black/40 border border-white/10 rounded-xl p-5 space-y-4'>
            <div className='space-y-2'>
              <span className='text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-1.5'>
                <Key className='w-3.5 h-3.5' />
                Your API Key
              </span>
              <div className='flex items-center gap-2 bg-black/60 border border-white/10 rounded-lg px-3 py-2.5'>
                {account.apiKey && (
                  <div className='bg-black/40 border border-white/10 rounded-xl p-5 space-y-4'>
                    <div className='space-y-2'>
                      <span className='text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-1.5'>
                        <Key className='w-3.5 h-3.5' />
                        Your API Key
                      </span>
                      <div className='flex items-center gap-2 bg-black/60 border border-white/10 rounded-lg px-3 py-2.5'>
                        <code className='flex-1 text-sm text-cyan-300 font-mono truncate'>
                          {account.apiKey}
                        </code>
                        <CopyButton value={account.apiKey} />
                      </div>
                    </div>
                    <p className='text-xs text-gray-600 flex items-start gap-1.5'>
                      <Lock className='w-3.5 h-3.5 mt-0.5 flex-shrink-0' />
                      API Secret is hidden. Use "Regenerate" to issue new
                      credentials.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <p className='text-xs text-gray-600 flex items-start gap-1.5'>
              <Lock className='w-3.5 h-3.5 mt-0.5 flex-shrink-0' />
              API Secret is hidden. Use "Regenerate" to issue new credentials.
            </p>
          </div>

          <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
            {[
              {
                label: "Total Requests",
                value: account.apiRequestCount?.toLocaleString() ?? "0",
                icon: Activity,
              },
              {
                label: "Hourly Limit",
                value: `${account.apiRateLimitPerHour?.toLocaleString() ?? "0"} req`,
                icon: Zap,
              },
              {
                label: "Daily Limit",
                value: `${account.apiRateLimitPerDay?.toLocaleString() ?? "0"} req`,
                icon: Calendar,
              },
              {
                label: "Last Used",
                value: account.apiLastUsedAt
                  ? new Date(account.apiLastUsedAt).toLocaleDateString()
                  : "Never",
                icon: Calendar,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className='bg-white/5 border border-white/10 rounded-lg p-3.5 space-y-1.5'
              >
                <div className='flex items-center gap-1.5 text-xs text-gray-500'>
                  <Icon className='w-3.5 h-3.5' />
                  {label}
                </div>
                <p
                  className='text-sm text-white font-semibold truncate'
                  title={value}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {account.wallet && (
            <div className='bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border border-cyan-500/20 rounded-xl p-5'>
              <h3 className='text-sm font-semibold text-white mb-3 flex items-center gap-2'>
                <Wallet className='w-4 h-4 text-cyan-400' />
                Token Wallet
              </h3>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                {[
                  { label: "Balance", value: account.wallet.balance },
                  {
                    label: "Purchased",
                    value: account.wallet.lifetimePurchased,
                  },
                  { label: "Used", value: account.wallet.lifetimeUsed },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className='text-xs text-gray-500 mb-1'>{label}</p>
                    <p className='text-base text-white font-bold'>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {account.salesmen && (
            <div className='bg-white/5 border border-white/10 rounded-lg p-4'>
              <p className='text-xs text-gray-500 mb-2'>Linked Employee</p>
              <p className='text-sm text-white font-medium'>
                {account.salesmen.linkedCount} / {account.salesmen.maxAllowed}{" "}
                employees linked
              </p>
            </div>
          )}

          <div className='bg-gradient-to-br from-red-500/5 to-red-500/[0.02] border border-red-500/20 rounded-xl p-5 space-y-3'>
            <div className='flex items-start gap-2'>
              <AlertCircle className='w-5 h-5 text-red-400 mt-0.5 flex-shrink-0' />
              <div>
                <p className='text-sm font-semibold text-red-400'>
                  Danger Zone
                </p>
                <p className='text-xs text-gray-500 mt-1'>
                  Deleting credentials is permanent. All API integrations will
                  stop immediately.
                </p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              disabled={isDisabling}
              className='flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-all font-medium'
            >
              {isDisabling ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Trash2 className='w-4 h-4' />
              )}
              Delete Credentials
            </button>
          </div>
        </div>
      )}

      {isError && (
        <div className='flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3'>
          <AlertCircle className='w-4 h-4' />
          Failed to load API account details
        </div>
      )}
    </div>
  );
}

function SecurityTab() {
  const items = [
    {
      title: "Password",
      description:
        "Change your account password. You'll be logged out of all sessions.",
      action: "Change Password",
      icon: Lock,
    },
    {
      title: "Active Sessions",
      description: "View and revoke active login sessions.",
      action: "Manage Sessions",
      icon: Activity,
    },
    {
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account.",
      action: "Set Up 2FA",
      icon: Shield,
    },
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold text-white'>Security</h2>
        <p className='text-sm text-gray-400 mt-0.5'>
          Authentication and session settings
        </p>
      </div>

      <div className='space-y-3'>
        {items.map(({ title, description, action, icon: Icon }) => (
          <div
            key={title}
            className='bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3'
          >
            <div className='flex items-start gap-3'>
              <div className='w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0'>
                <Icon className='w-5 h-5 text-gray-400' />
              </div>
              <div>
                <p className='text-sm font-medium text-white'>{title}</p>
                <p className='text-xs text-gray-400 mt-0.5'>{description}</p>
              </div>
            </div>
            <button
              disabled
              className='text-sm px-4 py-2 rounded-lg border border-white/10 text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap'
            >
              {action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    orderUpdates: true,
    tokenAlerts: true,
    systemNotices: false,
    weeklyReport: false,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const items: {
    key: keyof typeof prefs;
    label: string;
    description: string;
  }[] = [
    {
      key: "orderUpdates",
      label: "Order Updates",
      description: "Email when orders are placed, fulfilled, or cancelled.",
    },
    {
      key: "tokenAlerts",
      label: "Low Token Alerts",
      description: "Notify when wallet balance drops below 5 tokens.",
    },
    {
      key: "systemNotices",
      label: "System Notices",
      description: "Platform maintenance and feature announcements.",
    },
    {
      key: "weeklyReport",
      label: "Weekly Summary",
      description: "Weekly email digest of activity and usage stats.",
    },
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold text-white'>Notifications</h2>
        <p className='text-sm text-gray-400 mt-0.5'>
          Configure alerts and email preferences
        </p>
      </div>

      <div className='space-y-3'>
        {items.map(({ key, label, description }) => (
          <div
            key={key}
            className='bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4'
          >
            <div>
              <p className='text-sm font-medium text-white'>{label}</p>
              <p className='text-xs text-gray-400 mt-0.5'>{description}</p>
            </div>
            <button
              onClick={() => toggle(key)}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${prefs[key] ? "bg-cyan-500" : "bg-white/10"}`}
              role='switch'
              aria-checked={prefs[key]}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${prefs[key] ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => toast.success("Notification preferences saved")}
        className='bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors'
      >
        Save Preferences
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { data: profile, isLoading } = useGetUserProfileQuery();
  const role = (profile?.role ?? "DIRECT_CUSTOMER") as UserRole;
  const navigation = NAV_BY_ROLE[role] ?? directCustomerNavigation;

  const visibleTabs = TABS.filter(
    (t) => t.roles === "all" || (t.roles as UserRole[]).includes(role),
  );

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const resolvedTab = visibleTabs.some((t) => t.id === activeTab)
    ? activeTab
    : "profile";

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black'>
        <div className='w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin' />
      </div>
    );
  }

  return (
    <DashboardLayout sidebar={<DashboardSidebar navigation={navigation} />}>
      <div className='min-h-screen bg-black p-4 sm:p-6 lg:p-8'>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-white'>Settings</h1>
          <p className='text-sm text-gray-400 mt-1'>
            Manage your account configuration and preferences
          </p>
        </div>

        <div className='flex flex-col lg:flex-row gap-6'>
          <nav className='lg:w-52 flex-shrink-0'>
            <div className='bg-white/5 border border-white/10 rounded-2xl p-2 flex lg:flex-col gap-1'>
              {visibleTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    resolvedTab === id
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className='w-4 h-4 flex-shrink-0' />
                  {label}
                </button>
              ))}
            </div>
          </nav>

          <div className='flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-sm min-h-[400px]'>
            {resolvedTab === "profile" && <ProfileTab />}
            {resolvedTab === "api-access" && role === "DEALERSHIP_OWNER" && (
              <ApiAccessTab />
            )}
            {resolvedTab === "security" && <SecurityTab />}
            {resolvedTab === "notifications" && <NotificationsTab />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
