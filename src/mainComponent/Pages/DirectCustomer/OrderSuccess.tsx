// frontend/src/pages/OrderSuccess.tsx
import { useParams, Link } from "react-router-dom";

import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Copy,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useTrackOrderQuery } from "@/redux-store/services/userCentrix/directOrderApi";

const OrderSuccess = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = useTrackOrderQuery(
    { tokenId: tokenId! },
    { skip: !tokenId },
  );

  const handleCopyTokenId = () => {
    if (tokenId) {
      navigator.clipboard.writeText(tokenId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-cyan-600' />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>Failed to load order details</p>
          <Link to='/' className='text-cyan-600 hover:underline'>
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const order = data.data;

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-2xl mx-auto px-4'>
        {/* Success Header */}
        <div className='text-center mb-8'>
          <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <CheckCircle className='w-12 h-12 text-green-600' />
          </div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Order Placed Successfully!
          </h1>
          <p className='text-gray-600'>
            Thank you for your order. We'll start processing it right away.
          </p>
        </div>

        {/* Order ID Card */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-500'>Order ID</p>
              <p className='text-lg font-mono font-semibold text-gray-900'>
                {tokenId}
              </p>
            </div>
            <button
              onClick={handleCopyTokenId}
              className='p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors'
              title='Copy Order ID'
            >
              {copied ? (
                <CheckCircle className='w-5 h-5 text-green-600' />
              ) : (
                <Copy className='w-5 h-5' />
              )}
            </button>
          </div>
        </div>

        {/* Order Status */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6'>
          <h2 className='font-semibold text-gray-900 mb-4'>Order Status</h2>

          <div className='relative'>
            {/* Timeline */}
            <div className='absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200' />

            <div className='space-y-6'>
              {/* Submitted */}
              <div className='flex items-start gap-4'>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    [
                      "SUBMITTED",
                      "PROCESSING",
                      "READY_TO_PRINT",
                      "PRINTED",
                      "SHIPPED",
                      "DELIVERED",
                    ].includes(order.status)
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <CheckCircle className='w-4 h-4' />
                </div>
                <div>
                  <p className='font-medium text-gray-900'>Order Confirmed</p>
                  <p className='text-sm text-gray-500'>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Processing */}
              <div className='flex items-start gap-4'>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    [
                      "PROCESSING",
                      "READY_TO_PRINT",
                      "PRINTED",
                      "SHIPPED",
                      "DELIVERED",
                    ].includes(order.status)
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Package className='w-4 h-4' />
                </div>
                <div>
                  <p className='font-medium text-gray-900'>Processing</p>
                  <p className='text-sm text-gray-500'>
                    Preparing your sticker
                  </p>
                </div>
              </div>

              {/* Shipped */}
              <div className='flex items-start gap-4'>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    ["SHIPPED", "DELIVERED"].includes(order.status)
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Truck className='w-4 h-4' />
                </div>
                <div>
                  <p className='font-medium text-gray-900'>Shipped</p>
                  {order.shippedAt ? (
                    <p className='text-sm text-gray-500'>
                      {new Date(order.shippedAt).toLocaleString()}
                    </p>
                  ) : (
                    <p className='text-sm text-gray-500'>Pending</p>
                  )}
                  {order.trackingNumber && (
                    <p className='text-sm text-cyan-600 mt-1'>
                      Tracking: {order.trackingNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Delivered */}
              <div className='flex items-start gap-4'>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <MapPin className='w-4 h-4' />
                </div>
                <div>
                  <p className='font-medium text-gray-900'>Delivered</p>
                  {order.deliveredAt ? (
                    <p className='text-sm text-gray-500'>
                      {new Date(order.deliveredAt).toLocaleString()}
                    </p>
                  ) : (
                    <p className='text-sm text-gray-500'>
                      {order.estimatedDelivery || "3-5 business days"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6'>
            <h2 className='font-semibold text-gray-900 mb-3'>Shipping To</h2>
            <p className='text-gray-700'>{order.customerName}</p>
            <p className='text-gray-600 text-sm'>
              {order.shippingAddress.locality}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.pincode}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <Link
            to={`/track-order/${tokenId}`}
            className='flex-1 px-6 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors text-center flex items-center justify-center gap-2'
          >
            <ExternalLink className='w-4 h-4' />
            Track Order
          </Link>
          <Link
            to='/'
            className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center'
          >
            Continue Shopping
          </Link>
        </div>

        {/* Help Text */}
        <div className='mt-8 text-center text-sm text-gray-500'>
          <p>
            Questions about your order?{" "}
            <Link to='/contact' className='text-cyan-600 hover:underline'>
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
