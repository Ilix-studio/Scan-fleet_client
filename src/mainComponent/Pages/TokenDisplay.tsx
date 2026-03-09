// frontend/src/components/TokenDisplay.tsx
// B2B reseller economics: buy @ ₹299/token, sell @ ₹300–500/token

import { useState } from "react";
import {
  TrendingUp,
  Copy,
  ChevronRight,
  Building2,
  Car,
  Users,
  Package,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// ── B2B business model constants ──────────────────────────────────────────────
const COST_PER_TOKEN = 299; // What dealer pays ScanFleet (ex-GST)
const SALE_PRICE_OPTIONS = [300, 400, 500] as const;
type SalePrice = (typeof SALE_PRICE_OPTIONS)[number];

const STICKERS_PER_TOKEN = 6;

const TARGET_SEGMENTS = [
  {
    icon: Building2,
    label: "Dealerships",
    desc: "Upsell to every vehicle purchase",
    color: "cyan",
    example: "Customer buys a car → pitch the ₹500 safety package",
  },
  {
    icon: Car,
    label: "Rental Firms",
    desc: "Fleet-wide vehicle safety coverage",
    color: "purple",
    example: "10-vehicle fleet → 10 tokens → ₹2,010 profit at ₹500 sale",
  },
  {
    icon: Users,
    label: "Car Salespersons",
    desc: "Earn commission on every activation",
    color: "pink",
    example: "5 sales/month = ₹1,005 extra margin",
  },
] as const;

interface ProfitCalcState {
  qty: number;
  salePrice: SalePrice;
}

export default function TokenDisplay() {
  const [calc, setCalc] = useState<ProfitCalcState>({ qty: 5, salePrice: 500 });

  const cost = calc.qty * COST_PER_TOKEN;
  const revenue = calc.qty * calc.salePrice;
  const profit = revenue - cost;
  const margin = Math.round((profit / revenue) * 100);

  return (
    <div className="min-h-screen w-full relative bg-[#080810] py-12 px-4 font-['DM_Sans',sans-serif]">
      {/* Background */}
      <div
        className='absolute inset-0 z-0 pointer-events-none'
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 20% 20%, rgba(6,182,212,0.08), transparent 55%),
            radial-gradient(ellipse 50% 35% at 85% 75%, rgba(168,85,247,0.10), transparent 50%),
            radial-gradient(ellipse 40% 30% at 60% 50%, rgba(236,72,153,0.06), transparent 45%)
          `,
        }}
      />

      <div className='relative z-10 max-w-5xl mx-auto space-y-10'>
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className='text-center space-y-3'>
          <span className='inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'>
            Reseller Program
          </span>
          <h1 className='text-4xl sm:text-5xl font-bold text-white leading-tight'>
            Buy Tokens.{" "}
            <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent'>
              Sell Safety.
            </span>{" "}
            Keep the Margin.
          </h1>
          <p className='text-white/50 text-base max-w-xl mx-auto'>
            Purchase ScanFleet tokens at ₹299 each. Sell the safety package to
            your customers at ₹300–₹500. The difference is yours.
          </p>
        </div>

        {/* ── Core economics strip ─────────────────────────────────────────── */}
        <div className='grid grid-cols-3 divide-x divide-white/10 bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden'>
          {[
            {
              label: "Your Cost",
              value: "₹299",
              sub: "per token (ex-GST)",
              color: "text-white",
            },
            {
              label: "You Sell At",
              value: "₹300–500",
              sub: "per safety package",
              color: "text-cyan-400",
            },
            {
              label: "Your Profit",
              value: "₹1–₹201",
              sub: "per token minimum",
              color: "text-emerald-400",
            },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className='py-6 px-6 text-center'>
              <p className='text-xs text-white/40 uppercase tracking-wider mb-2'>
                {label}
              </p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className='text-xs text-white/40 mt-1'>{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Interactive Profit Calculator ────────────────────────────────── */}
        <div className='bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-6'>
          <div className='flex items-center gap-2 mb-2'>
            <TrendingUp size={20} className='text-emerald-400' />
            <h2 className='text-lg font-semibold text-white'>
              Profit Calculator
            </h2>
          </div>

          {/* Qty selector */}
          <div className='space-y-2'>
            <p className='text-sm text-white/50'>Tokens to buy</p>
            <div className='flex gap-2 flex-wrap'>
              {[1, 5, 10, 25, 50].map((n) => (
                <button
                  key={n}
                  onClick={() => setCalc((c) => ({ ...c, qty: n }))}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                    calc.qty === n
                      ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-400"
                      : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                  }`}
                >
                  {n}
                </button>
              ))}
              <input
                type='number'
                min={1}
                max={999}
                value={calc.qty}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v > 0) setCalc((c) => ({ ...c, qty: v }));
                }}
                className='w-20 px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50'
                placeholder='Custom'
              />
            </div>
          </div>

          {/* Sale price selector */}
          <div className='space-y-2'>
            <p className='text-sm text-white/50'>Your sale price per package</p>
            <div className='flex gap-2'>
              {SALE_PRICE_OPTIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => setCalc((c) => ({ ...c, salePrice: p }))}
                  className={`flex-1 py-3 rounded-lg text-sm font-semibold border transition-all ${
                    calc.salePrice === p
                      ? "bg-purple-500/20 border-purple-400/50 text-purple-300"
                      : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                  }`}
                >
                  ₹{p}
                </button>
              ))}
            </div>
          </div>

          {/* Result row */}
          <div className='grid grid-cols-4 gap-3 pt-2'>
            {[
              {
                label: "You Pay",
                value: `₹${cost.toLocaleString("en-IN")}`,
                color: "text-white",
              },
              {
                label: "You Collect",
                value: `₹${revenue.toLocaleString("en-IN")}`,
                color: "text-cyan-400",
              },
              {
                label: "Net Profit",
                value: `₹${profit.toLocaleString("en-IN")}`,
                color: "text-emerald-400",
              },
              {
                label: "Margin",
                value: `${margin}%`,
                color: "text-amber-400",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className='bg-white/5 border border-white/10 rounded-xl p-4 text-center'
              >
                <p className='text-xs text-white/40 mb-1'>{label}</p>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          <p className='text-xs text-white/30'>
            * Each token includes {STICKERS_PER_TOKEN} physical QR stickers with
            lifetime validity. Your ₹{COST_PER_TOKEN} includes the sticker pack.
          </p>
        </div>

        {/* ── Target segments ──────────────────────────────────────────────── */}
        <div>
          <h2 className='text-lg font-semibold text-white mb-4'>
            Who Should Resell ScanFleet?
          </h2>
          <div className='grid md:grid-cols-3 gap-4'>
            {TARGET_SEGMENTS.map(
              ({ icon: Icon, label, desc, color, example }) => {
                const colorMap: Record<string, string> = {
                  cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
                  purple:
                    "text-purple-400 bg-purple-500/10 border-purple-500/20",
                  pink: "text-pink-400 bg-pink-500/10 border-pink-500/20",
                };
                const [textCls, bgCls, borderCls] = colorMap[color].split(" ");
                return (
                  <div
                    key={label}
                    className='bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-3 hover:border-white/20 transition-colors'
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgCls} border ${borderCls}`}
                    >
                      <Icon size={18} className={textCls} />
                    </div>
                    <div>
                      <p className='font-semibold text-white'>{label}</p>
                      <p className='text-sm text-white/50'>{desc}</p>
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2 text-xs ${bgCls} border ${borderCls} ${textCls}`}
                    >
                      {example}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {/* ── What's in a token ────────────────────────────────────────────── */}
        <div className='bg-white/[0.03] border border-white/10 rounded-2xl p-8'>
          <div className='flex items-center gap-2 mb-6'>
            <Package size={20} className='text-purple-400' />
            <h2 className='text-lg font-semibold text-white'>
              What Your Customer Gets (1 Token = 1 Safety Package)
            </h2>
          </div>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {[
              "4 QR Safety Stickers",
              "Emergency contact page",
              "One-tap masked call (privacy protected)",
              "Multi-language support (12 Indian languages)",
              "Lifetime sticker validity",
              "Third-party emergency activation",
            ].map((item) => (
              <div
                key={item}
                className='flex items-center gap-2 text-sm text-white/70'
              >
                <ChevronRight size={14} className='text-cyan-400 shrink-0' />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── Referral strip ───────────────────────────────────────────────── */}
        <div className='bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div className='space-y-1'>
            <p className='font-semibold text-white'>
              Refer another dealership or rental firm
            </p>
            <p className='text-sm text-white/50'>
              Earn ₹100 credit on your next purchase when your referral buys
              their first token pack.
            </p>
          </div>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => {
              const link = `${window.location.origin}/signup?ref=${encodeURIComponent("USER_REF_CODE")}`;
              navigator.clipboard.writeText(link);
            }}
            className='shrink-0 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent'
          >
            <Copy size={14} className='mr-1.5' />
            Copy Referral Link
          </Button>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <div className='text-center space-y-3 pb-4'>
          <Link to='/wallet'>
            <Button className='bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0 px-10 py-5 text-base font-semibold rounded-xl'>
              Buy Tokens & Start Reselling
              <ArrowRight size={16} className='ml-2' />
            </Button>
          </Link>
          <p className='text-xs text-white/30'>
            Tokens never expire · Secure via Razorpay · GST invoice provided
          </p>
        </div>
      </div>
    </div>
  );
}
