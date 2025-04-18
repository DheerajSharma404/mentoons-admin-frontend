import React from "react";
import { FaBox, FaBriefcase, FaFileAlt, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
    CartesianGrid,
    Line,
    LineChart,
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
      <div className="p-6 max-w-7xl mx-aut">
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
        <div className="p-4 mb-12 bg-white border border-gray-200 shadow-lg rounded-2xl ">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Sales Data
          </h2>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data?.data.salesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="5 5"
                  stroke="#E2E8F0"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  tick={{ fontSize: 12, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={{ stroke: "#E2E8F0" }}
                />
                <YAxis
                  stroke="#64748B"
                  tick={{ fontSize: 12, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={{ stroke: "#E2E8F0" }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    padding: "1rem",
                  }}
                  itemStyle={{ color: "#334155", fontSize: "0.875rem" }}
                  labelStyle={{
                    color: "#1E293B",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                  cursor={{ stroke: "#94A3B8", strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="orderCount"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    stroke: "#2563eb",
                    strokeWidth: 2,
                    fill: "#FFFFFF",
                  }}
                  activeDot={{
                    r: 6,
                    stroke: "#2563eb",
                    strokeWidth: 2,
                    fill: "#FFFFFF",
                  }}
                  name="Orders"
                />
                <Line
                  type="monotone"
                  dataKey="totalAmount"
                  stroke="#0f766e"
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    stroke: "#0f766e",
                    strokeWidth: 2,
                    fill: "#FFFFFF",
                  }}
                  activeDot={{
                    r: 6,
                    stroke: "#0f766e",
                    strokeWidth: 2,
                    fill: "#FFFFFF",
                  }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
