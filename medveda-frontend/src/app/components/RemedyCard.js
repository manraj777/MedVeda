import '../styles/RemedyCard.css'
export default function RemedyCard({ remedy }) {
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
    </div>
    
  );
}
