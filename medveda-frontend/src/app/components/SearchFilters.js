export default function SearchFilters({ filters, categories, onChange }) {
    return (
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <select
          name="category"
          value={filters.category}
          onChange={onChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
  
        <select
          name="min_rating"
          value={filters.min_rating}
          onChange={onChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Ratings</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
        </select>
      </div>
    );
  }
  