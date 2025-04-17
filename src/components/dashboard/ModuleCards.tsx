import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ModuleCards = () => {
  const navigate = useNavigate();

  const modules = [
    {
      name: "Dashboard Analytics",
      description: "View and analyze key metrics and performance indicators",
      image: "https://cdn-icons-png.flaticon.com/512/1828/1828791.png",
      link: "/dashboard-analytics",
      color: "from-blue-400 to-purple-500",
    },
    {
      name: "User Management",
      description: "Manage users in the system",
      image: "https://cdn-icons-png.flaticon.com/512/1570/1570102.png",
      link: "/user-management",
      color: "from-green-400 to-blue-500",
    },
    {
      name: "Product Management",
      description: "Manage products in the system",
      image: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
      link: "/product-table",
      color: "from-purple-400 to-pink-500",
    },
    {
      name: "Hiring",
      description: "View reports in the system",
      image: "https://cdn-icons-png.flaticon.com/512/2910/2910791.png",
      link: "/all-jobs",
      color: "from-orange-400 to-red-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="h-full flex items-start justify-center rounded-xl shadow-inner p-4">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full min-h-fit"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {modules.map((module, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(module.link)}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center cursor-pointer transition-all duration-300 h-full"
          >
            <motion.div
              className={`w-16 h-16 mb-4 bg-gradient-to-br ${module.color} rounded-full flex items-center justify-center`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={module.image}
                alt={module.name}
                className="w-10 h-10 text-white"
              />
            </motion.div>
            <h2 className="text-lg font-bold mb-2 text-gray-800 text-center">
              {module.name}
            </h2>
            <p className="text-gray-600 text-center text-sm">
              {module.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ModuleCards;
