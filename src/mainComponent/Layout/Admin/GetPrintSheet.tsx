// src/mainComponent/Layout/Admin/GetPrintSheet.tsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Building2,
  MapPin,
  Phone,
  QrCode,
  Package,
  ExternalLink,
  Printer,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Tag,
} from "lucide-react";
import {
  useGetPrintDataQuery,
  type PrintCode,
} from "@/redux-store/services/AdminCentrix/adminDispatchApi";

type Tab = "codes" | "shipping";

// ─── Attach code row ──────────────────────────────────────────────────────────

function AttachCodeRow({ code, index }: { code: PrintCode; index: number }) {
  return (
    <div className='flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 transition-colors'>
      <div className='w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0'>
        <span className='text-xs text-white/30 font-mono'>{index + 1}</span>
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <QrCode size={13} className='text-cyan-400 shrink-0' />
          <span className='text-cyan-300 font-mono font-bold tracking-widest text-sm'>
            {code.attachCode}
          </span>
        </div>
        <div className='flex items-center gap-1.5 mt-1'>
          <Package size={11} className='text-white/20 shrink-0' />
          <span className='text-white/30 text-xs font-mono truncate'>
            {code.tokenId}
          </span>
        </div>
      </div>

      <a
        href={code.qrUrl}
        target='_blank'
        rel='noreferrer'
        title={code.qrUrl}
        className='flex items-center gap-1.5 text-xs text-white/30 hover:text-cyan-400 transition-colors shrink-0 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5'
      >
        <ExternalLink size={11} />
        <span>QR</span>
      </a>
    </div>
  );
}

// ─── Shipping detail row ──────────────────────────────────────────────────────

function ShippingRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string;
  icon: React.ElementType;
}) {
  if (!value) return null;
  return (
    <div className='flex items-start gap-3 py-3 border-b border-white/5 last:border-0'>
      <div className='w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5'>
        <Icon size={13} className='text-white/40' />
      </div>
      <div>
        <div className='text-xs text-white/30 mb-0.5'>{label}</div>
        <div className='text-sm text-white font-medium'>{value}</div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GetPrintSheet() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const purchaseId = searchParams.get("purchaseId") ?? "";
  const [activeTab, setActiveTab] = useState<Tab>("codes");

  // Redirect to admin dashboard if accessed without a purchaseId
  useEffect(() => {
    if (!purchaseId) {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [purchaseId, navigate]);

  const { data, isLoading, isError } = useGetPrintDataQuery(purchaseId, {
    skip: !purchaseId,
  });

  // Render nothing while redirect fires
  if (!purchaseId) return null;

  if (isLoading) {
    return (
      <div
        className='min-h-screen flex items-center justify-center'
        style={{ background: "#000000" }}
      >
        <div className='flex flex-col items-center gap-3 text-white/30'>
          <Loader2 size={28} className='animate-spin text-cyan-400' />
          <p className='text-sm'>Loading print sheet…</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        className='min-h-screen flex flex-col items-center justify-center gap-4 text-white/40'
        style={{ background: "#000000" }}
      >
        <AlertCircle size={32} className='text-red-400' />
        <p className='text-sm'>Failed to load print data.</p>
        <button
          onClick={() => navigate(-1)}
          className='text-xs text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2'
        >
          Go back
        </button>
      </div>
    );
  }

  const { buyer, codes } = data.data;

  return (
    <div
      className='min-h-screen'
      style={{
        background: `
          radial-gradient(ellipse 160% 130% at 10% 10%, rgba(0,255,255,0.08), transparent 60%),
          radial-gradient(ellipse 160% 130% at 90% 90%, rgba(138,43,226,0.12), transparent 65%),
          #000000
        `,
      }}
    >
      <div className='max-w-3xl mx-auto px-4 py-8 space-y-6'>
        {/* Back + header */}
        <div className='flex items-center gap-4'>
          <button
            onClick={() => navigate(-1)}
            className='w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0'
          >
            <ArrowLeft size={16} className='text-white/60' />
          </button>
          <div>
            <h1 className='text-lg font-bold text-white'>Print Sheet</h1>
            <div className='flex items-center gap-1 mt-0.5'>
              <Tag size={11} className='text-white/20' />
              <span className='text-xs text-white/30 font-mono'>
                {purchaseId}
              </span>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className='ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
              bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20
              text-white/60 hover:text-white transition-all'
          >
            <Printer size={14} />
            Print
          </button>
        </div>

        {/* Buyer card */}
        <div className='rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden'>
          <div className='h-0.5 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500' />
          <div className='p-5'>
            <div className='flex items-center gap-3'>
              <div className='w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0'>
                <User size={20} className='text-cyan-400' />
              </div>
              <div className='min-w-0'>
                <span className='text-white font-semibold'>{buyer.name}</span>
                {buyer.businessName && (
                  <div className='flex items-center gap-1 mt-0.5 text-white/40 text-xs'>
                    <Building2 size={11} />
                    <span className='truncate'>{buyer.businessName}</span>
                  </div>
                )}
              </div>
              <div className='ml-auto shrink-0 text-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2'>
                <div className='text-lg font-bold text-emerald-400 leading-none'>
                  {codes.length}
                </div>
                <div className='text-emerald-400/60 text-xs mt-0.5'>
                  sticker{codes.length > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/40'>
              <div className='flex items-center gap-2'>
                <Phone size={12} className='text-white/20' />
                <span>{buyer.phone}</span>
              </div>
              <div className='flex items-center gap-2'>
                <MapPin size={12} className='text-white/20' />
                <span className='truncate'>{buyer.deliveryAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl w-fit'>
          <button
            onClick={() => setActiveTab("codes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "codes"
                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/10 text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <QrCode size={14} />
            Attach Codes
            <span className='text-xs bg-white/10 rounded-full px-1.5 py-0.5 leading-none'>
              {codes.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "shipping"
                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/10 text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <Package size={14} />
            Shipping Details
          </button>
        </div>

        {/* Tab: Attach Codes */}
        {activeTab === "codes" && (
          <div className='rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 space-y-3'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-xs text-white/30'>
                Print these codes and include one per sticker package.
              </p>
              <div className='flex items-center gap-1.5 text-xs text-emerald-400'>
                <CheckCircle2 size={12} />
                Ready to print
              </div>
            </div>
            {codes.map((c, i) => (
              <AttachCodeRow key={c.attachCode} code={c} index={i} />
            ))}
          </div>
        )}

        {/* Tab: Shipping Details */}
        {activeTab === "shipping" && (
          <div className='rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5'>
            <h3 className='text-xs font-semibold text-white/30 uppercase tracking-widest mb-4'>
              Delivery Information
            </h3>
            <ShippingRow
              label='Recipient Name'
              value={buyer.name}
              icon={User}
            />
            <ShippingRow
              label='Business'
              value={buyer.businessName}
              icon={Building2}
            />
            <ShippingRow
              label='Delivery Address'
              value={buyer.deliveryAddress}
              icon={MapPin}
            />
            <ShippingRow
              label='Contact Phone'
              value={buyer.phone}
              icon={Phone}
            />

            <div className='mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20'>
              <p className='text-xs text-amber-300/70 leading-relaxed'>
                Ship{" "}
                <strong className='text-amber-300'>
                  {codes.length} sticker package
                  {codes.length > 1 ? "s" : ""}
                </strong>{" "}
                to the address above. Each package must contain its
                corresponding attach code printed on the back.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
