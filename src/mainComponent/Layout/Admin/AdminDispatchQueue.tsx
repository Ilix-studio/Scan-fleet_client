// src/mainComponent/Layout/Admin/AdminDispatchQueue.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  QrCode,
  User,
  Building2,
  Phone,
  Coins,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Tag,
} from "lucide-react";
import {
  useGetPendingPurchasesQuery,
  useGenerateAttachCodesMutation,
  type PendingPurchaseGroup,
} from "@/redux-store/services/AdminCentrix/adminDispatchApi";

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

// ─── Purchase card ────────────────────────────────────────────────────────────

function PurchaseCard({ group }: { group: PendingPurchaseGroup }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [generateAttachCodes, { isLoading, isSuccess, error }] =
    useGenerateAttachCodesMutation();

  const handleGenerate = async () => {
    try {
      await generateAttachCodes({ purchaseId: group.purchaseId }).unwrap();
      // Navigate to print sheet with purchaseId in query string
      navigate(`/get-print-sheet?purchaseId=${group.purchaseId}`);
    } catch {
      // error surfaced via RTK error state
    }
  };

  const errMsg =
    error && "data" in error
      ? (error.data as any)?.message
      : error
        ? "Failed to generate codes"
        : null;

  return (
    <div className='relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition-all duration-200 hover:border-white/20'>
      {/* Top accent */}
      <div className='h-0.5 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500' />

      <div className='p-5'>
        {/* Header */}
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0'>
              <User size={18} className='text-cyan-400' />
            </div>
            <div className='min-w-0'>
              <div className='flex items-center gap-2 flex-wrap'>
                <span className='text-white font-semibold text-sm'>
                  {group.buyerName}
                </span>
                <RoleBadge role={group.buyerRole} />
              </div>
              {group.businessName && (
                <div className='flex items-center gap-1 mt-0.5 text-white/50 text-xs'>
                  <Building2 size={11} />
                  <span className='truncate'>{group.businessName}</span>
                </div>
              )}
              <div className='flex items-center gap-1 mt-0.5 text-white/30 text-xs'>
                <Tag size={11} />
                <span className='font-mono truncate'>{group.purchaseId}</span>
              </div>
            </div>
          </div>

          {/* Token count */}
          <div className='shrink-0 text-center bg-white/5 border border-white/10 rounded-xl px-3 py-2'>
            <div className='text-lg font-bold text-white leading-none'>
              {group.tokenCount}
            </div>
            <div className='text-white/40 text-xs mt-0.5'>
              token{group.tokenCount > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className='mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 text-xs text-white/50'>
          <div className='flex items-center gap-1.5'>
            <Phone size={11} className='text-white/30' />
            <span>{group.phone}</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Coins size={11} className='text-white/30' />
            <span>₹{group.totalAmount}</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <CalendarDays size={11} className='text-white/30' />
            <span>
              {new Date(group.paidAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          {group.businessAddress && (
            <div className='flex items-center gap-1.5 col-span-2 sm:col-span-3'>
              <MapPin size={11} className='text-white/30 shrink-0' />
              <span className='truncate'>{group.businessAddress}</span>
            </div>
          )}
        </div>

        {/* Token toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className='mt-3 flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors'
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? "Hide" : "Show"} tokens
        </button>

        {expanded && (
          <div className='mt-3 space-y-1.5'>
            {group.tokens.map((t) => (
              <div
                key={t._id}
                className='flex items-center justify-between bg-black/20 rounded-lg px-3 py-2 text-xs'
              >
                <div className='flex items-center gap-2'>
                  <Package size={12} className='text-white/30' />
                  <span className='font-mono text-white/70'>{t.tokenId}</span>
                </div>
                <span className='text-amber-400/80 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5'>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {errMsg && (
          <div className='mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2'>
            <AlertCircle size={13} />
            {errMsg}
          </div>
        )}

        {/* Action */}
        <div className='mt-4'>
          {isSuccess ? (
            <div className='flex items-center justify-center gap-2 text-emerald-400 text-sm font-medium py-2'>
              <CheckCircle2 size={16} />
              Redirecting to print sheet…
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className='w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                text-white shadow-lg shadow-cyan-500/20'
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className='animate-spin' />
                  Generating…
                </>
              ) : (
                <>
                  <QrCode size={15} />
                  Generate Attach Codes
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminDispatchQueue() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching } = useGetPendingPurchasesQuery({
    page,
    limit: 20,
  });

  const groups = data?.data.groups ?? [];
  const pagination = data?.data.pagination;

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-24'>
        <div className='w-8 h-8 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center py-24 text-white/50 gap-3'>
        <AlertCircle size={32} className='text-red-400' />
        <p>Failed to load pending purchases.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-bold text-white'>Dispatch Queue</h2>
          <p className='text-sm text-white/40 mt-0.5'>
            {pagination?.total ?? 0} purchase
            {(pagination?.total ?? 0) !== 1 ? "s" : ""} pending attach code
            generation
          </p>
        </div>
        {isFetching && (
          <Loader2 size={16} className='animate-spin text-white/30' />
        )}
      </div>

      {!groups.length && (
        <div className='flex flex-col items-center justify-center py-24 text-white/30 gap-3'>
          <Package size={40} className='opacity-40' />
          <p className='text-sm'>No pending purchases</p>
        </div>
      )}

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {groups.map((group) => (
          <PurchaseCard key={group.purchaseId} group={group} />
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className='flex items-center justify-center gap-3 pt-4'>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className='px-4 py-2 text-sm rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all'
          >
            Previous
          </button>
          <span className='text-sm text-white/40'>
            {page} / {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className='px-4 py-2 text-sm rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
