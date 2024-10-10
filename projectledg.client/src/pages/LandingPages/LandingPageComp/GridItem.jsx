import { motion } from "framer-motion";

const GridItem = ({
  text = "Default Text", // Default text
  icon: Icon = () => <div>Default Icon</div>, // Default icon as a placeholder
  bgColor = "bg-blue-500", // Default background color
}) => {
  return (
    <div className="relative bg-gray-100 rounded-lg shadow-lg shadow-black/30 aspect-square">
      <div className="flex flex-col justify-around items-center pt-4 h-full">
        {/* Icon with exit animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }} // Adjust y for upward movement
          transition={{ duration: 0.5 }}
          className={`flex flex-col justify-center px-5 py-1 rounded-full ${bgColor}`}
        >
          <Icon color="black" size={36} />
        </motion.div>

        {/* Text with exit animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }} // Move up while fading out
          transition={{ duration: 0.9 }}
          className="paragraf flex flex-col text-xs w-full align-center items-center text-center p-1"
        >
          {text}
        </motion.div>
      </div>
    </div>
  );
};

export default GridItem;
