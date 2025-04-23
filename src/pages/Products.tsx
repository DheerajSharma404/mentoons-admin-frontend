import { FaBoxOpen, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Products = () => {
  const navigate = useNavigate();
  const totalProducts = 120;
  const trendingProductsCount = 10;
  const salesData = [
    { month: "Jan", sales: 100 },
    { month: "Feb", sales: 200 },
    { month: "Mar", sales: 150 },
    { month: "Apr", sales: 250 },
    { month: "May", sales: 300 },
    { month: "Jun", sales: 200 },
    { month: "Jul", sales: 150 },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between mt-6 mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Product Dashboard
        </h1>
        <button
          onClick={() => navigate("/add-products")}
          className="px-6 py-3 text-white transition duration-300 bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <div className="mr-4 text-4xl text-blue-500">
            <FaBoxOpen />
          </div>
          <div onClick={() => navigate("/product-table")}>
            <h2 className="mb-2 text-lg font-semibold text-gray-700">
              Total Products
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              {totalProducts.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center p-6 bg-white rounded-lg shadow-md">
          <div className="mr-4 text-4xl text-red-500">
            <FaChartLine />
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-gray-700">
              Trending Products
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              {trendingProductsCount} products
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-2 text-lg font-semibold text-gray-700">
          Total Sales Graph
        </h2>
        <BarChart
          width={800}
          height={300}
          data={salesData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default Products;
