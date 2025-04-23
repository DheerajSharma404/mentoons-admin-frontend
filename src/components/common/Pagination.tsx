import React, { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onLimitChange: (newLimit: number) => void;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onLimitChange,
  onPageChange,
}) => {
  const [inputLimit, setInputLimit] = useState(limit.toString());

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputLimit(e.target.value);
  };

  const handleLimitSubmit = () => {
    const newLimit = parseInt(inputLimit, 10);
    if (!isNaN(newLimit) && newLimit > 0) {
      onLimitChange(newLimit);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 mt-6 space-y-4 bg-white rounded-lg shadow-md md:flex-row md:justify-between md:space-y-0">
      <div className="text-sm text-gray-600">
        <p className="font-medium">
          Showing{" "}
          <span className="text-indigo-600">
            {startItem}-{endItem}
          </span>{" "}
          of <span className="text-indigo-600">{totalItems}</span> items
        </p>
        <p className="mt-1 text-xs">
          Page{" "}
          <span className="font-medium text-indigo-600">{currentPage}</span> of{" "}
          <span className="font-medium text-indigo-600">{totalPages}</span>
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-indigo-600 transition-colors duration-200 bg-indigo-100 rounded-md hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-indigo-600 transition-colors duration-200 bg-indigo-100 rounded-md hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <label
            htmlFor="limit-input"
            className="text-sm font-medium text-gray-600"
          >
            Per page:
          </label>
          <input
            id="limit-input"
            type="number"
            value={inputLimit}
            onChange={handleLimitChange}
            min="1"
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleLimitSubmit}
            className="px-3 py-1 text-sm font-medium text-white transition-colors duration-200 bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
