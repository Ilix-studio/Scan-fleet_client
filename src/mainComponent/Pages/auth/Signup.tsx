import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building,
  Phone,
  ScanQrCode,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  useUserGoogleAuthMutation,
  useUserSignupMutation,
} from "@/redux-store/services/userAuthApi";
import { auth, googleProvider } from "@/config/firebase";
import { signInWithPopup } from "firebase/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, setShowRoleModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState("");

  const [googleAuth, { isLoading: isGoogleLoading }] =
    useUserGoogleAuthMutation();
  const [signup, { isLoading: isSignupLoading }] = useUserSignupMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await signup({
        idToken: "", // Email/password signup - backend will handle Firebase creation
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
      }).unwrap();

      navigate("/update-profile");
    } catch (err: any) {
      setError(err?.data?.message || "Signup failed. Please try again.");
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await googleAuth({ idToken }).unwrap();
      if (response.user.role === "DIRECT_CUSTOMER") {
        setShowRoleModal(true);
      } else {
        navigate("/user-dashboard");
      }
    } catch (err: any) {
      setError(err?.data?.message || "Google signup failed. Please try again.");
    }
  };

  const isLoading = isGoogleLoading || isSignupLoading;

  return (
    <div className='min-h-screen flex items-center justify-center bg-black relative overflow-hidden py-8'>
      {/* Background Gradient */}
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

      <div className='relative z-10 w-full max-w-6xl px-1'>
        {/* Signup Card */}
        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl'>
          {/* Glow Effect */}
          <div className='absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50'></div>

          <div className='relative'>
            {/* Logo */}
            <div className='text-center mb-8'>
              <div className='flex items-center justify-center gap-3 mb-4'>
                <div className='relative'>
                  <div className='w-12 h-12 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg'>
                    <ScanQrCode size={24} />
                  </div>
                  <div className='absolute -inset-1 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl blur opacity-30'></div>
                </div>
                <span className='text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                  ScanFleet
                </span>
              </div>
              <h1 className='text-2xl font-bold text-white mb-2'>
                Join ScanFleet
              </h1>
              <p className='text-white/60'>Create your dealer account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm'>
                {error}
              </div>
            )}

            {/* Google Signup Button */}
            <Button
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className='w-full bg-white hover:bg-gray-100 text-gray-800 border-0 py-3 rounded-xl font-semibold mb-6 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            >
              <div className='flex items-center justify-center gap-3'>
                {isGoogleLoading ? (
                  <div className='w-4 h-4 border-2 border-gray-800/30 border-t-gray-800 rounded-full animate-spin'></div>
                ) : (
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    className='flex-shrink-0'
                  >
                    <path
                      fill='#4285F4'
                      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    />
                    <path
                      fill='#34A853'
                      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    />
                    <path
                      fill='#FBBC05'
                      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    />
                    <path
                      fill='#EA4335'
                      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    />
                  </svg>
                )}
                Continue with Google
              </div>
            </Button>

            {/* Divider */}
            <div className='relative mb-6'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t border-white/20'></span>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='bg-black px-4 text-white/60'>
                  Or create account with email
                </span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Name Fields */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='firstName'
                    className='block text-sm font-medium mb-2 text-white'
                  >
                    First Name
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <User size={18} className='text-white/40' />
                    </div>
                    <input
                      type='text'
                      id='firstName'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className='w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-white placeholder-white/50 disabled:opacity-50'
                      placeholder='John'
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor='lastName'
                    className='block text-sm font-medium mb-2 text-white'
                  >
                    Last Name
                  </label>
                  <input
                    type='text'
                    id='lastName'
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-white placeholder-white/50 disabled:opacity-50'
                    placeholder='Doe'
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium mb-2 text-white'
                >
                  Email Address
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Mail size={18} className='text-white/40' />
                  </div>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className='w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-white placeholder-white/50 disabled:opacity-50'
                    placeholder='john@dealership.com'
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium mb-2 text-white'
                >
                  Phone Number
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Phone size={18} className='text-white/40' />
                  </div>
                  <input
                    type='tel'
                    id='phone'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className='w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-white placeholder-white/50 disabled:opacity-50'
                    placeholder='+91 98765 43210'
                  />
                </div>
              </div>

              {/* Business Name Field */}
              <div>
                <label
                  htmlFor='businessName'
                  className='block text-sm font-medium mb-2 text-white'
                >
                  Business Name
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Building size={18} className='text-white/40' />
                  </div>
                  <input
                    type='text'
                    id='businessName'
                    name='businessName'
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className='w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-white placeholder-white/50 disabled:opacity-50'
                    placeholder='Your Dealership Name'
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium mb-2 text-white'
                >
                  Password
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock size={18} className='text-white/40' />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className='w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-white placeholder-white/50 disabled:opacity-50'
                    placeholder='Create a password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60 disabled:opacity-50'
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium mb-2 text-white'
                >
                  Confirm Password
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Lock size={18} className='text-white/40' />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id='confirmPassword'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className='w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-white placeholder-white/50 disabled:opacity-50'
                    placeholder='Confirm your password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60 disabled:opacity-50'
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className='flex items-start gap-3'>
                <input
                  type='checkbox'
                  id='agreeToTerms'
                  name='agreeToTerms'
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className='mt-1 w-4 h-4 text-cyan-400 border-white/20 rounded focus:ring-cyan-400 focus:ring-2 bg-white/5 disabled:opacity-50'
                />
                <label htmlFor='agreeToTerms' className='text-sm text-white/80'>
                  I agree to the{" "}
                  <Link
                    to='/terms'
                    className='text-cyan-400 hover:text-cyan-300'
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to='/privacy'
                    className='text-cyan-400 hover:text-cyan-300'
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                disabled={isLoading || !formData.agreeToTerms}
                className='w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              >
                {isSignupLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className='text-center mt-6'>
              <p className='text-white/60'>
                Already have an account?{" "}
                <Link
                  to='/login'
                  className='text-cyan-400 hover:text-cyan-300 font-semibold transition-colors'
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
