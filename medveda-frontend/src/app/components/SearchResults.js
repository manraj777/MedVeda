import RemedyCard from './RemedyCard';

export default function SearchResults({ results }) {
  if (!results.length) return <p>No remedies found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {results.map((remedy) => (
        <RemedyCard key={remedy.id} remedy={remedy} />
      ))}
    </div>
  );
}
