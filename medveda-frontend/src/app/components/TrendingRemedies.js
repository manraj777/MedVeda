export default function TrendingRemedies({ remedies }) {
    if (!remedies?.length) return null;
  
    return (
      <section className="py-16 bg-white">
        <h2 className="text-center text-3xl font-semibold mb-10">🔥 Trending Remedies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {remedies.map(remedy => (
            <div key={remedy.id} className="bg-green-50 p-4 rounded-lg shadow hover:shadow-lg transition">
              <img
                src={remedy.image_url}
                alt={remedy.title}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-xl font-semibold mt-4">{remedy.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{remedy.description}</p>
              <div className="text-yellow-500 mt-3">{'⭐'.repeat(Math.floor(remedy.rating))}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  