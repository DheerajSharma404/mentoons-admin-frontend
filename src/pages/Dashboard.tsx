import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IQuotes } from "../types";
import { getQuotes } from "../services/quoteService";
import ModuleCards from "../components/dashboard/ModuleCards";
import Quotes from "../components/dashboard/Quotes";

const Dashboard = () => {
  const [quotes, setQuotes] = useState<IQuotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const data = await getQuotes();
        setQuotes(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch quotes. Please try again later.");
        console.error("Error fetching quotes:", err);
      } finally {
        setLoading(false);
      }
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
        when: "beforeChildren",
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
      className="min-h-[100dvh] w-full bg-gray-100 overflow-auto flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col p-4 md:p-8 flex-grow bg-[#F7941D]">
        <motion.div
          className="flex items-center justify-between mb-4 md:mb-6"
          variants={itemVariants}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Mentoons Admin
          </h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-full p-2 shadow-md cursor-pointer"
          >
            <img
              src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
              alt="Mentoons Logo"
              className="w-10 h-10 md:w-24 md:h-12"
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 flex-grow">
          <motion.div
            className="rounded-xl overflow-hidden shadow-lg h-full"
            variants={itemVariants}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center bg-white h-full p-4 md:p-8 rounded-xl"
                >
                  <motion.div
                    className="flex flex-col items-center"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  >
                    <div className="w-12 h-12 border-4 border-[#F7941D] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-700 font-medium">
                      Loading quotes...
                    </p>
                  </motion.div>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center bg-white h-full p-4 md:p-8 rounded-xl"
                >
                  <div className="text-center">
                    <p className="text-red-500 font-medium mb-2">{error}</p>
                    <button
                      onClick={() =>
                        getQuotes()
                          .then(setQuotes)
                          .catch(() => setError("Failed to fetch quotes"))
                      }
                      className="px-4 py-2 bg-[#F7941D] text-white rounded-lg hover:bg-[#E68A1B] transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="quotes"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl shadow-lg h-full"
                >
                  <Quotes quotes={quotes} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div className="rounded-xl h-full" variants={itemVariants}>
            <ModuleCards />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
