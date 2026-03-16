// EmergencyPage.tsx
import { useParams } from "react-router-dom";
import { Phone, AlertTriangle, Truck, Wrench, ShieldAlert } from "lucide-react";
import { useGetEmergencyDataQuery } from "@/redux-store/services/emergencyApi";

// ─── National helplines (static) ─────────────────────────────────────────────
const HELPLINES = [
  {
    label: "Police",
    number: "100",
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    label: "Ambulance",
    number: "108",
    color: "bg-green-500/20 text-green-300 border-green-500/30",
  },
  {
    label: "Fire",
    number: "101",
    color: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  },
  {
    label: "Road Accident",
    number: "1073",
    color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
  {
    label: "Women Helpline",
    number: "1091",
    color: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  },
  {
    label: "Disaster",
    number: "108",
    color: "bg-red-500/20 text-red-300 border-red-500/30",
  },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function CallButton({
  label,
  number,
  variant = "default",
}: {
  label: string;
  number: string;
  variant?: "primary" | "secondary" | "default";
}) {
  const base =
    "flex items-center justify-between w-full rounded-2xl px-5 py-4 transition-all active:scale-95";
  const styles = {
    primary: `${base} bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40`,
    secondary: `${base} bg-white/10 hover:bg-white/15 text-white border border-white/15`,
    default: `${base} bg-white/5 hover:bg-white/10 text-white border border-white/10`,
  };

  return (
    <a href={`tel:${number}`} className={styles[variant]}>
      <span className='font-semibold text-sm'>{label}</span>
      <span className='flex items-center gap-2 text-sm opacity-80'>
        <Phone size={15} className='fill-current' />
        {number}
      </span>
    </a>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='mb-6'>
      <h2 className='text-xs font-bold uppercase tracking-widest text-white/40 mb-3 px-1'>
        {title}
      </h2>
      <div className='space-y-2'>{children}</div>
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function EmergencyPage() {
  const { identifier } = useParams<{ identifier: string }>();
  const { data, isLoading, isError, error } = useGetEmergencyDataQuery(
    identifier ?? "",
    { skip: !identifier },
  );

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin' />
          <p className='text-white/50 text-sm'>Loading emergency info…</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    const msg = (error as any)?.data?.message;
    return (
      <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6'>
        <div className='text-center max-w-xs'>
          <AlertTriangle size={40} className='text-yellow-400 mx-auto mb-4' />
          <h1 className='text-white font-bold text-lg mb-2'>Not Activated</h1>
          <p className='text-white/50 text-sm'>
            {msg ??
              "This QR code has not been activated yet. Please contact the dealer."}
          </p>
          <p className='text-white/30 text-xs mt-6'>
            Powered by{" "}
            <span className='text-cyan-400 font-semibold'>ScanFleet</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white'>
      <div className='max-w-md mx-auto px-4 pb-12'>
        {/* ── Header ── */}
        <div className='pt-8 pb-6 flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center'>
              <ShieldAlert size={16} className='text-white' />
            </div>
            <div className='leading-tight'>
              <p className='text-xs font-bold text-white tracking-wide'>
                SCANFLEET
              </p>
              {data.dealerName && (
                <p className='text-[10px] text-white/40'>× {data.dealerName}</p>
              )}
            </div>
          </div>
          {data.vehicleInfo?.registrationNumber && (
            <span className='text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-white/60'>
              {data.vehicleInfo.registrationNumber}
            </span>
          )}
        </div>

        {/* ── Emergency banner ── */}
        <div className='bg-red-600/15 border border-red-500/30 rounded-2xl px-5 py-4 mb-6'>
          <p className='text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1'>
            In Case of Emergency
          </p>
          <h1 className='text-xl font-black text-white leading-tight'>
            Connect with vehicle owner, contact family, get medical info.
          </h1>
          {data.vehicleInfo && (
            <p className='text-xs text-white/40 mt-2'>
              {[
                data.vehicleInfo.model,
                data.vehicleInfo.color,
                data.vehicleInfo.year,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>

        {/* ── Owner & emergency contacts ── */}
        <Section title='Vehicle Owner'>
          <CallButton
            label='Call Owner (Masked)'
            number={data.maskedOwnerNumber}
            variant='primary'
          />
        </Section>

        <Section title='Emergency Contacts'>
          {data.emergency1 && (
            <CallButton
              label='Emergency Contact 1'
              number={data.emergency1}
              variant='secondary'
            />
          )}
          {data.emergency2 && (
            <CallButton
              label='Emergency Contact 2'
              number={data.emergency2}
              variant='secondary'
            />
          )}
          {data.dealerNumber && (
            <CallButton
              label='Dealer'
              number={data.dealerNumber}
              variant='secondary'
            />
          )}
        </Section>

        {/* ── Roadside help ── */}
        <Section title='Roadside Assistance'>
          <a
            href='tel:1800-123-4567'
            className='flex items-center gap-4 w-full rounded-2xl px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95'
          >
            <div className='w-9 h-9 bg-yellow-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center shrink-0'>
              <Truck size={16} className='text-yellow-400' />
            </div>
            <div className='text-left'>
              <p className='text-sm font-semibold text-white'>Tow Vehicle</p>
              <p className='text-xs text-white/40'>Request towing service</p>
            </div>
            <Phone size={14} className='ml-auto text-white/30' />
          </a>
          <a
            href='tel:1800-123-4568'
            className='flex items-center gap-4 w-full rounded-2xl px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95'
          >
            <div className='w-9 h-9 bg-cyan-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center shrink-0'>
              <Wrench size={16} className='text-cyan-400' />
            </div>
            <div className='text-left'>
              <p className='text-sm font-semibold text-white'>Call Mechanic</p>
              <p className='text-xs text-white/40'>On-road repair assistance</p>
            </div>
            <Phone size={14} className='ml-auto text-white/30' />
          </a>
        </Section>

        {/* ── National helplines ── */}
        <Section title='National Helplines'>
          <div className='grid grid-cols-3 gap-2'>
            {HELPLINES.map(({ label, number, color }) => (
              <a
                key={label}
                href={`tel:${number}`}
                className={`flex flex-col items-center justify-center rounded-xl border px-2 py-3 text-center transition-all active:scale-95 ${color}`}
              >
                <span className='text-xs font-bold'>{number}</span>
                <span className='text-[10px] opacity-70 mt-0.5'>{label}</span>
              </a>
            ))}
          </div>
        </Section>

        {/* ── Footer ── */}
        <p className='text-center text-[10px] text-white/20 mt-4'>
          Powered by{" "}
          <span className='text-cyan-400 font-medium'>ScanFleet</span>
          {data.activatedAt && (
            <>
              {" "}
              · Active since{" "}
              {new Date(data.activatedAt).toLocaleDateString("en-IN")}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
