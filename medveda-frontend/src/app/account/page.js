'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/app/utils/api';
import RemedyCard from '@/app/components/RemedyCard';

export default function AccountPage() {
  const router = useRouter();
  const [saved, setSaved] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    ingredients: '',
    preparation: '',
    health_benefits: '',
    description: '',
    image: '',
    category: '',
  });
  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [finalSubmitting, setFinalSubmitting] = useState(false);

  useEffect(() => {
    API.get('/users/saved/')
      .then(res => setSaved(res.data))
      .catch(() => console.warn("Failed to fetch saved remedies"));
    API.get('/remedies/my-submissions/')
      .then(res => setSubmissions(res.data))
      .catch(() => {});
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 👀 Preview cleaned remedy
  const handlePreview = async () => {
    setLoadingPreview(true);
    try {
      const res = await API.post('/remedies/preview-cleaned/', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPreview(res.data);
    } catch (err) {
      alert("❌ Failed to generate preview.");
    } finally {
      setLoadingPreview(false);
    }
  };

  // ✅ Submit final remedy
  const handleFinalSubmit = async () => {
    setFinalSubmitting(true);
    try {
      await API.post('/remedies/submit/', preview, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert("✅ Remedy submitted for review!");
      setPreview(null);
      setForm({
        title: '',
        ingredients: '',
        preparation: '',
        health_benefits: '',
        description: '',
        image: '',
        category: '',
      });
      setShowForm(false);
    } catch {
      alert("❌ Submission failed.");
    } finally {
      setFinalSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await API.post('/remedies/submit/', form);
      alert("✅ Remedy submitted for review!");
      setShowForm(false);
    } catch (err) {
      alert("❌ Failed to submit remedy.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">👤 My Account</h1>

      <button
          onClick={() => router.back()}
          className="text-green-700 underline hover:text-green-900 mb-6"
        >
          ← Back to Search
        </button>

      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">💾 Saved Remedies</h2>
        </div>

        {saved.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map((remedy) => (
              <RemedyCard key={remedy.id} remedy={remedy} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No remedies saved yet.</p>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">📤 Submit a Remedy</h2>
          <button
            className="text-green-600 underline"
            onClick={() => {
              setShowForm(!showForm);
              setPreview(null); // Reset preview when toggling form
            }}
          >
            {showForm ? 'Cancel' : 'Submit Remedy'}
          </button>
        </div>

        {showForm && (
          <div className="space-y-4 bg-gray-50 border p-4 rounded">
            {preview ? (
              <>
                <div className="border p-4 rounded bg-white">
                  <h3 className="font-bold mb-2">Preview:</h3>
                  <RemedyCard remedy={preview} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreview(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                  >
                    Back to Edit
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={finalSubmitting}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:bg-green-400"
                  >
                    {finalSubmitting ? 'Submitting...' : 'Submit Final Remedy'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Title"
                />
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Short Description"
                />
                <textarea
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Ingredients (one per line)"
                />
                <textarea
                  name="preparation"
                  value={form.preparation}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Preparation Steps"
                />
                <textarea
                  name="health_benefits"
                  value={form.health_benefits}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Health Benefits"
                />
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Image URL"
                />
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Category"
                />

                <div className="flex gap-2">
                  <button
                    onClick={handlePreview}
                    disabled={loadingPreview}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400"
                  >
                    {loadingPreview ? 'Generating Preview...' : 'Preview Remedy'}
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Submit Remedy
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </section>
      <h2 className="text-xl font-semibold mt-10 mb-2">📝 My Submissions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {submissions.map(remedy => <RemedyCard key={remedy.id} remedy={remedy} />)}
      </div>
    </div>
  );
}