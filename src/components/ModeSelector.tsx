import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VibeMode } from '../types';
import { THEME_CONFIG } from '../constants';
import { BookHeart, Settings2, LogIn, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { signOut } from '../firebase';
import { useToast } from '../lib/ToastContext';
import AuthModal from './AuthModal';

interface ModeSelectorProps {
  onSelect: (mode: VibeMode) => void;
  onOpenDiary: () => void;
  onOpenSettings: () => void;
}

export default function ModeSelector({ onSelect, onOpenDiary, onOpenSettings }: ModeSelectorProps) {
  const modes = Object.entries(THEME_CONFIG) as [VibeMode, typeof THEME_CONFIG[VibeMode]][];
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuth = async () => {
    if (isAuthLoading || loading) return;
    
    if (user) {
      setIsAuthLoading(true);
      try {
        await signOut();
        showToast('Вы вышли из профиля');
      } catch (err) {
        showToast('Ошибка при выходе');
        console.error(err);
      } finally {
        setIsAuthLoading(false);
      }
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen relative overflow-hidden py-12 px-4 z-10 w-full max-w-2xl mx-auto">
      {/* Top Navigation */}
      <nav className="w-full flex items-center justify-between mb-12 relative z-20">
        <div className="flex w-1/3 justify-start">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleAuth}
            disabled={isAuthLoading || loading}
            className={`flex items-center justify-center w-12 h-12 rounded-full border border-white/10 transition-colors disabled:opacity-30 ${user ? 'bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 font-bold text-lg border-pink-400/30' : 'bg-white/5 hover:bg-white/10'}`}
            title={user ? "Выход" : "Войти"}
          >
            {isAuthLoading ? <Loader2 size={18} className="animate-spin text-white/70" /> : user ? (user.displayName?.[0] || user.email?.[0] || 'V').toUpperCase() : <LogIn size={18} className="text-white/70" />}
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center w-1/3"
        >
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.04em" }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">VIBE</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">BINGO</span>
          </h1>
        </motion.div>

        <div className="flex space-x-3 w-1/3 justify-end">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
            onClick={onOpenSettings}
            title="Настройки"
            className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-colors"
          >
            <Settings2 size={18} className="text-white/70" />
          </motion.button>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.15 } }}
            onClick={onOpenDiary}
            title="Дневник"
            className="flex items-center justify-center w-12 h-12 rounded-full border border-pink-400/30 bg-pink-500/10 hover:bg-pink-500/20 backdrop-blur-md transition-colors"
          >
            <BookHeart size={18} className="text-pink-300" />
          </motion.button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="text-center space-y-4 mb-16 w-full relative z-20">
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="inline-flex items-center justify-center px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">ВЫБЕРИ СВОЙ ВАЙБ</span>
        </motion.div>
      </header>

      {/* Grid of Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full relative z-20">
        {modes.map(([id, config], index) => (
          <motion.button
            key={id}
            id={`mode-select-${id}`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.2 + (index * 0.05) }
            }}
            onClick={() => onSelect(id)}
            className="flex flex-col text-left p-6 rounded-3xl transition-all border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group"
          >
            {/* Ambient glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <span className="text-5xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{config.icon}</span>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity group-hover:bg-white/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </div>

            <div className="relative z-10 mt-auto">
              <h3 className="font-bold text-xl tracking-tight text-white/90 mb-1">
                {config.question}
              </h3>
              <p className="text-sm text-white/50 font-medium leading-relaxed">
                {config.subtext}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
