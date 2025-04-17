import { FaEdit, FaEye, FaTrash, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
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

const DynamicTable = ({ data, onEdit, onDelete, onView, onSort, sortField, sortOrder, searchTerm, handleSearch }: DynamicTableProps) => {
 

  const tableData = Array.isArray(data) ? data : (Array.isArray((data as any)?.data) ? (data as any).data : []);
  const columnKeys = tableData.length > 0 ? Object.keys(tableData[0]).filter(key => !Array.isArray(tableData[0][key]) && key !== '_id') : [];

  const truncateText = (text: string | number | null | undefined, maxLength: number): string => {
    if (text == null) return '';
    const stringText = String(text);
    return stringText.length > maxLength ? stringText.slice(0, maxLength) + '...' : stringText;
  };

  const renderProductContent = (key: string, value: any) => {
    if (key === 'productThumbnail' || key === 'thumbnail' || key === 'picture') {
      return (
        <img
          src={value}
          alt="Product Thumbnail"
          className="w-full h-10 object-contain"
        />
      );
    }
    else if (key === 'productSample' || key === 'productFile') {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {truncateText(value, 20)}
        </a>
      );
    }
    return truncateText(value, 20);
  };


  const renderSortIcon = (column: string) => {
    if (column !== sortField) return <FaSort />;
    return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => handleSearch(e)}
          className="p-2 border rounded w-full"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columnKeys.map((key, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => onSort(key)}
                >
                 <div className='flex items-center gap-2'>{key} {renderSortIcon(key)}</div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className="hover:bg-gray-100">
                {columnKeys
                  .filter(key => key !== '_id')
                  .map((key: string, colIndex: number) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {renderProductContent(key, row[key])}
                    </td>
                  ))}
                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                  {onView && (
                    <button onClick={() => onView(row)} className="text-blue-600 hover:text-blue-900 flex items-center">
                      <FaEye className="mr-1" /> View
                    </button>
                  )}
                  {onEdit && (
                    <button onClick={() => onEdit(row)} className="text-yellow-600 hover:text-yellow-900 ml-2 flex items-center">
                      <FaEdit className="mr-1" /> Edit
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(row)} className="text-red-600 hover:text-red-900 ml-2 flex items-center">
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicTable;
