import { motion, AnimatePresence } from 'motion/react';
import { VibeMode, BingoItem, UiStyle, FillStyle, FontStyle } from '../types';
import BingoCell from './BingoCell';
import { useMemo } from 'react';

interface BingoGridProps {
  items: BingoItem[];
  mode: VibeMode;
  uiStyle: UiStyle;
  fillStyle: FillStyle;
  fontStyle?: FontStyle; // optional for backwards compatibility
  fontSize?: number;
  cellSpacing?: number;
  onToggle: (id: string) => void;
  onReroll: (id: string) => void;
}

export default function BingoGrid({ items, mode, uiStyle, fillStyle, fontStyle = FontStyle.DEFAULT, fontSize = 11, cellSpacing = 8, onToggle, onReroll }: BingoGridProps) {
  const winLines = useMemo(() => {
    const lines = [];
    // Rows
    for (let i = 0; i < 5; i++) {
      lines.push([i*5, i*5+1, i*5+2, i*5+3, i*5+4]);
    }
    // Cols
    for (let i = 0; i < 5; i++) {
      lines.push([i, i+5, i+10, i+15, i+20]);
    }
    // Diagonals
    lines.push([0, 6, 12, 18, 24]);
    lines.push([4, 8, 12, 16, 20]);
    
    return lines.filter(line => line.every(idx => items[idx]?.isCompleted));
  }, [items]);

  const hasBingo = winLines.length > 0;

  const fontClass = fontStyle === FontStyle.DEFAULT ? '' : 
    fontStyle === FontStyle.PLAYFAIR ? 'font-playfair' : 
    fontStyle === FontStyle.SPACE ? 'font-space' : 
    fontStyle === FontStyle.CAVEAT ? 'font-caveat' : 
    fontStyle === FontStyle.SYNE ? 'font-syne' : '';

  return (
    <div className={`relative w-full max-w-lg mx-auto ${fontClass}`} style={{ fontSize: `${fontSize}px` }}>
      <div 
        className="grid grid-cols-5 aspect-square relative"
        style={{ gap: `${cellSpacing}px` }}
      >
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <BingoCell
              key={item.id}
              item={item}
              mode={mode}
              uiStyle={uiStyle}
              fillStyle={fillStyle}
              onToggle={() => onToggle(item.id)}
              onReroll={() => onReroll(item.id)}
              index={index}
            />
          ))}
        </AnimatePresence>

        {/* Victory Overlay / Soft Message */}
        <AnimatePresence>
          {hasBingo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -bottom-16 inset-x-0 flex flex-col items-center pointer-events-none"
            >
              <motion.span 
                animate={{ 
                  y: [0, -5, 0],
                  transition: { repeat: Infinity, duration: 3 }
                }}
                className="text-sm font-medium opacity-80 italic text-center px-4"
              >
                {mode === VibeMode.COMFORT && "Ты справляешься. Отдохни немного."}
                {mode === VibeMode.CHAOTIC && "Хаос упорядочен. На сегодня хватит."}
                {mode === VibeMode.AESTHETIC && "Твой вайб прекрасен. Сохрани этот момент."}
                {mode === VibeMode.NATURE && "Ты заземлился. Дышится легче."}
                {mode === VibeMode.DARK_ACADEMIA && "Глава завершена. Закрываем книгу."}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SVG Container for connecting lines (Soft rewards) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
        {winLines.map((line, i) => {
          const startIdx = line[0];
          const endIdx = line[4];
          const startX = (startIdx % 5) * 20 + 10;
          const startY = Math.floor(startIdx / 5) * 20 + 10;
          const endX = (endIdx % 5) * 20 + 10;
          const endY = Math.floor(endIdx / 5) * 20 + 10;

          let strokeColor = "#8b7355"; // Comfort/Aesthetic
          if (mode === VibeMode.CHAOTIC) strokeColor = "#00ff41";
          if (mode === VibeMode.NATURE) strokeColor = "#556b2f";
          if (mode === VibeMode.DARK_ACADEMIA) strokeColor = "#cfa86e";

          return (
            <motion.line
              key={`line-${i}`}
              x1={`${startX}%`}
              y1={`${startY}%`}
              x2={`${endX}%`}
              y2={`${endY}%`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              stroke={strokeColor}
              strokeWidth="3"
              strokeDasharray="4 4"
              className="mix-blend-multiply opacity-40"
            />
          );
        })}
      </svg>
    </div>
  );
}

