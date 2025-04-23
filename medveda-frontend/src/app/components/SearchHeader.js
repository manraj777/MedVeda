export default function SearchHeader({ query }) {
    return (
      <h1 className="text-3xl font-bold mb-4" style={{ fontWeight: 600, fontSize: '1.25rem',
        lineHeight: '1.75rem' }}>
        Search results for “{query}”
      </h1>
    );
  }
  