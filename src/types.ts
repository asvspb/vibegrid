export enum VibeMode {
  COMFORT = 'comfort',
  CHAOTIC = 'chaotic',
  AESTHETIC = 'aesthetic',
  NATURE = 'nature',
  DARK_ACADEMIA = 'dark-academia'
}

export enum UiStyle {
  DEFAULT = 'default',
  MINIMAL = 'minimal',
  BRUTALISM = 'brutalism',
  GLASS = 'glass',
  CLAY = 'clay'
}

export enum FillStyle {
  DEFAULT = 'default',
  MINIMAL = 'minimal',
  BRUTALISM = 'brutalism',
  STRIKETHROUGH = 'strikethrough',
  MARKER = 'marker'
}

export enum ColorTheme {
  AUTO = 'auto',
  LIGHT = 'light',
  DARK = 'dark',
  PASTEL = 'pastel',
  NEON = 'neon',
  MONOCHROME = 'monochrome'
}

export enum FontStyle {
  DEFAULT = 'default',
  PLAYFAIR = 'playfair',
  SPACE = 'space',
  CAVEAT = 'caveat',
  SYNE = 'syne'
}

export interface BingoItem {
  id: string;
  text: string;
  isCompleted: boolean;
  category: string;
}

export interface VibeState {
  mode: VibeMode;
  items: BingoItem[];
  completedLines: number;
}
