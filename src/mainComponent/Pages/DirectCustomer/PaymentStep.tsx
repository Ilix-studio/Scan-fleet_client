// frontend/src/components/checkout/PaymentStep.tsx
import { CheckoutFormData } from "@/types/directOrder.types";
import {
  CreditCard,
  ChevronLeft,
  Shield,
  Truck,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface Props {
  formData: CheckoutFormData;
  price: number;
  isProcessing: boolean;
  error: string | null;
  onPay: () => void;
  onBack: () => void;
}

const PaymentStep = ({
  formData,
  price,
  isProcessing,
  error,
  onPay,
  onBack,
}: Props) => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4'>
        <CreditCard className='w-5 h-5 text-cyan-600' />
        <span>Review & Pay</span>
      </div>

      {/* Order Summary */}
      <div className='bg-gray-50 rounded-lg p-4 space-y-4'>
        <h3 className='font-medium text-gray-800'>Order Summary</h3>

        {/* Customer Info */}
        <div className='border-b border-gray-200 pb-3'>
          <p className='text-sm text-gray-500'>Customer</p>
          <p className='font-medium'>{formData.stickerUserName}</p>
          <p className='text-sm text-gray-600'>
            +91 {formData.primaryPhoneNumber}
          </p>
        </div>

        {/* Shipping Address */}
        <div className='border-b border-gray-200 pb-3'>
          <p className='text-sm text-gray-500'>Shipping To</p>
          <p className='font-medium'>{formData.fullName}</p>
          <p className='text-sm text-gray-600'>
            {formData.addressLine1}
            {formData.addressLine2 && `, ${formData.addressLine2}`}
          </p>
          <p className='text-sm text-gray-600'>
            {formData.locality}, {formData.district}
          </p>
          <p className='text-sm text-gray-600'>
            {formData.state} - {formData.pincode}
          </p>
        </div>

        {/* Emergency Contacts */}
        <div className='border-b border-gray-200 pb-3'>
          <p className='text-sm text-gray-500'>Emergency Contacts</p>
          <p className='text-sm text-gray-600'>
            Contact 1: +91 {formData.emergencyContact1}
          </p>
          <p className='text-sm text-gray-600'>
            Contact 2: +91 {formData.emergencyContact2}
          </p>
          {formData.additionalContact && (
            <p className='text-sm text-gray-600'>
              Additional: +91 {formData.additionalContact}
            </p>
          )}
        </div>

        {/* Customization */}
        <div className='flex items-center gap-4'>
          <p className='text-sm text-gray-500'>Sticker Color</p>
          <div className='flex items-center gap-2'>
            <div
              className='w-6 h-6 rounded border border-gray-300'
              style={{ backgroundColor: formData.backgroundColor }}
            />
            <span className='text-sm text-gray-600'>
              {formData.backgroundColor}
            </span>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className='bg-white border border-gray-200 rounded-lg p-4 space-y-3'>
        <div className='flex justify-between text-gray-600'>
          <span>Smart QR Sticker</span>
          <span>₹{price}</span>
        </div>
        <div className='flex justify-between text-gray-600'>
          <span>Shipping</span>
          <span className='text-green-600'>FREE</span>
        </div>
        <div className='flex justify-between text-gray-600'>
          <span>GST (Included)</span>
          <span>₹{Math.round(price * 0.18)}</span>
        </div>
        <div className='border-t border-gray-200 pt-3 flex justify-between font-semibold text-lg'>
          <span>Total</span>
          <span className='text-cyan-600'>₹{price}</span>
        </div>
      </div>

      {/* Features */}
      <div className='grid grid-cols-3 gap-4 text-center'>
        <div className='flex flex-col items-center gap-1'>
          <Shield className='w-6 h-6 text-green-600' />
          <span className='text-xs text-gray-600'>Secure Payment</span>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <Truck className='w-6 h-6 text-blue-600' />
          <span className='text-xs text-gray-600'>Free Delivery</span>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <CheckCircle className='w-6 h-6 text-cyan-600' />
          <span className='text-xs text-gray-600'>Quality Assured</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm'>
          {error}
        </div>
      )}

      {/* Payment Methods Info */}
      <div className='text-center text-sm text-gray-500'>
        <p>Pay securely with</p>
        <div className='flex justify-center items-center gap-4 mt-2'>
          <span className='px-3 py-1 bg-gray-100 rounded text-xs'>UPI</span>
          <span className='px-3 py-1 bg-gray-100 rounded text-xs'>Cards</span>
          <span className='px-3 py-1 bg-gray-100 rounded text-xs'>
            NetBanking
          </span>
          <span className='px-3 py-1 bg-gray-100 rounded text-xs'>Wallets</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className='flex justify-between pt-4'>
        <button
          type='button'
          onClick={onBack}
          disabled={isProcessing}
          className='px-4 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50'
        >
          <ChevronLeft className='w-4 h-4' />
          Back
        </button>
        <button
          type='button'
          onClick={onPay}
          disabled={isProcessing}
          className='px-8 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
        >
          {isProcessing ? (
            <>
              <Loader2 className='w-5 h-5 animate-spin' />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className='w-5 h-5' />
              Pay ₹{price}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentStep;
