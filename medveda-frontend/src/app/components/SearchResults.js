import RemedyCard from './RemedyCard';
import Link from 'next/link';

export default function SearchResults({ results }) {
  if (!results.length) return <p>No remedies found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {results.map((remedy) => (
        <Link key={remedy.id} href={`/remedies/${remedy.slug}`}>
          <RemedyCard remedy={remedy} />
        </Link>
      ))}
    </div>
  );
}
