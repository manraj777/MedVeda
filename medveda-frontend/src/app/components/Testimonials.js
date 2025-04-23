import '../styles/Testimonials.css'
export default function Testimonials({ testimonials }) {
    return (
      <section id="testimonials" className="py-20 bg-emerald-50">
        <div className='container mx-auto px-4'>
          <h2 className="text-3xl font-bold text-center mb-4">What Users Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(t => (
            <div key={t.name} className="bg-white p-8 rounded-2xl shadow-md">
              <div className="flex items-center mb-6">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full" />
                <div className='ml-4'>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-amber-400">{'⭐'.repeat(t.rating)}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">"{t.comment}"</p>   
            </div>
          ))}
        </div>
      </section>
    );
  }
  