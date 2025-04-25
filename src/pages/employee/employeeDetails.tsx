import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Briefcase,
  User,
  Loader2,
} from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import { useGetEmployeeByIdQuery } from "../../features/employee/employee";
import { BiRupee } from "react-icons/bi";
import { motion } from "framer-motion";

interface Place {
  houseName: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
}

const EmployeeDetailPage = () => {
  const { id: employeeId } = useParams();

  console.log("employee id :", employeeId);
  const { data, error, isLoading } = useGetEmployeeByIdQuery(employeeId!);

  console.log(data);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(salary);
  };

  const formatAddress = (place: Place) => {
    return `${place.houseName}, ${place.street}, ${place.city}, ${place.district}, ${place.state}, ${place.pincode}, ${place.country}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="text-blue-600 mb-4"
          >
            <Loader2 size={48} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl font-semibold text-gray-800"
          >
            Loading Employee Data
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 1.5, repeat: Infinity }}
            className="h-1 bg-blue-600 mt-4 rounded-full"
          />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-100 p-6 flex items-center justify-center"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-red-600">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">
            There was a problem loading the employee data.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-100 p-6 flex items-center justify-center"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
            <User size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Employee Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the employee you're looking for. They may have been
            removed or the ID is incorrect.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    );
  }

  const employee = data.data;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <img
                src={employee.profilePicture}
                alt={employee.name}
                className="h-24 w-24 rounded-full border-4 border-white object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{employee.name}</h1>
              <div className="flex items-center mt-1">
                <Briefcase size={16} className="mr-2" />
                <span>{employee.role}</span>
              </div>
              <div className="flex items-center mt-1">
                <Building size={16} className="mr-2" />
                <span>{employee.department}</span>
              </div>
              <span
                className={`mt-2 inline-block px-3 py-1 text-sm rounded-full ${
                  employee.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {employee.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Mail className="mr-3 text-blue-600 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-700">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="mr-3 text-blue-600 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-700">{employee.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-3 text-blue-600 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-700">
                      {formatAddress(employee.place)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                Employment Details
              </h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <User className="mr-3 text-blue-600 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-gray-700">{employee.role}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Building className="mr-3 text-blue-600 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-gray-700">{employee.department}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="mr-3 text-blue-600 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Join Date</p>
                    <p className="text-gray-700">
                      {formatDate(employee.joinDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BiRupee className="mr-3 text-blue-600 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="text-gray-700">
                      {formatSalary(employee.salary)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="text-right">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
              Edit Details
            </button>
            <NavLink
              to="/employee-table"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Back to List
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
