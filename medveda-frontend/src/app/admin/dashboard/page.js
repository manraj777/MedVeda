'use client';
import { useEffect, useState } from 'react';
import API from '@/app/utils/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/components/auth/AuthContext';

export default function AdminDashboard() {
  const { isAdmin, loaded } = useAuth();  // ✅ added `loaded`
  const router = useRouter();
  const [pendingRemedies, setPendingRemedies] = useState([]);
  const [approvedRemedies, setApprovedRemedies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (!loaded) return;  // ✅ wait for AuthContext to initialize

    if (!isAdmin) {
      toast.error("Access Denied");
      router.push('/');
      return;
    }

    // ✅ Fetch only if authenticated and admin
    Promise.all([
      API.get('/remedies/admin/pending/'),
      API.get('/remedies/admin/approved/')
    ])
      .then(([pendingRes, approvedRes]) => {
        setPendingRemedies(pendingRes.data);
        setApprovedRemedies(approvedRes.data);
      })
      .catch(() => toast.error("Failed to load remedies"))
      .finally(() => setLoading(false));
  }, [loaded, isAdmin, router]); // ✅ added `loaded` as dependency

  const handleApprove = async (id) => {
    try {
      await API.post(`/remedies/admin/approve/${id}/`);
      toast.success("Remedy approved");
      setPendingRemedies(pendingRemedies.filter(r => r.id !== id));
    } catch {
      toast.error("Approval failed");
    }
  };

  const handleDelete = async (id, title) => {
    const confirmDelete = confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      await API.delete(`/remedies/admin/delete/${id}/`);
      toast.success('Remedy deleted successfully');
      setApprovedRemedies((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error('Failed to delete remedy');
    }
  };

  // ✅ Prevent any rendering until auth context is fully loaded
  if (!loaded) return null;
  if (!isAdmin) return null;
  if (loading) return <div className="p-10">Loading dashboard...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'pending' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Remedies
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Remedies
        </button>
      </div>

      {/* Pending Remedies */}
      {activeTab === 'pending' && (
        <>
          {pendingRemedies.length === 0 ? (
            <p>No pending remedies to approve.</p>
          ) : (
            <div className="space-y-4">
              {pendingRemedies.map(remedy => (
                <div
                  key={remedy.id}
                  className={`bg-white p-4 border rounded shadow-sm ${
                    remedy.ai_cleaned ? 'border-green-300 bg-green-50' : ''
                  }`}
                >
                  <h2 className="text-xl font-semibold text-green-800">{remedy.title}</h2>
                  <p className="text-sm text-gray-500">
                    By {remedy.created_by} | Category: {remedy.category.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    AI Cleaned: {remedy.ai_cleaned ? "✅" : "❌"}
                  </p>
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
        </>
      )}

      {/* Approved Remedies */}
      {activeTab === 'approved' && (
        <>
          {approvedRemedies.length === 0 ? (
            <p>No approved remedies found.</p>
          ) : (
            <div className="space-y-4">
              {approvedRemedies.map(remedy => (
                <div
                  key={remedy.id}
                  className={`bg-white p-4 border rounded shadow-sm ${
                    remedy.ai_cleaned ? 'border-green-300 bg-green-50' : ''
                  }`}
                >
                  <h2 className="text-xl font-semibold text-green-800">{remedy.title}</h2>
                  <p className="text-sm text-gray-500">
                    By {remedy.created_by} | Category: {remedy.category.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    AI Cleaned: {remedy.ai_cleaned ? "✅" : "❌"}
                  </p>
                  <div className="mt-2">
                    <button
                      onClick={() => handleDelete(remedy.id, remedy.title)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
