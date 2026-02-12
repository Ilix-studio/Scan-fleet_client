// frontend/src/components/WalletDisplay.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Plus,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { useGetUserProfileQuery } from "@/redux-store/services/userAuthApi";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useGetPurchaseHistoryQuery,
} from "@/redux-store/services/purchaseApi";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
}

const TOKEN_PACKAGES = [
  { quantity: 10, label: "Starter", popular: false },
  { quantity: 25, label: "Growth", popular: true },
  { quantity: 50, label: "Business", popular: false },
  { quantity: 100, label: "Enterprise", popular: false },
];

const ROLE_PRICING: Record<string, number> = {
  DEALERSHIP_OWNER: 299,
  DEALERSHIP_SALESMAN: 299,
  RENTAL_OWNER: 299,
  DIRECT_CUSTOMER: 399,
};

const MAX_TOKEN_QUANTITY = 1000;

export default function WalletDisplay() {
  const [selectedQuantity, setSelectedQuantity] = useState(25);
  const [customQuantity, setCustomQuantity] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: profile, refetch: refetchProfile } = useGetUserProfileQuery();
  const { refetch: refetchHistory } = useGetPurchaseHistoryQuery({
    page: 1,
    limit: 5,
  });

  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  // FIX #1: Validate role pricing
  const userRole = profile?.role;
  const pricePerToken =
    userRole && userRole in ROLE_PRICING ? ROLE_PRICING[userRole] : null;

  const walletBalance = profile?.walletBalance ?? 0;
  const lifetimePurchased = profile?.lifetimeTokensPurchased ?? 0;
  // FIX #2: Correct field for used tokens
  const lifetimeUsed = profile?.lifetimeTokensPurchased ?? 0;

  const walletValue = pricePerToken ? walletBalance * pricePerToken : 0;
  const usagePercent =
    lifetimePurchased > 0
      ? Math.round((lifetimeUsed / lifetimePurchased) * 100)
      : 0;

  // FIX #3: Proper quantity validation
  const getQuantity = (): number => {
    const custom = Number(customQuantity);
    if (
      Number.isInteger(custom) &&
      custom > 0 &&
      custom <= MAX_TOKEN_QUANTITY
    ) {
      return custom;
    }
    return selectedQuantity;
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async () => {
    // Validate price exists
    if (!pricePerToken) {
      toast.error("Invalid user role. Contact support.");
      return;
    }

    const quantity = getQuantity();
    if (quantity < 1 || quantity > MAX_TOKEN_QUANTITY) {
      toast.error(`Quantity must be between 1 and ${MAX_TOKEN_QUANTITY}`);
      return;
    }

    try {
      setIsProcessing(true);

      // FIX #4: Load script BEFORE creating order
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway");
        setIsProcessing(false);
        return;
      }

      const response = await createOrder({ tokenQuantity: quantity }).unwrap();
      const orderData = (response as any).data ?? response;

      if (!orderData?.orderId || !orderData?.keyId) {
        throw new Error("Invalid order response");
      }

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ScanFleet",
        description: `${quantity} Token${quantity > 1 ? "s" : ""} Purchase`,
        order_id: orderData.orderId,
        handler: async (rzpResponse: RazorpayResponse) => {
          try {
            const result = await verifyPayment({
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_signature: rzpResponse.razorpay_signature,
            }).unwrap();

            toast.success(
              `${result.data.tokensAdded} token${result.data.tokensAdded > 1 ? "s" : ""} added!`,
            );

            // FIX #5: Refetch data after successful payment
            await Promise.all([refetchProfile(), refetchHistory()]);
          } catch {
            toast.error("Payment verification failed");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: profile?.name ?? "",
          email: profile?.email ?? "",
        },
        theme: { color: "#06b6d4" },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message ?? "Failed to initiate payment");
      setIsProcessing(false);
    }
  };

  // Show error if pricing unavailable
  if (profile && !pricePerToken) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-black'>
        <p className='text-red-500'>
          Invalid account configuration. Contact support.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6 bg-black min-h-screen p-6 max-w-7xl mx-auto container'>
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>Token Wallet</h1>
        <p className='text-white/60'>
          Manage your token balance and purchase history
        </p>
      </div>

      <Card className='bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden relative'>
        <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10' />
        <CardContent className='relative p-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2'>
              <div className='flex items-start gap-4 mb-6'>
                <div className='p-3 rounded-xl bg-cyan-500/20 border border-cyan-400/30'>
                  <Wallet className='text-cyan-400' size={32} />
                </div>
                <div>
                  <p className='text-white/60 text-sm mb-1'>
                    Available Balance
                  </p>
                  <p className='text-5xl font-bold text-white'>
                    {walletBalance.toLocaleString()}
                  </p>
                  <p className='text-white/60 mt-1'>
                    ₹{walletValue.toLocaleString()} value
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex items-center gap-2 mb-2'>
                    <ArrowDownRight className='text-green-400' size={16} />
                    <span className='text-white/60 text-xs'>Purchased</span>
                  </div>
                  <p className='text-xl font-semibold text-white'>
                    {lifetimePurchased.toLocaleString()}
                  </p>
                </div>
                <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex items-center gap-2 mb-2'>
                    <ArrowUpRight className='text-orange-400' size={16} />
                    <span className='text-white/60 text-xs'>Used</span>
                  </div>
                  <p className='text-xl font-semibold text-white'>
                    {lifetimeUsed.toLocaleString()}
                  </p>
                </div>
                <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex items-center gap-2 mb-2'>
                    <TrendingUp className='text-cyan-400' size={16} />
                    <span className='text-white/60 text-xs'>Rate</span>
                  </div>
                  <p className='text-xl font-semibold text-white'>
                    ₹{pricePerToken ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-center'>
              <div className='bg-white/5 rounded-xl p-6 border border-white/10'>
                <p className='text-white/60 text-sm mb-4'>Token Usage</p>
                <div className='relative h-32 w-32 mx-auto'>
                  <svg className='w-full h-full -rotate-90' viewBox='0 0 36 36'>
                    <path
                      d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                      fill='none'
                      stroke='rgba(255,255,255,0.1)'
                      strokeWidth='3'
                    />
                    <path
                      d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                      fill='none'
                      stroke='url(#gradient)'
                      strokeWidth='3'
                      strokeLinecap='round'
                      strokeDasharray={`${usagePercent}, 100`}
                    />
                    <defs>
                      <linearGradient id='gradient'>
                        <stop offset='0%' stopColor='#06b6d4' />
                        <stop offset='100%' stopColor='#a855f7' />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    <span className='text-2xl font-bold text-white'>
                      {usagePercent}%
                    </span>
                    <span className='text-white/60 text-xs'>used</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-3'>
          <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Plus size={20} className='text-cyan-400' />
                Buy Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                {TOKEN_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.quantity}
                    onClick={() => {
                      setSelectedQuantity(pkg.quantity);
                      setCustomQuantity("");
                    }}
                    className={cn(
                      "relative p-4 rounded-xl border transition-all text-left",
                      selectedQuantity === pkg.quantity && !customQuantity
                        ? "bg-cyan-500/20 border-cyan-400/50"
                        : "bg-white/5 border-white/10 hover:border-white/20",
                    )}
                  >
                    {pkg.popular && (
                      <span className='absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-white'>
                        Popular
                      </span>
                    )}
                    <p className='text-2xl font-bold text-white'>
                      {pkg.quantity}
                    </p>
                    <p className='text-xs text-white/60'>{pkg.label}</p>
                    <p className='text-sm text-cyan-400 mt-1'>
                      ₹
                      {pricePerToken
                        ? (pkg.quantity * pricePerToken).toLocaleString()
                        : "—"}
                    </p>
                  </button>
                ))}
              </div>

              <div>
                <label className='block text-sm text-white/60 mb-2'>
                  Or enter custom quantity (max {MAX_TOKEN_QUANTITY})
                </label>
                <div className='flex gap-3'>
                  <input
                    type='number'
                    min='1'
                    max={MAX_TOKEN_QUANTITY}
                    value={customQuantity}
                    onChange={(e) => setCustomQuantity(e.target.value)}
                    placeholder='Enter quantity'
                    className='flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50'
                  />
                  <div className='px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white min-w-[120px] text-center'>
                    ₹
                    {pricePerToken
                      ? (getQuantity() * pricePerToken).toLocaleString()
                      : "—"}
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePurchase}
                disabled={isProcessing || !pricePerToken}
                className='w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0 text-lg font-semibold'
              >
                {isProcessing ? (
                  <>
                    <RefreshCw size={18} className='mr-2 animate-spin' />
                    Processing...
                  </>
                ) : (
                  <>
                    Buy {getQuantity()} Tokens for ₹
                    {pricePerToken
                      ? (getQuantity() * pricePerToken).toLocaleString()
                      : "—"}
                  </>
                )}
              </Button>

              <p className='text-xs text-white/40 text-center'>
                Secure payment via Razorpay • Tokens never expire
              </p>
            </CardContent>
          </Card>
          <br />
          <Card className='bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-amber-500/20'>
            <CardContent className='space-y-3'>
              <p className='text-xs text-white/60 pl-6'>
                📦 Package will be delivered after purchasing tokens.
              </p>
              <div className='flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg'>
                <AlertCircle className='text-amber-400 mt-0.5' size={16} />
                <p className='text-sm text-amber-200 font-medium'>
                  Do not throw away the package until you've entered the attach
                  code!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
