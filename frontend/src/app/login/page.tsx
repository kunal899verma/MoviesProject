'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { loginUser, clearError } from '@/store/slices/authSlice';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { CustomInput } from '@/components/ui/CustomInput';
import { Checkbox } from '@/components/ui/Checkbox';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Remove automatic redirect - let the form submission handle it

  useEffect(() => {
    if (error) {
      toast.error(error);
      // Clear error after a delay to give users time to read the message
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Clear any existing errors before submitting
      dispatch(clearError());
      
      await dispatch(loginUser(data)).unwrap();
      toast.success('Login successful!');
      
      // Redirect immediately after successful login
      router.push('/movies');
    } catch (error) {
      // Error handling is done in the useEffect above
    }
  };

  return (
    <div className="min-h-screen bg-background bg-[url('/bg.png')] bg-no-repeat bg-bottom bg-[length:100%_111px] bg-fixed">
      <div className="min-h-screen flex items-center justify-center px-4">
         <div className="w-full max-w-[300px] flex items-center justify-center flex-col">
          {/* Logo Section */}
          <div className="text-center">
            <h1 className="text-heading-1 font-semibold text-center text-white mb-8">
              Sign in
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" role="form" aria-label="Login form">
            <CustomInput
              {...register('email')}
              type="email"
              placeholder="Email"
              error={errors.email?.message}
              aria-label="Email address"
              aria-required={true}
            />

            <CustomInput
              {...register('password')}
              variant="password"
              placeholder="Password"
              error={errors.password?.message}
              showPasswordToggle={true}
              aria-label="Password"
              aria-required={true}
            />

            <div className="flex items-center justify-center">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onChange={setRememberMe}
              />
              <label
                htmlFor="remember"
                  className="text-body-small font-normal text-white cursor-pointer ml-4"
              >
                Remember me
              </label>
            </div>

            <PrimaryButton
              type="submit"
              variant="login"
              size="login"
              disabled={isLoading}
              isLoading={isLoading}
              loadingText="Signing in..."
            >
              Login
            </PrimaryButton>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
