import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../firebase';
import { useToast } from '../lib/ToastContext';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        showToast('Успешный вход! ✨');
      } else {
        const userCredential = await signUpWithEmail(email, password);
        if (name && userCredential.user) {
          const { updateProfile } = await import('firebase/auth');
          await updateProfile(userCredential.user, { displayName: name });
        }
        showToast('Аккаунт создан! ✨');
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        showToast('Неверный логин или пароль');
      } else if (err.code === 'auth/email-already-in-use') {
        showToast('Этот email уже используется');
      } else if (err.code === 'auth/weak-password') {
        showToast('Пароль слишком простой');
      } else if (err.code === 'auth/operation-not-allowed') {
        showToast('Вход по email отключен в Firebase Console');
      } else {
        showToast('Ошибка авторизации 😢');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      showToast('Успешный вход! ✨');
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-blocked') {
        showToast('Окно заблокировано браузером. Открой приложение в новой вкладке!');
      } else if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        showToast('Ошибка авторизации');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0f0c13]/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#1f1926] text-[#f4ebf8] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-2xl font-black uppercase tracking-tight">{isLogin ? 'С возвращением' : 'Присоединяйся'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="opacity-60" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Имя</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all font-medium backdrop-blur-sm"
                    placeholder="Твое имя"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all font-medium backdrop-blur-sm"
                  placeholder="hello@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all font-medium backdrop-blur-sm"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:opacity-90 disabled:opacity-50 flex justify-center items-center shadow-lg transition-all"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : isLogin ? 'Войти' : 'Создать аккаунт'}
            </button>
          </form>

          <div className="relative pt-2 pb-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#1f1926] text-white/40 uppercase tracking-widest font-bold">Или</span>
            </div>
          </div>

          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 disabled:opacity-50 flex justify-center items-center space-x-3 transition-colors shadow-md"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Войти через Google</span>
          </button>
          
          <div className="text-center mt-6 h-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-semibold uppercase tracking-wide text-white/50 hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
            >
              {isLogin ? 'Нет аккаунта? Создать' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
