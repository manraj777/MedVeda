import '../styles/HowItWorks.css';
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
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-600 text-center mb-16">Your journey to natural wellness in three simple steps</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center"
            >
              <div className="bg-emerald-100 w-20 h-20 icon-large rounded-full flex items-center justify-center mx-auto mb-6">{step.icon}</div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        </div>
        
      </section>
    );
  }
  