import { Platform } from 'react-native';

/**
 * CASE ZERO Design Tokens
 * Neo-Noir Budapest Aesthetic
 */
export const NoirColors = {
  // Atmospheric Backgrounds
  background: '#090B0F',
  surface: '#12151D',
  surfaceElevated: '#1A1E29',
  surfaceHighlight: '#232938',
  
  // Warm Muted Gold Accents
  goldPrimary: '#C5A059',
  goldLight: '#DFC07B',
  goldDark: '#8F6E31',
  goldMuted: 'rgba(197, 160, 89, 0.15)',
  goldBorder: 'rgba(197, 160, 89, 0.35)',

  // Off-white Readable Typography
  textPrimary: '#F2F4F7',
  textSecondary: '#A3A8B5',
  textMuted: '#646D7D',

  // Detective Semantic Indicators
  crimson: '#D94545',
  crimsonMuted: 'rgba(217, 69, 69, 0.18)',
  emerald: '#359E6D',
  emeraldMuted: 'rgba(53, 158, 109, 0.18)',
  cyan: '#589FB8',
  cyanMuted: 'rgba(88, 159, 184, 0.18)',

  // Structural Borders
  borderSubtle: '#1C212E',
  borderStrong: '#2A3142',
} as const;

export const Colors = {
  light: {
    text: NoirColors.textPrimary,
    background: NoirColors.background,
    backgroundElement: NoirColors.surface,
    backgroundSelected: NoirColors.surfaceElevated,
    textSecondary: NoirColors.textSecondary,
    tint: NoirColors.goldPrimary,
  },
  dark: {
    text: NoirColors.textPrimary,
    background: NoirColors.background,
    backgroundElement: NoirColors.surface,
    backgroundSelected: NoirColors.surfaceElevated,
    textSecondary: NoirColors.textSecondary,
    tint: NoirColors.goldPrimary,
  },
} as const;

export type ThemeColor = keyof typeof Colors.dark;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  // Numeric aliases for backward compatibility
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 9999,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    mono: 'monospace',
  },
  web: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    mono: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
});

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 720;
