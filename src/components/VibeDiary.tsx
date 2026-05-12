import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VibeMode, BingoItem, UiStyle, FillStyle, FontStyle } from '../types';
import { THEME_CONFIG } from '../constants';
import { X, Calendar, Trash2, ChevronLeft } from 'lucide-react';
import BingoGrid from './BingoGrid';

interface DiaryEntry {
  date: string;
  mode: VibeMode;
  items: BingoItem[];
}

interface VibeDiaryProps {
  onClose: () => void;
  uiStyle: UiStyle;
  fillStyle: FillStyle;
  fontStyle: FontStyle;
}

export default function VibeDiary({ onClose, uiStyle, fillStyle, fontStyle }: VibeDiaryProps) {
  const [diary, setDiary] = useState<DiaryEntry[]>(() => {
    const stored = JSON.parse(localStorage.getItem('vibe_diary') || '[]');
    return stored.sort((a: DiaryEntry, b: DiaryEntry) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);

  const handleDelete = (idx: number) => {
    if (confirmDeleteIdx === idx) {
      const newDiary = [...diary];
      newDiary.splice(idx, 1);
      setDiary(newDiary);
      localStorage.setItem('vibe_diary', JSON.stringify(newDiary));
      setSelectedIdx(null);
      setConfirmDeleteIdx(null);
    } else {
      setConfirmDeleteIdx(idx);
      setTimeout(() => {
        setConfirmDeleteIdx((prev) => prev === idx ? null : prev);
      }, 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute inset-0 z-40 bg-[#fafafa] flex flex-col p-6 overflow-y-auto font-sans"
    >
      <AnimatePresence mode="wait">
        {selectedIdx !== null ? (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-md w-full mx-auto flex flex-col h-full pb-12"
          >
            <header className="flex items-center justify-between py-6">
              <button 
                onClick={() => setSelectedIdx(null)} 
                className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors flex items-center text-sm font-medium opacity-60 hover:opacity-100"
              >
                <ChevronLeft size={20} className="mr-1" />
                Назад
              </button>
              <button 
                onClick={() => handleDelete(selectedIdx)} 
                className={`p-2 rounded-full transition-colors flex items-center space-x-1 font-medium text-sm ${
                  confirmDeleteIdx === selectedIdx 
                    ? 'bg-red-500 text-white hover:bg-red-600 px-3' 
                    : 'hover:bg-red-50 text-red-400 hover:text-red-600'
                }`}
                title="Удалить запись"
              >
                {confirmDeleteIdx === selectedIdx ? (
                  <>
                    <span>Удалить?</span>
                  </>
                ) : (
                  <Trash2 size={20} />
                )}
              </button>
            </header>

            <div className="flex-1 flex flex-col items-center">
              <div className="text-center mb-8">
                <span className="text-4xl">{THEME_CONFIG[diary[selectedIdx].mode].icon}</span>
                <p className="mt-2 text-xs font-mono opacity-50 uppercase">
                  {new Date(diary[selectedIdx].date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <h3 className="font-medium text-lg mt-1 text-gray-800">
                  {THEME_CONFIG[diary[selectedIdx].mode].question}
                </h3>
              </div>
              
              <div 
                className="w-full relative px-2 pt-6 pb-12 rounded-3xl pointer-events-none" 
                style={{ backgroundColor: `var(--color-${diary[selectedIdx].mode}-bg)` }}
              >
                <div className="absolute top-4 right-4 text-[10px] opacity-30 font-medium tracking-widest uppercase">
                  @vibegrid
                </div>
                <BingoGrid 
                  items={diary[selectedIdx].items} 
                  mode={diary[selectedIdx].mode} 
                  uiStyle={uiStyle}
                  fillStyle={fillStyle}
                  fontStyle={fontStyle}
                  onToggle={() => {}} 
                  onReroll={() => {}}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="max-w-md w-full mx-auto"
          >
            <header className="flex items-center justify-between py-6">
              <h2 className="text-2xl font-serif text-gray-800">Дневник состояний</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors">
                <X size={24} className="opacity-60 text-black" />
              </button>
            </header>

            {diary.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center opacity-40 mt-32">
                <Calendar size={48} className="mb-4" />
                <p className="text-sm">Тут пока пусто. Сохрани свой первый вайб.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 pb-20">
                {diary.map((entry, idx) => {
                  const completedCount = entry.items.filter(i => i.isCompleted && i.text !== '★').length;
                  const config = THEME_CONFIG[entry.mode];
                  const d = new Date(entry.date);
                  const dateStr = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

                  return (
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      key={idx} 
                      onClick={() => setSelectedIdx(idx)}
                      className="p-5 rounded-3xl border border-black/5 bg-white shadow-sm flex items-center justify-between text-left hover:shadow-md transition-all group"
                    >
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xl">{config.icon}</span>
                          <h3 className="font-medium text-gray-800 text-sm">{config.question}</h3>
                        </div>
                        <div className="flex items-center space-x-3 text-xs opacity-50 mt-2">
                          <span className="font-mono uppercase">{dateStr}</span>
                          <span>•</span>
                          <span>Собрано: {completedCount}/24</span>
                        </div>
                      </div>
                      <ChevronLeft size={20} className="opacity-20 group-hover:opacity-60 transition-opacity rotate-180" />
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
