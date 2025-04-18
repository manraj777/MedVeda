'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import API from '@/app/utils/api';

export default function AuthForm({ mode }) {
  const isLogin = mode === 'login';
  const router = useRouter();
  const { login } = useAuth();

  // Zod schema
  const schema = z.object({
    username: z.string().min(3, 'Username is required'),
    password: z.string().min(4, 'Password must be at least 4 characters'),
    email: isLogin ? z.string().optional() : z.string().email('Invalid email'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        const res = await API.post('/users/login/', {
          username: data.username,
          password: data.password,
        });
        login({ username: res.data.user }, res.data.access);
        toast.success('Logged in successfully');
        router.push('/');
      } else {
        await API.post('/users/signup/', data);
        toast.success('Account created! You can log in now');
        router.push('/auth/loginpage');
      }
    } catch (err) {
      toast.error('Authentication failed. Please check credentials.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {isLogin ? 'Log In to Your Account' : 'Create an Account'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register('username')}
            placeholder="Username"
            className="w-full p-2 border rounded"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        {!isLogin && (
          <div>
            <input
              {...register('email')}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
        )}

        <div>
          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <p className="text-sm text-center mt-6 text-gray-600">
        {isLogin ? (
          <>Don't have an account? <a href="/auth/signuppage" className="text-green-700 hover:underline">Sign up</a></>
        ) : (
          <>Already have an account? <a href="/auth/loginpage" className="text-green-700 hover:underline">Log in</a></>
        )}
      </p>
    </div>
  );
}
