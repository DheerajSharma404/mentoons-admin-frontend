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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 p-4 md:p-6 bg-white rounded-lg">
      {modules.map((module, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(module.link)}
          className="flex flex-col items-center p-4 md:p-6 transition-all duration-300 bg-white shadow-md hover:shadow-xl cursor-pointer rounded-xl"
        >
          <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
            <img
              src={module.image}
              alt={module.name}
              className="w-10 h-10 md:w-12 md:h-12 text-white"
              loading="lazy"
            />
          </div>
          <h2 className="mb-2 text-lg md:text-xl font-bold text-gray-800 text-center">
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
