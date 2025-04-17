import ModuleCards from "../components/dashboard/ModuleCards";
import { useState, useEffect } from "react";
import { IQuotes } from "../types";
import { getQuotes } from "../services/quoteService";
import Quotes from "../components/dashboard/Quotes";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [quotes, setQuotes] = useState<IQuotes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      const data = await getQuotes();
      setQuotes(data);
      setLoading(false);
    };

    fetchQuotes();

    const interval = setInterval(fetchQuotes, 10000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="bg-gray-100 h-screen overflow-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col p-4 md:p-8 h-full bg-[#F7941D]">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-left mb-4 md:mb-6 text-gray-800"
          variants={itemVariants}
        >
          Mentoons Admin
        </motion.h1>

        <div className="flex-grow grid grid-rows-2 gap-4 md:gap-6 h-full">
          <motion.div
            className="rounded-xl overflow-hidden shadow-lg"
            variants={itemVariants}
          >
            {loading ? (
              <div className="flex justify-center items-center bg-[#F7941D] h-full p-4 md:p-8">
                <motion.p
                  className="text-black text-lg"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.98, 1, 0.98],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  Loading quotes...
                </motion.p>
              </div>
            ) : (
              <Quotes quotes={quotes} />
            )}
          </motion.div>

          <motion.div
            className="overflow-auto"
            variants={itemVariants}
            style={{ maxHeight: "100%" }}
          >
            <ModuleCards />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
