// frontend/src/components/checkout/ShippingAddressStep.tsx
import { useState } from "react";
import { CheckoutFormData } from "@/types/directOrder.types";
import { MapPin, ChevronLeft } from "lucide-react";

interface Props {
  formData: CheckoutFormData;
  onUpdate: (data: Partial<CheckoutFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
];

const ShippingAddressStep = ({ formData, onUpdate, onNext, onBack }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, "");
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  const validatePincode = (pincode: string): boolean => {
    return /^\d{6}$/.test(pincode);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
    }

    if (!formData.locality.trim()) {
      newErrors.locality = "Locality is required";
    }

    if (!formData.district.trim()) {
      newErrors.district = "District is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!validatePincode(formData.pincode)) {
      newErrors.pincode = "Invalid pincode (6 digits)";
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

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    onUpdate({ phone: cleaned });
  };

  const handlePincodeChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 6);
    onUpdate({ pincode: cleaned });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4'>
        <MapPin className='w-5 h-5 text-cyan-600' />
        <span>Shipping Address</span>
      </div>

      {/* Name and Phone */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Full Name *
          </label>
          <input
            type='text'
            value={formData.fullName}
            onChange={(e) => onUpdate({ fullName: e.target.value })}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder='Enter full name'
          />
          {errors.fullName && (
            <p className='mt-1 text-sm text-red-500'>{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Phone Number *
          </label>
          <div className='flex'>
            <span className='inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500'>
              +91
            </span>
            <input
              type='tel'
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`flex-1 px-4 py-2.5 border rounded-r-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder='9876543210'
            />
          </div>
          {errors.phone && (
            <p className='mt-1 text-sm text-red-500'>{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Address Line 1 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Address Line 1 *
        </label>
        <input
          type='text'
          value={formData.addressLine1}
          onChange={(e) => onUpdate({ addressLine1: e.target.value })}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
            errors.addressLine1 ? "border-red-500" : "border-gray-300"
          }`}
          placeholder='House/Flat No., Building Name, Street'
        />
        {errors.addressLine1 && (
          <p className='mt-1 text-sm text-red-500'>{errors.addressLine1}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Address Line 2 (Optional)
        </label>
        <input
          type='text'
          value={formData.addressLine2}
          onChange={(e) => onUpdate({ addressLine2: e.target.value })}
          className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
          placeholder='Area, Colony, etc.'
        />
      </div>

      {/* Locality and District */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Locality / Area *
          </label>
          <input
            type='text'
            value={formData.locality}
            onChange={(e) => onUpdate({ locality: e.target.value })}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
              errors.locality ? "border-red-500" : "border-gray-300"
            }`}
            placeholder='Locality'
          />
          {errors.locality && (
            <p className='mt-1 text-sm text-red-500'>{errors.locality}</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            District / City *
          </label>
          <input
            type='text'
            value={formData.district}
            onChange={(e) => onUpdate({ district: e.target.value })}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
              errors.district ? "border-red-500" : "border-gray-300"
            }`}
            placeholder='District'
          />
          {errors.district && (
            <p className='mt-1 text-sm text-red-500'>{errors.district}</p>
          )}
        </div>
      </div>

      {/* State and Pincode */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            State *
          </label>
          <select
            value={formData.state}
            onChange={(e) => onUpdate({ state: e.target.value })}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
              errors.state ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value=''>Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className='mt-1 text-sm text-red-500'>{errors.state}</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Pincode *
          </label>
          <input
            type='text'
            value={formData.pincode}
            onChange={(e) => handlePincodeChange(e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
              errors.pincode ? "border-red-500" : "border-gray-300"
            }`}
            placeholder='400001'
          />
          {errors.pincode && (
            <p className='mt-1 text-sm text-red-500'>{errors.pincode}</p>
          )}
        </div>
      </div>

      {/* Landmark */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Landmark (Optional)
        </label>
        <input
          type='text'
          value={formData.landmark}
          onChange={(e) => onUpdate({ landmark: e.target.value })}
          className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
          placeholder='Near Metro Station, etc.'
        />
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
          Continue to Customization
        </button>
      </div>
    </form>
  );
};

export default ShippingAddressStep;
