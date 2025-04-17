import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen flex-col space-y-10 p-4">
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to Mentoons, Admin Panel
      </motion.h1>
      <motion.button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"

        onClick={() => navigate("/dashboard")}

        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Let's get started
      </motion.button>
    </div>
  );
};

export default Welcome;
