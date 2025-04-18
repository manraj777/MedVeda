'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import API from '@/app/utils/api';

const fallbackRemedy = {
  title: 'Tulsi Ginger Kadha',
  image: 'https://cdn.medveda.com/images/dummy-kadha.jpg',
  description: 'A traditional Ayurvedic remedy to boost immunity.',
  ingredients: 'Tulsi leaves, Ginger, Black Pepper, Water, Honey',
  preparation: 'Boil all ingredients for 10 minutes. Strain and drink warm.',
  health_benefits: 'Boosts immunity, relieves cold and cough, detoxifies body.',
  rating: 4.5,
};

const fallbackReviews = [
  { user: 'Anonymous', comment: 'Helped me recover faster!', rating: 5 },
  { user: 'Rahul', comment: 'Tastes bitter but really works.', rating: 4 },
];

export default function RemedyDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [remedy, setRemedy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (slug) {
      API.get(`/remedies/${slug}/`)
        .then((res) => {
          setRemedy(res.data);
          // (Optional) fetch actual reviews
          setReviews(res.data.reviews || []);
        })
        .catch(() => {
          setRemedy(fallbackRemedy);
          setReviews(fallbackReviews);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="p-10 max-w-4xl mx-auto">
        <div className="animate-pulse bg-gray-200 h-64 w-full rounded mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-6 text-green-700 underline hover:text-green-900"
      >
        ← Back to Search
      </button>

      <img src={remedy.image} className="w-full h-64 object-cover rounded mb-6" />
      <h1 className="text-3xl font-bold text-green-800 mb-2">{remedy.title}</h1>
      <p className="text-gray-600 mb-4">{remedy.description}</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-green-700">🧂 Ingredients</h2>
        <p className="whitespace-pre-line">{remedy.ingredients}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-green-700">👨‍🍳 Preparation</h2>
        <p className="whitespace-pre-line">{remedy.preparation}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-green-700">💚 Health Benefits</h2>
        <p className="whitespace-pre-line">{remedy.health_benefits}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-green-700">⭐ User Reviews</h2>
        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((r, i) => (
              <li key={i} className="bg-gray-50 p-3 rounded border">
                <p className="text-sm text-gray-700 italic mb-1">"{r.comment}"</p>
                <p className="text-sm text-gray-500">– {r.user}, {'⭐'.repeat(r.rating)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No reviews available.</p>
        )}
      </section>
    </div>
  );
}
