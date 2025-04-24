'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import API from '@/app/utils/api';
import SearchNavbar from '@/app/components/SearchNavbar';
import Footer from '@/app/components/footer';
// import { useAuth } from '@/app/components/auth/AuthContext';
import mockRemedy from '@/app/utils/mockRemedies';
import '../../styles/remedyDetail.css';

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

  // useEffect(() => {
  //   if (slug) {
  //     API.get(`/remedies/${slug}/`)
  //       .then((res) => {
  //         setRemedy(res.data);
  //         setReviews(res.data.reviews || []);
  //       })
  //       .catch(() => toast.error('Failed to load remedy'))
  //       .finally(() => setLoading(false));
  //   }
  // }, [slug]);
  useEffect(() => {
    if (slug) {
      API.get(`/remedies/${slug}/`)
        .then((res) => {
          setRemedy(res.data);
          setReviews(res.data.reviews || []);
        })
        .catch(() => {
          toast.error('Failed to load remedy. Showing mock data.');
          setRemedy(mockRemedy); // fallback
          setReviews(mockRemedy.reviews || []);
        })
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

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center px-4 py-2 mb-4 bg-[#9B6D4D] text-white rounded-lg hover:bg-[#825A40] border border-none hover:text-white hover:bg-[#4A3427] transition"
        >
          ← Back to Search
        </button>
        <div className="rounded-xl overflow-hidden mb-6 ">                    
        <img
          // src={remedy.image}
          src="https://storage.googleapis.com/uxpilot-auth.appspot.com/101e740c71-ef048fa318b181f94d5d.png"
          className="w-full h-full object-cover"
          alt={remedy.title}
        />
        </div>
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-[#4A3427]">{remedy.title}</h1>
            <p className="text-gray-600 mb-4">{remedy.description}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center px-4 py-2 bg-[#E8D5C4] text-[#4A3427] rounded-lg hover:bg-[#D9C4B1] border border-none hover:text-white hover:bg-[#4A3427] transition">
            <i class="mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-share-nodes" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="share-nodes" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z"></path></svg></i>
            Share</button>
            <button
              className={`flex items-center px-4 py-2 bg-[#9B6D4D] text-white rounded-lg hover:bg-[#825A40] border border-none hover:text-white hover:bg-[#4A3427] transition ${
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
              <i class="mr-2" data-fa-i2svg=""><svg class="svg-inline--fa fa-heart" aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"></path></svg></i>

              {remedy.is_saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        <section id='ingredients-prep' className="bg-white rounded-xl p-6 mb-8">
          <div className='grid md:grid-cols-2 gap-6 flex justify-between items-start'>
          <div>
          <h2 className="text-xl font-bold text-[#4A3427] mb-4">Ingredients</h2>
          <p className="whitespace-pre-line text-gray-800">{remedy.ingredients}</p>
         </div>

          <div>
          <h2 className="text-xl font-bold text-[#4A3427] mb-4">Preparation Steps</h2>
          <p className="whitespace-pre-line text-gray-800">{remedy.preparation}</p>
        </div>
        </div>
        </section>

        <section className="bg-white rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-[#4A3427] mb-4">Health Benefits</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits?.slice(0, 4).map((b, i) => (
              <div key={i} className="bg-[#FDF8F3] p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Benefit {i + 1}</h3>
                <p className="text-sm text-gray-600">{b.trim()}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ⭐ Review Section */}
        <section className="bg-white rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#4A3427]">User Reviews</h2>
            <button
              disabled={!isLoggedIn}
              title={!isLoggedIn ? "Login to write a review" : ""}
              className={`bg-[#9B6D4D] text-white px-4 py-2 rounded-lg hover:bg-[#825A40] border border-none hover:text-white hover:bg-[#4A3427] transition ${
                isLoggedIn
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={() => setShowForm(!showForm)}
            >
            Write Review
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

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-none pb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{review.user || 'Anonymous'}</h3>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="flex items-center px-4 bg-[#E8D5C4] text-[#4A3427] rounded-lg hover:bg-[#D9C4B1] border border-none hover:text-white hover:bg-[#4A3427] transition"
                  >
                    Delete
                  </button>
                </div>
                <div className="my-2">{renderStars(review.rating)}</div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
