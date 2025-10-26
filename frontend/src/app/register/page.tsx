'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { registerUser, clearError } from '@/store/slices/authSlice';
import { registerSchema, RegisterFormData } from '@/lib/validations';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { CustomInput } from '@/components/ui/CustomInput';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });


  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await dispatch(registerUser({
        email: data.email,
        password: data.password,
      })).unwrap();
      toast.success('Registration successful!');
      router.push('/movies');
    } catch (error) {
    }
  };

  return (
    <div className="min-h-screen bg-background bg-[url('/bg.png')] bg-no-repeat bg-bottom bg-[length:100%_111px] bg-fixed">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-[300px] flex items-center justify-center flex-col">
          {/* Logo Section */}
          <div className="text-center ">
            <h1 className="text-heading-1 font-semibold text-center text-white mb-8">Sign up</h1>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CustomInput
              {...register('email')}
              type="email"
              placeholder="Email"
              error={errors.email?.message}
            />

            <CustomInput
              {...register('password')}
              variant="password"
              placeholder="Password"
              error={errors.password?.message}
              showPasswordToggle={true}
            />

            <CustomInput
              {...register('confirmPassword')}
              variant="password"
              placeholder="Confirm Password"
              error={errors.confirmPassword?.message}
              showPasswordToggle={true}
            />

            <PrimaryButton
              type="submit"
              variant="login"
              size="login"
              fullWidth={true}
              disabled={isLoading}
              isLoading={isLoading}
              loadingText="Creating account..."
            >
              Sign up
            </PrimaryButton>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-primary-400 hover:text-primary-300 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
