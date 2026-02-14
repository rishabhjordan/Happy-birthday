
import React from 'react';
import { CharacterName } from '../types';
import { motion } from 'framer-motion';

interface SelectionSceneProps {
  onSelect: (name: CharacterName) => void;
}

export const SelectionScene: React.FC<SelectionSceneProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-game text-blue-600 mb-12 text-center"
      >
        Whose birthday is it today? 🎂
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        <motion.button
          whileHover={{ scale: 1.05, translateY: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect('Vansh')}
          className="bg-white rounded-3xl p-8 shadow-xl border-4 border-blue-400 hover:border-blue-500 transition-all flex flex-col items-center space-y-4"
        >
          <div className="text-7xl bg-blue-100 rounded-full p-6">👦</div>
          <span className="text-3xl font-game text-blue-700">Vansh</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, translateY: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect('Simran')}
          className="bg-white rounded-3xl p-8 shadow-xl border-4 border-pink-400 hover:border-pink-500 transition-all flex flex-col items-center space-y-4"
        >
          <div className="text-7xl bg-pink-100 rounded-full p-6">👧</div>
          <span className="text-3xl font-game text-pink-700">Simran</span>
        </motion.button>
      </div>
    </div>
  );
};
