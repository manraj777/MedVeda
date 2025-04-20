import RemedyCard from './RemedyCard';
import Link from 'next/link';
import '../styles/SearchResults.css'
export default function SearchResults({ results }) {
  if (!results.length) return <p>No remedies found.</p>;

  return (
    <div className='flex-1'>

      <div className="grid grid-cols-3 gap-6">
        {results.map((remedy) => (
          <Link key={remedy.id} href={`/remedies/${remedy.slug}`}>
            <RemedyCard remedy={remedy} />
          </Link>
        ))}
      </div>
    </div>
  );
}
