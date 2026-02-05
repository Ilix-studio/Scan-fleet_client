// redux-store/services/tokenApi.ts
import { baseApi } from "./baseApi";

interface TokenPackage {
  id: string;
  name: string;
  tokenCount: number;
  stickerCount: number;
  price: number;
  gstPercent: number;
  totalPrice: number;
}

interface PurchaseRequest {
  packageId: string;
  paymentMethod: "razorpay";
}

interface PurchaseResponse {
  orderId: string;
  amount: number;
  currency: string;
  paymentGatewayOrderId: string;
}

interface PurchaseHistory {
  id: string;
  packageName: string;
  tokensAdded: number;
  amount: number;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export const tokenApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get available token packages
    getTokenPackages: builder.query<TokenPackage[], void>({
      query: () => "/tokens/packages",
      providesTags: ["Token"],
    }),

    // Get current user token balance
    getTokenBalance: builder.query<
      { available: number; used: number; total: number },
      void
    >({
      query: () => "/tokens/balance",
      providesTags: ["Token"],
    }),

    // Initiate purchase
    initiateTokenPurchase: builder.mutation<PurchaseResponse, PurchaseRequest>({
      query: (data) => ({
        url: "/tokens/purchase/initiate",
        method: "POST",
        body: data,
      }),
    }),

    // Verify payment and credit tokens
    verifyTokenPurchase: builder.mutation<
      { success: boolean; tokensAdded: number },
      { orderId: string; paymentId: string; signature: string }
    >({
      query: (data) => ({
        url: "/tokens/purchase/verify",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Token", "User", "Purchase"],
    }),

    // Purchase history
    getPurchaseHistory: builder.query<PurchaseHistory[], void>({
      query: () => "/tokens/purchase/history",
      providesTags: ["Purchase"],
    }),
  }),
});

export const {
  useGetTokenPackagesQuery,
  useGetTokenBalanceQuery,
  useInitiateTokenPurchaseMutation,
  useVerifyTokenPurchaseMutation,
  useGetPurchaseHistoryQuery,
} = tokenApi;
