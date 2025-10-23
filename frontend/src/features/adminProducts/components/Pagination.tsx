interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-center items-center mt-6 space-x-3">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className={`px-4 py-2 rounded-lg ${
          page === 1 ? "bg-gray-300 text-gray-600" : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Prev
      </button>

      <span className="text-gray-700 font-medium">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className={`px-4 py-2 rounded-lg ${
          page === totalPages
            ? "bg-gray-300 text-gray-600"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
