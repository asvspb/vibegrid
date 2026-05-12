import { motion } from 'motion/react';
import { X, Check } from 'lucide-react';
import { UiStyle, FillStyle, FontStyle, ColorTheme } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  uiStyle: UiStyle;
  setUiStyle: (style: UiStyle) => void;
  fillStyle: FillStyle;
  setFillStyle: (style: FillStyle) => void;
  fontStyle: FontStyle;
  setFontStyle: (style: FontStyle) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  cellSpacing: number;
  setCellSpacing: (spacing: number) => void;
}

const UI_STYLES = [
  { id: UiStyle.DEFAULT, name: 'Авторский', desc: 'Оригинальный вайб каждой категории' },
  { id: UiStyle.MINIMAL, name: 'Минимализм', desc: 'Тонкие линии, ничего лишнего' },
  { id: UiStyle.BRUTALISM, name: 'Необрутализм', desc: 'Жесткие тени, рамки и максимальный контраст' },
  { id: UiStyle.GLASS, name: 'Глассморфизм', desc: 'Ощущение матового стекла' },
  { id: UiStyle.CLAY, name: 'Клейморфизм', desc: 'Мягкий, приятный 3D объем' },
];

const FILL_STYLES = [
  { id: FillStyle.DEFAULT, name: 'Авторский', desc: 'Оригинальные фигурки и пятна' },
  { id: FillStyle.STRIKETHROUGH, name: 'Зачеркивание', desc: 'Просто зачеркнутый текст' },
  { id: FillStyle.MARKER, name: 'Маркер', desc: 'Выделение желтым неоном' },
  { id: FillStyle.MINIMAL, name: 'Легкий фон', desc: 'Едва заметная заливка цветом текста' },
  { id: FillStyle.BRUTALISM, name: 'Ядреный черный', desc: 'Плотная черная заливка' },
];

const FONT_STYLES = [
  { id: FontStyle.DEFAULT, name: 'Классика', desc: 'Чистый и читаемый', className: 'font-sans' },
  { id: FontStyle.PLAYFAIR, name: 'Элегантный', desc: 'С засечками, как в книгах', className: 'font-playfair' },
  { id: FontStyle.SPACE, name: 'Современный', desc: 'Широкий и геометричный', className: 'font-space' },
  { id: FontStyle.CAVEAT, name: 'Рукописный', desc: 'Словно написано ручкой', className: 'font-caveat text-xl leading-none' },
  { id: FontStyle.SYNE, name: 'Арт-хаус', desc: 'Необычный и стильный', className: 'font-syne' },
];

const COLOR_THEMES = [
  { id: ColorTheme.AUTO, name: 'По умолчанию', desc: 'Цвета зависят от выбранного режима. Менять стоит ради свежести.', cssPattern: 'bg-[#fafafa]' },
  { id: ColorTheme.LIGHT, name: 'Светлая', desc: 'Чистый белый интерфейс', cssPattern: 'bg-[#fafafa]' },
  { id: ColorTheme.DARK, name: 'Темная', desc: 'Ночной режим', cssPattern: 'bg-[#121212]' },
  { id: ColorTheme.PASTEL, name: 'Пастельная', desc: 'Нежно-розовые оттенки', cssPattern: 'bg-[#fdf4ff]' },
  { id: ColorTheme.NEON, name: 'Неоновая', desc: 'Высокий контраст, черный и зеленый', cssPattern: 'bg-[#000000]' },
  { id: ColorTheme.MONOCHROME, name: 'Монохромная', desc: 'Черно-белая эстетика', cssPattern: 'bg-[#e5e5e5]' },
];

function PreviewCell({ styleId, fillId }: { styleId: UiStyle, fillId: FillStyle }) {
  const getPreviewClasses = () => {
    switch (styleId) {
      case UiStyle.MINIMAL:
        return 'bg-transparent border-[0.5px] border-gray-400 text-gray-600 rounded-sm';
      case UiStyle.BRUTALISM:
        return 'bg-[#eee3da] border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-black rounded-none';
      case UiStyle.GLASS:
        return 'bg-black/5 backdrop-blur-xl border border-black/10 shadow-sm rounded-xl';
      case UiStyle.CLAY:
        return 'bg-gray-100 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.8),inset_-3px_-3px_5px_rgba(0,0,0,0.1)] rounded-2xl border-none text-gray-700';
      default:
        return 'bg-white shadow-sm border-2 border-gray-100 rounded-xl text-gray-800';
    }
  };

  const getFillNode = () => {
    if (fillId === FillStyle.MINIMAL) {
      return <div className="absolute inset-0 bg-current opacity-10 rounded-inherit" />;
    }
    if (fillId === FillStyle.BRUTALISM) {
      return <div className="absolute inset-0 bg-black opacity-10 rounded-inherit" />;
    }
    if (fillId === FillStyle.MARKER) {
      return <div className="absolute inset-x-0 h-2 top-1/2 -translate-y-1/2 bg-yellow-300 mix-blend-multiply opacity-50" />;
    }
    if (fillId === FillStyle.DEFAULT) {
      return <div className="absolute inset-1 rounded-full bg-pink-200 mix-blend-multiply opacity-50" />;
    }
    return null;
  };

  return (
    <div className={`relative w-12 h-12 flex-shrink-0 flex items-center justify-center text-xs font-medium overflow-hidden ${getPreviewClasses()}`}>
      {getFillNode()}
      <span className={`relative z-10 ${fillId === FillStyle.STRIKETHROUGH ? 'line-through decoration-2' : ''}`}>
        Aa
      </span>
    </div>
  );
}

export default function SettingsModal({ onClose, uiStyle, setUiStyle, fillStyle, setFillStyle, fontStyle, setFontStyle, colorTheme, setColorTheme, fontSize, setFontSize, cellSpacing, setCellSpacing }: SettingsModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute inset-0 z-[100] bg-[#0f0c13]/95 backdrop-blur-2xl text-[#f4ebf8] flex flex-col p-6 overflow-y-auto font-sans"
    >
      <header className="flex items-center justify-between py-6 max-w-md w-full mx-auto">
        <h2 className="text-2xl font-serif text-white/90">Настройки визуала</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <X size={24} className="opacity-60 text-white" />
        </button>
      </header>

      <div className="flex flex-col space-y-8 max-w-md w-full mx-auto pb-12">
        <section>
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Форма карточек</h3>
          <div className="flex flex-col space-y-3">
            {UI_STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => setUiStyle(style.id)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  uiStyle === style.id 
                    ? 'border-white/40 bg-white/10 ring-1 ring-white/40' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <PreviewCell styleId={style.id} fillId={fillStyle} />
                  <div>
                    <h3 className={`font-medium leading-tight ${uiStyle === style.id ? 'text-white' : 'text-white/80'}`}>{style.name}</h3>
                    <p className="text-xs text-white/50 mt-1 leading-snug">{style.desc}</p>
                  </div>
                </div>
                {uiStyle === style.id && <Check size={20} className="text-white flex-shrink-0 ml-2" />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Стиль закрашивания</h3>
          <div className="flex flex-col space-y-3">
            {FILL_STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => setFillStyle(style.id)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  fillStyle === style.id 
                    ? 'border-white/40 bg-white/10 ring-1 ring-white/40' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <PreviewCell styleId={uiStyle} fillId={style.id} />
                  <div>
                    <h3 className={`font-medium leading-tight ${fillStyle === style.id ? 'text-white' : 'text-white/80'}`}>{style.name}</h3>
                    <p className="text-xs text-white/50 mt-1 leading-snug">{style.desc}</p>
                  </div>
                </div>
                {fillStyle === style.id && <Check size={20} className="text-white flex-shrink-0 ml-2" />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Цветовая тема</h3>
          <div className="flex flex-col space-y-3">
            {COLOR_THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => setColorTheme(theme.id)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  colorTheme === theme.id 
                    ? 'border-white/40 bg-white/10 ring-1 ring-white/40' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-xl border border-white/20 shadow-inner ${theme.cssPattern}`} />
                  <div>
                    <h3 className={`font-medium leading-tight ${colorTheme === theme.id ? 'text-white' : 'text-white/80'}`}>{theme.name}</h3>
                    <p className="text-xs text-white/50 mt-1 leading-snug">{theme.desc}</p>
                  </div>
                </div>
                {colorTheme === theme.id && <Check size={20} className="text-white flex-shrink-0 ml-2" />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Шрифт</h3>
          <div className="flex flex-col space-y-3">
            {FONT_STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => setFontStyle(style.id)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  fontStyle === style.id 
                    ? 'border-white/40 bg-white/10 ring-1 ring-white/40' 
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center text-xl font-medium bg-white/10 border border-white/10 rounded-xl text-white ${style.className}`}>
                    Aa
                  </div>
                  <div>
                    <h3 className={`font-medium leading-tight ${style.className} ${fontStyle === style.id ? 'text-white' : 'text-white/80'}`}>{style.name}</h3>
                    <p className="text-xs text-white/50 mt-1 leading-snug font-sans">{style.desc}</p>
                  </div>
                </div>
                {fontStyle === style.id && <Check size={20} className="text-white flex-shrink-0 ml-2" />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Размер шрифта</h3>
          <div className="flex items-center space-x-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
            <span className="text-xs font-medium text-white/50 w-8 text-center">{fontSize}</span>
            <input 
              type="range" 
              min="8" 
              max="24" 
              value={fontSize} 
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Отступы между ячейками</h3>
          <div className="flex items-center space-x-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
            <span className="text-xs font-medium text-white/50 w-8 text-center">{cellSpacing}</span>
            <input 
              type="range" 
              min="0" 
              max="20" 
              value={cellSpacing} 
              onChange={(e) => setCellSpacing(Number(e.target.value))}
              className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>
        </section>
        
        <div className="mt-4 pt-6 border-t border-white/10 flex flex-col items-center space-y-4">
          <button
            onClick={() => {
              setUiStyle(UiStyle.DEFAULT);
              setFillStyle(FillStyle.DEFAULT);
              setFontStyle(FontStyle.DEFAULT);
              setColorTheme(ColorTheme.AUTO);
              setFontSize(11);
              setCellSpacing(8);
            }}
            className="text-sm font-medium text-white/50 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
          >
            Сброс по умолчанию
          </button>
          <p className="text-xs text-white/30 text-center">Настройки применяются ко всем активным доскам. Просто закройте это окно.</p>
        </div>
      </div>
    </motion.div>
  );
}
