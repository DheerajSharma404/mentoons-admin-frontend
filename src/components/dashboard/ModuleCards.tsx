import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ModuleCards = () => {
  const navigate = useNavigate();
  const modules = [
    {
      name: "Dashboard Analytics",
      description: "View and analyze key metrics and performance indicators",
      image: "https://cdn-icons-png.flaticon.com/512/1828/1828791.png",
      link: "/dashboard-analytics",
    },
    {
      name: "User Management",
      description: "Manage users in the system",
      image: "https://cdn-icons-png.flaticon.com/512/1570/1570102.png",
      link: "/user-management",
    },
    {
      name: "Product Management",
      description: "Manage products in the system",
      image: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
      link: "/product-table",
    },
    {
      name: "Hiring",
      description: "View reports in the system",
      image: "https://cdn-icons-png.flaticon.com/512/2910/2910791.png",
      link: "/all-jobs",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 p-6 rounded-lg sm:grid-cols-2 lg:grid-cols-4">
      {modules.map((module, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(module.link)}
          className="flex flex-col items-center p-6 transition-all duration-300 bg-white shadow-lg cursor-pointer rounded-xl hover:shadow-xl"
        >
          <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
            <img
              src={module.image}
              alt={module.name}
              className="w-12 h-12 text-white"
            />
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-800">
            {module.name}
          </h2>
          <p className="text-sm text-center text-gray-600">
            {module.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default ModuleCards;
