export default function RemedyCard({ remedy }) {
  const renderStars = (rating) => '⭐'.repeat(Math.floor(rating));

  return (
    <div className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition">
      <img
        src={remedy.image}
        className="w-full h-40 object-cover rounded"
        alt={remedy.title}
      />
      <h3 className="text-xl font-semibold mt-4">{remedy.title}</h3>
      <p className="text-sm text-gray-600">{remedy.description}</p>
      <p className="text-yellow-500 mt-2">
        {renderStars(remedy.rating)}{' '}
        <span className="text-gray-600 text-sm">({remedy.rating?.toFixed(1)})</span>
      </p>
    </div>
  );
}
