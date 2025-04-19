'use client';
import { useEffect, useState } from 'react';
import API from '@/app/utils/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/remedies/admin/pending/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setRemedies(res.data))
      .catch(() => toast.error("Access denied or failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.post(`/remedies/admin/approve/${id}/`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRemedies(remedies.filter(r => r.id !== id));
      toast.success('Remedy approved');
    } catch {
      toast.error('Approval failed');
    }
  };

  if (loading) return <div className="p-10">Loading dashboard...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Admin Dashboard</h1>
      {remedies.length === 0 ? (
        <p>No pending remedies to approve.</p>
      ) : (
        <div className="space-y-4">
          {remedies.map(remedy => (
            <div key={remedy.id} className="bg-white p-4 border rounded shadow-sm">
              <h2 className="text-xl font-semibold text-green-800">{remedy.title}</h2>
              <p className="text-sm text-gray-500">By {remedy.created_by} | Category: {remedy.category.name}</p>
              <div className="mt-2">
                <button
                  onClick={() => handleApprove(remedy.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  ✅ Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
