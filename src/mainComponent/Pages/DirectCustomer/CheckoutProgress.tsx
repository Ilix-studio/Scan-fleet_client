// frontend/src/components/checkout/CheckoutProgress.tsx
import { CheckoutStep } from "@/types/directOrder.types";
import { User, MapPin, Palette, CreditCard, Check } from "lucide-react";

interface Props {
  currentStep: CheckoutStep;
  onStepClick: (step: CheckoutStep) => void;
}

const STEPS: { id: CheckoutStep; label: string; icon: typeof User }[] = [
  { id: "customer", label: "Customer", icon: User },
  { id: "shipping", label: "Shipping", icon: MapPin },
  { id: "customization", label: "Customize", icon: Palette },
  { id: "payment", label: "Payment", icon: CreditCard },
];

const CheckoutProgress = ({ currentStep, onStepClick }: Props) => {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className='flex items-center justify-between'>
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isClickable = index < currentIndex;

        return (
          <div key={step.id} className='flex items-center flex-1'>
            {/* Step Circle */}
            <button
              type='button'
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                isCompleted
                  ? "bg-cyan-600 text-white cursor-pointer hover:bg-cyan-700"
                  : isCurrent
                    ? "bg-cyan-100 text-cyan-600 border-2 border-cyan-600"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {isCompleted ? (
                <Check className='w-5 h-5' />
              ) : (
                <Icon className='w-5 h-5' />
              )}
            </button>

            {/* Step Label */}
            <span
              className={`ml-2 text-sm font-medium hidden sm:block ${
                isCurrent
                  ? "text-cyan-600"
                  : isCompleted
                    ? "text-gray-700"
                    : "text-gray-400"
              }`}
            >
              {step.label}
            </span>

            {/* Connector Line */}
            {index < STEPS.length - 1 && (
              <div className='flex-1 mx-4'>
                <div
                  className={`h-0.5 ${
                    index < currentIndex ? "bg-cyan-600" : "bg-gray-200"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutProgress;
