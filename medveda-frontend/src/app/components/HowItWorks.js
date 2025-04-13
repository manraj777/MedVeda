const steps = [
    {
      icon: '🔍',
      title: 'Search Remedies',
      description: 'Find natural remedies for your symptoms or conditions instantly.',
    },
    {
      icon: '🌿',
      title: 'Learn',
      description: 'Understand the benefits, usage and traditional wisdom behind each remedy',
    },
    {
      icon: '🤝',
      title: 'Apply',
      description: 'Follow expert guidelines to incorporate remedies into your wellness routine',
    },
  ];
  
  export default function HowItWorks() {
    return (
      <section className="py-20 bg-white text-center px-4">
        <h2 className="text-4xl font-bold mb-12 text-green-700">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  