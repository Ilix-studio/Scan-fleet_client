// src/pages/dashboard/Users/TrackOrders.tsx

import { useState } from "react";

import { useAppSelector } from "@/redux-store/store";
import { selectCurrentUser } from "@/redux-store/slices/authSlice";
import { OrderTrackingData } from "@/types/directOrder.types";
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Hash,
  AlertCircle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useTrackOrderQuery } from "@/redux-store/services/userCentrix/directOrderApi";

// ─── Status config ────────────────────────────────────────────────────────────

type TokenStatus =
  | "PAID_PENDING_DATA"
  | "SUBMITTED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

const STATUS_CONFIG: Record<
  TokenStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: React.ReactNode;
    step: number;
  }
> = {
  PAID_PENDING_DATA: {
    label: "Pending Details",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 border-yellow-200",
    icon: <Clock className='w-4 h-4' />,
    step: 0,
  },
  SUBMITTED: {
    label: "Order Placed",
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
    icon: <Package className='w-4 h-4' />,
    step: 1,
  },
  PROCESSING: {
    label: "Processing",
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
    icon: <RefreshCw className='w-4 h-4' />,
    step: 2,
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200",
    icon: <Truck className='w-4 h-4' />,
    step: 3,
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
    icon: <CheckCircle2 className='w-4 h-4' />,
    step: 4,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
    icon: <AlertCircle className='w-4 h-4' />,
    step: -1,
  },
};

const TIMELINE_STEPS: TokenStatus[] = [
  "SUBMITTED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

function getStatusConfig(status: string) {
  return (
    STATUS_CONFIG[status as TokenStatus] ?? {
      label: status,
      color: "text-gray-600",
      bgColor: "bg-gray-50 border-gray-200",
      icon: <Clock className='w-4 h-4' />,
      step: 0,
    }
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OrderTimeline({ status }: { status: string }) {
  const currentStep = getStatusConfig(status).step;
  const isCancelled = status === "CANCELLED";

  if (isCancelled) {
    return (
      <div className='flex items-center gap-2 text-red-600 text-sm font-medium py-2'>
        <AlertCircle className='w-4 h-4' />
        Order cancelled
      </div>
    );
  }

  return (
    <div className='flex items-center gap-1 mt-4'>
      {TIMELINE_STEPS.map((step, idx) => {
        const config = STATUS_CONFIG[step];
        const isDone = currentStep >= config.step;
        const isActive = currentStep === config.step;

        return (
          <div key={step} className='flex items-center flex-1'>
            <div className='flex flex-col items-center flex-1'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isDone
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-gray-200 text-gray-400"
                } ${isActive ? "ring-4 ring-indigo-100" : ""}`}
              >
                {isDone ? (
                  <CheckCircle2 className='w-4 h-4' />
                ) : (
                  <span className='text-xs font-bold'>{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium text-center leading-tight ${
                  isDone ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                {config.label}
              </span>
            </div>
            {idx < TIMELINE_STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mb-4 transition-all ${
                  currentStep > config.step ? "bg-indigo-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ data }: { data: OrderTrackingData }) {
  const config = getStatusConfig(data.status);

  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
      {/* Header */}
      <div
        className={`px-5 py-4 border-b ${config.bgColor} flex items-center justify-between`}
      >
        <div className='flex items-center gap-2'>
          <span className={config.color}>{config.icon}</span>
          <span className={`text-sm font-semibold ${config.color}`}>
            {config.label}
          </span>
        </div>
        <span className='text-xs text-gray-500 font-mono bg-white/70 px-2 py-1 rounded-md'>
          {data.tokenId}
        </span>
      </div>

      {/* Body */}
      <div className='px-5 py-4 space-y-4'>
        {/* Timeline */}
        <OrderTimeline status={data.status} />

        {/* Details grid */}
        <div className='grid grid-cols-2 gap-3 pt-2'>
          {data.customerName && (
            <InfoCell label='Customer' value={data.customerName} />
          )}
          {data.shippingAddress && (
            <InfoCell
              label='Destination'
              value={`${data.shippingAddress.locality}, ${data.shippingAddress.state} – ${data.shippingAddress.pincode}`}
              icon={<MapPin className='w-3.5 h-3.5' />}
            />
          )}
          {data.trackingNumber && (
            <InfoCell
              label='Tracking #'
              value={data.trackingNumber}
              icon={<Hash className='w-3.5 h-3.5' />}
              mono
            />
          )}
          {data.estimatedDelivery && (
            <InfoCell label='Est. Delivery' value={data.estimatedDelivery} />
          )}
        </div>

        {/* Status history */}
        {data.statusHistory?.length > 0 && (
          <details className='group'>
            <summary className='cursor-pointer text-xs font-medium text-gray-500 flex items-center gap-1 select-none'>
              <ChevronRight className='w-3.5 h-3.5 transition-transform group-open:rotate-90' />
              Status history ({data.statusHistory.length} events)
            </summary>
            <ol className='mt-2 space-y-1.5 pl-4 border-l-2 border-gray-100'>
              {[...data.statusHistory].reverse().map((h, i) => (
                <li
                  key={i}
                  className='flex justify-between text-xs text-gray-600'
                >
                  <span className='font-medium'>
                    {getStatusConfig(h.status).label}
                  </span>
                  <span className='text-gray-400'>
                    {new Date(h.changedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </li>
              ))}
            </ol>
          </details>
        )}
      </div>

      {/* Footer timestamps */}
      <div className='px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400'>
        <span>
          Placed:{" "}
          {new Date(data.createdAt).toLocaleDateString("en-IN", {
            dateStyle: "medium",
          })}
        </span>
        {data.shippedAt && (
          <span>
            Shipped:{" "}
            {new Date(data.shippedAt).toLocaleDateString("en-IN", {
              dateStyle: "medium",
            })}
          </span>
        )}
        {data.deliveredAt && (
          <span>
            Delivered:{" "}
            {new Date(data.deliveredAt).toLocaleDateString("en-IN", {
              dateStyle: "medium",
            })}
          </span>
        )}
      </div>
    </div>
  );
}

function InfoCell({
  label,
  value,
  icon,
  mono = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className='min-w-0'>
      <p className='text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5'>
        {label}
      </p>
      <p
        className={`text-sm text-gray-800 truncate flex items-center gap-1 ${
          mono ? "font-mono" : "font-medium"
        }`}
      >
        {icon && <span className='text-gray-400 shrink-0'>{icon}</span>}
        {value}
      </p>
    </div>
  );
}

// ─── Search form ──────────────────────────────────────────────────────────────

interface SearchFormProps {
  onSearch: (tokenId: string, email?: string) => void;
  isGuest: boolean;
  isLoading: boolean;
}

function SearchForm({ onSearch, isGuest, isLoading }: SearchFormProps) {
  const [tokenId, setTokenId] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    const trimmedId = tokenId.trim();
    if (!trimmedId) return;
    onSearch(trimmedId, isGuest ? email.trim() || undefined : undefined);
  };

  return (
    <div className='bg-black rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3'>
      <h3 className='text-sm font-semibold text-white'>Track your order</h3>
      <div className='flex flex-col sm:flex-row gap-2'>
        <input
          type='text'
          placeholder='Token ID (e.g. TKN-XXXX)'
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className='flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono placeholder:font-sans'
        />
        {isGuest && (
          <input
            type='email'
            placeholder='Order email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className='flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
          />
        )}
        <button
          onClick={handleSubmit}
          disabled={!tokenId.trim() || isLoading}
          className='flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          {isLoading ? (
            <RefreshCw className='w-4 h-4 animate-spin' />
          ) : (
            <Search className='w-4 h-4' />
          )}
          Track
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface TrackOrderFetcherProps {
  tokenId: string;
  email?: string;
  isGuest: boolean;
}

function TrackOrderFetcher({
  tokenId,
  email,
  isGuest,
}: TrackOrderFetcherProps) {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useTrackOrderQuery({ tokenId, email }, { skip: !tokenId });

  if (isLoading || isFetching) {
    return (
      <div className='flex items-center justify-center py-12 gap-3 text-gray-500'>
        <RefreshCw className='w-5 h-5 animate-spin' />
        <span className='text-sm'>Fetching order details…</span>
      </div>
    );
  }

  if (isError) {
    const message =
      (error as any)?.data?.message ??
      "Order not found. Check the token ID and try again.";
    return (
      <div className='flex flex-col items-center gap-3 py-10 text-center'>
        <AlertCircle className='w-10 h-10 text-red-400' />
        <p className='text-sm text-red-600 font-medium'>{message}</p>
        {isGuest && (
          <p className='text-xs text-gray-400'>
            Guest orders require a matching email address.
          </p>
        )}
        <button
          onClick={() => refetch()}
          className='text-xs text-indigo-600 hover:underline'
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data?.data) return null;

  return <OrderCard data={data.data} />;
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function TrackOrders() {
  const user = useAppSelector(selectCurrentUser);
  const isGuest = !user;

  const [searchParams, setSearchParams] = useState<{
    tokenId: string;
    email?: string;
  } | null>(null);

  const handleSearch = (tokenId: string, email?: string) => {
    setSearchParams({ tokenId, email });
  };

  // useTrackOrderQuery skip logic lives inside TrackOrderFetcher
  // We drive loading state from a dummy query for the button UX
  const { isFetching } = useTrackOrderQuery(
    { tokenId: searchParams?.tokenId ?? "", email: searchParams?.email },
    { skip: !searchParams?.tokenId },
  );

  return (
    <div className='max-w-2xl mx-auto px-4 py-6 space-y-5'>
      {/* Page header */}
      <div>
        <h1 className='text-xl font-bold text-white flex items-center gap-2'>
          <Truck className='w-5 h-5 text-indigo-600' />
          Track Order
        </h1>
        <p className='text-sm text-gray-500 mt-0.5'>
          Enter your order ID to check real-time delivery status.
        </p>
      </div>

      <SearchForm
        onSearch={handleSearch}
        isGuest={isGuest}
        isLoading={isFetching}
      />

      {searchParams?.tokenId && (
        <TrackOrderFetcher
          tokenId={searchParams.tokenId}
          email={searchParams.email}
          isGuest={isGuest}
        />
      )}

      {!searchParams && (
        <div className='flex flex-col items-center gap-3 py-12 text-center text-gray-400'>
          <Package className='w-12 h-12 opacity-30' />
          <p className='text-sm'>Your order details will appear here.</p>
        </div>
      )}
    </div>
  );
}
