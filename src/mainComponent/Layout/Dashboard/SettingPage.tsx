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
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import { useCreateApiAccountMutation } from "@/redux-store/services/external/apiAccountApi";
import {
  useDisableMyApiAccessMutation,
  useEnableMyApiAccessMutation,
  useGetMyApiAccountDetailsQuery,
  useRegenerateMyApiSecretMutation,
} from "@/redux-store/services/external/myApiAccountApi";
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

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------
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

// ------------------------------------------------------------------
// Shared UI
// ------------------------------------------------------------------
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
    <div className='flex flex-col gap-1'>
      <span className='text-xs text-gray-500 font-medium uppercase tracking-wider'>
        {label}
      </span>
      <div className='flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2'>
        <code className='flex-1 text-sm text-cyan-300 font-mono break-all'>
          {visible ? value : "•".repeat(Math.min(value.length, 40))}
        </code>
        <button
          onClick={() => setVisible((v) => !v)}
          className='p-1 text-gray-400 hover:text-cyan-400 transition-colors'
          title={visible ? "Hide" : "Show"}
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

// ------------------------------------------------------------------
// Tab: Profile
// ------------------------------------------------------------------
function ProfileTab() {
  const { data: profile } = useGetUserProfileQuery();

  const fields = [
    { label: "Full Name", value: profile?.name ?? "—" },
    { label: "Email", value: profile?.email ?? "—" },
    { label: "Phone", value: profile?.phone ?? "—" },
    ...(profile?.businessName
      ? [{ label: "Business Name", value: profile.businessName }]
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

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {fields.map(({ label, value }) => (
          <div key={label} className='space-y-1'>
            <label className='text-xs text-gray-500 uppercase tracking-wider font-medium'>
              {label}
            </label>
            <div className='bg-black/40 border border-white/10 rounded-lg px-3 py-2.5'>
              <span className='text-sm text-white'>{value}</span>
            </div>
          </div>
        ))}
      </div>

      <p className='text-xs text-gray-600'>
        To update profile details, contact support or use account management.
      </p>
    </div>
  );
}

// ------------------------------------------------------------------
// Tab: API Access (DEALERSHIP_OWNER only)
// ------------------------------------------------------------------
function ApiAccessTab() {
  const {
    data: accountRes,
    isLoading,
    isError,
  } = useGetMyApiAccountDetailsQuery();
  const [createApiAccount, { isLoading: isCreating }] =
    useCreateApiAccountMutation();
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

  const handleCreate = useCallback(async () => {
    try {
      // Backend derives businessName/email/phone from the authenticated user
      const res = await createApiAccount({} as any).unwrap();
      setNewCredentials(res as any);
      toast.success("API access enabled — save credentials now.");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to enable API access");
    }
  }, [createApiAccount]);

  const handleRegenerate = useCallback(async () => {
    try {
      const res = await regenerateSecret().unwrap();
      setNewCredentials({
        apiKey: res.data.apiKey,
        apiSecret: res.data.apiSecret,
      });
      toast.success("Secret regenerated — save it now.");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to regenerate secret");
    }
  }, [regenerateSecret]);

  const handleToggle = useCallback(async () => {
    try {
      if (account?.apiEnabled) {
        await disableAccess().unwrap();
        toast.success("API access disabled");
      } else {
        await enableAccess().unwrap();
        toast.success("API access enabled");
      }
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Operation failed");
    }
  }, [account?.apiEnabled, disableAccess, enableAccess]);

  const handleDelete = useCallback(async () => {
    try {
      await disableAccess().unwrap();
      setNewCredentials(null);
      toast.success("API credentials deleted");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete credentials");
    }
  }, [disableAccess]);

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
          Manage API credentials for integrating ScanFleet with your dealership
          systems.
        </p>
      </div>

      {/* One-time credentials banner */}
      {newCredentials && (
        <div className='bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-4'>
          <div className='flex items-start gap-2'>
            <AlertCircle className='w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0' />
            <p className='text-sm text-amber-300 font-medium'>
              Save these credentials now — the secret will not be shown again.
            </p>
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
            className='text-xs text-gray-500 hover:text-gray-300 transition-colors'
          >
            Dismiss (credentials saved)
          </button>
        </div>
      )}

      {/* No account */}
      {!account && !newCredentials && (
        <div className='bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center gap-4 text-center'>
          <Key className='w-10 h-10 text-cyan-400/60' />
          <div>
            <p className='text-white font-medium'>API access not enabled</p>
            <p className='text-sm text-gray-400 mt-1'>
              Enable API access to integrate ScanFleet with your website or
              e-commerce platform.
            </p>
          </div>
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className='flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors'
          >
            {isCreating ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Key className='w-4 h-4' />
            )}
            Enable API Access
          </button>
        </div>
      )}

      {/* Account exists */}
      {account && (
        <div className='space-y-4'>
          {/* Status + controls */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between'>
            <div className='space-y-1'>
              <span className='text-xs text-gray-500 uppercase tracking-wider font-medium'>
                Status
              </span>
              <div className='flex items-center gap-2'>
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                    account.apiEnabled ? "text-green-400" : "text-red-400"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${account.apiEnabled ? "bg-green-400" : "bg-red-400"}`}
                  />
                  {account.apiEnabled ? "Active" : "Disabled"}
                </span>
              </div>
            </div>

            <div className='flex items-center gap-2 flex-wrap'>
              <button
                onClick={handleToggle}
                disabled={isDisabling || isEnabling}
                className='flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/20 disabled:opacity-50 transition-colors'
              >
                {isDisabling || isEnabling ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : account.apiEnabled ? (
                  <ToggleRight className='w-4 h-4 text-green-400' />
                ) : (
                  <ToggleLeft className='w-4 h-4 text-red-400' />
                )}
                {account.apiEnabled ? "Disable" : "Enable"}
              </button>

              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className='flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 disabled:opacity-50 transition-colors'
              >
                {isRegenerating ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <RefreshCw className='w-4 h-4' />
                )}
                Regenerate Secret
              </button>
            </div>
          </div>

          {/* API Key display */}
          <div className='bg-black/40 border border-white/10 rounded-xl p-4 space-y-3'>
            <div className='space-y-1'>
              <span className='text-xs text-gray-500 uppercase tracking-wider font-medium'>
                API Key
              </span>
              <div className='flex items-center gap-2 bg-black/60 border border-white/10 rounded-lg px-3 py-2'>
                <code className='flex-1 text-sm text-cyan-300 font-mono truncate'>
                  {account.apiKey}
                </code>
                <CopyButton value={account.apiKey} />
              </div>
            </div>
            <p className='text-xs text-gray-600'>
              API Secret is not displayed after initial creation. Use
              "Regenerate Secret" to issue a new one.
            </p>
          </div>

          {/* Usage stats */}
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
            {[
              {
                label: "Total Requests",
                value: account.apiRequestCount.toLocaleString(),
              },
              {
                label: "Rate Limit / Hour",
                value: `${account.apiRateLimitPerHour.toLocaleString()} req`,
              },
              {
                label: "Rate Limit / Day",
                value: `${account.apiRateLimitPerDay.toLocaleString()} req`,
              },
              ...(account.apiLastUsedAt
                ? [
                    {
                      label: "Last Used",
                      value: new Date(
                        account.apiLastUsedAt,
                      ).toLocaleDateString(),
                    },
                  ]
                : []),
              ...(account.webhookUrl
                ? [{ label: "Webhook URL", value: account.webhookUrl }]
                : []),
              ...(account.allowedIPs.length > 0
                ? [
                    {
                      label: "Allowed IPs",
                      value: `${account.allowedIPs.length} configured`,
                    },
                  ]
                : []),
            ].map(({ label, value }) => (
              <div
                key={label}
                className='bg-white/5 border border-white/10 rounded-lg p-3'
              >
                <p className='text-xs text-gray-500 mb-1'>{label}</p>
                <p
                  className='text-sm text-white font-medium truncate'
                  title={value}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Danger zone */}
          <div className='bg-red-500/5 border border-red-500/20 rounded-xl p-4'>
            <p className='text-sm font-medium text-red-400 mb-1'>Danger Zone</p>
            <p className='text-xs text-gray-500 mb-3'>
              Deleting API credentials is irreversible. All integrations using
              these keys will stop working immediately.
            </p>
            <button
              onClick={handleDelete}
              disabled={isDisabling}
              className='flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors'
            >
              {isDisabling ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Trash2 className='w-4 h-4' />
              )}
              Delete API Credentials
            </button>
          </div>
        </div>
      )}

      {isError && (
        <div className='flex items-center gap-2 text-sm text-red-400'>
          <AlertCircle className='w-4 h-4' />
          Failed to load API account details.
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Tab: Security
// ------------------------------------------------------------------
function SecurityTab() {
  const items = [
    {
      title: "Password",
      description:
        "Change your account password. You'll be logged out of all other sessions.",
      action: "Change Password",
    },
    {
      title: "Active Sessions",
      description: "View and revoke active login sessions.",
      action: "Manage Sessions",
    },
    {
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account.",
      action: "Set Up 2FA",
    },
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold text-white'>Security</h2>
        <p className='text-sm text-gray-400 mt-0.5'>
          Manage authentication and session settings.
        </p>
      </div>

      <div className='space-y-3'>
        {items.map(({ title, description, action }) => (
          <div
            key={title}
            className='bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3'
          >
            <div>
              <p className='text-sm font-medium text-white'>{title}</p>
              <p className='text-xs text-gray-400 mt-0.5'>{description}</p>
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

// ------------------------------------------------------------------
// Tab: Notifications
// ------------------------------------------------------------------
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
          Configure which alerts and emails you receive.
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
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                prefs[key] ? "bg-cyan-500" : "bg-white/10"
              }`}
              aria-checked={prefs[key]}
              role='switch'
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  prefs[key] ? "translate-x-5" : "translate-x-0.5"
                }`}
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

// ------------------------------------------------------------------
// Root: SettingsPage
// ------------------------------------------------------------------
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
            Manage your account configuration and preferences.
          </p>
        </div>

        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Sidebar nav */}
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

          {/* Content panel */}
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
