// Admin-dashboard.tsx
import { useMemo } from "react";
import {
  BarChart3,
  Users,
  CreditCard,
  TrendingUp,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import {
  useGetAnalyticsTransactionsQuery,
  useGetAnalyticsOverviewQuery,
  useGetRevenueByRoleQuery,
  useGetRevenueSummaryQuery,
} from "@/redux-store/services/adminPurchaseAnalyticsApi";

// ─── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtNum = (n: number) => new Intl.NumberFormat("en-IN").format(n);

function delta(current: number, previous: number): number | null {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

const ROLE_COLORS: Record<string, string> = {
  DEALERSHIP_OWNER: "#22d3ee",
  DEALERSHIP_SALESMAN: "#a78bfa",
  RENTAL_OWNER: "#f472b6",
  DIRECT_CUSTOMER: "#34d399",
};

const ROLE_LABELS: Record<string, string> = {
  DEALERSHIP_OWNER: "Dealership Owner",
  DEALERSHIP_SALESMAN: "Salesman",
  RENTAL_OWNER: "Rental Owner",
  DIRECT_CUSTOMER: "Direct Customer",
};

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-green-500/20 text-green-300",
  PENDING: "bg-yellow-500/20 text-yellow-300",
  FAILED: "bg-red-500/20 text-red-300",
  REFUNDED: "bg-purple-500/20 text-purple-300",
};

// ─── sub-components ───────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded-lg ${className}`} />
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { data: overview, isLoading: overviewLoading } =
    useGetAnalyticsOverviewQuery();

  // Last 13 months to reliably get current + previous month
  const startDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 12);
    d.setDate(1);
    return d.toISOString();
  }, []);

  const { data: revenueGroups } = useGetRevenueSummaryQuery({
    groupBy: "month",
    startDate,
  });

  const { data: byRole, isLoading: roleLoading } = useGetRevenueByRoleQuery({});

  const { data: txData, isLoading: txLoading } =
    useGetAnalyticsTransactionsQuery({
      page: 1,
      limit: 5,
      status: undefined,
    });

  // Derive previous month revenue for delta calculation
  const monthlyDelta = useMemo(() => {
    if (!revenueGroups?.groups || revenueGroups.groups.length < 2) return null;
    const sorted = [...revenueGroups.groups].sort((a, b) => {
      if (a._id.year !== b._id.year) return a._id.year - b._id.year;
      return (a._id.month ?? 0) - (b._id.month ?? 0);
    });
    const prev = sorted[sorted.length - 2];
    const curr = sorted[sorted.length - 1];
    return {
      revenue: delta(curr.totalRevenue, prev.totalRevenue),
      tokens: delta(curr.totalTokens, prev.totalTokens),
      purchases: delta(curr.totalPurchases, prev.totalPurchases),
    };
  }, [revenueGroups]);

  const roleChartData = useMemo(
    () =>
      (byRole ?? []).map((r) => ({
        role: ROLE_LABELS[r.role] ?? r.role,
        rawRole: r.role,
        revenue: r.totalRevenue,
        purchases: r.totalPurchases,
      })),
    [byRole],
  );

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col gap-2 mb-8'>
        <h1 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
          Admin Dashboard
        </h1>
        <p className='text-white/70 text-lg'>
          Monitor platform performance and manage users
        </p>
      </div>

      {/* ── Overview Stats ── */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {overviewLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-28' />
          ))
        ) : (
          <>
            {/* All-time revenue */}
            <StatCard
              label='All-time Revenue'
              value={fmt(overview?.total.revenue ?? 0)}
              sub={`${fmtNum(overview?.total.count ?? 0)} purchases`}
              icon={CreditCard}
              delta={null}
            />
            {/* This year */}
            <StatCard
              label='This Year'
              value={fmt(overview?.thisYear.revenue ?? 0)}
              sub={`${fmtNum(overview?.thisYear.tokens ?? 0)} tokens`}
              icon={TrendingUp}
              delta={null}
            />
            {/* This month with MoM delta */}
            <StatCard
              label='This Month'
              value={fmt(overview?.thisMonth.revenue ?? 0)}
              sub={`${fmtNum(overview?.thisMonth.tokens ?? 0)} tokens`}
              icon={BarChart3}
              delta={monthlyDelta?.revenue ?? null}
              deltaLabel='vs last month'
            />
            {/* Today */}
            <StatCard
              label='Today'
              value={fmt(overview?.today.revenue ?? 0)}
              sub={`${fmtNum(overview?.today.count ?? 0)} transactions`}
              icon={Users}
              delta={null}
            />
          </>
        )}
      </div>

      {/* ── Revenue by Role ── */}
      <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
        <CardHeader>
          <CardTitle className='text-white'>Revenue by Role</CardTitle>
          <CardDescription className='text-white/60'>
            All-time revenue contribution per user segment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {roleLoading ? (
            <Skeleton className='h-56' />
          ) : !roleChartData.length ? (
            <p className='text-white/40 text-sm text-center py-12'>
              No data available
            </p>
          ) : (
            <ResponsiveContainer width='100%' height={220}>
              <BarChart
                data={roleChartData}
                layout='vertical'
                margin={{ left: 16, right: 32, top: 4, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='rgba(255,255,255,0.06)'
                  horizontal={false}
                />
                <XAxis
                  type='number'
                  stroke='rgba(255,255,255,0.3)'
                  tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type='category'
                  dataKey='role'
                  width={120}
                  stroke='rgba(255,255,255,0.3)'
                  tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{
                    backgroundColor: "rgba(10,10,20,0.95)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: 12,
                  }}
                  formatter={(
                    value: number | undefined,
                    _name: any,
                    entry: any,
                  ) => [
                    fmt(value || 0),
                    `${entry.payload.purchases} purchases`,
                  ]}
                  labelFormatter={(label) => label}
                />
                <Bar dataKey='revenue' radius={[0, 4, 4, 0]} maxBarSize={28}>
                  {roleChartData.map((entry) => (
                    <Cell
                      key={entry.rawRole}
                      fill={ROLE_COLORS[entry.rawRole] ?? "#94a3b8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* ── Recent Transactions ── */}
      <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
        <CardHeader>
          <CardTitle className='text-white'>Recent Transactions</CardTitle>
          <CardDescription className='text-white/60'>
            Latest 5 payment activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className='space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-10' />
              ))}
            </div>
          ) : !txData?.transactions.length ? (
            <p className='text-white/40 text-sm text-center py-12'>
              No transactions found
            </p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-white/10'>
                    {[
                      "User",
                      "Role",
                      "Amount",
                      "Tokens",
                      "Type",
                      "Date",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className='text-left py-3 px-4 text-white/50 font-medium text-xs uppercase tracking-wider'
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {txData.transactions.map((tx) => (
                    <tr
                      key={tx._id}
                      className='border-b border-white/5 hover:bg-white/5 transition-colors'
                    >
                      <td className='py-3 px-4 text-white font-medium'>
                        {tx.userId?.name ?? "—"}
                        <div className='text-xs text-white/40'>
                          {tx.userId?.email}
                        </div>
                      </td>
                      <td className='py-3 px-4'>
                        <span
                          className='text-xs px-2 py-0.5 rounded-full border'
                          style={{
                            color: ROLE_COLORS[tx.userId?.role] ?? "#94a3b8",
                            borderColor: `${ROLE_COLORS[tx.userId?.role] ?? "#94a3b8"}40`,
                            backgroundColor: `${ROLE_COLORS[tx.userId?.role] ?? "#94a3b8"}12`,
                          }}
                        >
                          {ROLE_LABELS[tx.userId?.role] ?? tx.userId?.role}
                        </span>
                      </td>
                      <td className='py-3 px-4 font-semibold text-white'>
                        {fmt(tx.totalAmount)}
                      </td>
                      <td className='py-3 px-4 text-white/70'>
                        {fmtNum(tx.tokenQuantity)}
                      </td>
                      <td className='py-3 px-4 text-white/50 text-xs'>
                        {tx.purchaseType === "WALLET_TOPUP"
                          ? "Wallet Top-up"
                          : "Direct Order"}
                      </td>
                      <td className='py-3 px-4 text-white/50 text-xs'>
                        {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className='py-3 px-4'>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            STATUS_STYLES[tx.status] ??
                            "bg-white/10 text-white/60"
                          }`}
                        >
                          {tx.status.charAt(0) +
                            tx.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  delta: number | null;
  deltaLabel?: string;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  delta: d,
  deltaLabel = "",
}: StatCardProps) {
  const isPositive = d !== null && d >= 0;
  return (
    <Card className='bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-white/70'>
          {label}
        </CardTitle>
        <Icon size={18} className='text-cyan-400' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold text-white'>{value}</div>
        <p className='text-xs text-white/40 mt-0.5'>{sub}</p>
        {d !== null && (
          <p
            className={`text-xs mt-1.5 flex items-center gap-1 ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(d)}% {deltaLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
