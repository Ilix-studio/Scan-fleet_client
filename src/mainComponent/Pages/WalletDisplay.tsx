// src/components/WalletDisplay.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  History,
  RefreshCw,
} from "lucide-react";
import { useGetUserProfileQuery } from "@/redux-store/services/userAuthApi";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useGetPurchaseHistoryQuery,
} from "@/redux-store/services/purchaseApi";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

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

export default function WalletDisplay() {
  const [selectedQuantity, setSelectedQuantity] = useState(25);
  const [customQuantity, setCustomQuantity] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: profile } = useGetUserProfileQuery();
  const { data: purchaseHistory, isLoading: historyLoading } =
    useGetPurchaseHistoryQuery({ page: 1, limit: 5 });

  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const pricePerToken = ROLE_PRICING[profile?.role ?? "DIRECT_CUSTOMER"] ?? 399;
  const walletBalance = profile?.walletBalance ?? 0;
  const walletValue = walletBalance * pricePerToken;
  const lifetimePurchased = profile?.lifetimeTokensPurchased ?? 0;

  const getQuantity = () => {
    const custom = parseInt(customQuantity);
    return custom > 0 ? custom : selectedQuantity;
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
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
    const quantity = getQuantity();
    if (quantity < 1) {
      toast.error("Select at least 1 token");
      return;
    }

    try {
      setIsProcessing(true);

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway");
        return;
      }

      const orderData = await createOrder({ tokenQuantity: quantity }).unwrap();

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ScanFleet",
        description: `${quantity} Token${quantity > 1 ? "s" : ""} Purchase`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            toast.success(
              `${result.data.tokensAdded} token${result.data.tokensAdded > 1 ? "s" : ""} added!`,
            );
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

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to initiate payment");
      setIsProcessing(false);
    }
  };

  return (
    <div className='space-y-6 bg-black min-h-screen p-6 max-w-7xl mx-auto container'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>Token Wallet</h1>
        <p className='text-white/60'>
          Manage your token balance and purchase history
        </p>
      </div>

      {/* Balance Card */}
      <Card className='bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10' />
        <CardContent className='relative p-8'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Main Balance */}
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

              {/* Stats Row */}
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
                </div>
                <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex items-center gap-2 mb-2'>
                    <TrendingUp className='text-cyan-400' size={16} />
                    <span className='text-white/60 text-xs'>Rate</span>
                  </div>
                  <p className='text-xl font-semibold text-white'>
                    ₹{pricePerToken}
                  </p>
                </div>
              </div>
            </div>

            {/* Usage Progress */}
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
                    />
                    <defs>
                      <linearGradient id='gradient'>
                        <stop offset='0%' stopColor='#06b6d4' />
                        <stop offset='100%' stopColor='#a855f7' />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    <span className='text-white/60 text-xs'>used</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Purchase Section */}
        <div className='lg:col-span-2'>
          <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Plus size={20} className='text-cyan-400' />
                Buy Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Package Selection */}
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
                      ₹{(pkg.quantity * pricePerToken).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>

              {/* Custom Quantity */}
              <div>
                <label className='block text-sm text-white/60 mb-2'>
                  Or enter custom quantity
                </label>
                <div className='flex gap-3'>
                  <input
                    type='number'
                    min='1'
                    value={customQuantity}
                    onChange={(e) => setCustomQuantity(e.target.value)}
                    placeholder='Enter quantity'
                    className='flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50'
                  />
                  <div className='px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white min-w-[120px] text-center'>
                    ₹{(getQuantity() * pricePerToken).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={handlePurchase}
                disabled={isProcessing}
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
                    {(getQuantity() * pricePerToken).toLocaleString()}
                  </>
                )}
              </Button>

              <p className='text-xs text-white/40 text-center'>
                Secure payment via Razorpay • Tokens never expire
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-white text-base'>
              <History size={18} className='text-purple-400' />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className='flex justify-center py-8'>
                <RefreshCw className='animate-spin text-white/40' size={24} />
              </div>
            ) : purchaseHistory?.data?.length ? (
              <div className='space-y-3'>
                {purchaseHistory.data.map((purchase) => (
                  <div
                    key={purchase._id}
                    className='flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10'
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        purchase.status === "COMPLETED"
                          ? "bg-green-500/20"
                          : purchase.status === "PENDING"
                            ? "bg-yellow-500/20"
                            : "bg-red-500/20",
                      )}
                    >
                      {purchase.status === "COMPLETED" ? (
                        <CheckCircle2 className='text-green-400' size={16} />
                      ) : purchase.status === "PENDING" ? (
                        <Clock className='text-yellow-400' size={16} />
                      ) : (
                        <XCircle className='text-red-400' size={16} />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-white'>
                        +{purchase.tokenQuantity} tokens
                      </p>
                      <p className='text-xs text-white/60 truncate'>
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className='text-sm font-semibold text-white'>
                      ₹{purchase.totalAmount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
                <Wallet className='mx-auto text-white/20 mb-3' size={32} />
                <p className='text-white/60 text-sm'>No transactions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
