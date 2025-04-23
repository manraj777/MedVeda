'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/HeroSection.css';

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  // State to store the search query

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    console.log('Searching for:', query);
    e.preventDefault(); // Prevent the default form submission behavior
    console.log('Searching for:', query); // Log the query (or connect to an API)
  };

  return (
    <section className="bg-green-100 py-20 text-center px-4 hero-section relative h-[800px] flex items-center">
      {/* 🌿 Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          src="https://storage.googleapis.com/uxpilot-auth.appspot.com/c7dfd33d4e-96210fd4a79284765168.png"
          alt="natural herbs and ayurvedic ingredients with warm lighting, earthy tones, photographic style"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Discover Ancient Wisdom for Modern Wellness
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Find natural Ayurvedic remedies for your health and wellness journey
          </p>

          {/* 🔍 Search Bar Inside Form */}
          <form onSubmit={handleSearch} className="bg-white p-2 rounded-full shadow-lg max-w-2xl">
            <div className="flex items-center">
              <i className="text-gray-400 ml-4">
                <svg
                  className="svg-inline--fa fa-magnifying-glass"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="magnifying-glass"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                  ></path>
                </svg>
              </i>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)} // Update the query state
                placeholder="Search remedies by ailment or ingredient..."
                className="w-full px-4 py-2 rounded-l-lg border border-green-300 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-emerald-700 text-white px-8 py-3 rounded-full rounded-r-lg hover:bg-green-700 hover:bg-emerald-800 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
