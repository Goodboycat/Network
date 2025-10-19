import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAppDispatch } from '../hooks/redux';
import { register as registerAction } from '../store/slices/authSlice';
import { useToast } from '../hooks/useToast';
import type { RegisterRequest } from '@shared/types';
import { PASSWORD_MIN_LENGTH, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_REGEX } from '@shared/constants';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(USERNAME_MIN_LENGTH, `Username must be at least ${USERNAME_MIN_LENGTH} characters`)
    .max(USERNAME_MAX_LENGTH, `Username must be at most ${USERNAME_MAX_LENGTH} characters`)
    .regex(USERNAME_REGEX, 'Username can only contain letters, numbers, and underscores'),
  displayName: z.string().min(1, 'Display name is required'),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      await dispatch(registerAction(registerData as RegisterRequest)).unwrap();
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Create your account</h2>
      
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
          {...register('username')}
          type="text"
          label="Username"
          placeholder="johndoe"
          error={errors.username?.message}
          icon={<UserIcon className="w-5 h-5 text-gray-400" />}
          helperText="Letters, numbers, and underscores only"
        />

        <Input
          {...register('displayName')}
          type="text"
          label="Display Name"
          placeholder="John Doe"
          error={errors.displayName?.message}
          icon={<UserIcon className="w-5 h-5 text-gray-400" />}
        />

        <Input
          {...register('password')}
          type="password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
          helperText={`At least ${PASSWORD_MIN_LENGTH} characters`}
        />

        <Input
          {...register('confirmPassword')}
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
        />

        <Button type="submit" variant="primary" fullWidth loading={isLoading}>
          Create account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="link font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
