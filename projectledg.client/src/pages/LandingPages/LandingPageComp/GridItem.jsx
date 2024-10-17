import { motion, AnimatePresence } from "framer-motion";

const GridItem = ({ color, text, icon: IconComponent }) => {
  return (

    <div className="relative bg-gray-100 rounded-lg shadow-lg shadow-black/30 aspect-square">
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
            className="paragraf flex flex-col text-xs w-full align-center items-center text-center p-1"
          >
            {text}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GridItem;
