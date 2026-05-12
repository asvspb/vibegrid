import { motion } from 'motion/react';
import { VibeMode } from '../types';
import { THEME_CONFIG } from '../constants';
import { BookHeart, Settings2 } from 'lucide-react';

interface ModeSelectorProps {
  onSelect: (mode: VibeMode) => void;
  onOpenDiary: () => void;
  onOpenSettings: () => void;
}

export default function ModeSelector({ onSelect, onOpenDiary, onOpenSettings }: ModeSelectorProps) {
  const modes = Object.entries(THEME_CONFIG) as [VibeMode, typeof THEME_CONFIG[VibeMode]][];

  return (
    <div className="flex flex-col items-center space-y-10 w-full pt-6 relative">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onOpenSettings}
        className="absolute top-0 left-4 p-3 rounded-full hover:bg-pink-100/50 transition-colors opacity-60 hover:opacity-100 text-pink-400"
      >
        <Settings2 size={24} />
      </motion.button>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onOpenDiary}
        className="absolute top-0 right-4 p-3 rounded-full hover:bg-pink-100/50 transition-colors opacity-60 hover:opacity-100 text-pink-400"
      >
        <BookHeart size={24} />
      </motion.button>
      <header className="text-center space-y-3 px-4">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="inline-block mb-2 bg-pink-100 text-pink-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm"
        >
          vibe check ✨
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-medium text-pink-800 tracking-tight"
        >
          Что у тебя на душе? 🌸
        </motion.h2>
      </header>

      <div className="grid grid-cols-1 gap-5 w-full max-w-sm px-4">
        {modes.map(([id, config], index) => (
          <motion.button
            key={id}
            id={`mode-select-${id}`}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              transition: { delay: index * 0.1 }
            }}
            onClick={() => onSelect(id)}
            className={`
              flex items-center space-x-4 p-5 rounded-[2rem] text-left transition-all
              bg-white/80 backdrop-blur-md shadow-[0_8px_20px_rgba(244,143,177,0.15)] 
              border-2 border-transparent hover:border-pink-200 hover:bg-white hover:shadow-[0_12px_25px_rgba(244,143,177,0.25)]
            `}
          >
            <span className="text-4xl drop-shadow-sm">{config.icon}</span>
            <div>
              <h3 className="font-semibold text-pink-900 leading-tight text-[17px]">
                {config.question}
              </h3>
              <p className="text-[13px] text-pink-500/80 mt-1.5 font-medium leading-snug">
                {config.subtext}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
