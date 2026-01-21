// frontend/src/pages/DirectCheckout.tsx
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  selectCheckoutStep,
  selectFormData,
  selectIsGuest,
  selectIsProcessing,
  selectError,
  setStep,
  nextStep,
  prevStep,
  updateFormData,
  setProcessing,
  setError,
  setOrderDetails,
  resetCheckout,
  prefillFromUser,
} from "@/redux-store/slices/directOrderSlice";

import { useGetUserProfileQuery } from "@/redux-store/services/userAuthApi";
import {
  CheckoutStep,
  CreateDirectOrderRequest,
} from "@/types/directOrder.types";
import { RazorpayOptions, RazorpayResponse } from "@/types/razorpay";
import {
  useCreateDirectOrderMutation,
  useVerifyDirectOrderMutation,
} from "@/redux-store/services/userCentrix/directOrderApi";
import CustomerDataStep from "./CustomerDataStep";
import ShippingAddressStep from "./ShippingAddressStep";
import CustomizationStep from "./CustomizationStep";
import PaymentStep from "./PaymentStep";
import CheckoutProgress from "./CheckoutProgress";
import { useAppDispatch, useAppSelector } from "@/redux-store/store";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

const STICKER_PRICE = 500;

const DirectCheckout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const step = useAppSelector(selectCheckoutStep);
  const formData = useAppSelector(selectFormData);
  const isGuest = useAppSelector(selectIsGuest);
  const isProcessing = useAppSelector(selectIsProcessing);
  const error = useAppSelector(selectError);

  const { data: userProfile } = useGetUserProfileQuery(undefined, {
    skip: isGuest,
  });

  const [createOrder] = useCreateDirectOrderMutation();
  const [verifyPayment] = useVerifyDirectOrderMutation();

  // Prefill from logged-in user
  useEffect(() => {
    if (userProfile) {
      dispatch(
        prefillFromUser({
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
        }),
      );
    }
  }, [userProfile, dispatch]);

  // Reset on unmount
  useEffect(() => {
    return () => {
      dispatch(resetCheckout());
    };
  }, [dispatch]);

  const buildOrderRequest = useCallback((): CreateDirectOrderRequest => {
    return {
      customerData: {
        stickerUserName: formData.stickerUserName.trim(),
        primaryPhoneNumber: formData.primaryPhoneNumber,
        emergencyContact1: formData.emergencyContact1,
        emergencyContact2: formData.emergencyContact2,
        additionalContact: formData.additionalContact || undefined,
        vehicleDetails: formData.vehicleNumber
          ? {
              vehicleNumber: formData.vehicleNumber,
              vehicleType: formData.vehicleType || undefined,
              vehicleModel: formData.vehicleModel || undefined,
            }
          : undefined,
      },
      shippingAddress: {
        fullName: formData.fullName.trim(),
        phone: formData.phone,
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2?.trim() || undefined,
        locality: formData.locality.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode,
        country: "India",
        landmark: formData.landmark?.trim() || undefined,
      },
      customizationData: {
        backgroundColor: formData.backgroundColor,
        textColor: formData.textColor,
        customMessage: formData.customMessage?.trim() || undefined,
      },
      guestEmail: isGuest ? formData.guestEmail?.toLowerCase() : undefined,
      guestPhone: isGuest ? formData.guestPhone : undefined,
    };
  }, [formData, isGuest]);

  const handlePayment = useCallback(async () => {
    dispatch(setProcessing(true));
    dispatch(setError(null));

    try {
      const orderRequest = buildOrderRequest();
      const { data: orderData } = await createOrder(orderRequest).unwrap();

      if (!orderData) {
        throw new Error("Failed to create order");
      }

      dispatch(
        setOrderDetails({
          orderId: orderData.orderId,
          purchaseId: orderData.purchaseId,
        }),
      );

      // Initialize Razorpay
      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ScanFleet",
        description: "Smart QR Sticker",
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            dispatch(
              setOrderDetails({
                tokenId: verifyResult.data.tokenId,
              }),
            );

            // Navigate to success
            navigate(`/order-success/${verifyResult.data.tokenId}`);
          } catch (err: any) {
            dispatch(
              setError(err.data?.message || "Payment verification failed"),
            );
          } finally {
            dispatch(setProcessing(false));
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.guestEmail || userProfile?.email,
          contact: formData.phone,
        },
        theme: {
          color: "#06B6D4",
        },
        modal: {
          ondismiss: () => {
            dispatch(setProcessing(false));
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      dispatch(setError(err.data?.message || "Failed to create order"));
      dispatch(setProcessing(false));
    }
  }, [
    buildOrderRequest,
    createOrder,
    verifyPayment,
    dispatch,
    navigate,
    formData,
    userProfile,
  ]);

  const handleStepChange = (newStep: CheckoutStep) => {
    dispatch(setStep(newStep));
  };

  const handleNext = () => {
    dispatch(nextStep());
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  const handleFormUpdate = (data: Partial<typeof formData>) => {
    dispatch(updateFormData(data));
  };

  const renderStep = () => {
    switch (step) {
      case "customer":
        return (
          <CustomerDataStep
            formData={formData}
            onUpdate={handleFormUpdate}
            onNext={handleNext}
            isGuest={isGuest}
          />
        );
      case "shipping":
        return (
          <ShippingAddressStep
            formData={formData}
            onUpdate={handleFormUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case "customization":
        return (
          <CustomizationStep
            formData={formData}
            onUpdate={handleFormUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case "payment":
        return (
          <PaymentStep
            formData={formData}
            price={STICKER_PRICE}
            isProcessing={isProcessing}
            error={error}
            onPay={handlePayment}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-3xl mx-auto px-4'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Order Smart QR Sticker
          </h1>
          <p className='text-gray-600'>
            Complete the form below to order your emergency contact sticker
          </p>
        </div>

        <CheckoutProgress currentStep={step} onStepClick={handleStepChange} />

        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6'>
          {renderStep()}
        </div>

        {/* Price summary */}
        <div className='mt-6 bg-cyan-50 rounded-lg p-4 flex justify-between items-center'>
          <div>
            <span className='text-sm text-gray-600'>Total Amount</span>
            <p className='text-2xl font-bold text-cyan-600'>₹{STICKER_PRICE}</p>
          </div>
          <div className='text-right text-sm text-gray-500'>
            <p>Includes GST</p>
            <p>Free shipping all over India</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectCheckout;
