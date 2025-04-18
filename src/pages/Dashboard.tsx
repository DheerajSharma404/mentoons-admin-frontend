import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ModuleCards from "../components/dashboard/ModuleCards";
import Quotes from "../components/dashboard/Quotes";
import { getQuotes } from "../services/quoteService";
import { IQuotes } from "../types";

const Dashboard = () => {
  const [quotes, setQuotes] = useState<IQuotes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      const data = await getQuotes();
      setQuotes(data);
      setLoading(false);
    };
    const interval = setInterval(fetchQuotes, 10000);
    fetchQuotes();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-gray-100">
      <div className="">
        <div className="flex flex-col p-6 md:p-12 ">
          <h1 className="mb-6 text-3xl font-bold text-left text-gray-800 md:text-4xl">
            Mentoons Admin
          </h1>
          <div className="flex flex-col space-y-6">
            <div className="relative flex justify-center w-full">
              <img
                src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
                alt="logo"
                className="lg:h-[20rem] object-contain lg:object-cover "
              />
              <motion.img
                src="/assets/football.png"
                alt="team"
                className="absolute bottom-0 right-0 hidden w-20 h-20 md:block"
                animate={{
                  y: [-16, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
              <motion.img
                src="/assets/helicopter.png"
                alt="helicopter"
                className="absolute bottom-0 left-0 hidden w-20 h-20 rotate-180 md:block"
                animate={{
                  x: ["0%", "100%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
              />
            </div>
          </div>
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : (
            <Quotes quotes={quotes} />
          )}
        </div>
        <div className="w-full py-2">
          <ModuleCards />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
