import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

const GridItem = ({ color, text, icon: IconComponent }) => {
  const [isFading, setIsFading] = useState(false);


  useEffect(() => {
    if (text) {
      setIsFading(true); // Trigger fade effect when new content is set
      const timeout = setTimeout(() => {
        setIsFading(false); // Revert to gray after the animation
      }, 2000); // 2 seconds delay

      // Clean up the timeout on component unmount or when text changes
      return () => clearTimeout(timeout);
    }
  }, [text]);

  return (

    <div
      className={`relative rounded-lg shadow-md shadow-black/30 aspect-square 
    transition-colors ease-fade-delay "
    ${isFading ? "bg-white duration-1000" : "bg-gray-200 duration-3000 "}`}
    >
      <div className="flex flex-col justify-around items-center pt-4 h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={text}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.8 }
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: -20,
              filter: 'blur(20px)',
              transition: { duration: 0.5 }
            }}
            className={`flex flex-col justify-center px-5 py-1 rounded-full ${color}`}
          >
            {IconComponent && <IconComponent color="black" size={36} />}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 1 }
            }}
            exit={{
              opacity: 0,
              y: -20,
              filter: 'blur(20px)',
              transition: { duration: 0.5 }
            }}
            className="paragraf flex flex-col text-sm w-full align-center items-center text-center p-1"
          >
            {text}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GridItem;
