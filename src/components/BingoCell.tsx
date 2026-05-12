import { motion, PanInfo, AnimatePresence } from 'motion/react';
import { VibeMode, BingoItem, UiStyle, FillStyle } from '../types';
import { RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { audioManager } from '../lib/audioManager';

interface BingoCellProps {
  item: BingoItem;
  mode: VibeMode;
  uiStyle: UiStyle;
  fillStyle: FillStyle;
  index: number;
  onToggle: () => void;
  onReroll: () => void;
}

export default function BingoCell({ item, mode, uiStyle, fillStyle, onToggle, onReroll, index }: BingoCellProps) {
  const [isRerolling, setIsRerolling] = useState(false);

  const handleDragEnd = (_: any, info: PanInfo) => {
    // If swiped down or left significantly, trigger reroll
    if (Math.abs(info.offset.y) > 100 || Math.abs(info.offset.x) > 100) {
      setIsRerolling(true);
      setTimeout(() => {
        onReroll();
        setIsRerolling(false);
      }, 300);
    }
  };

  const handleClick = () => {
    audioManager.playClick(mode);
    onToggle();
  };

  const getVisualEffect = () => {
    if (!item.isCompleted) return null;
    
    if (fillStyle === FillStyle.MINIMAL) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-current/10 pointer-events-none mix-blend-multiply"
        />
      );
    }
    
    if (fillStyle === FillStyle.BRUTALISM) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none"
        />
      );
    }

    if (fillStyle === FillStyle.STRIKETHROUGH) {
      return (
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--theme-strike)] pointer-events-none origin-left z-20"
        />
      );
    }

    if (fillStyle === FillStyle.MARKER) {
      return (
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-[60%] bg-[var(--theme-highlight)] mix-blend-multiply pointer-events-none origin-left z-0"
        />
      );
    }

    // Default fill style (category specific)
    const variation = index % 5;

    switch (mode) {
      case VibeMode.COMFORT: {
        const blobs = [
          '61% 39% 51% 49% / 44% 54% 46% 56%',
          '33% 67% 58% 42% / 63% 31% 69% 37%',
          '73% 27% 38% 62% / 37% 74% 26% 63%',
          '45% 55% 26% 74% / 57% 41% 59% 43%',
          '25% 75% 73% 27% / 47% 29% 71% 53%'
        ];
        const colors = ['#fde6e9', '#e6f0ef', '#fcf4dd', '#eae3f2', '#f6e7d9'];
        return (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-1 pointer-events-none opacity-50 mix-blend-multiply"
            style={{ 
              borderRadius: blobs[variation],
              backgroundColor: colors[variation]
            }}
          />
        );
      }
      case VibeMode.CHAOTIC: {
        const clipPaths = [
          'polygon(10% 25%, 95% 15%, 85% 90%, 5% 85%)',
          'polygon(0% 10%, 100% 0%, 90% 100%, 15% 95%)',
          'polygon(20% 0%, 80% 10%, 100% 80%, 10% 100%)',
          'polygon(5% 5%, 90% 20%, 95% 95%, 20% 80%)',
          'polygon(15% 15%, 100% 5%, 80% 100%, 0% 90%)'
        ];
        return (
          <motion.div 
            initial={{ scaleX: 0, opacity: 0, rotate: -20 }}
            animate={{ scaleX: 1, opacity: 1, rotate: variation * 10 - 20 }}
            className="absolute inset-1 bg-[#00ff41] pointer-events-none mix-blend-difference opacity-40 origin-left"
            style={{ clipPath: clipPaths[variation] }}
          />
        );
      }
      case VibeMode.AESTHETIC: {
        const tapes = [
          { rot: -5, y: '30%', h: '40%', w: '110%', l: '-5%', bg: '#e0d5c1' },
          { rot: 3, y: '40%', h: '35%', w: '120%', l: '-10%', bg: '#d1c0b3' },
          { rot: -2, y: '50%', h: '30%', w: '105%', l: '-2%', bg: '#c7bca1' },
          { rot: 7, y: '20%', h: '50%', w: '100%', l: '0%', bg: '#dfd2c4' },
          { rot: -8, y: '35%', h: '45%', w: '115%', l: '-7%', bg: '#d4c7ba' }
        ];
        const t = tapes[variation];
        return (
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            className="absolute pointer-events-none mix-blend-multiply opacity-50 origin-left"
            style={{ 
              top: t.y, left: t.l, width: t.w, height: t.h, 
              backgroundColor: t.bg, rotate: `${t.rot}deg` 
            }}
          />
        );
      }
      case VibeMode.NATURE: {
        const blobs = [
          '61% 39% 51% 49% / 44% 54% 46% 56%',
          '33% 67% 58% 42% / 63% 31% 69% 37%',
          '80% 20% 80% 20% / 20% 80% 20% 80%',
          '30% 70% 70% 30% / 30% 30% 70% 70%',
          '50% 50% 10% 90% / 90% 10% 50% 50%'
        ];
        const colors = ['#8ca86e', '#6e8a50', '#a3b88b', '#7b965c', '#9bb582'];
        return (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            className="absolute inset-[10%] pointer-events-none mix-blend-multiply"
            style={{ 
              borderRadius: blobs[variation],
              backgroundColor: colors[variation],
              rotate: `${variation * 45}deg`
            }}
          />
        );
      }
      case VibeMode.DARK_ACADEMIA: {
        const rings = [
          { rx: '50%', ry: '40%', rot: -10, p: 2 },
          { rx: '45%', ry: '55%', rot: 15, p: 1 },
          { rx: '55%', ry: '50%', rot: -5, p: 3 },
          { rx: '40%', ry: '60%', rot: 25, p: 2 },
          { rx: '60%', ry: '45%', rot: -20, p: 1 }
        ];
        const r = rings[variation];
        return (
           <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute pointer-events-none opacity-80 mix-blend-overlay"
            style={{ 
               inset: `${r.p}px`,
               border: '2px solid #8b0000',
               borderRadius: `${r.rx} ${r.ry} ${r.ry} ${r.rx} / ${r.ry} ${r.rx} ${r.rx} ${r.ry}`,
               transform: `rotate(${r.rot}deg)`
            }}
          />
        );
      }
    }
  };

  const getStyleClasses = () => {
    switch (uiStyle) {
      case UiStyle.MINIMAL:
        return 'bg-transparent border border-[var(--theme-text)] border-opacity-30 hover:border-opacity-50 rounded-sm';
      case UiStyle.BRUTALISM:
        return 'bg-[var(--theme-bg)] border-2 border-[var(--theme-text)] shadow-[3px_3px_0px_0px_var(--theme-text)] text-[var(--theme-text)] rounded-none';
      case UiStyle.GLASS:
        return 'bg-[var(--theme-card)]/50 backdrop-blur-xl border border-[var(--theme-accent)]/30 shadow-[0_4px_16px_rgba(0,0,0,0.1)] rounded-2xl';
      case UiStyle.CLAY:
        return 'bg-current/5 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.4),inset_-3px_-3px_5px_rgba(0,0,0,0.1)] rounded-3xl border-none';
      default:
        switch (mode) {
          case VibeMode.COMFORT:
            return 'bg-[var(--theme-card)] shadow-sm border-2 border-[var(--theme-accent)] rounded-[24px] hover:shadow-md';
          case VibeMode.CHAOTIC:
            return `bg-[var(--theme-card)] border border-[var(--theme-accent)] shadow-[2px_2px_0px_0px_var(--theme-accent)] rounded-sm transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`;
          case VibeMode.AESTHETIC:
            return 'bg-[var(--theme-card)] border border-[var(--theme-accent)] shadow-[1px_1px_3px_rgba(0,0,0,0.05)] rounded-sm';
          case VibeMode.NATURE:
            return `bg-[var(--theme-card)] border border-[var(--theme-accent)] shadow-sm ${
              index % 3 === 0 ? 'rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm' : 
              index % 3 === 1 ? 'rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm' : 
              'rounded-xl'
            }`;
          case VibeMode.DARK_ACADEMIA:
            return 'bg-[var(--theme-card)] border border-[var(--theme-accent)] shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] rounded-none';
          default:
            return '';
        }
    }
  };

  return (
    <motion.div
      id={`cell-${item.id}`}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isRerolling ? 0 : 1, 
        scale: isRerolling ? 0.8 : 1,
        transition: { delay: index * 0.02 }
      }}
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.4}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={`
        relative aspect-square p-1 sm:p-2 flex items-center justify-center text-center cursor-pointer
        transition-all duration-500 overflow-hidden group
        ${getStyleClasses()}
      `}
    >
      <AnimatePresence>
        {getVisualEffect()}
      </AnimatePresence>

      <span 
        className={`
          w-full h-full px-0.5
          leading-[1.1] flex items-center justify-center relative z-10 
          break-words transition-all duration-700 delay-100 overflow-hidden text-ellipsis
          ${item.isCompleted && item.text !== '★' && uiStyle !== UiStyle.BRUTALISM ? 'opacity-40' : 'opacity-100'}
          ${item.text === '★' ? 'text-2xl sm:text-3xl filter drop-shadow-md' : 'text-inherit'}
          ${mode === VibeMode.CHAOTIC && item.text !== '★' ? 'uppercase tracking-tighter' : ''}
        `}
        style={{ overflowWrap: 'anywhere', hyphens: 'auto' }}
      >
        {item.text}
      </span>

      {/* Swipe Indicator Hint */}
      {item.text !== '★' ? (
        <div className={`absolute top-1 right-1 transition-opacity ${uiStyle === UiStyle.BRUTALISM ? 'opacity-50' : 'opacity-10 group-hover:opacity-100'}`}>
          <RefreshCcw size={8} />
        </div>
      ) : (
        <div className={`absolute top-1 right-1 opacity-0 group-hover:opacity-60 transition-opacity flex items-center justify-center p-1 rounded-full bg-black/5`}>
          <RefreshCcw size={10} />
        </div>
      )}
    </motion.div>
  );
}
