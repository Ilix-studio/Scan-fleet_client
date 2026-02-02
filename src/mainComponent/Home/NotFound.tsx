// src/pages/NotFound.tsx
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-black relative overflow-hidden'>
      {/* Background */}
      <div
        className='absolute inset-0 z-0'
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 20, 147, 0.1), transparent 50%),
            radial-gradient(ellipse 160% 130% at 10% 10%, rgba(0, 255, 255, 0.08), transparent 60%),
            radial-gradient(ellipse 160% 130% at 90% 90%, rgba(138, 43, 226, 0.12), transparent 65%),
            #000000
          `,
        }}
      />

      <div className='relative z-10 text-center px-4'>
        {/* 404 Text */}
        <h1 className='text-[150px] sm:text-[200px] font-bold leading-none bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
          404
        </h1>

        {/* Message */}
        <h2 className='text-2xl sm:text-3xl font-semibold text-white mb-4 -mt-4'>
          Page Not Found
        </h2>
        <p className='text-white/60 max-w-md mx-auto mb-8'>
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button
            asChild
            className='bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white border-0'
          >
            <Link to='/'>
              <Home size={18} className='mr-2' />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            variant='outline'
            className='border-white/20 text-white hover:bg-white/10 bg-transparent'
          >
            <Link to={-1 as any}>
              <ArrowLeft size={18} className='mr-2' />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
