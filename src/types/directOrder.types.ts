// frontend/src/types/directOrder.types.ts

export interface CustomerData {
  stickerUserName: string;
  primaryPhoneNumber: string;
  emergencyContact1: string;
  emergencyContact2: string;
  additionalContact?: string;
  vehicleDetails?: {
    vehicleNumber?: string;
    vehicleType?: string;
    vehicleModel?: string;
  };
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  locality: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
}

export interface CustomizationData {
  backgroundColor?: string;
  textColor?: string;
  logoUrl?: string;
  customMessage?: string;
  designTemplate?: string;
}

export interface CreateDirectOrderRequest {
  customerData: CustomerData;
  shippingAddress: ShippingAddress;
  customizationData?: CustomizationData;
  guestEmail?: string;
  guestPhone?: string;
}

export interface CreateDirectOrderResponse {
  success: boolean;
  data: {
    purchaseId: string;
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    isGuest: boolean;
    pricePerToken: number;
  };
}

export interface VerifyDirectOrderRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyDirectOrderResponse {
  success: boolean;
  data: {
    purchaseId: string;
    tokenId: string;
    status: string;
    trackingUrl: string;
  };
  message: string;
}

export interface OrderTrackingData {
  tokenId: string;
  status: string;
  customerName?: string;
  shippingAddress?: {
    locality: string;
    state: string;
    pincode: string;
  };
  trackingNumber?: string;
  statusHistory: Array<{
    status: string;
    changedAt: string;
  }>;
  estimatedDelivery?: string;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface TrackOrderResponse {
  success: boolean;
  data: OrderTrackingData;
}

export interface GuestOrder {
  purchaseId: string;
  tokenId?: string;
  status: string;
  amount: number;
  createdAt: string;
  customerName?: string;
}

export interface GuestOrdersResponse {
  success: boolean;
  data: GuestOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Checkout form state
export interface CheckoutFormData {
  // Customer data
  stickerUserName: string;
  primaryPhoneNumber: string;
  emergencyContact1: string;
  emergencyContact2: string;
  additionalContact: string;
  vehicleNumber: string;
  vehicleType: string;
  vehicleModel: string;
  // Shipping
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  locality: string;
  district: string;
  state: string;
  pincode: string;
  landmark: string;
  // Guest
  guestEmail: string;
  guestPhone: string;
  // Customization
  backgroundColor: string;
  textColor: string;
  customMessage: string;
}

export type CheckoutStep =
  | "customer"
  | "shipping"
  | "customization"
  | "payment";

export interface CheckoutState {
  step: CheckoutStep;
  formData: CheckoutFormData;
  isGuest: boolean;
  isProcessing: boolean;
  error: string | null;
  orderId: string | null;
  purchaseId: string | null;
  tokenId: string | null;
}
