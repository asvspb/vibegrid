/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VibeMode, BingoItem, UiStyle, FillStyle, FontStyle, ColorTheme } from './types';
import { THEME_CONFIG, MOCK_ITEMS } from './constants';
import ModeSelector from './components/ModeSelector';
import BingoGrid from './components/BingoGrid';
import { generateBingoItems } from './services/geminiService';
import { Sparkles, Loader2, Download, BookHeart, Settings2 } from 'lucide-react';
import { useToast } from './lib/ToastContext';
import * as htmlToImage from 'html-to-image';
import VibeDiary from './components/VibeDiary';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [mode, setMode] = useState<VibeMode | null>(null);
  const [items, setItems] = useState<BingoItem[]>([]);
  const [gridTitle, setGridTitle] = useState<string>('');
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDiary, setShowDiary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [uiStyle, setUiStyle] = useState<UiStyle>(() => {
    return (localStorage.getItem('vibe_uistyle') as UiStyle) || UiStyle.DEFAULT;
  });
  const [fillStyle, setFillStyle] = useState<FillStyle>(() => {
    return (localStorage.getItem('vibe_fillstyle') as FillStyle) || FillStyle.DEFAULT;
  });
  const [fontStyle, setFontStyle] = useState<FontStyle>(() => {
    return (localStorage.getItem('vibe_fontstyle') as FontStyle) || FontStyle.DEFAULT;
  });
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    return (localStorage.getItem('vibe_colortheme') as ColorTheme) || ColorTheme.AUTO;
  });
  const [fontSize, setFontSize] = useState<number>(() => {
    const val = localStorage.getItem('vibe_fontsize');
    return val !== null ? Number(val) : 11;
  });
  const [cellSpacing, setCellSpacing] = useState<number>(() => {
    const val = localStorage.getItem('vibe_cellspacing');
    return val !== null ? Number(val) : 8; // default gap-2 is 8px
  });
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('vibe_uistyle', uiStyle);
  }, [uiStyle]);

  useEffect(() => {
    localStorage.setItem('vibe_fillstyle', fillStyle);
  }, [fillStyle]);

  useEffect(() => {
    localStorage.setItem('vibe_fontstyle', fontStyle);
  }, [fontStyle]);

  useEffect(() => {
    localStorage.setItem('vibe_colortheme', colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    localStorage.setItem('vibe_fontsize', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('vibe_cellspacing', cellSpacing.toString());
  }, [cellSpacing]);

  // Apply theme class to body
  useEffect(() => {
    if (mode) {
      const baseClass = THEME_CONFIG[mode].className;
      const themeClass = colorTheme === ColorTheme.AUTO ? baseClass : `${baseClass} color-theme-${colorTheme}`;
      document.body.className = themeClass;
    } else {
      document.body.className = 'bg-gradient-to-br from-[#fff0f5] via-[#ffe4e1] to-[#fdf8ff] text-[#5c4a52] flex items-center justify-center min-h-screen font-sans';
    }
  }, [mode, colorTheme]);

  const generateGrid = async (selectedMode: VibeMode, useAI = false) => {
    setIsLoading(true);
    let texts: string[] = [];
    let title = '';
    
    if (useAI) {
      const res = await generateBingoItems(selectedMode);
      if (res) {
        texts = res.items;
        title = res.title;
      }
    }
    
    if (texts.length === 0) {
      const pool = MOCK_ITEMS[selectedMode];
      texts = [...pool].sort(() => 0.5 - Math.random()).slice(0, 24);
      title = THEME_CONFIG[selectedMode]?.question || 'Бинго';
    }
    
    // Insert "★" at index 12 if texts array is 24 items
    if (texts.length === 24) {
      texts.splice(12, 0, '★');
    }

    const initialItems = texts.map((text, index) => {
      // Free space in the center
      if (text === '★' && index === 12) {
        return {
          id: `cell-${index}-${Date.now()}`,
          text: '★',
          isCompleted: true,
          category: selectedMode
        };
      }
      return {
        id: `cell-${index}-${Date.now()}`,
        text,
        isCompleted: false,
        category: selectedMode
      };
    });
    
    setItems(initialItems);
    setGridTitle(title);
    setIsAIGenerated(useAI && texts.length > 0);
    setMode(selectedMode);
    setIsLoading(false);
  };

  const handleReroll = (id: string) => {
    if (!mode) return;
    const itemToReroll = items.find(i => i.id === id);
    if (itemToReroll?.text === '★') return; // Cannot reroll free space

    const pool = MOCK_ITEMS[mode];
    const currentTexts = items.map(i => i.text);
    const available = pool.filter(t => !currentTexts.includes(t) && t !== '★');
    
    if (available.length > 0) {
      const newItemText = available[Math.floor(Math.random() * available.length)];
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, text: newItemText, isCompleted: false } : item
      ));
    }
  };

  const toggleComplete = (id: string) => {
    const itemToToggle = items.find(i => i.id === id);
    if (itemToToggle?.text === '★') {
      if (mode) {
        generateGrid(mode, isAIGenerated);
      }
      return;
    }

    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
    
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleExport = async () => {
    const gridEl = document.getElementById('bingo-wrapper');
    if (!gridEl) return;
    try {
      showToast('Генерируем картинку...', 2000);
      const dataUrl = await htmlToImage.toPng(gridEl, { 
        pixelRatio: 2,
        backgroundColor: 'var(--color-' + mode + '-bg)' 
      });
      const dlLink = document.createElement('a');
      dlLink.download = `vibegrid-${Date.now()}.png`;
      dlLink.href = dataUrl;
      dlLink.click();
      showToast('Карточка сохранена! ✨');
    } catch (err) {
      console.error("Export error:", err);
      showToast('Не удалось сохранить картинку 😢');
    }
  };

  const handleSaveToDiary = () => {
    const diary = JSON.parse(localStorage.getItem('vibe_diary') || '[]');
    diary.push({ date: new Date().toISOString(), mode, items });
    localStorage.setItem('vibe_diary', JSON.stringify(diary.slice(-20))); // Keep last 20
    showToast('Твой вайб сохранен в дневник ✨');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4">
      <AnimatePresence>
        {showSettings && (
          <SettingsModal 
            key="settings" 
            onClose={() => setShowSettings(false)} 
            uiStyle={uiStyle} 
            setUiStyle={setUiStyle} 
            fillStyle={fillStyle}
            setFillStyle={setFillStyle}
            fontStyle={fontStyle}
            setFontStyle={setFontStyle}
            colorTheme={colorTheme}
            setColorTheme={setColorTheme}
            fontSize={fontSize}
            setFontSize={setFontSize}
            cellSpacing={cellSpacing}
            setCellSpacing={setCellSpacing}
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {showDiary ? (
          <VibeDiary key="diary" onClose={() => setShowDiary(false)} uiStyle={uiStyle} fillStyle={fillStyle} fontStyle={fontStyle} fontSize={fontSize} cellSpacing={cellSpacing} />
        ) : isLoading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center space-y-4"
          >
            <div className="relative">
              <Loader2 className="animate-spin text-pink-400" size={56} />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-300" size={20} />
            </div>
            <p className="text-[15px] font-medium text-pink-500 tracking-wide">Собираем эстетику... ✨</p>
          </motion.div>
        ) : !mode ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center w-full max-w-md"
          >
            <ModeSelector 
              onSelect={(m) => generateGrid(m, false)} 
              onOpenDiary={() => setShowDiary(true)} 
              onOpenSettings={() => setShowSettings(true)}
            />
            
              {/* <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1 } }}
              onClick={() => {
                const modes = Object.values(VibeMode);
                const randomMode = modes[Math.floor(Math.random() * modes.length)];
                generateGrid(randomMode, true);
              }}
              className="mt-12 flex items-center space-x-2 px-6 py-3 bg-pink-100 text-pink-600 rounded-full text-[13px] font-bold uppercase tracking-widest hover:bg-pink-200 hover:text-pink-700 transition-all shadow-[0_4px_12px_rgba(244,143,177,0.2)] hover:shadow-[0_6px_16px_rgba(244,143,177,0.3)]"
             >
              <Sparkles size={16} />
              <span>Довериться ИИ ✨</span>
            </motion.button> */}
          </motion.div>
        ) : (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md flex-1 flex flex-col"
          >
            <header className="py-8 flex flex-col items-center space-y-2 relative">
              <button 
                onClick={() => setShowSettings(true)}
                className="absolute top-8 right-0 p-3 opacity-40 hover:opacity-100 transition-opacity"
                title="Настройки визуала"
              >
                <Settings2 size={24} />
              </button>
              <button 
                onClick={() => setMode(null)}
                className="absolute top-8 left-0 p-3 opacity-40 hover:opacity-100 transition-opacity"
                title="Главное меню"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button 
                className="text-4xl hover:scale-110 transition-transform cursor-pointer"
              >
                {THEME_CONFIG[mode].icon}
              </button>
              <h1 className="text-3xl font-black uppercase tracking-widest text-center mt-2">
                {THEME_CONFIG[mode].title}
              </h1>
              {gridTitle && (
                <h2 className="text-lg font-medium tracking-tight mt-1 text-center px-4">
                  {gridTitle}
                </h2>
              )}
              <p className="text-sm opacity-60 text-center max-w-[280px] leading-relaxed">
                {THEME_CONFIG[mode].subtext}
              </p>
            </header>

            <div id="bingo-wrapper" className="w-full relative px-2 pt-6 pb-12 rounded-3xl" style={{ backgroundColor: 'var(--color-' + mode + '-bg)' }}>
              <div className="absolute top-4 right-4 text-[10px] opacity-30 font-medium tracking-widest uppercase">
                @vibegrid
              </div>
              <BingoGrid 
                items={items} 
                mode={mode} 
                uiStyle={uiStyle}
                fillStyle={fillStyle}
                fontStyle={fontStyle}
                fontSize={fontSize}
                cellSpacing={cellSpacing}
                onToggle={toggleComplete} 
                onReroll={handleReroll}
              />
            </div>

            <footer className="mt-8 py-8 flex flex-col items-center space-y-4">
              <div className="flex bg-black/5 rounded-full p-1 backdrop-blur-sm shadow-inner">
                 <button 
                  onClick={handleSaveToDiary}
                  title="Сохранить в дневник"
                  className="flex items-center justify-center p-3 rounded-full hover:bg-white/50 transition-colors"
                >
                  <BookHeart size={18} className="opacity-80" />
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  title="Настройки визуала"
                  className="flex items-center justify-center p-3 rounded-full hover:bg-white/50 transition-colors"
                >
                  <Settings2 size={18} className="opacity-80" />
                </button>
                <button 
                  onClick={handleExport}
                  title="Скачать картинку"
                  className="flex items-center justify-center p-3 rounded-full hover:bg-white/50 transition-colors"
                >
                  <Download size={18} className="opacity-80" />
                </button>
              </div>
              
              <button 
                onClick={() => setMode(null)}
                className="mt-6 px-6 py-2 rounded-full border border-current opacity-20 hover:opacity-100 transition-all text-[11px] font-semibold uppercase tracking-widest"
              >
                Вернуться назад
              </button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


