import '../styles/TrendingRemedies.css';
export default function TrendingRemedies({ remedies }) {
  if (!remedies?.length) return null;

  return (
    <section id="remedies" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Trending Remedies</h2>
        <p className="text-gray-600 text-center mb-12">Discover our most popular natural solutions</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {remedies.map((remedy) => (
            <div key={remedy.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition">
              <img
                src={remedy.image_url}
                alt={remedy.title}
                className="w-full h-48 object-cover"
              />
              <div className='p-6'>
                <h3 className="text-xl font-bold mb-2">{remedy.title}</h3>
                <p className="text-gray-600 mb-4">{remedy.description}</p>
                <div className="text-yellow-500 mt-3">{'⭐'.repeat(Math.floor(remedy.rating))}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
