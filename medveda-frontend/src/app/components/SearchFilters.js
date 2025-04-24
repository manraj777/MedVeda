import '../styles/SearchFilters.css';
export default function SearchFilters({ filters, categories, onChange }) {
    return (
      <aside className='w-[280px] space-y-6'>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className='space-y-4'>
          <div className='sspace-y-2'>
        <h3 className="font-medium text-[#6B4423]">Sort By</h3>
        
        <select
          name="category"
          value={filters.category}
          onChange={onChange}
          className="w-full p-2 rounded border border-[#E8D5C4]"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        </div>
        <div className='space-y-2'>

        <select
          name="min_rating"
          value={filters.min_rating}
          onChange={onChange}
          className="w-full p-2 rounded border border-[#E8D5C4]"
        >
          <option value="">All Ratings</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
        </select>
        </div>
      </div>
      </div>
      </aside>
    );
  }
  