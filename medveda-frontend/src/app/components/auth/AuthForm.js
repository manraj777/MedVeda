'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import API from '@/app/utils/api';
import '../../styles/AuthForm.css';

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
      <div className="text-center mb-10">
        <i className="text-4xl text-green-700 mb-4" data-fa-i2svg=""><svg className="svg-inline--fa fa-leaf" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="leaf" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5h88c8.8 0 16 7.2 16 16s-7.2 16-16 16H288 216s0 0 0 0c-16.6 0-32.7 1.9-48.2 5.4c-25.9 5.9-50 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440v16c0 13.3 10.7 24 24 24s24-10.7 24-24V440c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z"></path></svg></i>
        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>            
        <p className="text-gray-600 mt-2">
          {isLogin ? 'Log In to Your Account' : 'Create an Account'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" >User Name</label>
          <input
            {...register('username')}
            placeholder="Enter Your Username"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" >Email Address</label>
            <input
              {...register('email')}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
        )}

        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" >Password</label>
          <input
            {...register('password')}
            type="password"
            placeholder="Enter Your Password"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition shadow-md"
        >
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <p className="text-center mt-8 text-sm text-gray-600">
        {isLogin ? (
          <>Don't have an account? <a href="/auth/signuppage" className="text-green-600 hover:text-green-700 font-medium cursor-pointer">Sign up</a></>
        ) : (
          <>Already have an account? <a href="/auth/loginpage" className="text-green-600 hover:text-green-700 font-medium cursor-pointer">Log in</a></>
        )}
      </p>
    </div>
  );
}
