import { useState, useEffect } from "react";
import { IQuotes } from "../../types";
import { motion, AnimatePresence } from "framer-motion";

interface QuotesProps {
  quotes: IQuotes | IQuotes[];
}

const Quotes: React.FC<QuotesProps> = ({ quotes }) => {
  const quotesArray = Array.isArray(quotes) ? quotes : [quotes];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || quotesArray.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotesArray.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [quotesArray.length, isAutoPlaying]);

  if (!quotesArray || quotesArray.length === 0) {
    return (
      <div className="flex justify-center items-center bg-white h-full p-4 rounded-xl">
        <p className="text-gray-700 text-lg">No quotes available</p>
      </div>
    );
  }

  const quote = quotesArray[currentQuoteIndex];

  const handlePrevQuote = () => {
    setIsAutoPlaying(false);
    setCurrentQuoteIndex((prevIndex) =>
      prevIndex === 0 ? quotesArray.length - 1 : prevIndex - 1
    );
  };

  const handleNextQuote = () => {
    setIsAutoPlaying(false);
    setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotesArray.length);
  };

  return (
    <div className="relative bg-white h-full w-full overflow-hidden flex items-center justify-center rounded-xl">
      {/* Background images */}
      <motion.div
        className="absolute bottom-0 left-0 h-full sm:h-3/4 md:h-4/5 lg:h-full z-0 flex items-end opacity-70"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 0.7 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <img
          src="/assets/background/Avatars of happy young people.png"
          alt="Background"
          className="h-auto w-auto max-h-full object-contain"
          style={{ maxWidth: "45vw" }}
          loading="lazy"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-0 right-0 h-full sm:h-3/4 md:h-4/5 lg:h-full z-0 flex items-end justify-end opacity-70"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 0.7 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <img
          src="/assets/background/Books, motivational poster with the inscription Make Today Great, office plant on the desk.png"
          alt="Background"
          className="h-auto w-auto max-h-full object-contain"
          style={{ maxWidth: "45vw" }}
          loading="lazy"
        />
      </motion.div>

      {/* Quote content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-screen-md mx-auto px-4 py-6">
        <motion.img
          src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
          alt="Mentoons Icon"
          className="w-32 sm:w-40 md:w-48 lg:w-56 mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 100,
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={quote.quote}
            className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font-medium italic text-black bg-white/90 backdrop-blur-sm rounded-xl p-3 md:p-5 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              "{quote.quote}"
            </motion.div>
            <motion.div
              className="text-center text-sm sm:text-base md:text-lg text-gray-700 mt-3 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {quote.author ? `— ${quote.author}` : ""}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons - only show if there are multiple quotes */}
        {quotesArray.length > 1 && (
          <div className="flex items-center justify-center mt-6 space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
              onClick={handlePrevQuote}
              aria-label="Previous quote"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#F7941D]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>

            <div className="flex space-x-1">
              {quotesArray.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentQuoteIndex ? "bg-[#F7941D]" : "bg-gray-300"
                  }`}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentQuoteIndex(index);
                  }}
                  aria-label={`Go to quote ${index + 1}`}
                  initial={{ scale: index === currentQuoteIndex ? 1.2 : 1 }}
                  animate={{ scale: index === currentQuoteIndex ? 1.2 : 1 }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
              onClick={handleNextQuote}
              aria-label="Next quote"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#F7941D]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quotes;
