import {
  FaEdit,
  FaEye,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
} from "react-icons/fa";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ChangeEvent } from "react";

interface DynamicTableProps {
  data: any[];
  headings?: string[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  onSort: (field: string) => void;
  sortField: string;
  sortOrder: "asc" | "desc" | string;
  handleSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
  title?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

const DynamicTable = ({
  data,
  headings,
  onEdit,
  onDelete,
  onView,
  onSort,
  sortField,
  sortOrder,
  searchTerm,
  handleSearch,
  title,
  pagination,
}: DynamicTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [screenSize, setScreenSize] = useState<string>("md");

  // Ensure we have valid data
  const tableData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // Get column keys from data or use provided headings
  const columnKeys = useMemo(() => {
    if (tableData.length > 0) {
      return Object.keys(tableData[0]).filter(
        (key) => !Array.isArray(tableData[0][key]) && key !== "_id"
      );
    }
    // If no data but headings provided, use lowercase headings as keys
    if (headings && headings.length > 0) {
      return headings.map((heading) =>
        heading.toLowerCase().replace(/\s+/g, "")
      );
    }
    return [];
  }, [tableData, headings]);


  const visibleColumns = useCallback(() => {
    if (screenSize === "sm") return columnKeys.slice(0, 2);
    if (screenSize === "md") return columnKeys.slice(0, 4);
    return columnKeys;
  }, [columnKeys, screenSize]);

  const getColumnDisplayName = useCallback(
    (key: string, index: number) => {
      if (headings && headings[index]) return headings[index];
      return (
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")
      );
    },
    [headings]
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setScreenSize("sm");
      else if (window.innerWidth < 1024) setScreenSize("md");
      else setScreenSize("lg");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const truncateText = (text: string | number, maxLength: number) => {
    if (text === null || text === undefined) return "-";
    const str = String(text);
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  };

  const renderContent = (key: string, value: any) => {
    if (!value && value !== 0) return "-";

    if (key.toLowerCase().includes("image") || key === "thumbnail") {
      return (
        <img
          src={value || "/placeholder.png"}
          alt="Thumbnail"
          className="w-8 h-8 object-cover rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.png";
          }}
        />
      );
    }

    if (
      key.toLowerCase().includes("link") ||
      key.toLowerCase().includes("url")
    ) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {truncateText(value, screenSize === "sm" ? 10 : 15)}
        </a>
      );
    }

    return truncateText(value, screenSize === "sm" ? 10 : 15);
  };

  const renderSortIcon = (column: string) => {
    if (column !== sortField) return <FaSort className="text-xs" />;
    return sortOrder === "asc" || sortOrder === "1" ? (
      <FaSortUp />
    ) : (
      <FaSortDown />
    );
  };

  const toggleRowExpand = (index: number) => {
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = new Set(prevExpandedRows);
      if (newExpandedRows.has(index)) {
        newExpandedRows.delete(index);
      } else {
        newExpandedRows.add(index);
      }
      return newExpandedRows;
    });
  };

  const renderPagination = () => {
    if (!pagination) return null;
    const { currentPage, totalPages, onPageChange } = pagination;

    return (
      <div className="flex justify-between items-center p-4 border-t">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}

        <div className="relative max-w-xs ml-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 pl-8 border rounded w-full"
          />
          <FaFilter className="absolute left-2 top-3 text-gray-400" />
        </div>
      </div>

      <div className="sm:hidden space-y-4">
        {tableData.length > 0 ? (
          tableData.map((row, index) => (
            <div key={index} className="border rounded p-3 bg-gray-50">
              <div className="flex justify-between items-start">
               
                {columnKeys[0] && (
                  <div className="font-medium">
                    {renderContent(columnKeys[0], row[columnKeys[0]])}
                  </div>
                )}

                <button
                  onClick={() => toggleRowExpand(index)}
                  className="p-2 hover:bg-gray-200 rounded-full"
                  aria-label={expandedRows.has(index) ? "Collapse" : "Expand"}
                >
                  {expandedRows.has(index) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </button>
              </div>

              {columnKeys.length > 1 && (
                <div className="mt-1 text-sm">
                  <span className="text-gray-500">
                    {getColumnDisplayName(columnKeys[1], 1)}:
                  </span>{" "}
                  {renderContent(columnKeys[1], row[columnKeys[1]])}
                </div>
              )}

              {expandedRows.has(index) && (
                <div className="mt-3 pt-2 border-t space-y-2">
                  {columnKeys.slice(2).map((key, keyIndex) => (
                    <div key={key} className="text-sm flex flex-col">
                      <span className="text-gray-500 font-medium">
                        {getColumnDisplayName(key, keyIndex + 2)}:
                      </span>
                      <span className="mt-1">
                        {renderContent(key, row[key])}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-2 mt-3 pt-2 border-t">
                {onView && (
                  <button
                    onClick={() => onView?.(row)}
                    className="text-blue-600 p-2 hover:bg-blue-100 rounded"
                    aria-label="View"
                  >
                    <FaEye />
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit?.(row)}
                    className="text-yellow-600 p-2 hover:bg-yellow-100 rounded"
                    aria-label="Edit"
                  >
                    <FaEdit />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete?.(row)}
                    className="text-red-600 p-2 hover:bg-red-100 rounded"
                    aria-label="Delete"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-gray-500">No data available</div>
        )}
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full table-auto divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns().map((key, index) => (
                <th
                  key={key}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => onSort(key)}
                >
                  <div className="flex items-center gap-1">
                    {getColumnDisplayName(key, index)}
                    {renderSortIcon(key)}
                  </div>
                </th>
              ))}
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.length > 0 ? (
              tableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {visibleColumns().map((key) => (
                    <td
                      key={key}
                      className="px-3 py-2 whitespace-nowrap text-sm max-w-xs overflow-hidden text-ellipsis"
                    >
                      {renderContent(key, row[key])}
                    </td>
                  ))}
                  <td className="px-3 py-2 whitespace-nowrap w-24">
                    <div className="flex space-x-1">
                      {onView && (
                        <button
                          onClick={() => onView?.(row)}
                          className="text-blue-600 p-1 hover:bg-blue-100 rounded"
                          aria-label="View"
                        >
                          <FaEye />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit?.(row)}
                          className="text-yellow-600 p-1 hover:bg-yellow-100 rounded"
                          aria-label="Edit"
                        >
                          <FaEdit />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete?.(row)}
                          className="text-red-600 p-1 hover:bg-red-100 rounded"
                          aria-label="Delete"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns().length + 1}
                  className="px-3 py-8 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {renderPagination()}
    </div>
  );
};

export default DynamicTable;
