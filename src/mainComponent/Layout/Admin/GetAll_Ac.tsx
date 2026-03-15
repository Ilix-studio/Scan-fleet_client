// src/mainComponent/Layout/Admin/GetAllAC.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  QrCode,
  User,
  Building2,
  Phone,
  Package,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Tag,
  Clock,
  Truck,
  CheckCircle2,
  Circle,
  Printer,
} from "lucide-react";
import {
  useGetAllAttachCodesQuery,
  type AttachCodeEntry,
} from "@/redux-store/services/AdminCentrix/adminDispatchApi";

// ─── Shipping status badge ────────────────────────────────────────────────────

const SHIPPING_STATUS_STYLES = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: Circle,
  },
  DISPATCHED: {
    label: "Dispatched",
    className: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    icon: CheckCircle2,
  },
} as const;

function ShippingStatusBadge({
  status,
}: {
  status: AttachCodeEntry["shippingStatus"];
}) {
  const s = SHIPPING_STATUS_STYLES[status];
  const Icon = s.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${s.className}`}
    >
      <Icon size={10} />
      {s.label}
    </span>
  );
}

// ─── Role badge ───────────────────────────────────────────────────────────────

const ROLE_STYLES: Record<string, string> = {
  DEALERSHIP_OWNER: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  DEALERSHIP_SALESMAN: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  RENTAL_OWNER: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  DIRECT_CUSTOMER: "bg-pink-500/15 text-pink-300 border-pink-500/30",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
        ROLE_STYLES[role] ?? "bg-white/10 text-white/60 border-white/20"
      }`}
    >
      {role.replace(/_/g, " ")}
    </span>
  );
}

// ─── Single attach code card ──────────────────────────────────────────────────

function AttachCodeCard({ entry }: { entry: AttachCodeEntry }) {
  const navigate = useNavigate();

  const handleViewPrintSheet = () => {
    navigate(`/get-print-sheet?purchaseId=${entry.purchaseId}`);
  };

  return (
    <div className='relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden hover:border-white/20 transition-all duration-200'>
      <div className='h-0.5 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500' />

      <div className='p-4 space-y-3'>
        {/* Attach code + shipping status */}
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-2 min-w-0'>
            <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0'>
              <QrCode size={16} className='text-cyan-400' />
            </div>
            <div className='min-w-0'>
              <span className='text-cyan-300 font-mono font-bold tracking-widest text-sm'>
                {entry.attachCode}
              </span>
              <div className='flex items-center gap-1 mt-0.5'>
                <Package size={10} className='text-white/20 shrink-0' />
                <span className='text-white/30 text-xs font-mono truncate'>
                  {entry.tokenId}
                </span>
              </div>
            </div>
          </div>
          <ShippingStatusBadge status={entry.shippingStatus} />
        </div>

        {/* Buyer info */}
        <div className='rounded-xl bg-black/20 border border-white/5 px-3 py-2.5 space-y-1.5'>
          <div className='flex items-center gap-2'>
            <User size={11} className='text-white/30 shrink-0' />
            <span className='text-white/70 text-xs font-medium truncate'>
              {entry.buyer.name}
            </span>
            <RoleBadge role={entry.buyer.role} />
          </div>
          {entry.buyer.businessName && (
            <div className='flex items-center gap-2'>
              <Building2 size={11} className='text-white/20 shrink-0' />
              <span className='text-white/40 text-xs truncate'>
                {entry.buyer.businessName}
              </span>
            </div>
          )}
          <div className='flex items-center gap-2'>
            <Phone size={11} className='text-white/20 shrink-0' />
            <span className='text-white/40 text-xs'>{entry.buyer.phone}</span>
          </div>
        </div>

        {/* Meta row */}
        <div className='flex items-center justify-between gap-2 text-xs text-white/30'>
          <div className='flex items-center gap-1.5'>
            <Clock size={11} />
            <span>
              {entry.generatedAt
                ? new Date(entry.generatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Tag size={11} />
            <span className='font-mono truncate max-w-[100px]'>
              {entry.purchaseId}
            </span>
          </div>
        </div>

        {/* View Print Sheet button */}
        <button
          onClick={handleViewPrintSheet}
          className='w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium
            bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20
            text-white/50 hover:text-white transition-all duration-200'
        >
          <Printer size={12} />
          View Print Sheet
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function GetAll_Ac() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, isError, isFetching } = useGetAllAttachCodesQuery({
    page,
    limit,
  });

  const codes = data?.data.codes ?? [];
  const total = data?.data.total ?? 0;
  const pages = data?.data.pages ?? 1;

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-24'>
        <div className='w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center py-24 gap-3 text-white/40'>
        <AlertCircle size={32} className='text-red-400' />
        <p className='text-sm'>Failed to load attach codes.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-bold text-white'>All Attach Codes</h2>
          <p className='text-sm text-white/40 mt-0.5'>
            {total} code{total !== 1 ? "s" : ""} generated across all purchases
          </p>
        </div>
        {isFetching && (
          <Loader2 size={16} className='animate-spin text-white/30' />
        )}
      </div>

      {/* Empty state */}
      {!codes.length && (
        <div className='flex flex-col items-center justify-center py-24 text-white/30 gap-3'>
          <QrCode size={40} className='opacity-40' />
          <p className='text-sm'>No attach codes generated yet</p>
        </div>
      )}

      {/* Grid */}
      {codes.length > 0 && (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {codes.map((entry) => (
            <AttachCodeCard key={entry.shippingOrderId} entry={entry} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className='flex items-center justify-center gap-3 pt-2'>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isFetching}
            className='w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all'
          >
            <ChevronLeft size={16} />
          </button>
          <span className='text-sm text-white/40 min-w-[64px] text-center'>
            {page} / {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages || isFetching}
            className='w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all'
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
