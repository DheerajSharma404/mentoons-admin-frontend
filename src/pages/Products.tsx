import { useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { FaBoxOpen, FaChartLine } from "react-icons/fa";

const Products = () => {
  const navigate = useNavigate();
  const totalProducts = 120;
  const trendingProductsCount = 10;
  const salesData = [
    { month: 'Jan', sales: 100 },
    { month: 'Feb', sales: 200 },
    { month: 'Mar', sales: 150 },
    { month: 'Apr', sales: 250 },
    { month: 'May', sales: 300 },
    { month: 'Jun', sales: 200 },
    { month: 'Jul', sales: 150 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex mt-6 justify-between mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Product Dashboard</h1>
        <button
          onClick={() => navigate('/add-products')}
          className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
        >
          Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="mr-4 text-blue-500 text-4xl">
            <FaBoxOpen />
          </div>
          <div onClick={()=>navigate('/product-table')}>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Products</h2>
            <p className="text-2xl font-bold text-gray-900">{totalProducts.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="mr-4 text-red-500 text-4xl">
            <FaChartLine />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Trending Products</h2>
            <p className="text-2xl font-bold text-gray-900">{trendingProductsCount} products</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Total Sales Graph</h2>
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
