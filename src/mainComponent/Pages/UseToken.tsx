// components/UseToken.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Package, AlertCircle, CheckCircle2, Info } from "lucide-react";

interface UseTokenProps {
  className?: string;
}

export const UseToken = ({ className }: UseTokenProps) => {
  const [attachCode, setAttachCode] = useState("");
  const [ownerNumber, setOwnerNumber] = useState("");
  const [emergency1, setEmergency1] = useState("");
  const [emergency2, setEmergency2] = useState("");
  const [dealerNumber, setDealerNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      attachCode,
      ownerNumber,
      emergency1,
      emergency2,
      dealerNumber,
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Information Card */}
      <Card className='bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-amber-500/20'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-amber-200 text-base'>
            <Info size={18} className='text-amber-400' />
            Where to Find Attach Code?
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex items-start gap-2'>
            <Package className='text-amber-400 mt-0.5' size={16} />
            <p className='text-sm text-white/80'>
              The attach code is printed on the{" "}
              <span className='font-semibold text-amber-300'>
                back of the package
              </span>{" "}
              that contains your sticker.
            </p>
          </div>

          <div className='flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg'>
            <AlertCircle className='text-amber-400 mt-0.5' size={16} />
            <p className='text-sm text-amber-200 font-medium'>
              Do not throw away the package until you've entered the attach
              code!
            </p>
          </div>

          <p className='text-xs text-white/60 pl-6'>
            📦 Package will be delivered after purchasing tokens from the wallet
            section.
          </p>
        </CardContent>
      </Card>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Form Section */}
        <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-white text-base'>
              <Package size={18} className='text-blue-400' />
              Use Token
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <label htmlFor='attachCode' className='text-sm text-white/80'>
                  Attach Code <span className='text-red-400'>*</span>
                </label>
                <Input
                  id='attachCode'
                  value={attachCode}
                  onChange={(e) => setAttachCode(e.target.value)}
                  placeholder='SF-000123456'
                  className='bg-white/10 border-white/20 text-white placeholder:text-white/40'
                  required
                />
              </div>

              <div className='space-y-2'>
                <label htmlFor='ownerNumber' className='text-sm text-white/80'>
                  Owner Phone Number <span className='text-red-400'>*</span>
                </label>
                <Input
                  id='ownerNumber'
                  type='tel'
                  value={ownerNumber}
                  onChange={(e) => setOwnerNumber(e.target.value)}
                  placeholder='+91 98765 43210'
                  className='bg-white/10 border-white/20 text-white placeholder:text-white/40'
                  required
                />
              </div>

              <div className='space-y-2'>
                <label htmlFor='emergency1' className='text-sm text-white/80'>
                  Emergency Contact 1 <span className='text-red-400'>*</span>
                </label>
                <Input
                  id='emergency1'
                  type='tel'
                  value={emergency1}
                  onChange={(e) => setEmergency1(e.target.value)}
                  placeholder='+91 98765 43211'
                  className='bg-white/10 border-white/20 text-white placeholder:text-white/40'
                  required
                />
              </div>

              <div className='space-y-2'>
                <label htmlFor='emergency2' className='text-sm text-white/80'>
                  Emergency Contact 2
                </label>
                <Input
                  id='emergency2'
                  type='tel'
                  value={emergency2}
                  onChange={(e) => setEmergency2(e.target.value)}
                  placeholder='+91 98765 43212'
                  className='bg-white/10 border-white/20 text-white placeholder:text-white/40'
                />
              </div>

              <div className='space-y-2'>
                <label htmlFor='dealerNumber' className='text-sm text-white/80'>
                  Dealer Important Number
                </label>
                <Input
                  id='dealerNumber'
                  type='tel'
                  value={dealerNumber}
                  onChange={(e) => setDealerNumber(e.target.value)}
                  placeholder='+91 98765 43213'
                  className='bg-white/10 border-white/20 text-white placeholder:text-white/40'
                />
              </div>

              <Button
                type='submit'
                className='w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              >
                Use Token
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History Section */}
        <Card className='bg-white/5 backdrop-blur-xl border border-white/10'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-white text-base'>
              <CheckCircle2 size={18} className='text-green-400' />
              Used Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-center py-8'>
              <Package className='mx-auto text-white/20 mb-3' size={32} />
              <p className='text-white/60 text-sm'>No tokens used yet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
