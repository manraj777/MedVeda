'use client';
import { useAuth } from './auth/AuthContext';
import { useRouter } from 'next/navigation';

import '../styles/Navbar.css'; // Import your CSS file for custom styles
export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      logout();
      router.push('/');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* 🔶 Logo / App Name */}
      <div className="text-2xl font-bold text-green-700">
        MedVeda
      </div>

      {/* 🔗 Navigation Links */}
      <div className="space-x-6 items-center text-sm font-medium text-gray-700">
        <a href="#remedies" className="hover:text-green-600 transition">Remedies</a>
        <a href="#how-it-works" className="hover:text-green-600 transition">How It Works</a>
        <a href="#testimonials" className="hover:text-green-600 transition">Testimonials</a>

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push('/auth/loginpage')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}

    return (
      <div className="fixed w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 bg-white">
        <div className='navbar-container px-4'>
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center flex h-20">
          {/* 🔶 Logo / App Name */}
          <div className="text-2xl font-bold text-green-700 flex items-center">
            <span className="text-2xl font-bold text-emerald-800 cursor-pointer">Med<span className="text-amber-600">Veda</span></span>
          </div>
    
          {/* 🔗 Navigation Links */}
          <div className="space-x-8 items-center text-sm font-medium text-gray-700 hidden md:flex">
            <a href="#remedies" className="transition text-gray-600 hover:text-emerald-700">Remedies</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-emerald-700 transition">How It Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-emerald-700 transition">Testimonials</a>
            <button className="bg-emerald-700 text-white px-6 py-2 rounded-full hover:bg-emerald-800">Sign In</button>
          </div>
        </nav>
        </div>
      </div>
    );
  }
  