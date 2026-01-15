import { Wallet, Zap, Phone, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const userStats = [
  { label: "Token Balance", value: "45", subtext: "Tokens", icon: Wallet },
  { label: "Smart Stickers", value: "6", subtext: "Total Created", icon: Zap },
  { label: "Total Calls", value: "324", subtext: "Last 30 days", icon: Phone },
  {
    label: "Call Success Rate",
    value: "94.5%",
    subtext: "Completed",
    icon: TrendingUp,
  },
];

const callLogsData = [
  { date: "Jan 1", calls: 8, unique: 6 },
  { date: "Jan 3", calls: 12, unique: 9 },
  { date: "Jan 5", calls: 15, unique: 11 },
  { date: "Jan 7", calls: 18, unique: 14 },
  { date: "Jan 9", calls: 22, unique: 16 },
  { date: "Jan 11", calls: 25, unique: 19 },
  { date: "Jan 13", calls: 28, unique: 21 },
];

const smartStickers = [
  {
    id: 1,
    name: "Honda City - Red",
    created: "2025-01-05",
    scans: 145,
    calls: 87,
  },
  {
    id: 2,
    name: "Toyota Fortuner - Black",
    created: "2025-01-08",
    scans: 98,
    calls: 62,
  },
  {
    id: 3,
    name: "Maruti Swift - White",
    created: "2025-01-10",
    scans: 234,
    calls: 156,
  },
  {
    id: 4,
    name: "Hyundai Creta - Silver",
    created: "2025-01-12",
    scans: 89,
    calls: 54,
  },
];

const tokenHistory = [
  {
    id: 1,
    action: "Purchased",
    amount: "+10",
    date: "2025-01-10",
    price: "₹3,000",
  },
  { id: 2, action: "Used", amount: "-2", date: "2025-01-09", price: "- " },
  {
    id: 3,
    action: "Purchased",
    amount: "+5",
    date: "2025-01-08",
    price: "₹1,500",
  },
  { id: 4, action: "Used", amount: "-1", date: "2025-01-07", price: "- " },
];

export default function UserDashboard() {
  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col gap-2 mb-8'>
        <h1 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
          My Dashboard
        </h1>
        <p className='text-white/70 text-lg'>
          Manage your tokens, smart stickers, and call analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {userStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className='bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all'
            >
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='space-y-1'>
                  <CardTitle className='text-sm font-medium text-white/70'>
                    {stat.label}
                  </CardTitle>
                  <p className='text-xs text-white/50'>{stat.subtext}</p>
                </div>
                <Icon size={20} className='text-cyan-400' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-white'>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Token Wallet Card */}
      <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-white'>
            <Wallet size={24} className='text-cyan-400' />
            Token Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='md:col-span-2'>
              <div className='bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-cyan-400/30 space-y-4'>
                <div className='space-y-2'>
                  <p className='text-white/60 text-sm'>Available Balance</p>
                  <p className='text-4xl font-bold text-white'>45 Tokens</p>
                </div>
                <p className='text-sm text-white/60'>₹13,500 value</p>
              </div>
            </div>
            <div className='space-y-2'>
              <Button className='w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0'>
                Buy Tokens
              </Button>
              <Button
                variant='outline'
                className='w-full border-white/20 text-white hover:bg-white/10 bg-transparent'
              >
                Token History
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Analytics Chart */}
      <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
        <CardHeader>
          <CardTitle className='text-white'>Call Analytics</CardTitle>
          <CardDescription className='text-white/60'>
            Daily incoming calls and unique callers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={callLogsData}>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='rgba(255,255,255,0.1)'
              />
              <XAxis
                dataKey='date'
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
              <Line
                type='monotone'
                dataKey='calls'
                stroke='hsl(var(--chart-1))'
                strokeWidth={2}
                name='Total Calls'
              />
              <Line
                type='monotone'
                dataKey='unique'
                stroke='hsl(var(--chart-2))'
                strokeWidth={2}
                name='Unique Callers'
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Smart Stickers */}
      <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
        <CardHeader>
          <CardTitle className='text-white'>My Smart Stickers</CardTitle>
          <CardDescription className='text-white/60'>
            Your active QR code stickers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-white/10'>
                  <th className='text-left py-3 px-4 text-white/70 font-medium'>
                    Sticker Name
                  </th>
                  <th className='text-left py-3 px-4 text-white/70 font-medium'>
                    Created
                  </th>
                  <th className='text-left py-3 px-4 text-white/70 font-medium'>
                    Scans
                  </th>
                  <th className='text-left py-3 px-4 text-white/70 font-medium'>
                    Calls
                  </th>
                  <th className='text-left py-3 px-4 text-white/70 font-medium'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {smartStickers.map((sticker) => (
                  <tr
                    key={sticker.id}
                    className='border-b border-white/5 hover:bg-white/5 transition-colors'
                  >
                    <td className='py-3 px-4 font-semibold text-white'>
                      {sticker.name}
                    </td>
                    <td className='py-3 px-4 text-white/60'>
                      {sticker.created}
                    </td>
                    <td className='py-3 px-4 text-white'>{sticker.scans}</td>
                    <td className='py-3 px-4 text-white'>{sticker.calls}</td>
                    <td className='py-3 px-4'>
                      <Button
                        size='sm'
                        variant='outline'
                        className='border-white/20 text-white hover:bg-white/10 bg-transparent'
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Token History */}
      <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
        <CardHeader>
          <CardTitle className='text-white'>
            Token Transaction History
          </CardTitle>
          <CardDescription className='text-white/60'>
            Your recent token activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-white/10'>
                  <th className='text-left py-3 px-4 text-white/70 font-medium'>
                    Action
                  </th>
                  <th className='text-left py-3 px-4 text-white/70 font-medium'>
                    Tokens
                  </th>
                  <th className='text-left py-3 px-4 text-white/70 font-medium'>
                    Date
                  </th>
                  <th className='text-left py-3 px-4 text-white/70 font-medium'>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {tokenHistory.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className='border-b border-white/5 hover:bg-white/5 transition-colors'
                  >
                    <td className='py-3 px-4 text-white'>
                      {transaction.action}
                    </td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        transaction.amount.startsWith("+")
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.amount}
                    </td>
                    <td className='py-3 px-4 text-white/60'>
                      {transaction.date}
                    </td>
                    <td className='py-3 px-4 text-white/60'>
                      {transaction.price}
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
