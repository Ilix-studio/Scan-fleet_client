import DashboardSidebar from "../AdminDashboardSidebar";
import AdminDashboard from "./Admin-dashboard";

export default function AdminDashboardPage() {
  return (
    <div className='min-h-screen w-full relative bg-black'>
      {/* Aurora Background */}
      <div
        className='absolute inset-0 z-0'
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 20, 147, 0.15), transparent 50%),
            radial-gradient(ellipse 160% 130% at 10% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
            radial-gradient(ellipse 160% 130% at 90% 90%, rgba(138, 43, 226, 0.18), transparent 65%),
            radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
            #000000
          `,
        }}
      />

      {/* Dashboard Layout */}
      <div className='relative z-10 flex'>
        <DashboardSidebar userType='admin' />
        <main className='flex-1 overflow-auto'>
          <div className='p-6 md:p-8 max-w-7xl mx-auto'>
            <AdminDashboard />
          </div>
        </main>
      </div>
    </div>
  );
}
