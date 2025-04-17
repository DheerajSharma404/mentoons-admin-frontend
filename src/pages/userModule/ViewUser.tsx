import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { User } from "../../types";
// Import additional components and icons
import { FaArrowLeft, FaEnvelope, FaPencilAlt, FaPhone } from "react-icons/fa";
import { errorToast, successToast } from '../../utils/toastResposnse';
import Loader from '../../components/common/Loader';

const ViewUser: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);        
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [newRole, setNewRole] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setError(null);
                const token = await getToken();
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError('Failed to load user details');
                errorToast('Failed to load user details');
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
                `https://api.mentoons.com/api/v1/user/update-role/${user?.clerkId}`,
                { 
                    role: newRole,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUser(prev => prev ? { ...prev, role: newRole } : null);
            successToast('Role updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating role:", error);
            errorToast('Failed to update role');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50" role="status" aria-label="Loading user details">
                <Loader />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50" role="alert">
                <div className="p-8 bg-white rounded-xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">{error || 'User not found'}</h2>
                    <button
                        onClick={() => navigate('/users')}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none"
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" role="main">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/users')}
                    className="group mb-8 inline-flex items-center text-gray-600 hover:text-blue-600 transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 hover:bg-white/50 backdrop-blur-sm"
                >
                    <FaArrowLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
                    Back to Users
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100" role="article">
                    <div className="md:grid md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                        {/* Enhanced Profile Image Section */}
                        <div className="md:col-span-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                            <div className="p-8 flex flex-col items-center">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur"></div>
                                    <img
                                        className="relative h-48 w-48 object-cover rounded-full ring-4 ring-white shadow-lg transform group-hover:scale-105 transition duration-200"
                                        src={user.picture || "https://via.placeholder.com/128"}
                                        alt={`Profile of ${user.name}`}
                                    />
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                        <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-white shadow-md text-gray-700 border border-gray-100">
                                            {user.role || "User"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced User Details Section */}
                        <div className="md:col-span-8 p-8">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                                        {user.name}
                                    </h1>
                                    <p className="text-gray-500 text-lg">@{user.name}</p>
                                </div>
                                {isEditing ? (
                                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                        <div className="relative">
                                            <select
                                                value={newRole}
                                                onChange={(e) => setNewRole(e.target.value)}
                                                className="w-full sm:w-auto pl-4 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-lg shadow-sm"
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
                                                className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:outline-none transition-all duration-200 shadow-md hover:shadow-lg"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1 sm:flex-none px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                   
                                        <button
                                            onClick={() => {
                                                setNewRole(user.role || '');
                                                setIsEditing(true);
                                            }}
                                            className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold hover:bg-indigo-200"
                                        >
                                            <div className='flex items-center gap-2'>
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
                                    <span className="text-gray-700">{user.phoneNumber || "Not provided"}</span>
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
