'use client';
import { useAuth } from './auth/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      logout();
      router.push('/');
    }
  };

  return (
    <div className="fixed w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 bg-white">
      <div className="navbar-container px-4">
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center h-20">
          {/* 🔶 Logo */}
          <Link href="/" className="text-2xl font-bold text-emerald-800 cursor-pointer">
            Med<span className="text-amber-600">Veda</span>
          </Link>

          {/* 🔗 Navigation Links */}
          <div className="space-x-8 items-center text-sm font-medium text-gray-700 hidden md:flex">
            <a href="#remedies" className="transition text-gray-600 hover:text-emerald-700">Remedies</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-emerald-700 transition">How It Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-emerald-700 transition">Testimonials</a>

            {isAdmin && (
              <Link href="/admin/dashboard">
                <span className="text-xs bg-yellow-100 border border-yellow-500 text-yellow-700 px-2 py-1 rounded">
                  🛠 Admin
                </span>
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-brown-700 text-white px-6 py-2 rounded-full hover:bg-brown-800 transition shadow"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push('/auth/loginpage')}
                className="bg-emerald-700 text-white px-6 py-2 rounded-full hover:bg-emerald-800 transition shadow"
              >
                Sign In
              </button>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
