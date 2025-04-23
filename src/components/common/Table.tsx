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
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  onSort: (field: string) => void;
  sortField: string;
  sortOrder: "asc" | "desc";
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

  const tableData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const columnKeys = useMemo(() => {
    return tableData.length > 0
      ? Object.keys(tableData[0]).filter(
          (key) => !Array.isArray(tableData[0][key]) && key !== "_id"
        )
      : [];
  }, [tableData]);

  const visibleColumns = useCallback(() => {
    if (screenSize === "sm") return columnKeys.slice(0, 2);
    if (screenSize === "md") return columnKeys.slice(0, 3);
    return columnKeys;
  }, [columnKeys, screenSize]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setScreenSize("sm");
      else if (window.innerWidth < 768) setScreenSize("md");
      else setScreenSize("lg");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const truncateText = (text: string | number, maxLength: number) => {
    const str = String(text);
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  };

  const renderContent = (key: string, value: any) => {
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
    return truncateText(value, screenSize === "sm" ? 10 : 15);
  };

  const renderSortIcon = (column: string) => {
    if (column !== sortField) return <FaSort className="text-xs" />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const toggleRowExpand = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
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
          disabled={currentPage === totalPages}
          className="p-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}

        <div className="relative">
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

      <div className="sm:hidden space-y-2">
        {tableData.map((row, index) => (
          <div key={index} className="border rounded p-3">
            <div className="flex justify-between items-start">
              {visibleColumns()[0] && (
                <div className="font-medium">
                  {renderContent(visibleColumns()[0], row[visibleColumns()[0]])}
                </div>
              )}
              <button onClick={() => toggleRowExpand(index)}>
                {expandedRows.has(index) ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            {(expandedRows.has(index) || visibleColumns().length <= 2) && (
              <div className="mt-2 space-y-1">
                {visibleColumns()
                  .slice(1)
                  .map((key) => (
                    <div key={key} className="text-sm">
                      <span className="text-gray-500">{key}: </span>
                      {renderContent(key, row[key])}
                    </div>
                  ))}
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-2 pt-2 border-t">
              {onView && (
                <button onClick={() => onView?.(row)} className="text-blue-600">
                  <FaEye />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit?.(row)}
                  className="text-yellow-600"
                >
                  <FaEdit />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete?.(row)}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns().map((key) => (
                <th
                  key={key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => onSort(key)}
                >
                  <div className="flex items-center gap-1">
                    {key}
                    {renderSortIcon(key)}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
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
                      className="px-4 py-3 whitespace-nowrap text-sm"
                    >
                      {key === "productThumbnail" ||
                      key === "thumbnail" ||
                      key === "picture" ||
                      key.toLowerCase().includes("image") ? (
                        <img
                          src={row[key]}
                          alt={key}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      ) : (
                        renderContent(key, row[key])
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {onView && (
                        <button
                          onClick={() => onView?.(row)}
                          className="text-blue-600"
                        >
                          <FaEye />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit?.(row)}
                          className="text-yellow-600"
                        >
                          <FaEdit />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete?.(row)}
                          className="text-red-600"
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
                  className="px-4 py-8 text-center text-gray-500"
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
