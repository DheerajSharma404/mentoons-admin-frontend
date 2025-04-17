import { IQuotes } from "../../types";
import { motion } from "framer-motion";

const Quotes: React.FC<{ quotes: IQuotes | IQuotes[] }> = ({ quotes }) => {
  const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

  if (!quotesArray || quotesArray.length === 0) {
    return (
      <div className="flex justify-center items-center bg-[#F7941D] h-full p-4">
        <p className="text-black text-lg">No quotes available</p>
      </div>
    );
  }

  const quote = quotesArray[0];

  return (
    <div className="relative bg-white h-full w-full overflow-hidden flex items-center justify-center">
      <motion.div
        className="absolute bottom-0 left-0 h-full sm:h-3/4 md:h-4/5 lg:h-full z-0 flex items-end"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <img
          src="/assets/background/Avatars of happy young people.png"
          alt="bg-img2"
          className="h-auto w-auto max-h-full object-contain"
          style={{ maxWidth: "45vw" }}
        />
      </motion.div>
      <motion.div
        className="absolute bottom-0 right-0 h-full sm:h-3/4 md:h-4/5 lg:h-full z-0 flex items-end justify-end"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <img
          src="/assets/background/Books, motivational poster with the inscription Make Today Great, office plant on the desk.png"
          alt="bg-img"
          className="h-auto w-auto max-h-full object-contain"
          style={{ maxWidth: "45vw" }}
        />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center max-w-screen-md mx-auto px-4 py-6">
        <motion.img
          src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
          alt="mentoons-icon"
          className="w-24 sm:w-28 md:w-32 lg:w-40 mb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 100,
          }}
        />

        <motion.div
          key={quote.quote}
          className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font-medium italic text-black bg-white/70 backdrop-blur-sm rounded-xl p-3 md:p-5"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            "{quote.quote}"
          </motion.div>
          <motion.div
            className="text-center text-sm sm:text-base md:text-lg text-black mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {quote.author ? `— ${quote.author}` : ""}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Quotes;
