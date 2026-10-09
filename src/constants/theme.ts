import { Platform } from 'react-native';

/**
 * CASE ZERO Design Tokens
 * Neo-Noir Budapest Aesthetic
 * High-Contrast Accessible Colors
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
  goldMuted: 'rgba(197, 160, 89, 0.18)',
  goldBorder: 'rgba(197, 160, 89, 0.45)',

  // Off-white & High-Contrast Typography (WCAG AA & AAA compliant)
  textPrimary: '#F2F4F7',   // Crisp, high contrast (~16:1 on surface)
  textSecondary: '#B4BAC7', // Accessible secondary silver (~8.5:1 on surface)
  textMuted: '#9AA2B1',     // Clear tertiary label color (~5.5:1 on surface, >4.5:1)

  // Detective Semantic Indicators (high-visibility tints on dark backgrounds)
  crimson: '#E85353',
  crimsonMuted: 'rgba(232, 83, 83, 0.22)',
  crimsonBorder: 'rgba(232, 83, 83, 0.5)',
  emerald: '#3DB87E',
  emeraldMuted: 'rgba(61, 184, 126, 0.22)',
  cyan: '#64B2CE',
  cyanMuted: 'rgba(100, 178, 206, 0.22)',

  // Structural Borders
  borderSubtle: '#222838',
  borderStrong: '#323B4F',
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
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
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
  xs: 4,
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
export const MaxContentWidth = 640;
