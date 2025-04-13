export default function HowItWorks({ steps }) {
    return (
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map(step => (
            <div key={step.order} className="p-4 border rounded shadow-sm">
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  