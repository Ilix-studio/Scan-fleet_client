// components/Login.tsx
import { useState, FormEvent } from "react";
import { Eye, EyeOff, Mail, Lock, ScanQrCode } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  useUserLoginMutation,
  useUserGoogleAuthMutation,
} from "@/redux-store/services/userAuthApi";
import { signInWithGoogle } from "@/config/firebase";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  const [userLogin, { isLoading }] = useUserLoginMutation();
  const [userGoogleAuth, { isLoading: isGoogleLoading }] =
    useUserGoogleAuthMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      // Step 1: Firebase client auth
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("@/config/firebase");

      const result = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Step 2: Get ID token
      const idToken = await result.user.getIdToken();

      // Step 3: Send to backend
      await userLogin({ idToken }).unwrap();

      navigate("/dashboard");
    } catch (err: any) {
      setFormError(err?.message || "Invalid credentials");
    }
  };

  const handleGoogleLogin = async () => {
    setFormError(null);

    try {
      // Step 1: Firebase client authentication
      const result = await signInWithGoogle();

      // Step 2: Get Firebase ID token
      const idToken = await result.user.getIdToken();

      // Step 3: Send token to backend for verification
      await userGoogleAuth({ idToken }).unwrap();

      navigate("/dashboard");
    } catch (err: any) {
      // Error handling remains the same
      if (err.code === "auth/popup-closed-by-user") {
        setFormError("Sign-in popup was closed");
      } else if (err.code === "auth/cancelled-popup-request") {
        setFormError("Sign-in cancelled");
      } else if (err.code === "auth/network-request-failed") {
        setFormError("Network error. Please check your connection");
      } else {
        setFormError(
          err?.data?.message || err?.message || "Google authentication failed"
        );
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-black relative overflow-hidden'>
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

      <div className='relative z-10 w-full max-w-md px-6'>
        {/* Login Card */}
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
                Welcome Back
              </h1>
              <p className='text-white/60'>Sign in to your account</p>
            </div>

            {/* Google Login Button */}
            <Button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              type='button'
              className='w-full bg-white hover:bg-gray-100 text-gray-800 border-0 py-3 rounded-xl font-semibold mb-6 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            >
              {isGoogleLoading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-4 h-4 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin'></div>
                  Connecting...
                </div>
              ) : (
                <div className='flex items-center justify-center gap-3'>
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
                  Continue with Google
                </div>
              )}
            </Button>

            {/* Divider */}
            <div className='relative mb-6'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t border-white/20'></span>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='bg-black px-4 text-white/60'>
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Error Message */}
            {formError && (
              <div className='mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl'>
                <p className='text-red-400 text-sm text-center'>{formError}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className='space-y-4'>
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
                    className='w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-white placeholder-white/50'
                    placeholder='user@scanfleet.com'
                  />
                </div>
              </div>

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
                    className='w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-white placeholder-white/50'
                    placeholder='Enter your password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60'
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className='text-right'>
                <Link
                  to='/forgot-password'
                  className='text-sm text-cyan-400 hover:text-cyan-300 transition-colors'
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type='submit'
                disabled={isLoading || isGoogleLoading}
                className='w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className='text-center mt-6'>
              <p className='text-white/60'>
                Don't have an account?{" "}
                <Link
                  to='/signup'
                  className='text-cyan-400 hover:text-cyan-300 font-semibold transition-colors'
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
