// src/pages/dashboard/Wallet/WalletDisplay.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

const WalletDisplay = () => {
  return (
    <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-white'>
          <Wallet size={24} className='text-cyan-400' />
          Token Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='md:col-span-2'>
            <div className='bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-cyan-400/30 space-y-4'>
              <div className='space-y-2'>
                <p className='text-white/60 text-sm'>Available Balance</p>
                <p className='text-4xl font-bold text-white'>45 Tokens</p>
              </div>
              <p className='text-sm text-white/60'>₹13,500 value</p>
            </div>
          </div>
          <div className='space-y-2'>
            <Button className='w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0'>
              Buy Tokens
            </Button>
            <Button
              variant='outline'
              className='w-full border-white/20 text-white hover:bg-white/10 bg-transparent'
            >
              Token History
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletDisplay;
