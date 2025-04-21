import { useState } from "react";
import {
  FaEdit,
  FaEye,
  FaSort,
  FaSortDown,
  FaSortUp,
  FaTrash,
} from "react-icons/fa";
import { ITable } from "../../types";

interface DynamicTableProps extends ITable {
  onEdit: (row: any) => void | undefined;
  onDelete: (row: any) => void | undefined;
  onView: (row: any) => void;
  onSort: (field: string) => void;
  sortField: string;
  sortOrder: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
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
}: DynamicTableProps) => {
  const [showActions, setShowActions] = useState<number | null>(null);

  const tableData = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
    ? (data as any).data
    : [];
  const columnKeys =
    tableData.length > 0
      ? Object.keys(tableData[0]).filter(
          (key) => !Array.isArray(tableData[0][key]) && key !== "_id"
        )
      : [];

  const truncateText = (
    text: string | number | null | undefined,
    maxLength: number
  ): string => {
    if (text == null) return "";
    const stringText = String(text);
    return stringText.length > maxLength
      ? stringText.slice(0, maxLength) + "..."
      : stringText;
  };

  const renderProductContent = (key: string, value: any) => {
    if (
      key === "productThumbnail" ||
      key === "thumbnail" ||
      key === "picture"
    ) {
      return (
        <img
          src={value || ""}
          alt="Product Thumbnail"
          className="object-contain w-8 h-8 md:w-10 md:h-10"
        />
      );
    } else if (key === "productSample" || key === "productFile") {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline md:text-sm"
        >
          {truncateText(value, window.innerWidth < 640 ? 10 : 20)}
        </a>
      );
    }
    return truncateText(value, window.innerWidth < 640 ? 10 : 20);
  };

  const renderSortIcon = (column: string) => {
    if (column !== sortField) return <FaSort className="text-xs" />;
    return sortOrder === "asc" ? (
      <FaSortUp className="text-xs" />
    ) : (
      <FaSortDown className="text-xs" />
    );
  };

  const toggleActionMenu = (index: number) => {
    setShowActions(showActions === index ? null : index);
  };

  // Determine how many columns to show based on screen width
  const getVisibleColumns = () => {
    // For mobile, just show the first column and actions
    if (window.innerWidth < 640) {
      return columnKeys.slice(0, 1);
    }
    // For small tablets
    else if (window.innerWidth < 768) {
      return columnKeys.slice(0, 2);
    }
    // For larger screens
    return columnKeys;
  };

  const visibleColumns = getVisibleColumns();

  return (
    <div className="w-full">
      <div className="px-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => handleSearch(e)}
          className="w-full p-2 text-sm border rounded md:text-base"
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns.map((key, index) => (
                <th
                  key={index}
                  className="px-2 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer md:px-4 md:py-3"
                  onClick={() => onSort(key)}
                >
                  <div className="flex items-center gap-1">
                    <span className="hidden sm:inline">{key}</span>
                    <span className="sm:hidden">{key.substring(0, 3)}</span>
                    {renderSortIcon(key)}
                  </div>
                </th>
              ))}
              <th className="px-2 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-4 md:py-3">
                <span className="hidden sm:inline">Actions</span>
                <span className="sm:hidden">Act</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className="hover:bg-gray-100">
                {visibleColumns
                  .filter((key) => key !== "_id")
                  .map((key: string, colIndex: number) => (
                    <td
                      key={colIndex}
                      className="px-2 py-2 text-xs md:px-4 md:py-3 whitespace-nowrap md:text-sm"
                    >
                      {renderProductContent(key, row[key])}
                    </td>
                  ))}
                <td className="relative px-2 py-2 md:px-4 md:py-3 whitespace-nowrap">
                  <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
                    {/* Mobile action menu */}
                    <div className="sm:hidden">
                      <button
                        onClick={() => toggleActionMenu(rowIndex)}
                        className="p-1 text-gray-500 rounded-full hover:text-gray-700"
                      >
                        •••
                      </button>
                      {showActions === rowIndex && (
                        <div className="absolute right-0 z-10 flex flex-col gap-2 p-2 mt-1 bg-white border rounded shadow-lg">
                          {onView && (
                            <button
                              onClick={() => onView(row)}
                              className="flex items-center text-xs text-blue-600 hover:text-blue-900"
                            >
                              <FaEye className="mr-1" /> View
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="flex items-center text-xs text-yellow-600 hover:text-yellow-900"
                            >
                              <FaEdit className="mr-1" /> Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="flex items-center text-xs text-red-600 hover:text-red-900"
                            >
                              <FaTrash className="mr-1" /> Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Desktop action buttons */}
                    <div className="items-center hidden gap-2 sm:flex">
                      {onView && (
                        <button
                          onClick={() => onView(row)}
                          className="flex items-center text-xs text-blue-600 hover:text-blue-900 md:text-sm"
                        >
                          <FaEye className="mr-1" />{" "}
                          <span className="hidden md:inline">View</span>
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="flex items-center text-xs text-yellow-600 hover:text-yellow-900 md:text-sm"
                        >
                          <FaEdit className="mr-1" />{" "}
                          <span className="hidden md:inline">Edit</span>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="flex items-center text-xs text-red-600 hover:text-red-900 md:text-sm"
                        >
                          <FaTrash className="mr-1" />{" "}
                          <span className="hidden md:inline">Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Show note about hidden columns on small screens */}
        {window.innerWidth < 768 &&
          columnKeys.length > visibleColumns.length && (
            <div className="p-2 text-xs text-center text-gray-500">
              Some columns are hidden on small screens. Rotate device or use a
              larger screen to view all data.
            </div>
          )}
      </div>
    </div>
  );
};

export default DynamicTable;
