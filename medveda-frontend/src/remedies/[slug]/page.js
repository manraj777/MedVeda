'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import API from '@/utils/api';

export default function RemedyDetailPage() {
  const { slug } = useParams();
  const [remedy, setRemedy] = useState(null);

  useEffect(() => {
    if (slug) {
      API.get(`/remedies/${slug}/`)
        .then(res => setRemedy(res.data))
        .catch(() => console.warn('Failed to fetch remedy'));
    }
  }, [slug]);

  if (!remedy) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
    </div>
  );
}
