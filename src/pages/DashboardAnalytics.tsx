import React from "react";
import { FaBox, FaBriefcase, FaFileAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loader from "../components/common/Loader";
import StatCard from "../components/common/StatsCard";
import { useGetDashboardDataQuery } from "../features/dashboard/dashboardApi";

const DashboardAnalytics: React.FC = () => {
  const navigate = useNavigate(); 
  const { data, isLoading } = useGetDashboardDataQuery();

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="h-full p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-4xl font-bold text-gray-800">
          Dashboard Analytics
        </h1>
        <div className="grid grid-cols-1 gap-8 mb-10 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={data?.data.totalUsers || 0}
            icon={FaUsers}
            onClick={() => {
              navigate("/users");
            }}
          />
          <StatCard
            title="Total Jobs"
            value={data?.data.totalJobs || 0}
            icon={FaBriefcase}
            onClick={() => {
              navigate("/all-jobs");
            }}
          />
          <StatCard
            title="Job Applications"
            value={data?.data.totalJobApplications || 0}
            icon={FaFileAlt}
            onClick={() => {
              navigate("/view-applications");
            }}
          />
          <StatCard
            title="Total Products"
            value={data?.data.totalProducts || 0}
            icon={FaBox}
            onClick={() => {
              navigate("/product-table");
            }}
          />
        </div>
        <div className="p-6 bg-white shadow-lg rounded-2xl">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Sales Data
          </h2>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data?.data?.completedOrdersInMonthOrder}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    border: "none",
                    borderRadius: "0.5rem",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#4F46E5"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
