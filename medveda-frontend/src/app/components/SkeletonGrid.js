export default function SkeletonGrid({ count = 6 }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 p-4 h-60 rounded-lg" />
        ))}
      </div>
    );
  }
  