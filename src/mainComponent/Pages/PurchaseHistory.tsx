// components/PurchaseHistory.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPurchaseHistoryQuery } from "@/redux-store/services/purchaseApi";
import { cn } from "@/lib/utils";
import {
  History,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Wallet,
} from "lucide-react";

interface PurchaseHistoryProps {
  className?: string;
  page?: number;
  limit?: number;
}

export const PurchaseHistory = ({
  className,
  page = 1,
  limit = 10,
}: PurchaseHistoryProps) => {
  const { data: purchaseHistory, isLoading } = useGetPurchaseHistoryQuery({
    page,
    limit,
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          bg: "bg-green-500/20",
          icon: <CheckCircle2 className='text-green-400' size={16} />,
        };
      case "PENDING":
        return {
          bg: "bg-yellow-500/20",
          icon: <Clock className='text-yellow-400' size={16} />,
        };
      default:
        return {
          bg: "bg-red-500/20",
          icon: <XCircle className='text-red-400' size={16} />,
        };
    }
  };

  return (
    <Card
      className={cn(
        "bg-white/5 backdrop-blur-xl border border-white/10",
        className,
      )}
    >
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-white text-base'>
          <History size={18} className='text-purple-400' />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex justify-center py-8'>
            <RefreshCw className='animate-spin text-white/40' size={24} />
          </div>
        ) : purchaseHistory?.data?.length ? (
          <div className='space-y-3'>
            {purchaseHistory.data.map((purchase) => {
              const statusConfig = getStatusConfig(purchase.status);

              return (
                <div
                  key={purchase._id}
                  className='flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10'
                >
                  <div className={cn("p-2 rounded-lg", statusConfig.bg)}>
                    {statusConfig.icon}
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
              );
            })}
          </div>
        ) : (
          <div className='text-center py-8'>
            <Wallet className='mx-auto text-white/20 mb-3' size={32} />
            <p className='text-white/60 text-sm'>No transactions yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
