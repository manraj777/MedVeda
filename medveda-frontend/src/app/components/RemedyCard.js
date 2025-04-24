'use client';
import Link from 'next/link';
import '../styles/RemedyCard.css';

export default function RemedyCard({ remedy }) {
  const renderStars = (rating = 0) => {
    const stars = Math.floor(rating);
    return '⭐'.repeat(stars);
  };

  return (
    <Link href={`/remedies/${remedy.slug}`} passHref>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer">
        <div className="relative">
          <img
            src={remedy.image || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/0461b06c78-28d93f7d631561f5f09e.png'}
            alt={remedy.title || 'Remedy'}
            className="w-full h-[200px] object-cover"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {remedy.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-3">
            {remedy.description || 'No description provided.'}
          </p>
          <p className="text-yellow-500 mt-2 text-sm">
            {renderStars(remedy.rating)}
            <span className="text-gray-600 text-xs ml-1">
              ({remedy.rating?.toFixed(1) || '0.0'})
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}
