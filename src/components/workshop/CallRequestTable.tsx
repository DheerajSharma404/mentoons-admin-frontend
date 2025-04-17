import { BsTelephone } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

interface CallRequestTableProps {
  filteredData: any[];
  statusConfig: any;
  handleStatusUpdate: (requestId: string, status: string) => void;
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
  serchUser: string;
  setSerchUser: (search: string) => void;
  adminUsers: AdminUser[];
  assignCallRequestHandler: (requestId: string, adminId: string) => void;
}

interface AdminUser {
  _id: string;
  name: string;
}

const CallRequestTable = ({
  filteredData,
  statusConfig,
  handleStatusUpdate,
  openDropdownId,
  setOpenDropdownId,
  serchUser,
  setSerchUser,
  adminUsers,
  assignCallRequestHandler
}: CallRequestTableProps) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData?.map((request) => (
            <tr key={request._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="flex items-center gap-2">
                  <FaUser className="text-gray-400 h-4 w-4" />
                  <span className="text-sm text-gray-900">{request.name}</span>
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="flex items-center gap-2">
                  <BsTelephone className="text-gray-400 h-4 w-4" />
                  <span className="text-sm text-gray-600">{request.phone}</span>
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={request.status || 'pending'}
                  onChange={(e) => handleStatusUpdate(request._id, e.target.value)}
                  className={`text-sm w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500
                    ${statusConfig[request.status]?.bg || 'bg-gray-100'}
                    ${statusConfig[request.status]?.text || 'text-gray-800'}
                    ${statusConfig[request.status]?.border || 'border-gray-300'}
                  `}
                >
                  <option value="reached out" className="bg-white text-gray-800">Reached Out</option>
                  <option value="converted to lead" className="bg-white text-gray-800">Converted to Lead</option>
                  <option value="awaiting outreach" className="bg-white text-gray-800">Awaiting Outreach</option>
                  <option value="conversion unsuccessful" className="bg-white text-gray-800">Conversion Unsuccessful</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative admin-dropdown">
                  <div 
                    className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenDropdownId(openDropdownId === request._id ? null : request._id)}
                  >
                    {request.assignedTo?.[0]?.name || "Select Admin"}
                  </div>
                  
                  {openDropdownId === request._id && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                      <div className="p-2">
                        <input
                          type="text"
                          placeholder="Search admin..."
                          value={serchUser}
                          onChange={(e) => setSerchUser(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {adminUsers.map((admin) => (
                          <div
                            key={admin._id}
                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => {
                              assignCallRequestHandler(request._id, admin._id);
                              setOpenDropdownId(null);
                            }}
                          >
                            {admin.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CallRequestTable; 