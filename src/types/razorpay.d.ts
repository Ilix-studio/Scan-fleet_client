// frontend/src/types/razorpay.d.ts

export interface CreateOrderRequest {
  tokenQuantity: number;
}

export interface CreateOrderResponse {
  purchaseId: string;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  tokenQuantity: number;
  pricePerToken: number;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data: {
    purchaseId: string;
    tokensAdded: number;
    walletBalance: number;
    status: string;
  };
}

export interface Purchase {
  _id: string;
  tokenQuantity: number;
  pricePerToken: number;
  totalAmount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseHistoryResponse {
  success: boolean;
  data: Purchase[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayInstance {
  open(): void;
  close(): void;
}

export interface Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}
