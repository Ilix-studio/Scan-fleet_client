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
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const dashboardStats = [
  { label: "Total Users", value: "2,845", change: "+12.5%", icon: Users },
  { label: "Revenue", value: "₹8,54,500", change: "+23.1%", icon: CreditCard },
  { label: "QR Scans", value: "15,420", change: "+5.3%", icon: TrendingUp },
  { label: "Active Tags", value: "1,230", change: "+8.2%", icon: BarChart3 },
];

const revenueData = [
  { month: "Jan", revenue: 4000, subscriptions: 2400 },
  { month: "Feb", revenue: 3000, subscriptions: 1398 },
  { month: "Mar", revenue: 2000, subscriptions: 9800 },
  { month: "Apr", revenue: 2780, subscriptions: 3908 },
  { month: "May", revenue: 1890, subscriptions: 4800 },
  { month: "Jun", revenue: 2390, subscriptions: 3800 },
];

const userData = [
  { name: "Active", value: 2400, fill: "hsl(var(--chart-1))" },
  { name: "Inactive", value: 300, fill: "hsl(var(--chart-2))" },
  { name: "Suspended", value: 145, fill: "hsl(var(--chart-3))" },
];

const recentTransactions = [
  {
    id: 1,
    user: "Raj Kumar",
    amount: "₹3,000",
    date: "2025-01-10",
    status: "Completed",
  },
  {
    id: 2,
    user: "Priya Singh",
    amount: "₹1,500",
    date: "2025-01-09",
    status: "Completed",
  },
  {
    id: 3,
    user: "Amit Patel",
    amount: "₹6,000",
    date: "2025-01-09",
    status: "Pending",
  },
  {
    id: 4,
    user: "Neha Sharma",
    amount: "₹2,100",
    date: "2025-01-08",
    status: "Completed",
  },
  {
    id: 5,
    user: "Vikram Singh",
    amount: "₹4,500",
    date: "2025-01-08",
    status: "Failed",
  },
];

export default function AdminDashboard() {
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

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith("+");
          return (
            <Card
              key={index}
              className='bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all'
            >
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-white/70'>
                  {stat.label}
                </CardTitle>
                <Icon size={20} className='text-cyan-400' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-white'>
                  {stat.value}
                </div>
                <p
                  className={`text-xs mt-1 flex items-center gap-1 ${
                    isPositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Revenue Chart */}
        <Card className='bg-white/5 backdrop-blur-xl border border-white/10 lg:col-span-2'>
          <CardHeader>
            <CardTitle className='text-white'>Revenue Trend</CardTitle>
            <CardDescription className='text-white/60'>
              Monthly revenue and subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='rgba(255,255,255,0.1)'
                />
                <XAxis
                  dataKey='month'
                  stroke='rgba(255,255,255,0.5)'
                  tick={{ fill: "rgba(255,255,255,0.7)" }}
                />
                <YAxis
                  stroke='rgba(255,255,255,0.5)'
                  tick={{ fill: "rgba(255,255,255,0.7)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.9)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ color: "#fff" }} />
                <Bar dataKey='revenue' fill='hsl(var(--chart-1))' />
                <Bar dataKey='subscriptions' fill='hsl(var(--chart-2))' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Status Pie */}
        <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
          <CardHeader>
            <CardTitle className='text-white'>User Status</CardTitle>
            <CardDescription className='text-white/60'>
              Account distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={userData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.9)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
        <CardHeader>
          <CardTitle className='text-white'>Recent Transactions</CardTitle>
          <CardDescription className='text-white/60'>
            Latest payment activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-white/10'>
                  <th className='text-left py-3 px-4 text-white/70 font-medium'>
                    User
                  </th>
                  <th className='text-left py-3 px-4 text-white/70 font-medium'>
                    Amount
                  </th>
                  <th className='text-left py-3 px-4 text-white/70 font-medium'>
                    Date
                  </th>
                  <th className='text-left py-3 px-4 text-white/70 font-medium'>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className='border-b border-white/5 hover:bg-white/5 transition-colors'
                  >
                    <td className='py-3 px-4 text-white'>{transaction.user}</td>
                    <td className='py-3 px-4 font-semibold text-white'>
                      {transaction.amount}
                    </td>
                    <td className='py-3 px-4 text-white/60'>
                      {transaction.date}
                    </td>
                    <td className='py-3 px-4'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.status === "Completed"
                            ? "bg-green-500/20 text-green-300"
                            : transaction.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
