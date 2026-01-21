// frontend/src/components/checkout/CustomizationStep.tsx
import { CheckoutFormData } from "@/types/directOrder.types";
import { Palette, ChevronLeft } from "lucide-react";

interface Props {
  formData: CheckoutFormData;
  onUpdate: (data: Partial<CheckoutFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const COLOR_PRESETS = [
  { bg: "#FFFFFF", text: "#000000", label: "Classic White" },
  { bg: "#000000", text: "#FFFFFF", label: "Black" },
  { bg: "#1E3A8A", text: "#FFFFFF", label: "Navy Blue" },
  { bg: "#DC2626", text: "#FFFFFF", label: "Red" },
  { bg: "#059669", text: "#FFFFFF", label: "Green" },
  { bg: "#7C3AED", text: "#FFFFFF", label: "Purple" },
  { bg: "#F59E0B", text: "#000000", label: "Orange" },
  { bg: "#06B6D4", text: "#000000", label: "Cyan" },
];

const CustomizationStep = ({ formData, onUpdate, onNext, onBack }: Props) => {
  const handlePresetSelect = (bg: string, text: string) => {
    onUpdate({ backgroundColor: bg, textColor: text });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4'>
        <Palette className='w-5 h-5 text-cyan-600' />
        <span>Customize Your Sticker</span>
      </div>

      {/* Color Presets */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-3'>
          Color Theme
        </label>
        <div className='grid grid-cols-4 gap-3'>
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type='button'
              onClick={() => handlePresetSelect(preset.bg, preset.text)}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.backgroundColor === preset.bg
                  ? "border-cyan-500 ring-2 ring-cyan-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className='w-full h-8 rounded mb-2'
                style={{ backgroundColor: preset.bg }}
              />
              <span className='text-xs text-gray-600'>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Background Color
          </label>
          <div className='flex items-center gap-2'>
            <input
              type='color'
              value={formData.backgroundColor}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className='w-12 h-10 rounded cursor-pointer border border-gray-300'
            />
            <input
              type='text'
              value={formData.backgroundColor}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className='flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm'
              placeholder='#FFFFFF'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Text Color
          </label>
          <div className='flex items-center gap-2'>
            <input
              type='color'
              value={formData.textColor}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              className='w-12 h-10 rounded cursor-pointer border border-gray-300'
            />
            <input
              type='text'
              value={formData.textColor}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              className='flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm'
              placeholder='#000000'
            />
          </div>
        </div>
      </div>

      {/* Custom Message */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Custom Message (Optional)
        </label>
        <input
          type='text'
          value={formData.customMessage}
          onChange={(e) =>
            onUpdate({ customMessage: e.target.value.slice(0, 50) })
          }
          className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
          placeholder="e.g., 'In case of emergency, scan QR'"
          maxLength={50}
        />
        <p className='mt-1 text-xs text-gray-500'>
          {formData.customMessage?.length || 0}/50 characters
        </p>
      </div>

      {/* Preview */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-3'>
          Preview
        </label>
        <div className='flex justify-center'>
          <div
            className='w-48 h-64 rounded-xl shadow-lg flex flex-col items-center justify-center p-4 transition-colors'
            style={{ backgroundColor: formData.backgroundColor }}
          >
            <div
              className='w-24 h-24 bg-white rounded-lg mb-3 flex items-center justify-center'
              style={{ border: `2px solid ${formData.textColor}` }}
            >
              <span className='text-xs text-gray-400'>QR Code</span>
            </div>
            <p
              className='text-sm font-medium text-center'
              style={{ color: formData.textColor }}
            >
              {formData.stickerUserName || "Your Name"}
            </p>
            {formData.customMessage && (
              <p
                className='text-xs mt-2 text-center'
                style={{ color: formData.textColor, opacity: 0.8 }}
              >
                {formData.customMessage}
              </p>
            )}
            <p
              className='text-xs mt-3'
              style={{ color: formData.textColor, opacity: 0.6 }}
            >
              scanfleet.com
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className='flex justify-between pt-4'>
        <button
          type='button'
          onClick={onBack}
          className='px-4 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2'
        >
          <ChevronLeft className='w-4 h-4' />
          Back
        </button>
        <button
          type='submit'
          className='px-6 py-2.5 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2'
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
};

export default CustomizationStep;
