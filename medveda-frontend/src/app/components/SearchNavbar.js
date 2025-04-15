'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchNavbar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q');
  const [searchQuery, setSearchQuery] = useState('');

  // Keep input value in sync with current query param
  useEffect(() => {
    if (q) setSearchQuery(q);
  }, [q]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* 🧠 Left: App Name */}
      <div
        className="text-2xl font-bold text-green-700 cursor-pointer"
        onClick={() => router.push('/')}
      >
        MedVeda
      </div>

      {/* 🔍 Center: Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl mx-auto w-full">
        <input
          type="text"
          placeholder="Search for remedies, ailments..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-r-lg hover:bg-green-700 transition"
        >
          Search
        </button>
      </form>

      {/* 📌 Right: Saved / Account */}
      <div className="flex items-center gap-4 text-sm text-gray-700">
        <button onClick={() => router.push('/saved')} className="hover:text-green-600">
          Saved
        </button>
        <button onClick={() => router.push('/account')} className="hover:text-green-600">
          Account
        </button>
      </div>
    </nav>
  );
}
