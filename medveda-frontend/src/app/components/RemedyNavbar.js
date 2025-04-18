'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

export default function SearchNavbar() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* 🔶 Logo */}
      <div
        className="text-2xl font-bold text-green-700 cursor-pointer"
        onClick={() => router.push('/')}
      >
        MedVeda
      </div>

      {/* 🔗 Nav Links */}
      <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
        <button onClick={() => router.push('/')} className="hover:text-green-600">Home</button>
        <button onClick={() => router.push('/search')} className="hover:text-green-600">Remedies</button>
        <button onClick={() => router.push('/categories')} className="hover:text-green-600">Categories</button>
      </div>

      {/* 🔍 Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-1 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search remedies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l focus:outline-none"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700 transition"
        >
          Search
        </button>
      </form>

      {/* 👤 Account Icon */}
      <div>
        <FaUserCircle
          size={28}
          className="text-gray-600 hover:text-green-600 cursor-pointer"
          onClick={() => router.push('/account')}
        />
      </div>
    </nav>
  );
}
