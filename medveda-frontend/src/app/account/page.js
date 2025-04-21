'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/app/utils/api';
import RemedyCard from '@/app/components/RemedyCard';
import toast from 'react-hot-toast';

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
    API.get('/users/saved-remedies/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => setSaved(res.data))
      .catch(() => console.warn("Failed to fetch saved remedies"));
  
    API.get('/remedies/my-submissions/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
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

  const handleSubmitRaw = async () => {
    try {
      const res = await API.post('/remedies/submit-raw/', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success("✅ Remedy submitted without preview");
      setShowForm(false);
      setForm({
        title: '',
        ingredients: '',
        preparation: '',
        health_benefits: '',
        description: '',
        image: '',
        category: '',
      });
      setPreview(null);
    } catch (err) {
      toast.error("❌ Submission failed.");
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
              setPreview(null);
            }}
          >
            {showForm ? 'Cancel' : 'Submit Remedy'}
          </button>
        </div>

        {showForm && (
  <div className="space-y-4 bg-gray-50 border p-4 rounded">
    {['title', 'description', 'ingredients', 'preparation', 'health_benefits', 'image', 'category'].map(field => {
      const isMultiline = ['description', 'ingredients', 'preparation', 'health_benefits'].includes(field);
      const label = field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()); // Title Case

      return isMultiline ? (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <textarea
            name={field}
            value={form[field]}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        </div>
      ) : (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            name={field}
            value={form[field]}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        </div>
      );
    })}

    {/* Buttons */}
    <div className="flex flex-wrap gap-4 mt-4">
      <button
        onClick={handlePreview}
        disabled={loadingPreview}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loadingPreview ? "Loading Preview..." : "✨ Preview Cleaned"}
      </button>

      <button
        onClick={() => {
          // Submit raw data directly without preview
          handleSubmitRaw();
        }}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
      >
        🚀 Submit Without Preview
      </button>
    </div>

    {/* Show AI Preview if available */}
    {preview && (
      <div className="bg-white border rounded p-4 mt-6 space-y-2">
        <h3 className="text-lg font-semibold text-green-700">🔍 Cleaned Preview</h3>
        <p><strong>Title:</strong> {preview.title}</p>
        <p><strong>Description:</strong> {preview.description}</p>
        <p><strong>Ingredients:</strong> <pre className="whitespace-pre-wrap">{preview.ingredients}</pre></p>
        <p><strong>Preparation:</strong> <pre className="whitespace-pre-wrap">{preview.preparation}</pre></p>
        <p><strong>Benefits:</strong> <pre className="whitespace-pre-wrap">{preview.health_benefits}</pre></p>
        <p className="text-sm italic text-gray-500">AI Cleaned: {preview.ai_cleaned ? "✅ Yes" : "❌ No"}</p>
        <button
          onClick={handleFinalSubmit}
          disabled={finalSubmitting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
        >
          {finalSubmitting ? "Submitting..." : "✅ Submit Cleaned"}
        </button>
      </div>
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