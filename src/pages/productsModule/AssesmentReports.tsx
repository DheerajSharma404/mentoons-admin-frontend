import { useState } from "react";
import Loader from "../../components/common/Loader";
import { useGetAssesmentReportsQuery } from "../../features/workshop/workshopApi";
import AssesmentDetails from "./AssesmentDetails";
import { 
  HiOutlineClipboardList, 
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineDownload,
  HiOutlineEye
} from "react-icons/hi";
import Pagination from "../../components/common/Pagination";

const AssesmentReports = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { data, isLoading } = useGetAssesmentReportsQuery({
    page: currentPage,
    limit,
    search: searchQuery,
    sortField,
    sortDirection,
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = data?.data?.feedbacks.filter((feedback: any) =>
    feedback.childName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <Loader />
  
  return (
    <div className="flex flex-col gap-6 p-8 bg-gray-50 min-h-screen">
      {selectedFeedback ? (
        <AssesmentDetails 
          feedback={selectedFeedback} 
          onClose={() => setSelectedFeedback(null)} 
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <HiOutlineClipboardList className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-900">Assessment Reports</h2>
            </div>
            <p className="text-gray-600 mt-2 text-lg">View and manage all assessment feedback</p>

            {/* Search and Filter Bar */}
            <div className="mt-6 flex gap-4">
              <div className="relative flex-1">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reports..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <HiOutlineFilter className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <HiOutlineDownload className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600">Export</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {["Child Name", "Age", "Created At", "Issues", "Actions"].map((header) => (
                    <th
                      key={header}
                      onClick={() => handleSort(header.toLowerCase().replace(" ", ""))}
                      className="px-8 py-5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        {header}
                        {sortField === header.toLowerCase().replace(" ", "") && (
                          <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData?.map((feedback: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-4 text-sm text-gray-700">{feedback.childName}</td>
                    <td className="px-8 py-4 text-sm text-gray-700">{feedback.childAge}</td>
                    <td className="px-8 py-4 text-sm text-gray-700">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-700">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {feedback.issues}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <button
                        onClick={() => setSelectedFeedback(feedback)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                      >
                        <HiOutlineEye className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-600">View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil((data?.data?.totalFeedbacks || 0) / limit)}
            totalItems={data?.data?.totalFeedbacks || 0}
            limit={limit}
            onLimitChange={setLimit}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
};

export default AssesmentReports;
