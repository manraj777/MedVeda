export default function PaginationControls({ page, setPage, hasNextPage }) {
    return (
      <div className="flex justify-center mt-10">
        {page > 1 && (
          <button
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 mr-2 bg-gray-200 rounded"
          >
            Prev
          </button>
        )}
        {hasNextPage && (
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Next
          </button>
        )}
      </div>
    );
  }
  