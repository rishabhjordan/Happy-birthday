
import React from 'react';
import { motion } from 'framer-motion';

interface MailSceneProps {
  onOpen: () => void;
}

export const MailScene: React.FC<MailSceneProps> = ({ onOpen }) => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="cursor-pointer relative inline-block"
        onClick={onOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="text-9xl filter drop-shadow-2xl">
          📩
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -top-4 -right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white"
        >
          1
        </motion.div>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-4xl font-game text-pink-600 drop-shadow-md"
      >
        You've got a birthday invitation!
      </motion.h1>
      <p className="text-gray-500 mt-2 font-semibold">Click the mail to open it</p>
    </div>
  );
};
