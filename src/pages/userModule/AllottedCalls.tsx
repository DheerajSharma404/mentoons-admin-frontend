import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowPathIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

// Define the structure of a call object
interface Call {
  _id: string;
  name: string;
  phone: string;
  email: string;
  status: keyof typeof statusConfig;
}

// Define status configuration types
type StatusConfigType = {
  [key: string]: {
    bg: string;
    text: string;
    border: string;
    label: string;
    icon: string;
  };
};

const statusConfig: StatusConfigType = {
  "reached out": {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
    label: "Reached Out",
    icon: "📞",
  },
  "converted to lead": {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
    label: "Converted to Lead",
    icon: "✅",
  },
  "awaiting outreach": {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
    label: "Awaiting Outreach",
    icon: "⏳",
  },
  "conversion unsuccessful": {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
    label: "Conversion Unsuccessful",
    icon: "❌",
  },
};

// Sample data to display when no real data is available
const sampleCalls: Call[] = [
  {
    _id: "sample-1",
    name: "John Smith",
    phone: "+91 98765 43210",
    email: "john.smith@example.com",
    status: "awaiting outreach",
  },
  {
    _id: "sample-2",
    name: "Priya Sharma",
    phone: "+91 87654 32109",
    email: "priya.sharma@example.com",
    status: "reached out",
  },
  {
    _id: "sample-3",
    name: "Raj Patel",
    phone: "+91 76543 21098",
    email: "raj.patel@example.com",
    status: "converted to lead",
  },
  {
    _id: "sample-4",
    name: "Ananya Singh",
    phone: "+91 65432 10987",
    email: "ananya.singh@example.com",
    status: "conversion unsuccessful",
  },
];

const AllottedCalls = () => {
  const { getToken } = useAuth();
  const [allottedCalls, setAllottedCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Call>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showingSampleData, setShowingSampleData] = useState<boolean>(false);
  const [expandedCards, setExpandedCards] = useState<{
    [key: string]: boolean;
  }>({});

  const fetchAllottedCalls = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/allocatedCalls`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedCalls = response.data.data.allocatedCalls;

      if (fetchedCalls && fetchedCalls.length > 0) {
        setAllottedCalls(fetchedCalls);
        setShowingSampleData(false);
      } else {
        // Use sample data if no calls were found
        setAllottedCalls(sampleCalls);
        setShowingSampleData(true);
      }
    } catch (error) {
      console.error("Error fetching allotted calls:", error);
      // Use sample data if there was an error
      setAllottedCalls(sampleCalls);
      setShowingSampleData(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllottedCalls();
  }, []);

  const handleSort = (field: keyof Call) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleExpandCard = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredCalls = allottedCalls.filter((call) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      call.name.toLowerCase().includes(searchLower) ||
      call.phone.toLowerCase().includes(searchLower) ||
      call.email.toLowerCase().includes(searchLower) ||
      (statusConfig[call.status]?.label.toLowerCase() || "").includes(
        searchLower
      )
    );
  });

  const sortedCalls = [...filteredCalls].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const refreshData = () => {
    fetchAllottedCalls();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 text-blue-500"
        >
          <ArrowPathIcon className="w-full h-full" />
        </motion.div>
      </div>
    );
  }

  if (allottedCalls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-64 gap-4"
      >
        <div className="text-center text-2xl font-bold text-gray-900">
          No allotted calls
        </div>
        <button
          onClick={refreshData}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          Refresh
        </button>
      </motion.div>
    );
  }

  // Mobile Card View
  const renderMobileCards = () => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 md:hidden"
      >
        {sortedCalls.map((call) => (
          <motion.div
            key={call._id}
            className="bg-white rounded-lg shadow overflow-hidden"
            variants={itemVariants}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleExpandCard(call._id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-lg font-medium">
                      {call.name ? call.name.charAt(0).toUpperCase() : "?"}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {call.name}
                    </p>
                    <div className="mt-1">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          statusConfig[call.status]?.bg || "bg-gray-100"
                        } ${
                          statusConfig[call.status]?.text || "text-gray-800"
                        } ${
                          statusConfig[call.status]?.border || "border-gray-200"
                        } border`}
                      >
                        <span className="mr-1">
                          {statusConfig[call.status]?.icon}
                        </span>
                        {statusConfig[call.status]?.label || call.status}
                      </motion.span>
                    </div>
                  </div>
                </div>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    expandedCards[call._id] ? "transform rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {expandedCards[call._id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-4 pt-2 border-t border-gray-200"
              >
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center">
                      <PhoneIcon className="w-4 h-4 text-gray-500" />
                      <span className="ml-2 text-xs text-gray-500">Phone</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-900">{call.phone}</p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                      <span className="ml-2 text-xs text-gray-500">Email</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-900 break-all">
                      {call.email}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    );
  };

  // Desktop Table View
  const renderDesktopTable = () => {
    return (
      <div className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-1" />
                    Caller Name
                    {sortField === "name" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("phone")}
                >
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-1" />
                    Phone
                    {sortField === "phone" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-4 h-4 mr-1" />
                    Email
                    {sortField === "email" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === "status" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <motion.tbody
              className="bg-white divide-y divide-gray-200"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {sortedCalls.map((call) => (
                <motion.tr
                  key={call._id}
                  className="hover:bg-gray-50 transition-colors"
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-lg font-medium">
                          {call.name ? call.name.charAt(0).toUpperCase() : "?"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {call.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <PhoneIcon className="w-4 h-4 mr-2 text-gray-500" />
                      {call.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-500" />
                      {call.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        statusConfig[call.status]?.bg || "bg-gray-100"
                      } ${statusConfig[call.status]?.text || "text-gray-800"} ${
                        statusConfig[call.status]?.border || "border-gray-200"
                      } border`}
                    >
                      <span className="mr-1">
                        {statusConfig[call.status]?.icon}
                      </span>
                      {statusConfig[call.status]?.label || call.status}
                    </motion.span>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="px-3 sm:px-6 py-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Allotted Calls
          </h1>
          {showingSampleData && (
            <p className="text-xs sm:text-sm text-amber-600 mt-1">
              Showing sample data. No actual calls found.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search calls..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <button
            onClick={refreshData}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            title="Refresh data"
            aria-label="Refresh data"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Conditional rendering based on screen size */}
      <div className="bg-white sm:bg-transparent rounded-lg">
        {renderMobileCards()}
        {renderDesktopTable()}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-center text-xs sm:text-sm text-gray-500"
      >
        Showing {sortedCalls.length} of {allottedCalls.length} calls
        {showingSampleData && " (sample data)"}
      </motion.div>
    </div>
  );
};

export default AllottedCalls;
