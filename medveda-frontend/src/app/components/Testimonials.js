export default function Testimonials({ testimonials }) {
    return (
      <section className="py-16 bg-gray-50">
        <h2 className="text-center text-3xl font-semibold mb-8">What Users Say</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map(t => (
            <div key={t.name} className="bg-white p-6 rounded shadow">
              <p className="text-sm text-gray-600 italic">"{t.comment}"</p>
              <div className="mt-4 flex items-center gap-2">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-yellow-500 text-sm">{'⭐'.repeat(t.rating)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  