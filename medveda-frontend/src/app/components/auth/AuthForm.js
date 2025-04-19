'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import API from '@/app/utils/api';
import { jwtDecode } from 'jwt-decode';

// Define form schemas
const loginSchema = z.object({
  username: z.string().min(3, 'Username is required'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

const signupSchema = loginSchema.extend({
  email: z.string().email('Invalid email address'),
});

export default function AuthForm({ mode }) {
  const isLogin = mode === 'login';
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
  });

  const handleLoginSuccess = async(response) => {
    const { access: token, refresh, user } = response.data;
    
    // Decode token to get user info
    const decoded = jwtDecode(token);
    
    // Store tokens securely (consider using httpOnly cookies in production)
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refresh);
    
    // Update auth context
    login({
      username: user.username,
      email: decoded.email, // From token
      isAdmin: decoded.is_admin || false // From token
    }, token);
    
    toast.success('Logged in successfully!');
    if (user) {
      console.log('Logged in as:', user.username);
    }
    router.push('/');
  };

  const handleSignupSuccess = () => {
    toast.success('Account created! Please log in.');
    router.push('/auth/loginpage');
  };

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        const response = await API.post('/users/login/', {
          username: data.username,
          password: data.password,
        });
        handleLoginSuccess(response);
      } else {
        await API.post('/users/signup/', {
          username: data.username,
          email: data.email,
          password: data.password,
        });
        handleSignupSuccess();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message || 
                         'Authentication failed';
      toast.error(errorMessage);
      
      // Log detailed error for debugging
      console.error('Auth error:', {
        error: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        {isLogin ? 'Welcome Back' : 'Create Your Account'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            {...register('username')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            autoComplete="username"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoComplete="email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            {...register('password')}
            type="password"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? (
          <>
            Don't have an account?{' '}
            <a href="/auth/signuppage" className="font-medium text-green-600 hover:text-green-500">
              Sign up
            </a>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <a href="/auth/loginpage" className="font-medium text-green-600 hover:text-green-500">
              Log in
            </a>
          </>
        )}
      </div>
    </div>
  );
}