import { useState } from 'react';

export default function HeroSection() {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    console.log('Searching for:', query);
  };

  return (
    <section className="bg-green-100 py-20 text-center px-4">
      <h1 className="text-5xl font-bold text-green-800 leading-tight">
        Discover Ayurvedic Home Remedies
      </h1>
      <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
        MedVeda helps you explore natural, time-tested treatments curated from traditional wisdom and trusted communities.
      </p>

      {/* 🔍 Search Bar */}
      <form onSubmit={handleSearch} className="mt-8 flex justify-center max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search for ailments, ingredients, remedies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-l-lg border border-green-300 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 rounded-r-lg hover:bg-green-700 transition"
        >
          Search
        </button>
      </form>

      {/* Optional CTA button below
      <button className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition">
        Explore Remedies
      </button> */}
    </section>
  );
}
