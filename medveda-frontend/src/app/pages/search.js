import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import API from '../utils/api';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!q) return;

    API.get(`/remedies/search/?q=${encodeURIComponent(q)}`)
      .then(res => setResults(res.data.results))
      .catch(err => console.error("Search failed:", err));
  }, [q]);

  return (
    <div className="px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Search Results for “{q}”</h1>

      {results.length === 0 && (
        <p className="text-gray-600">No remedies found. Try a different keyword.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((remedy) => (
          <div
            key={remedy.id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <img
              src={remedy.image_url}
              alt={remedy.title}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="text-xl font-semibold mt-4">{remedy.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{remedy.description}</p>
            <p className="mt-3 text-yellow-500">{'⭐'.repeat(Math.round(remedy.rating))}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
