
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlessingSection } from '../types';

interface BlessingsSceneProps {
  birthdayName: string;
  onPlaySFX: (type: 'blessing') => void;
}

const SECTIONS: BlessingSection[] = [
  {
    id: 'god',
    title: 'Blessings from God',
    icon: '🙏',
    content: `In every prayer and silent plea,
May His light follow where you be.
A path of peace, a heart of gold,
May your life’s story beautifully unfold.

May grace and mercy lead your way,
Through every night and every day.`,
    image: 'https://images.unsplash.com/photo-1519810755548-39cd217da494?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'parents',
    title: 'Love from Parents',
    icon: '👨‍👩‍👧',
    content: `Our guiding star, our source of light,
You make our world so pure and bright.
With every step and every dream,
You're the finest part of our family team.

We hold you close within our heart,
Even when we are miles apart.`,
    image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'self',
    title: 'Wishes from Rishabh',
    icon: '😊',
    content: `A day of joy, a year of grace,
A smile upon your lovely face.
With love and wishes, warm and true,
Rishabh sends this gift to you.

May your birthday be just the start,
Of a year that warms your happy heart.`,
    image: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?auto=format&fit=crop&q=80&w=600'
  }
];

export const BlessingsScene: React.FC<BlessingsSceneProps> = ({ birthdayName, onPlaySFX }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeSection = SECTIONS.find(s => s.id === selectedId);

  const handleSectionClick = (id: string) => {
    setSelectedId(id);
    onPlaySFX('blessing');
  };

  return (
    <div className="h-full flex flex-col items-center justify-start py-12 px-6 overflow-y-auto">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-game text-pink-600 mb-2">Happy Birthday, {birthdayName}! 🎂</h1>
        <p className="text-gray-600 text-xl font-medium">The celebration ends with these heartfelt words...</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {SECTIONS.map((section) => (
          <motion.button
            key={section.id}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSectionClick(section.id)}
            className={`flex flex-col items-center p-8 rounded-3xl shadow-xl transition-all border-4 ${
              selectedId === section.id ? 'bg-pink-50 border-pink-400' : 'bg-white border-transparent'
            }`}
          >
            <div className="text-6xl mb-4 bg-pink-100 w-24 h-24 flex items-center justify-center rounded-full">
              {section.icon}
            </div>
            <h3 className="text-2xl font-game text-gray-800">{section.title}</h3>
            <p className="text-gray-500 mt-2 text-sm font-semibold italic">Open the poem</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mt-16 w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-pink-100 flex flex-col md:flex-row items-stretch min-h-[400px]"
          >
            <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img 
                    src={activeSection.image} 
                    alt={activeSection.title} 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                <div className="text-4xl mb-4">{activeSection.icon}</div>
                <h2 className="text-3xl font-game text-pink-600 mb-6 border-b-2 border-pink-100 pb-2">{activeSection.title}</h2>
                <div className="text-xl text-gray-700 leading-relaxed italic whitespace-pre-line font-medium text-center">
                    "{activeSection.content}"
                </div>
                <button 
                  onClick={() => setSelectedId(null)}
                  className="mt-8 bg-pink-100 hover:bg-pink-200 text-pink-600 font-bold px-6 py-2 rounded-full self-center transition-colors"
                >
                  Close Poem
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="mt-24 text-center pb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="text-4xl mb-4">✨ 💖 ✨</div>
        <p className="text-gray-400 font-bold">A special surprise created by Rishabh</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 text-white font-game bg-pink-500 px-10 py-3 rounded-full hover:bg-pink-600 shadow-lg transition-transform hover:scale-105"
        >
          Celebrate Again! 🔄
        </button>
      </motion.div>
    </div>
  );
};
