import { Button } from "@/components/ui/button";
import { Check, Package, Infinity, Home, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const features = [
    {
      icon: Package,
      title: "6 Smart Stickers",
      description: " 6 high-quality smart QR stickers with emergency features",
    },

    {
      icon: MessageCircle,
      title: "WhatsApp GPS Sharing",
      description: "Auto-share location with family during emergencies",
    },
    {
      icon: Infinity,
      title: "Unlimited Validity",
      description: "No expiration date. Use your smart stickers forever",
    },
    {
      icon: Home,
      title: "Home Delivery",
      description: "Direct delivery to your doorstep within 5-7 days",
    },
  ];

  return (
    <section
      id='pricing'
      className='bg-white/1 backdrop-blur-xl border-t border-white/1 py-12'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-4 text-white'>
            Smart Sticker Pricing
          </h2>
          <p className='text-white/70 text-lg max-w-2xl mx-auto'>
            One token, six smart stickers with emergency features, unlimited
            validity.
          </p>
        </div>

        {/* Main Pricing Card */}
        <div className='max-w-2xl mx-auto mb-26 '>
          <div className='relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12'>
            {/* Glow Effect */}
            <div className='absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50'></div>

            <div className='relative text-center'>
              {/* Price */}
              <div className='mb-8'>
                <span className='text-6xl sm:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
                  ₹499
                </span>
              </div>

              {/* Key Benefit */}
              <div className='bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-6 mb-8'>
                <p className='text-white font-semibold text-lg'>
                  ₹499 = 6 Smart Safety Stickers
                </p>
                <p className='text-white/60 text-sm mt-1'>
                  Emergency services • GPS sharing • Dealer connectivity
                </p>
              </div>

              {/* CTA Button */}
              <Link to='/sticker-select'>
                <Button className='bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0 px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200'>
                  Order Smart Stickers
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className='text-center'>
                <div className='w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                  <Icon size={28} className='text-white' />
                </div>
                <h3 className='text-lg font-bold mb-2 text-white'>
                  {feature.title}
                </h3>
                <p className='text-white/70 text-sm'>{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12'>
          <h3 className='text-2xl font-bold mb-8 text-center text-white'>
            Smart Sticker Features
          </h3>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h4 className='font-semibold mb-4 text-cyan-400'>
                For Dealerships
              </h4>
              <ul className='space-y-3 text-white/70'>
                <li className='flex items-start gap-3'>
                  <Check
                    size={20}
                    className='text-cyan-400 flex-shrink-0 mt-0.5'
                  />
                  <span>
                    Generate stickers with vehicle info & dealer contacts
                  </span>
                </li>

                <li className='flex items-start gap-3'>
                  <Check
                    size={20}
                    className='text-cyan-400 flex-shrink-0 mt-0.5'
                  />
                  <span>Dashboard analytics & usage tracking</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4 text-purple-400'>
                Vehicle Safety
              </h4>
              <ul className='space-y-3 text-white/70'>
                <li className='flex items-start gap-3'>
                  <Check
                    size={20}
                    className='text-purple-400 flex-shrink-0 mt-0.5'
                  />
                  <span>GPS location sharing via WhatsApp Business</span>
                </li>
                <li className='flex items-start gap-3'>
                  <Check
                    size={20}
                    className='text-purple-400 flex-shrink-0 mt-0.5'
                  />
                  <span>Family safety notifications</span>
                </li>
                <li className='flex items-start gap-3'>
                  <Check
                    size={20}
                    className='text-purple-400 flex-shrink-0 mt-0.5'
                  />
                  <span>Road-Side Assistance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
