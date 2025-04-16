'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../utils/api';
import { useAuth } from './AuthContext';

export default function AuthForm({ mode }) {
  const isLogin = mode === 'login';
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await API.post('/users/login/', {
          username: form.username,
          password: form.password,
        });
        login({ username: res.data.user }, res.data.access);
        router.push('/');
      } else {
        await API.post('/users/signup/', form);
        router.push('/auth/(login)');
      }
    } catch (err) {
      setError('Something went wrong. Check your credentials.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {isLogin ? 'Log In to Your Account' : 'Create an Account'}
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {!isLogin && (
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <p className="text-sm text-center mt-6 text-gray-600">
        {isLogin ? (
          <>Don't have an account? <a href="/auth/(signup)" className="text-green-700 hover:underline">Sign up</a></>
        ) : (
          <>Already have an account? <a href="/auth/(login)" className="text-green-700 hover:underline">Log in</a></>
        )}
      </p>
    </div>
  );
}
