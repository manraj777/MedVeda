'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import API from '@/app/utils/api'; 
import SearchNavbar from '@/app/components/RemedyNavbar';
import Footer from '@/app/components/Footer';

const fallbackRemedy = {
  title: 'Tulsi Ginger Kadha',
  image: 'https://cdn.medveda.com/images/dummy-kadha.jpg',
  description: 'A traditional Ayurvedic remedy to boost immunity.',
  ingredients: `1. Tulsi leaves\n2. Ginger\n3. Black Pepper\n4. Water\n5. Honey`,
  preparation: `1. Boil all ingredients for 10 minutes\n2. Strain\n3. Add honey\n4. Serve warm`,
  health_benefits: `• Boosts immunity\n• Relieves cold and cough\n• Detoxifies body\n• Reduces inflammation`,
  rating: 4.5,
};

const fallbackReviews = [
  { 
    user: 'Priya K.', 
    comment: 'This kadha saved me during flu season! Tastes strong but works wonders.', 
    rating: 5,
    date: '2 weeks ago'
  },
  { 
    user: 'Rahul M.', 
    comment: 'Effective for sore throat. Reduce ginger if sensitive to spice.', 
    rating: 4,
    date: '1 month ago'
  },
  { 
    user: 'Anonymous', 
    comment: 'My grandmother’s recipe! Modern twist: add lemon for better taste.', 
    rating: 5,
    date: '3 days ago'
  },
  { 
    user: 'Neha S.', 
    comment: 'Helped with my chronic cough. Drinking it daily now.', 
    rating: 4,
    date: '2 months ago'
  },
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
          // Use fallback if no reviews exist
          setReviews(res.data.reviews?.length > 0 ? res.data.reviews : fallbackReviews);
        })
        .catch(() => {
          
          setReviews(fallbackReviews);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading || !remedy) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const benefits = remedy.health_benefits?.split('•').filter(Boolean);

  // Helper to render star ratings
  const renderStars = (rating) => {
    return (
      <span className="inline-flex items-center">
        {'⭐'.repeat(Math.floor(rating))}
        {rating % 1 >= 0.5 && '⭐'}
        <span className="text-gray-500 ml-2 text-sm">({rating.toFixed(1)})</span>
      </span>
    );
  };

  return (
    <>
      <SearchNavbar />

      <div className="p-6 max-w-4xl mx-auto">
        {/* 🔙 Back to Search */}
        <button
          onClick={() => router.back()}
          className="text-green-700 underline hover:text-green-900 mb-6"
        >
          ← Back to Search
        </button>

        {/* 📷 Remedy Image */}
        <img
          src={remedy.image}
          className="w-full h-64 object-cover rounded mb-6"
          alt={remedy.title}
        />

        {/* 🧠 Title + Description */}
        <h1 className="text-3xl font-bold text-green-800 mb-2">{remedy.title}</h1>
        

      

        {/* ⚙️ Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button className="border px-4 py-2 rounded hover:bg-gray-100 transition">
            🔗 Share
          </button>
          <button className="border px-4 py-2 rounded hover:bg-gray-100 transition">
            💾 Save
          </button>
        </div>

        {/* 🧂 Ingredients */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-green-700">🧂 Ingredients</h2>
          <p className="whitespace-pre-line text-gray-800">{remedy.ingredients}</p>
        </section>

        {/* 👨‍🍳 Preparation Steps */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-green-700">👨‍🍳 Preparation Steps</h2>
          <p className="whitespace-pre-line text-gray-800">{remedy.preparation}</p>
        </section>

        {/* 💚 Health Benefits (4 cards) */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-green-700">💚 Health Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits?.slice(0, 4).map((benefit, index) => (
              <div
                key={index}
                className="bg-green-50 border border-green-200 p-4 rounded shadow-sm"
              >
                <h3 className="font-semibold text-green-800">Benefit {index + 1}</h3>
                <p className="text-gray-700 mt-1">{benefit.trim()}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ⭐ User Reviews */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-green-700">⭐ User Reviews</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              ✍️ Write a Review
            </button>
          </div>
          
          <ul className="space-y-4">
            {reviews.map((review, index) => (
              <li key={index} className="bg-gray-50 p-4 rounded border">
                <div className="flex justify-between">
                  <h3 className="font-medium">{review.user}</h3>
                  <span className="text-gray-500 text-sm">{review.date}</span>
                </div>
                <div className="my-2">{renderStars(review.rating)}</div>
                <p className="text-gray-700 italic">"{review.comment}"</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Footer />
    </>
  );
}