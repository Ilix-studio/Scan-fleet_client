// frontend/src/pages/TrackOrder.tsx
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import {
  Search,
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  useLazyTrackOrderQuery,
  useTrackOrderQuery,
} from "@/redux-store/services/userCentrix/directOrderApi";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof Package }
> = {
  SUBMITTED: {
    label: "Order Confirmed",
    color: "text-blue-600",
    icon: CheckCircle,
  },
  PROCESSING: { label: "Processing", color: "text-yellow-600", icon: Clock },
  READY_TO_PRINT: {
    label: "Ready to Print",
    color: "text-orange-600",
    icon: Package,
  },
  PRINTED: { label: "Printed", color: "text-purple-600", icon: Package },
  SHIPPED: { label: "Shipped", color: "text-cyan-600", icon: Truck },
  DELIVERED: { label: "Delivered", color: "text-green-600", icon: MapPin },
  CANCELLED: { label: "Cancelled", color: "text-red-600", icon: AlertCircle },
};

const TrackOrder = () => {
  const { tokenId: urlTokenId } = useParams<{ tokenId: string }>();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email");

  const [tokenId, setTokenId] = useState(urlTokenId || "");
  const [email, setEmail] = useState(emailParam || "");
  const [_searchedTokenId, setSearchedTokenId] = useState(urlTokenId || "");
  const [_searchedEmail, setSearchedEmail] = useState(emailParam || "");

  const [triggerSearch, { data, isLoading, error, isFetching }] =
    useLazyTrackOrderQuery();

  // Auto-fetch if URL has tokenId
  const { data: autoData, isLoading: autoLoading } = useTrackOrderQuery(
    { tokenId: urlTokenId!, email: emailParam || undefined },
    { skip: !urlTokenId },
  );

  const orderData = urlTokenId ? autoData : data;
  const loading = urlTokenId ? autoLoading : isLoading || isFetching;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenId.trim()) {
      setSearchedTokenId(tokenId.trim());
      setSearchedEmail(email.trim());
      triggerSearch({
        tokenId: tokenId.trim(),
        email: email.trim() || undefined,
      });
    }
  };

  const order = orderData?.data;
  const statusConfig = order ? STATUS_CONFIG[order.status] : null;

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Track Your Order
          </h1>
          <p className='text-gray-600'>
            Enter your order ID to check the status of your sticker
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className='mb-8'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Order ID *
              </label>
              <input
                type='text'
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                placeholder='TKN-2025-00001'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email (for guest orders)
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                placeholder='your@email.com'
              />
            </div>

            <button
              type='submit'
              disabled={!tokenId.trim() || loading}
              className='w-full px-6 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {loading ? (
                <Loader2 className='w-5 h-5 animate-spin' />
              ) : (
                <Search className='w-5 h-5' />
              )}
              Track Order
            </button>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3'>
            <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
            <div>
              <p className='font-medium text-red-800'>Order not found</p>
              <p className='text-sm text-red-600 mt-1'>
                Please check your order ID and try again. For guest orders, make
                sure to enter the email used during checkout.
              </p>
            </div>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className='space-y-6'>
            {/* Status Card */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div>
                  <p className='text-sm text-gray-500'>Order ID</p>
                  <p className='font-mono font-semibold text-gray-900'>
                    {order.tokenId}
                  </p>
                </div>
                {statusConfig && (
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 ${statusConfig.color}`}
                  >
                    <statusConfig.icon className='w-4 h-4' />
                    <span className='text-sm font-medium'>
                      {statusConfig.label}
                    </span>
                  </div>
                )}
              </div>

              {order.customerName && (
                <div className='border-t border-gray-200 pt-4'>
                  <p className='text-sm text-gray-500'>Customer</p>
                  <p className='font-medium text-gray-900'>
                    {order.customerName}
                  </p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <h2 className='font-semibold text-gray-900 mb-4'>
                Order Timeline
              </h2>

              <div className='space-y-4'>
                {order.statusHistory.map((history, index) => {
                  const config = STATUS_CONFIG[history.status];
                  const Icon = config?.icon || Package;

                  return (
                    <div key={index} className='flex items-start gap-4'>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 ${config?.color || "text-gray-400"}`}
                      >
                        <Icon className='w-4 h-4' />
                      </div>
                      <div className='flex-1'>
                        <p className='font-medium text-gray-900'>
                          {config?.label || history.status}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {new Date(history.changedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Info */}
            {order.shippingAddress && (
              <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                <h2 className='font-semibold text-gray-900 mb-3'>
                  Shipping Address
                </h2>
                <p className='text-gray-700'>
                  {order.shippingAddress.locality},{" "}
                  {order.shippingAddress.state}
                </p>
                <p className='text-gray-600 text-sm'>
                  PIN: {order.shippingAddress.pincode}
                </p>

                {order.trackingNumber && (
                  <div className='mt-4 pt-4 border-t border-gray-200'>
                    <p className='text-sm text-gray-500'>Tracking Number</p>
                    <p className='font-mono text-cyan-600'>
                      {order.trackingNumber}
                    </p>
                  </div>
                )}

                {order.estimatedDelivery && (
                  <div className='mt-3 p-3 bg-cyan-50 rounded-lg'>
                    <p className='text-sm text-cyan-800'>
                      <span className='font-medium'>Estimated Delivery:</span>{" "}
                      {order.estimatedDelivery}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
