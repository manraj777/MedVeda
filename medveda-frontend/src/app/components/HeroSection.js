export default function HeroSection({ hero }) {
    return (
      <section className="bg-green-100 py-16 text-center">
        <h1 className="text-4xl font-bold">{hero.heading}</h1>
        <p className="mt-4 text-lg">{hero.subheading}</p>
        {hero.cta_text && (
          <a
            href={hero.cta_url}
            className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            {hero.cta_text}
          </a>
        )}
      </section>
    );
  }
  