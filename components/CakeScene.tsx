
import React, { useState, useEffect } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { CharacterName, Person } from '../types';

interface CakeSceneProps {
  birthdayName: CharacterName;
  onNext: () => void;
  onPlaySFX: (type: 'slice' | 'pop') => void;
}

export const CakeScene: React.FC<CakeSceneProps> = ({ birthdayName, onNext, onPlaySFX }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [showSlice, setShowSlice] = useState(true);
  const [fedCount, setFedCount] = useState(0);
  const [birthdayPersonFed, setBirthdayPersonFed] = useState(false);
  const [activeMessage, setActiveMessage] = useState<string>(`Feed the cake to ${birthdayName}!`);
  const [isCutting, setIsCutting] = useState(false);
  const [cakeAnimation, setCakeAnimation] = useState({});

  useEffect(() => {
    const otherNames = ['Rishabh', 'Gurman', 'Divya', 'Annaya', 'Aman'];
    const generatedPeople: Person[] = [
      { id: 0, name: birthdayName, isBirthdayPerson: true, avatar: birthdayName === 'Vansh' ? '👦' : '👧', fed: false },
      ...otherNames.slice(0, 5).map((name, i) => ({
        id: i + 1,
        name: name,
        isBirthdayPerson: false,
        avatar: ['🧔', '👩', '👨', '🧑', '👵'][i],
        fed: false
      }))
    ];
    setPeople(generatedPeople);
  }, [birthdayName]);

  const handleDragStart = () => {
    setIsCutting(true);
    onPlaySFX('slice');
    setTimeout(() => {
      setIsCutting(false);
    }, 800);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const sliceElement = document.getElementById('cake-slice');
    if (!sliceElement) return;

    const sliceRect = sliceElement.getBoundingClientRect();
    const centerX = sliceRect.left + sliceRect.width / 2;
    const centerY = sliceRect.top + sliceRect.height / 2;

    let fedSomeone = false;

    setPeople(prev => prev.map(person => {
      const personEl = document.getElementById(`person-${person.id}`);
      if (!personEl) return person;

      const personRect = personEl.getBoundingClientRect();
      const dist = Math.sqrt(
        Math.pow(centerX - (personRect.left + personRect.width / 2), 2) +
        Math.pow(centerY - (personRect.top + personRect.height / 2), 2)
      );

      if (dist < 80 && !person.fed) {
        fedSomeone = true;
        if (person.isBirthdayPerson) setBirthdayPersonFed(true);
        setFedCount(c => c + 1);
        setActiveMessage(`Yum! ${person.name} is happy!`);
        return { ...person, fed: true };
      }
      return person;
    }));

    if (fedSomeone) {
      onPlaySFX('pop');
      setCakeAnimation({
        scale: [1, 0.95, 1.05, 1],
        transition: { duration: 0.4 }
      });

      setShowSlice(false);
      setTimeout(() => {
        if (!birthdayPersonFed || fedCount < 5) {
            setShowSlice(true);
        }
      }, 800);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center bg-[#fdf2f2] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-[#d97706] rounded-full border-[16px] border-[#b45309] shadow-inner opacity-20"></div>
      </div>

      <div className="z-10 mt-12 text-center">
        <h2 className="text-3xl font-game text-orange-700 bg-white/80 px-6 py-2 rounded-full shadow-sm">{activeMessage}</h2>
      </div>

      <div className="relative flex-1 w-full max-w-3xl mx-auto flex items-center justify-center">
        {people.map((person, idx) => {
          const angle = (idx * 60) * (Math.PI / 180);
          const radius = window.innerWidth < 640 ? 120 : 220;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={person.id}
              id={`person-${person.id}`}
              className="absolute flex flex-col items-center"
              style={{ x, y }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <div className={`text-5xl sm:text-6xl p-4 bg-white rounded-full shadow-lg border-4 transition-all ${person.fed ? 'border-green-400 scale-110' : 'border-gray-100'}`}>
                {person.fed ? '😋' : person.avatar}
              </div>
              <span className={`mt-2 font-bold px-3 py-1 rounded-full text-sm sm:text-base ${person.isBirthdayPerson ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {person.name}
              </span>
              {person.fed && (
                 <motion.div 
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -40 }}
                    className="absolute text-2xl"
                 >❤️</motion.div>
              )}
            </motion.div>
          );
        })}

        <div className="relative z-20">
          <motion.div 
            className="w-48 h-48 sm:w-64 sm:h-64 bg-pink-100 rounded-full border-8 border-pink-300 shadow-xl flex items-center justify-center relative overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, ...cakeAnimation }}
          >
            {!showSlice && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[#fdf2f2] z-10"
                style={{ 
                  clipPath: 'polygon(50% 50%, 100% 10%, 100% 40%)',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                }}
              />
            )}

            <div className="absolute inset-4 border-4 border-dashed border-pink-200 rounded-full"></div>
            <div className="text-center z-0">
              <span className="block text-2xl sm:text-3xl font-game text-pink-600 mb-2">Happy Birthday</span>
              <span className="block text-3xl sm:text-4xl font-game text-pink-700 underline decoration-wavy decoration-blue-400">{birthdayName}</span>
            </div>
            
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-2">
                <div className="w-2 h-8 bg-blue-400 rounded-t-lg relative">
                    <div className="absolute -top-3 left-0 w-2 h-4 bg-orange-400 rounded-full animate-pulse"></div>
                </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isCutting && (
              <motion.div
                key="knife"
                initial={{ x: 60, y: -100, rotate: 45, opacity: 0 }}
                animate={{ 
                  x: [60, -20, 40, 0], 
                  y: [-100, 20, -10, 0],
                  rotate: [45, -30, 10, -15],
                  opacity: [0, 1, 1, 0] 
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute top-0 left-0 text-7xl z-50 pointer-events-none drop-shadow-2xl"
              >
                🔪
              </motion.div>
            )}
          </AnimatePresence>

          {showSlice && (
            <motion.div
              id="cake-slice"
              drag
              dragSnapToOrigin
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: 1.2, zIndex: 100 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-30"
            >
              <div className="text-6xl sm:text-7xl drop-shadow-lg filter">🍰</div>
              {!fedCount && (
                <div className="absolute -top-4 -right-4 bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-bounce whitespace-nowrap">Drag to cut!</div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {birthdayPersonFed && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-10 z-50"
        >
          <button
            onClick={onNext}
            className="bg-green-500 hover:bg-green-600 text-white font-game text-2xl px-12 py-4 rounded-full shadow-2xl transition-transform hover:scale-105"
          >
            Everyone is happy! Next ➡️
          </button>
        </motion.div>
      )}

      {birthdayPersonFed && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-pink-400 rounded-full"
                    initial={{ x: '50%', y: '50%' }}
                    animate={{ 
                        x: `${Math.random() * 100}%`, 
                        y: `${Math.random() * 100}%`,
                        opacity: [1, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                />
            ))}
          </div>
      )}
    </div>
  );
};
