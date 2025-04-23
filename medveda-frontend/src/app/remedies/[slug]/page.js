'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import API from '@/app/utils/api';
import SearchNavbar from '@/app/components/SearchNavbar';
import Footer from '@/app/components/footer';
// import { useAuth } from '@/app/components/auth/AuthContext';

export default function RemedyDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [remedy, setRemedy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ comment: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    if (slug) {
      API.get(`/remedies/${slug}/`)
        .then((res) => {
          setRemedy(res.data);
          setReviews(res.data.reviews || []);
        })
        .catch(() => toast.error('Failed to load remedy'))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      toast.error('Please log in to submit a review.');
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      toast.error('Please select a rating between 1 and 5.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post(
        `/remedies/${slug}/add-review/`,
        newReview,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setReviews([res.data, ...reviews]);
      toast.success('Review submitted!');
      setNewReview({ comment: '', rating: 5 });
      setShowForm(false);
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await API.delete(`remedies/reviews/${reviewId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setReviews(reviews.filter((r) => r.id !== reviewId));
      toast.success('Review deleted.');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  if (loading || !remedy) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const benefits = remedy.health_benefits?.split('•').filter(Boolean);
  const renderStars = (rating) => '⭐'.repeat(Math.round(rating));

  return (
    <>
      <SearchNavbar />

      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-green-700 underline hover:text-green-900 mb-6"
        >
          ← Back to Search
        </button>

        <img
          src={remedy.image}
          className="w-full h-64 object-cover rounded mb-6"
          alt={remedy.title}
        />

        <h1 className="text-3xl font-bold text-green-800 mb-2">{remedy.title}</h1>
        <p className="text-gray-600 mb-4">{remedy.description}</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <button className="border px-4 py-2 rounded hover:bg-gray-100 transition">🔗 Share</button>
          <button
  className={`border px-4 py-2 rounded transition ${
    remedy.is_saved ? 'bg-green-100 border-green-300 text-green-700' : 'hover:bg-gray-100'
  }`}
  onClick={async () => {
    if (!isLoggedIn) return toast.error("Login to save remedies");
    try {
      if (remedy.is_saved) {
        await API.delete(`/remedies/unsaved/${remedy.id}/`);
        setRemedy({ ...remedy, is_saved: false });
        toast.success('Removed from saved');
      } else {
        await API.post(`/remedies/saved/${remedy.id}/`);
        setRemedy({ ...remedy, is_saved: true });
        toast.success('Saved!');
      }
    } catch {
      toast.error('Failed to update saved remedies');
    }
  }}
>
  {remedy.is_saved ? '💾 Saved' : '💾 Save'}
</button>

        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-green-700">🧂 Ingredients</h2>
          <p className="whitespace-pre-line text-gray-800">{remedy.ingredients}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-green-700">👨‍🍳 Preparation Steps</h2>
          <p className="whitespace-pre-line text-gray-800">{remedy.preparation}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-green-700">💚 Health Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits?.slice(0, 4).map((b, i) => (
              <div key={i} className="bg-green-50 border p-4 rounded shadow-sm">
                <h3 className="font-semibold text-green-800">Benefit {i + 1}</h3>
                <p className="text-gray-700 mt-1">{b.trim()}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ⭐ Review Section */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-green-700">⭐ User Reviews</h2>
            <button
              disabled={!isLoggedIn}
              title={!isLoggedIn ? "Login to write a review" : ""}
              className={`px-4 py-2 rounded transition ${
                isLoggedIn
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={() => setShowForm(!showForm)}
            >
              ✍️ Write a Review
            </button>
          </div>

          {showForm && (
            <div className="bg-gray-50 p-4 rounded border mb-6">
              <textarea
                rows={3}
                className="w-full border px-3 py-2 rounded mb-2"
                placeholder="Write your review..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
              />
              <select
                className="w-full border px-3 py-2 rounded mb-2"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: Number(e.target.value) })
                }
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Stars
                  </option>
                ))}
              </select>
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          )}

          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="bg-gray-50 p-4 rounded border">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{review.user || 'Anonymous'}</h3>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
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
