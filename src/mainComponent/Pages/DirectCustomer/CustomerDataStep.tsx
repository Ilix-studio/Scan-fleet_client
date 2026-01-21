// frontend/src/components/checkout/CustomerDataStep.tsx
import { useState } from "react";
import { CheckoutFormData } from "@/types/directOrder.types";
import { User, Phone, Car, AlertCircle } from "lucide-react";

interface Props {
  formData: CheckoutFormData;
  onUpdate: (data: Partial<CheckoutFormData>) => void;
  onNext: () => void;
  isGuest: boolean;
}

const CustomerDataStep = ({ formData, onUpdate, onNext, isGuest }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, "");
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.stickerUserName.trim()) {
      newErrors.stickerUserName = "Name is required";
    }

    if (!formData.primaryPhoneNumber) {
      newErrors.primaryPhoneNumber = "Primary phone is required";
    } else if (!validatePhone(formData.primaryPhoneNumber)) {
      newErrors.primaryPhoneNumber = "Invalid phone number";
    }

    if (!formData.emergencyContact1) {
      newErrors.emergencyContact1 = "Emergency contact 1 is required";
    } else if (!validatePhone(formData.emergencyContact1)) {
      newErrors.emergencyContact1 = "Invalid phone number";
    }

    if (!formData.emergencyContact2) {
      newErrors.emergencyContact2 = "Emergency contact 2 is required";
    } else if (!validatePhone(formData.emergencyContact2)) {
      newErrors.emergencyContact2 = "Invalid phone number";
    }

    if (isGuest && !formData.guestEmail) {
      newErrors.guestEmail = "Email is required for order tracking";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const handlePhoneChange = (field: keyof CheckoutFormData, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    onUpdate({ [field]: cleaned });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4'>
        <User className='w-5 h-5 text-cyan-600' />
        <span>Customer Information</span>
      </div>

      {/* Name */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Name on Sticker *
        </label>
        <input
          type='text'
          value={formData.stickerUserName}
          onChange={(e) => onUpdate({ stickerUserName: e.target.value })}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
            errors.stickerUserName ? "border-red-500" : "border-gray-300"
          }`}
          placeholder='Enter name to display on sticker'
        />
        {errors.stickerUserName && (
          <p className='mt-1 text-sm text-red-500'>{errors.stickerUserName}</p>
        )}
      </div>

      {/* Guest Email */}
      {isGuest && (
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Email Address *
          </label>
          <input
            type='email'
            value={formData.guestEmail}
            onChange={(e) => onUpdate({ guestEmail: e.target.value })}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
              errors.guestEmail ? "border-red-500" : "border-gray-300"
            }`}
            placeholder='For order tracking and updates'
          />
          {errors.guestEmail && (
            <p className='mt-1 text-sm text-red-500'>{errors.guestEmail}</p>
          )}
        </div>
      )}

      {/* Phone Numbers Section */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          <Phone className='w-4 h-4' />
          <span>Contact Numbers</span>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm text-gray-600 mb-1'>
              Primary Phone *
            </label>
            <div className='flex'>
              <span className='inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500'>
                +91
              </span>
              <input
                type='tel'
                value={formData.primaryPhoneNumber}
                onChange={(e) =>
                  handlePhoneChange("primaryPhoneNumber", e.target.value)
                }
                className={`flex-1 px-4 py-2.5 border rounded-r-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.primaryPhoneNumber
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder='9876543210'
              />
            </div>
            {errors.primaryPhoneNumber && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.primaryPhoneNumber}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm text-gray-600 mb-1'>
              Emergency Contact 1 *
            </label>
            <div className='flex'>
              <span className='inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500'>
                +91
              </span>
              <input
                type='tel'
                value={formData.emergencyContact1}
                onChange={(e) =>
                  handlePhoneChange("emergencyContact1", e.target.value)
                }
                className={`flex-1 px-4 py-2.5 border rounded-r-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.emergencyContact1
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder='9876543210'
              />
            </div>
            {errors.emergencyContact1 && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.emergencyContact1}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm text-gray-600 mb-1'>
              Emergency Contact 2 *
            </label>
            <div className='flex'>
              <span className='inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500'>
                +91
              </span>
              <input
                type='tel'
                value={formData.emergencyContact2}
                onChange={(e) =>
                  handlePhoneChange("emergencyContact2", e.target.value)
                }
                className={`flex-1 px-4 py-2.5 border rounded-r-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.emergencyContact2
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder='9876543210'
              />
            </div>
            {errors.emergencyContact2 && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.emergencyContact2}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm text-gray-600 mb-1'>
              Additional Contact (Optional)
            </label>
            <div className='flex'>
              <span className='inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500'>
                +91
              </span>
              <input
                type='tel'
                value={formData.additionalContact}
                onChange={(e) =>
                  handlePhoneChange("additionalContact", e.target.value)
                }
                className='flex-1 px-4 py-2.5 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                placeholder='9876543210'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Details (Optional) */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
          <Car className='w-4 h-4' />
          <span>Vehicle Details (Optional)</span>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm text-gray-600 mb-1'>
              Vehicle Number
            </label>
            <input
              type='text'
              value={formData.vehicleNumber}
              onChange={(e) =>
                onUpdate({ vehicleNumber: e.target.value.toUpperCase() })
              }
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              placeholder='MH01AB1234'
            />
          </div>

          <div>
            <label className='block text-sm text-gray-600 mb-1'>
              Vehicle Type
            </label>
            <select
              value={formData.vehicleType}
              onChange={(e) => onUpdate({ vehicleType: e.target.value })}
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
            >
              <option value=''>Select type</option>
              <option value='car'>Car</option>
              <option value='bike'>Bike</option>
              <option value='scooter'>Scooter</option>
              <option value='truck'>Truck</option>
              <option value='other'>Other</option>
            </select>
          </div>

          <div>
            <label className='block text-sm text-gray-600 mb-1'>
              Vehicle Model
            </label>
            <input
              type='text'
              value={formData.vehicleModel}
              onChange={(e) => onUpdate({ vehicleModel: e.target.value })}
              className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              placeholder='Swift Dzire'
            />
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3'>
        <AlertCircle className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' />
        <div className='text-sm text-blue-800'>
          <p className='font-medium'>Your privacy is protected</p>
          <p className='mt-1'>
            Your primary phone number will be masked. When someone scans the QR
            code, they'll see a masked number that forwards to your actual
            phone.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className='flex justify-end pt-4'>
        <button
          type='submit'
          className='px-6 py-2.5 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2'
        >
          Continue to Shipping
        </button>
      </div>
    </form>
  );
};

export default CustomerDataStep;
