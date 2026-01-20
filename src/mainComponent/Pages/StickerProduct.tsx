import { useState } from "react";
import {
  ShoppingCart,
  Lock,
  AlertCircle,
  Phone,
  QrCode,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StickerProduct() {
  const [bikeQuantity, setBikeQuantity] = useState(1);
  const [carQuantity, setCarQuantity] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const bikeStickerPrice = 499;
  const carStickerPrice = 299;
  const carOriginalPrice = 599;
  const stickersPerOrder = 4;

  const totalPrice =
    bikeStickerPrice * bikeQuantity + carStickerPrice * carQuantity;

  const handleAddToCart = () => {
    console.log(
      `Ordered ${bikeQuantity} bike sets${carQuantity > 0 ? ` + ${carQuantity} car sets` : ""}`,
    );
  };

  return (
    <div className='min-h-screen w-full relative bg-black flex items-center justify-center py-12'>
      <div
        className='absolute inset-0 z-0'
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 20, 147, 0.15), transparent 50%),
            radial-gradient(ellipse 160% 130% at 10% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
            radial-gradient(ellipse 160% 130% at 90% 90%, rgba(138, 43, 226, 0.18), transparent 65%),
            radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
            #000000
          `,
        }}
      />

      {/* Info Modal */}
      {showInfo && (
        <div
          className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4'
          onClick={() => setShowInfo(false)}
        >
          <div
            className='bg-slate-900 border border-white/10 rounded-2xl max-w-3xl w-full p-6 relative'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInfo(false)}
              className='absolute top-4 right-4 text-white/60 hover:text-white'
            >
              <X size={24} />
            </button>

            <h3 className='text-xl font-bold text-white mb-6'>
              Sticker Application Guide
            </h3>

            <div className='space-y-6'>
              <div className='bg-white rounded-lg p-6'>
                <svg viewBox='0 0 600 300' className='w-full h-auto'>
                  <g transform='translate(100, 80)'>
                    <rect
                      x='0'
                      y='120'
                      width='400'
                      height='20'
                      fill='#E5E7EB'
                      stroke='#9CA3AF'
                      strokeWidth='2'
                    />
                    <text x='420' y='135' fontSize='14' fill='#374151'>
                      Release Paper
                    </text>
                    <path
                      d='M 50 140 Q 30 160, 50 180'
                      stroke='#374151'
                      strokeWidth='1.5'
                      fill='none'
                      markerEnd='url(#arrow)'
                    />
                    <text
                      x='60'
                      y='175'
                      fontSize='12'
                      fill='#374151'
                      fontStyle='italic'
                    >
                      sticky down for bikes
                    </text>

                    <rect
                      x='20'
                      y='90'
                      width='360'
                      height='25'
                      fill='#D1D5DB'
                      stroke='#6B7280'
                      strokeWidth='2'
                    />
                    <text x='420' y='107' fontSize='14' fill='#374151'>
                      Photo Sticker
                    </text>

                    <rect
                      x='0'
                      y='60'
                      width='400'
                      height='25'
                      fill='#10B981'
                      stroke='#059669'
                      strokeWidth='2'
                    />
                    <text x='420' y='77' fontSize='14' fill='#374151'>
                      Sticker Paper
                    </text>
                    <path
                      d='M 50 60 Q 30 40, 50 20'
                      stroke='#374151'
                      strokeWidth='1.5'
                      fill='none'
                      markerEnd='url(#arrow)'
                    />
                    <text
                      x='60'
                      y='30'
                      fontSize='12'
                      fill='#374151'
                      fontStyle='italic'
                    >
                      sticky up for cars
                    </text>
                  </g>

                  <defs>
                    <marker
                      id='arrow'
                      markerWidth='10'
                      markerHeight='10'
                      refX='9'
                      refY='3'
                      orient='auto'
                    >
                      <polygon points='0 0, 10 3, 0 6' fill='#374151' />
                    </marker>
                  </defs>
                </svg>
              </div>

              <div className='grid md:grid-cols-2 gap-4'>
                <div className='bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4'>
                  <h4 className='font-bold text-cyan-400 mb-2'>
                    🏍️ Bike Stickers
                  </h4>
                  <p className='text-sm text-white/80'>
                    <strong>Back Adhesive (Sticky Down)</strong>
                    <br />
                    Apply directly to bike surface from outside
                  </p>
                </div>

                <div className='bg-purple-500/10 border border-purple-500/20 rounded-lg p-4'>
                  <h4 className='font-bold text-purple-400 mb-2'>
                    🚗 Car Stickers
                  </h4>
                  <p className='text-sm text-white/80'>
                    <strong>Front Adhesive (Sticky Up)</strong>
                    <br />
                    Apply to inside of windshield for external viewing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='relative z-10 max-w-6xl mx-auto px-4 w-full'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl sm:text-5xl font-bold mb-4 text-white'>
            Smart Parking Sticker
          </h1>
          <p className='text-white/70 text-lg max-w-2xl mx-auto'>
            Privacy and Security at its Best
          </p>
        </div>

        <div className='relative group'>
          <div className='absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300' />

          <div className='relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 lg:p-12'>
            <div className='grid lg:grid-cols-2 gap-12'>
              {/* Left Side */}
              <div className='flex items-center justify-center'>
                <div className='relative w-full max-w-sm'>
                  <div className='relative bg-gradient-to-br from-red-600 to-red-400 rounded-2xl p-8 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300'>
                    <div className='absolute -top-4 left-0 right-0 h-8 bg-red-400 transform skew-y-2 rounded-t-lg' />

                    <div className='space-y-6 relative z-10'>
                      <div className='text-center'>
                        <h3 className='text-2xl font-black text-slate-900'>
                          SCANFLEET
                        </h3>
                        <p className='text-xs font-bold text-slate-700 mt-1'>
                          One Scan. Instant Contact.
                        </p>
                      </div>

                      <div className='text-center'>
                        <p className='text-sm font-bold text-slate-900 leading-tight'>
                          Instant contact. Zero hassle. Always protected.
                        </p>
                      </div>

                      <div className='flex justify-center'>
                        <div className='bg-white p-4 rounded-lg shadow-lg border-4 border-slate-900'>
                          <div className='w-32 h-32 bg-gradient-to-br from-slate-900 to-slate-700 rounded flex items-center justify-center'>
                            <QrCode
                              size={80}
                              className='text-white opacity-30'
                            />
                          </div>
                        </div>
                      </div>

                      <div className='border-t-4 border-slate-900 pt-4'>
                        <div className='flex items-center justify-center gap-3 mb-2'>
                          <div className='flex items-center gap-1'>
                            <Lock size={16} className='text-slate-900' />
                            <span className='text-xs font-bold text-slate-900'>
                              Private
                            </span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <AlertCircle size={16} className='text-slate-900' />
                            <span className='text-xs font-bold text-slate-900'>
                              Emergency
                            </span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Phone size={16} className='text-slate-900' />
                            <span className='text-xs font-bold text-slate-900'>
                              Contact
                            </span>
                          </div>
                        </div>
                        <p className='text-xs text-center font-semibold text-slate-800'>
                          Scan using phone camera or Google Lens
                        </p>
                      </div>
                    </div>

                    <div className='absolute -bottom-4 left-0 right-0 h-8 bg-red-400 transform -skew-y-2 rounded-b-lg' />
                  </div>

                  <div className='absolute -top-8 -left-8 w-24 h-24 border-4 border-red-400/30 transform rotate-45' />
                  <div className='absolute -bottom-8 -right-8 w-24 h-24 border-4 border-red-400/30 transform rotate-45' />
                </div>
              </div>

              {/* Right Side */}
              <div className='flex flex-col justify-center space-y-8'>
                <p className='text-white/80 text-lg leading-relaxed'>
                  Enable bystanders to connect with emergency contacts and share
                  your location instantly—ScanFleet works even when you can't.
                </p>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                    <div className='flex items-start gap-3'>
                      <Lock
                        size={20}
                        className='text-cyan-400 flex-shrink-0 mt-1'
                      />
                      <div>
                        <h4 className='font-semibold text-sm text-white'>
                          Private Contact
                        </h4>
                        <p className='text-xs text-white/60 mt-1'>
                          Your details stay secure
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                    <div className='flex items-start gap-3'>
                      <Phone
                        size={20}
                        className='text-cyan-400 flex-shrink-0 mt-1'
                      />
                      <div>
                        <h4 className='font-semibold text-sm text-white'>
                          Emergency Call
                        </h4>
                        <p className='text-xs text-white/60 mt-1'>
                          24/7 support access
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                    <div className='flex items-start gap-3'>
                      <AlertCircle
                        size={20}
                        className='text-cyan-400 flex-shrink-0 mt-1'
                      />
                      <div>
                        <h4 className='font-semibold text-sm text-white'>
                          Upload Files
                        </h4>
                        <p className='text-xs text-white/60 mt-1'>
                          Store documents safely
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                    <div className='flex items-start gap-3'>
                      <QrCode
                        size={20}
                        className='text-cyan-400 flex-shrink-0 mt-1'
                      />
                      <div>
                        <h4 className='font-semibold text-sm text-white'>
                          WhatsApp Updates
                        </h4>
                        <p className='text-xs text-white/60 mt-1'>
                          Get notifications
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-4 border border-white/10'>
                  <div className='flex items-center justify-between mb-3'>
                    <span className='text-sm font-semibold text-white'>
                      Includes Bike Stickers (4 pcs)
                    </span>
                    <button
                      onClick={() => setShowInfo(true)}
                      className='text-cyan-400 hover:text-cyan-300'
                    >
                      <Info size={18} />
                    </button>
                  </div>
                  <p className='text-xs text-white/60'>
                    Back adhesive - Apply from outside
                  </p>
                  <div className='mt-2 pt-2 border-t border-white/10'>
                    <div className='flex justify-between items-center text-sm'>
                      <span className='text-white/70'>Validity:</span>
                      <span className='font-bold text-green-400'>Lifetime</span>
                    </div>
                  </div>
                </div>

                <div className='space-y-3'>
                  <label className='text-sm font-semibold text-white/70'>
                    Bike Quantity (Sets of {stickersPerOrder})
                  </label>
                  <div className='flex items-center gap-4 bg-white/5 rounded-lg p-3 border border-white/10'>
                    <button
                      onClick={() =>
                        setBikeQuantity(Math.max(1, bikeQuantity - 1))
                      }
                      className='w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors font-bold text-white'
                    >
                      −
                    </button>
                    <span className='text-xl font-bold flex-1 text-center text-white'>
                      {bikeQuantity}
                    </span>
                    <button
                      onClick={() => setBikeQuantity(bikeQuantity + 1)}
                      className='w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors font-bold text-white'
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className='space-y-2 bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex justify-between text-sm text-white/70'>
                    <span>
                      Bike: ₹{bikeStickerPrice} × {bikeQuantity}
                    </span>
                    <span>
                      ₹{(bikeStickerPrice * bikeQuantity).toLocaleString()}
                    </span>
                  </div>

                  {carQuantity > 0 && (
                    <div className='space-y-2'>
                      <div className='flex justify-between items-center text-sm text-white/70'>
                        <span>
                          Car: ₹{carStickerPrice} × {carQuantity}
                        </span>
                        <div className='flex items-center gap-2'>
                          <button
                            onClick={() =>
                              setCarQuantity(Math.max(0, carQuantity - 1))
                            }
                            className='w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-bold'
                          >
                            −
                          </button>
                          <button
                            onClick={() => setCarQuantity(carQuantity + 1)}
                            className='w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-bold'
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className='flex justify-end text-sm text-white/70'>
                        <span>
                          ₹{(carStickerPrice * carQuantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className='flex justify-between text-sm text-white/60'>
                    <span>Total stickers:</span>
                    <span>
                      {bikeQuantity * stickersPerOrder +
                        carQuantity * stickersPerOrder}{" "}
                      QR stickers
                    </span>
                  </div>

                  <div className='border-t border-white/10 pt-2 flex justify-between font-bold text-lg'>
                    <span className='text-white'>Total Price:</span>
                    <span className='text-cyan-400'>
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {carQuantity === 0 && (
                  <Button
                    onClick={() => setCarQuantity(1)}
                    className='w-full bg-white/5 hover:bg-white/10 border-2 border-purple-400/50 hover:border-purple-400 text-white font-bold py-4 rounded-xl transition-all duration-200 relative overflow-hidden'
                  >
                    <div className='flex flex-row items-center gap-1'>
                      <span className='text-base'>
                        + Add Car Stickers (4 pcs)
                      </span>

                      <div className='flex items-center gap-2 text-sm'>
                        <span className='text-white/40 line-through'>
                          ₹{carOriginalPrice}
                        </span>
                        <span className='text-purple-400 font-bold'>
                          ₹{carStickerPrice}
                        </span>
                      </div>
                    </div>
                  </Button>
                )}

                <Button
                  onClick={handleAddToCart}
                  className='w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-6 text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200'
                >
                  <ShoppingCart size={24} />
                  Buy Now - ₹{totalPrice.toLocaleString()}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
