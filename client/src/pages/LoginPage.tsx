import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAppDispatch } from '../hooks/redux';
import { login } from '../store/slices/authSlice';
import { useToast } from '../hooks/useToast';
import type { LoginRequest } from '@shared/types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await dispatch(login(data as LoginRequest)).unwrap();
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      toast.error(error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Sign in to Network</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('email')}
          type="email"
          label="Email"
          placeholder="you@example.com"
          error={errors.email?.message}
          icon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
        />

        <Input
          {...register('password')}
          type="password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              {...register('rememberMe')}
              type="checkbox"
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Remember me
            </span>
          </label>
          <Link to="/forgot-password" className="text-sm link">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" fullWidth loading={isLoading}>
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="link font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
