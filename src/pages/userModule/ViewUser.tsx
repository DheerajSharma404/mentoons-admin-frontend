import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../types";
// Import additional components and icons
import { FaArrowLeft, FaEnvelope, FaPencilAlt, FaPhone } from "react-icons/fa";
import Loader from "../../components/common/Loader";
import { errorToast, successToast } from "../../utils/toastResposnse";

const ViewUser: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setError(null);
        const token = await getToken();
        const response = await axios.get(
          `https://mentoons-backend-zlx3.onrender.com/api/v1/user/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user details");
        errorToast("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [getToken, userId]);

  const handleRoleUpdate = async () => {
    try {
      const token = await getToken();
      await axios.post(
        `https://mentoons-backend-zlx3.onrender.com/api/v1/user/update-role/${user?.clerkId}`,
        {
          role: newRole,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((prev) => (prev ? { ...prev, role: newRole } : null));
      successToast("Role updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating role:", error);
      errorToast("Failed to update role");
    }
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-gray-50"
        role="status"
        aria-label="Loading user details"
      >
        <Loader />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
        role="alert"
      >
        <div className="p-8 text-center bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            {error || "User not found"}
          </h2>
          <button
            onClick={() => navigate("/users")}
            className="inline-flex items-center px-6 py-3 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Return to users list"
          >
            <FaArrowLeft className="mr-2" />
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
      role="main"
    >
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/users")}
          className="inline-flex items-center px-4 py-2 mb-8 font-medium text-gray-600 transition duration-200 rounded-lg group hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-white/50 backdrop-blur-sm"
        >
          <FaArrowLeft className="w-5 h-5 mr-2 transition-transform duration-200 transform group-hover:-translate-x-1" />
          Back to Users
        </button>

        <div
          className="overflow-hidden bg-white border border-gray-100 shadow-xl rounded-2xl"
          role="article"
        >
          <div className="divide-y divide-gray-200 md:grid md:grid-cols-12 md:divide-y-0 md:divide-x">
            {/* Enhanced Profile Image Section */}
            <div className="md:col-span-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
              <div className="flex flex-col items-center p-8">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur"></div>
                  <img
                    className="relative object-cover w-48 h-48 transition duration-200 transform rounded-full shadow-lg ring-4 ring-white group-hover:scale-105"
                    src={user.picture || "https://via.placeholder.com/128"}
                    alt={`Profile of ${user.name}`}
                  />
                  <div className="absolute transform -translate-x-1/2 -bottom-2 left-1/2">
                    <span className="inline-flex items-center px-4 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-100 rounded-full shadow-md">
                      {user.role || "User"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced User Details Section */}
            <div className="p-8 md:col-span-8">
              <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
                <div>
                  <h1 className="mb-1 text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                    {user.name}
                  </h1>
                  <p className="text-lg text-gray-500">@{user.name}</p>
                </div>
                {isEditing ? (
                  <div className="flex flex-col w-full gap-3 sm:flex-row sm:w-auto">
                    <div className="relative">
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full py-2 pl-4 pr-10 text-base border-gray-300 rounded-lg shadow-sm sm:w-auto focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select Role</option>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleRoleUpdate}
                        className="flex-1 px-6 py-2 text-white transition-all duration-200 rounded-lg shadow-md sm:flex-none bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:outline-none hover:shadow-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 px-6 py-2 text-gray-700 transition-all duration-200 bg-gray-100 rounded-lg shadow-sm sm:flex-none hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:outline-none hover:shadow-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setNewRole(user.role || "");
                      setIsEditing(true);
                    }}
                    className="px-4 py-2 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-full hover:bg-indigo-200"
                  >
                    <div className="flex items-center gap-2">
                      {user.role || "User"}
                      <FaPencilAlt className="ml-2" />
                    </div>
                  </button>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-purple-500" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-purple-500" />
                  <span className="text-gray-700">
                    {user.phoneNumber || "Not provided"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
