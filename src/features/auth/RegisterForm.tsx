import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthFormAlert } from '../../components/feedback/AuthFormAlert';
import { FormField } from '../../components/feedback/FormField';
import { Button } from '../../components/ui/Button';
import { getAuthErrorMessage } from './authErrors';
import { registerSchema, type RegisterFormValues } from './authSchemas';
import { useAuth } from './useAuth';

export function RegisterForm() {
  const { register: registerUser, isRegistering } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await registerUser(values);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setFormError(getAuthErrorMessage(error, 'register'));
    }
  });

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
      <p className="mt-2 text-sm text-slate-600">Start managing projects and tasks in TaskFlow.</p>

      <form className="mt-6 space-y-4" aria-label="Registration form" onSubmit={onSubmit} noValidate>
        <AuthFormAlert message={formError} />

        <FormField
          id="register-first-name"
          label="First name"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register('firstName')}
        />

        <FormField
          id="register-last-name"
          label="Last name"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register('lastName')}
        />

        <FormField
          id="register-email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormField
          id="register-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" disabled={isRegistering} className="w-full">
          {isRegistering ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-slate-900 hover:underline">
          Sign in
        </Link>
      </p>
    </section>
  );
}
