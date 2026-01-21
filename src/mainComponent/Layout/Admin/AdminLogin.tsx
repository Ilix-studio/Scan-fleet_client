// src/pages/AdminLogin.tsx
import { useState, FormEvent, ChangeEvent } from "react";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAdminLoginMutation } from "@/redux-store/services/AdminCentrix/adminAuthApi";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    if (!formData.email || !formData.password) {
      setFormError("Email and password are required");
      return;
    }

    try {
      await adminLogin({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      navigate("/admin-dashboard");
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message || "Invalid credentials";
      setFormError(errorMessage);
      console.error("Login error:", err);
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
        <div className='bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='flex items-center justify-center mb-4'>
              <div className='bg-gradient-to-br from-cyan-500 to-purple-600 p-3 rounded-2xl'>
                <Shield size={32} className='text-white' />
              </div>
            </div>
            <h1 className='text-3xl font-bold text-white mb-2'>Admin Login</h1>
            <p className='text-white/60'>Access the admin dashboard</p>
          </div>

          {/* Error Message */}
          {formError && (
            <div className='mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl'>
              <p className='text-red-400 text-sm text-center'>{formError}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
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
                  className='w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all text-white placeholder-white/50'
                  placeholder='admin@scanfleet.com'
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

            {/* Submit Button */}
            <Button
              type='submit'
              disabled={isLoading}
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
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
