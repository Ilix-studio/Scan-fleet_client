import { useParams } from "react-router-dom";
import { useGetEmergencyDataQuery } from "@/redux-store/services/emergencyApi";
import { Phone, AlertTriangle, Car, Wrench, Loader2 } from "lucide-react";

const HELPLINES = [
  { label: "Police", number: "100" },
  { label: "Ambulance", number: "102" },
  { label: "Fire", number: "101" },
  { label: "National Emergency", number: "112" },
  { label: "Highway Helpline", number: "1033" },
  { label: "Road Accident", number: "1073" },
];

function CallButton({
  label,
  number,
  primary = false,
}: {
  label: string;
  number: string;
  primary?: boolean;
}) {
  return (
    <a
      href={`tel:${number}`}
      className={`flex items-center justify-between w-full px-4 py-4 rounded-2xl font-semibold text-base transition-all active:scale-95 ${
        primary
          ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
          : "bg-white/10 text-white border border-white/15"
      }`}
    >
      <span>{label}</span>
      <span className='flex items-center gap-2 opacity-80'>
        <Phone size={18} />
        {number}
      </span>
    </a>
  );
}

export default function EmergencyPage() {
  const { identifier } = useParams<{ identifier: string }>();
  const { data, isLoading, isError, error } = useGetEmergencyDataQuery(
    identifier ?? "",
    { skip: !identifier },
  );

  if (isLoading) {
    return (
      <div className='min-h-screen bg-[#0a0a0f] flex items-center justify-center'>
        <Loader2 className='animate-spin text-red-500' size={36} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className='min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-3 px-6 text-center'>
        <AlertTriangle size={40} className='text-red-500' />
        <h1 className='text-white text-xl font-bold'>QR Code Not Found</h1>
        <p className='text-white/50 text-sm'>
          This code doesn't exist or has been cancelled.
        </p>
      </div>
    );
  }

  // ── DEBUG — remove before production ──
  if (import.meta.env.DEV || true) {
    console.log("[Emergency Debug]", {
      identifier,
      isLoading,
      isError,
      error,
      data,
    });
  }

  // Unactivated — sticker printed but dealer hasn't bound it yet
  if (!data.activated || !data.data) {
    return (
      <div className='min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-4 px-6 text-center'>
        {/* Header */}
        <div className='flex items-center gap-2 mb-2'>
          <span className='text-2xl font-black text-white tracking-tight'>
            SCAN<span className='text-red-500'>FLEET</span>
          </span>
        </div>
        <AlertTriangle size={40} className='text-yellow-400' />
        <h1 className='text-white text-xl font-bold'>Not Activated Yet</h1>
        <p className='text-white/50 text-sm max-w-xs'>
          This sticker ({data.attachCode}) hasn't been activated. Contact your
          dealer.
        </p>
        <div className='mt-4 w-full max-w-sm'>
          <p className='text-white/30 text-xs mb-3 uppercase tracking-wider'>
            Emergency Helplines
          </p>
          <div className='space-y-2'>
            {HELPLINES.slice(0, 3).map((h) => (
              <CallButton key={h.number} label={h.label} number={h.number} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const {
    maskedOwnerNumber,
    emergency1,
    emergency2,
    dealerNumber,
    vehicleInfo,
    dealerName,
    businessName,
  } = data.data;

  return (
    <>
      {/* DEBUG PANEL */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#000",
          color: "#0f0",
          fontSize: 11,
          padding: "8px",
          zIndex: 9999,
          fontFamily: "monospace",
          maxHeight: "40vh",
          overflowY: "auto",
          borderTop: "1px solid #333",
        }}
      >
        <div>
          <b>identifier:</b> {identifier ?? "MISSING"}
        </div>
        <div>
          <b>isLoading:</b> {String(isLoading)}
        </div>
        <div>
          <b>isError:</b> {String(isError)}
        </div>
        <div>
          <b>error:</b> {JSON.stringify(error)}
        </div>
        <div>
          <b>data:</b> {JSON.stringify(data)}
        </div>
      </div>

      <div className='min-h-screen bg-[#0a0a0f] text-white'>
        <div className='max-w-md mx-auto px-4 pb-12'>
          {/* ── Header ── */}
          <div className='pt-8 pb-6 text-center border-b border-white/10'>
            <div className='flex items-center justify-center gap-2 mb-1'>
              <span className='text-xl font-black tracking-tight'>
                SCAN<span className='text-red-500'>FLEET</span>
              </span>
              {(businessName || dealerName) && (
                <>
                  <span className='text-white/30 text-sm'>×</span>
                  <span className='text-white/70 text-sm font-medium'>
                    {businessName ?? dealerName}
                  </span>
                </>
              )}
            </div>
            {vehicleInfo?.registrationNumber && (
              <p className='text-white/40 text-xs font-mono mt-1'>
                {vehicleInfo.registrationNumber}
                {vehicleInfo.model ? ` · ${vehicleInfo.model}` : ""}
                {vehicleInfo.color ? ` · ${vehicleInfo.color}` : ""}
              </p>
            )}
          </div>

          {/* ── Hero ── */}
          <div className='py-6 text-center'>
            <div className='inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-1.5 mb-3'>
              <AlertTriangle size={14} className='text-red-400' />
              <span className='text-red-400 text-xs font-bold uppercase tracking-widest'>
                Emergency
              </span>
            </div>
            <h1 className='text-3xl font-black leading-tight'>
              In Case of
              <br />
              <span className='text-red-500'>Emergency</span>
            </h1>
            <p className='text-white/50 text-sm mt-2'>
              Tap a button below to connect instantly
            </p>
          </div>

          {/* ── Primary contacts ── */}
          <div className='space-y-3 mb-8'>
            <p className='text-white/30 text-xs uppercase tracking-wider'>
              Vehicle Owner & Contacts
            </p>
            <CallButton
              label='Call Vehicle Owner'
              number={maskedOwnerNumber}
              primary
            />
            {emergency1 && (
              <CallButton label='Emergency Contact 1' number={emergency1} />
            )}
            {emergency2 && (
              <CallButton label='Emergency Contact 2' number={emergency2} />
            )}
            {dealerNumber && (
              <CallButton
                label='Dealer / Fleet Manager'
                number={dealerNumber}
              />
            )}
          </div>

          {/* ── Towing & Mechanic ── */}
          <div className='space-y-3 mb-8'>
            <p className='text-white/30 text-xs uppercase tracking-wider'>
              Roadside Assistance
            </p>
            <a
              href='tel:1800-180-1520'
              className='flex items-center gap-3 w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 transition-all active:scale-95'
            >
              <div className='w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0'>
                <Car size={18} className='text-orange-400' />
              </div>
              <div className='flex-1'>
                <p className='font-semibold text-sm'>Tow Vehicle</p>
                <p className='text-white/40 text-xs'>
                  NHAI Helpline · 1800-180-1520
                </p>
              </div>
              <Phone size={16} className='text-white/30' />
            </a>
            <a
              href='tel:1800-103-5555'
              className='flex items-center gap-3 w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 transition-all active:scale-95'
            >
              <div className='w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0'>
                <Wrench size={18} className='text-blue-400' />
              </div>
              <div className='flex-1'>
                <p className='font-semibold text-sm'>Call Mechanic</p>
                <p className='text-white/40 text-xs'>
                  AA Roadside · 1800-103-5555
                </p>
              </div>
              <Phone size={16} className='text-white/30' />
            </a>
          </div>

          {/* ── National helplines ── */}
          <div className='space-y-2'>
            <p className='text-white/30 text-xs uppercase tracking-wider mb-3'>
              National Helplines
            </p>
            <div className='grid grid-cols-2 gap-2'>
              {HELPLINES.map((h) => (
                <a
                  key={h.number}
                  href={`tel:${h.number}`}
                  className='flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-all'
                >
                  <span className='text-white font-bold text-lg'>
                    {h.number}
                  </span>
                  <span className='text-white/50 text-xs text-center'>
                    {h.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ── Footer ── */}
          <p className='text-center text-white/20 text-xs mt-10'>
            Powered by{" "}
            <span className='text-white/40 font-semibold'>ScanFleet</span> ·
            scanfleet.in
          </p>
        </div>
      </div>
    </>
  );
}
