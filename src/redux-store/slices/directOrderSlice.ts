// frontend/src/redux-store/slices/directOrderSlice.ts
import {
  CheckoutFormData,
  CheckoutState,
  CheckoutStep,
} from "@/types/directOrder.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialFormData: CheckoutFormData = {
  // Customer
  stickerUserName: "",
  primaryPhoneNumber: "",
  emergencyContact1: "",
  emergencyContact2: "",
  additionalContact: "",
  vehicleNumber: "",
  vehicleType: "",
  vehicleModel: "",
  // Shipping
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  locality: "",
  district: "",
  state: "",
  pincode: "",
  landmark: "",
  // Guest
  guestEmail: "",
  guestPhone: "",
  // Customization
  backgroundColor: "#FFFFFF",
  textColor: "#000000",
  customMessage: "",
};

const initialState: CheckoutState = {
  step: "customer",
  formData: initialFormData,
  isGuest: true,
  isProcessing: false,
  error: null,
  orderId: null,
  purchaseId: null,
  tokenId: null,
};

const directOrderSlice = createSlice({
  name: "directOrder",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<CheckoutStep>) => {
      state.step = action.payload;
      state.error = null;
    },

    nextStep: (state) => {
      const steps: CheckoutStep[] = [
        "customer",
        "shipping",
        "customization",
        "payment",
      ];
      const currentIndex = steps.indexOf(state.step);
      if (currentIndex < steps.length - 1) {
        state.step = steps[currentIndex + 1];
        state.error = null;
      }
    },

    prevStep: (state) => {
      const steps: CheckoutStep[] = [
        "customer",
        "shipping",
        "customization",
        "payment",
      ];
      const currentIndex = steps.indexOf(state.step);
      if (currentIndex > 0) {
        state.step = steps[currentIndex - 1];
        state.error = null;
      }
    },

    updateFormData: (
      state,
      action: PayloadAction<Partial<CheckoutFormData>>,
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    setIsGuest: (state, action: PayloadAction<boolean>) => {
      state.isGuest = action.payload;
    },

    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setOrderDetails: (
      state,
      action: PayloadAction<{
        orderId?: string;
        purchaseId?: string;
        tokenId?: string;
      }>,
    ) => {
      if (action.payload.orderId) state.orderId = action.payload.orderId;
      if (action.payload.purchaseId)
        state.purchaseId = action.payload.purchaseId;
      if (action.payload.tokenId) state.tokenId = action.payload.tokenId;
    },

    resetCheckout: () => initialState,

    // Prefill from logged-in user
    prefillFromUser: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        phone: string;
      }>,
    ) => {
      state.formData.fullName = action.payload.name;
      state.formData.phone = action.payload.phone;
      state.formData.stickerUserName = action.payload.name;
      state.isGuest = false;
    },

    // Copy shipping phone to customer
    copyShippingToCustomer: (state) => {
      state.formData.primaryPhoneNumber = state.formData.phone;
    },
  },
});

export const {
  setStep,
  nextStep,
  prevStep,
  updateFormData,
  setIsGuest,
  setProcessing,
  setError,
  setOrderDetails,
  resetCheckout,
  prefillFromUser,
  copyShippingToCustomer,
} = directOrderSlice.actions;

export default directOrderSlice.reducer;

// Selectors
export const selectCheckoutStep = (state: { directOrder: CheckoutState }) =>
  state.directOrder.step;

export const selectFormData = (state: { directOrder: CheckoutState }) =>
  state.directOrder.formData;

export const selectIsGuest = (state: { directOrder: CheckoutState }) =>
  state.directOrder.isGuest;

export const selectIsProcessing = (state: { directOrder: CheckoutState }) =>
  state.directOrder.isProcessing;

export const selectError = (state: { directOrder: CheckoutState }) =>
  state.directOrder.error;

export const selectOrderDetails = (state: { directOrder: CheckoutState }) => ({
  orderId: state.directOrder.orderId,
  purchaseId: state.directOrder.purchaseId,
  tokenId: state.directOrder.tokenId,
});
