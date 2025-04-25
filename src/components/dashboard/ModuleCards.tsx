import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Module {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
  color: string;
}

const ModuleCards = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const modules: Module[] = [
    {
      id: "dashboard-analytics",
      name: "Dashboard Analytics",
      description: "View and analyze key metrics and performance indicators",
      image: "https://cdn-icons-png.flaticon.com/512/1828/1828791.png",
      link: "/dashboard-analytics",
      color: "from-blue-400 to-blue-600",
    },
    {
      id: "user-management",
      name: "User Management",
      description: "Manage users, roles and permissions in the system",
      image: "https://cdn-icons-png.flaticon.com/512/1570/1570102.png",
      link: "/user-management",
      color: "from-purple-400 to-purple-600",
    },
    {
      id: "product-management",
      name: "Product Management",
      description: "Create, update and manage your products and inventory",
      image: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
      link: "/product-table",
      color: "from-green-400 to-green-600",
    },
    {
      id: "hiring",
      name: "Hiring",
      description: "Manage job postings and review applications",
      image: "https://cdn-icons-png.flaticon.com/512/2910/2910791.png",
      link: "/all-jobs",
      color: "from-red-400 to-red-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 bg-white rounded-lg h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {modules.map((module) => (
        <motion.div
          key={module.id}
          variants={itemVariants}
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(module.link)}
          onMouseEnter={() => setHoveredCard(module.id)}
          onMouseLeave={() => setHoveredCard(null)}
          className="flex flex-col h-full transition-all duration-300 bg-white shadow-md hover:shadow-xl cursor-pointer rounded-xl overflow-hidden border border-gray-100"
        >
          <div className={`h-2 w-full bg-gradient-to-r ${module.color}`} />

          <div className="flex items-start p-4 md:p-6">
            <div
              className={`flex-shrink-0 flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${module.color}`}
            >
              <img
                src={module.image}
                alt={module.name}
                className="w-10 h-10 md:w-14 md:h-14 text-white"
                loading="lazy"
              />
            </div>

            <div className="ml-4 flex-grow">
              <h2 className="mb-2 text-lg md:text-xl font-bold text-gray-800">
                {module.name}
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                {module.description}
              </p>
            </div>
          </div>

          <div className="mt-auto p-4 pt-0 md:pb-6">
            <motion.div
              className="flex items-center justify-end text-sm font-medium"
              animate={{
                color: hoveredCard === module.id ? "#F7941D" : "#6B7280",
              }}
              transition={{ duration: 0.2 }}
            >
              <span>Open</span>
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{
                  x: hoveredCard === module.id ? 5 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ModuleCards;
