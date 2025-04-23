import '../styles/RemedyCard.css'
export default function RemedyCard({ remedy }) {
  const renderStars = (rating) => '⭐'.repeat(Math.floor(rating));

  return (
    
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className='relative container'>
      <img

        src={remedy.image_url}
        className="w-full h-[200px] object-cover rounded-t-xl"
        alt={remedy.title}
      />
      </div>
      <div className='p-4'>
      <h3 className="font-semibold">{remedy.title}</h3>
      <p className="text-sm text-gray-600 mt-2 ">{remedy.description}</p>
      <p className="text-yellow-500 mt-2">{'⭐'.repeat(Math.floor(remedy.rating))}</p>
      </div>

//         src={remedy.image}
//         className="w-full h-40 object-cover rounded"
//         alt={remedy.title}
//       />
//       <h3 className="text-xl font-semibold mt-4">{remedy.title}</h3>
//       <p className="text-sm text-gray-600">{remedy.description}</p>
//       <p className="text-yellow-500 mt-2">
//         {renderStars(remedy.rating)}{' '}
//         <span className="text-gray-600 text-sm">({remedy.rating?.toFixed(1)})</span>
//       </p>

    </div>
    
  );
}
