import { BarChart3, Phone, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPreviewSection() {
  return (
    <section id='dashboard' className='py-20 sm:py-32'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-4'>
            Dealer Portal Dashboard
          </h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Manage your tags, track calls, and monitor token usage from one
            powerful dashboard
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className='glass-effect rounded-2xl overflow-hidden mb-12'>
          {/* Dashboard Header */}
          <div className='bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-xl font-bold'>Dashboard</h3>
                <p className='text-sm text-muted-foreground'>
                  Welcome back, Dealer Name
                </p>
              </div>
              <div className='text-right'>
                <p className='text-sm text-muted-foreground'>Last updated</p>
                <p className='text-sm font-medium'>2 minutes ago</p>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className='p-8'>
            {/* Stats Grid */}
            <div className='grid md:grid-cols-4 gap-6 mb-8'>
              {/* Recharge Balance */}
              <div className='bg-secondary/50 rounded-lg p-6 border border-border'>
                <div className='flex items-center justify-between mb-2'>
                  <p className='text-sm text-muted-foreground'>
                    Recharge Balance
                  </p>
                  <Zap size={20} className='text-primary' />
                </div>
                <p className='text-3xl font-bold'>2,450</p>
                <p className='text-xs text-muted-foreground mt-2'>
                  Tokens available
                </p>
              </div>

              {/* Active Tags */}
              <div className='bg-secondary/50 rounded-lg p-6 border border-border'>
                <div className='flex items-center justify-between mb-2'>
                  <p className='text-sm text-muted-foreground'>Active Tags</p>
                  <BarChart3 size={20} className='text-primary' />
                </div>
                <p className='text-3xl font-bold'>18</p>
                <p className='text-xs text-muted-foreground mt-2'>
                  Out of 25 tags
                </p>
              </div>

              {/* Total Calls */}
              <div className='bg-secondary/50 rounded-lg p-6 border border-border'>
                <div className='flex items-center justify-between mb-2'>
                  <p className='text-sm text-muted-foreground'>Total Calls</p>
                  <Phone size={20} className='text-primary' />
                </div>
                <p className='text-3xl font-bold'>1,234</p>
                <p className='text-xs text-muted-foreground mt-2'>This month</p>
              </div>

              {/* Growth */}
              <div className='bg-secondary/50 rounded-lg p-6 border border-border'>
                <div className='flex items-center justify-between mb-2'>
                  <p className='text-sm text-muted-foreground'>Growth</p>
                  <TrendingUp size={20} className='text-primary' />
                </div>
                <p className='text-3xl font-bold'>+23%</p>
                <p className='text-xs text-muted-foreground mt-2'>
                  vs last month
                </p>
              </div>
            </div>

            {/* Call Logs Table */}
            <div className='border border-border rounded-lg overflow-hidden'>
              <div className='bg-secondary/30 px-6 py-4 border-b border-border'>
                <h4 className='font-semibold'>Recent Call Logs</h4>
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead className='bg-secondary/20 border-b border-border'>
                    <tr>
                      <th className='px-6 py-3 text-left font-medium'>
                        Date & Time
                      </th>
                      <th className='px-6 py-3 text-left font-medium'>
                        Tag ID
                      </th>
                      <th className='px-6 py-3 text-left font-medium'>
                        Duration
                      </th>
                      <th className='px-6 py-3 text-left font-medium'>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        time: "Today, 2:45 PM",
                        tag: "TAG-001",
                        duration: "3m 24s",
                        status: "Completed",
                      },
                      {
                        time: "Today, 1:30 PM",
                        tag: "TAG-005",
                        duration: "5m 12s",
                        status: "Completed",
                      },
                      {
                        time: "Today, 12:15 PM",
                        tag: "TAG-012",
                        duration: "2m 08s",
                        status: "Completed",
                      },
                      {
                        time: "Yesterday, 4:20 PM",
                        tag: "TAG-003",
                        duration: "4m 45s",
                        status: "Completed",
                      },
                    ].map((log, index) => (
                      <tr
                        key={index}
                        className='border-b border-border hover:bg-secondary/20 transition-colors'
                      >
                        <td className='px-6 py-4'>{log.time}</td>
                        <td className='px-6 py-4 font-medium'>{log.tag}</td>
                        <td className='px-6 py-4'>{log.duration}</td>
                        <td className='px-6 py-4'>
                          <span className='px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium'>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className='glass-effect p-8 sm:p-12 rounded-2xl text-center'>
          <h3 className='text-2xl font-bold mb-4'>Ready to Get Started?</h3>
          <p className='text-muted-foreground mb-6 max-w-2xl mx-auto'>
            Access your dealer portal, manage tags, and track calls in
            real-time. Sign up today and start revolutionizing your dealership
            communication.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button className='bg-primary hover:bg-accent text-primary-foreground'>
              Login to Portal
            </Button>
            <Button
              variant='outline'
              className='border-primary text-primary hover:bg-primary/10 bg-transparent'
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
