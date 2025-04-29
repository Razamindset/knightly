import { BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

export default function StockfishLoader() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-gray-900 to-black text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center space-y-6"
      >
        <div className="flex items-center space-x-3 text-2xl font-semibold">
          <BrainCircuit className="text-blue-500 animate-pulse" size={40} />
          <span>Loading Stockfish Engine...</span>
        </div>

        <FaSpinner size={35} className="animate-spin" />
      </motion.div>
    </div>
  );
}
