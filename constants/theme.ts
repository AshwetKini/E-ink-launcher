export const Colors = {
  // E-ink grayscale palette
  ink: {
    100: '#FFFFFF', // White
    90: '#E5E5E5',
    80: '#CCCCCC',
    70: '#B2B2B2',
    60: '#999999',
    50: '#7F7F7F', // Mid gray
    40: '#666666',
    30: '#4C4C4C',
    20: '#333333',
    10: '#1A1A1A',
    0: '#000000', // Black
  },
  // Primary accent (subtle, not bright)
  accent: {
    light: '#B2B2B2',
    DEFAULT: '#666666',
    dark: '#333333',
  },
  // Status colors (muted for e-ink)
  success: '#4C4C4C',
  warning: '#666666',
  error: '#1A1A1A',
  info: '#7F7F7F',
};

export const Fonts = {
  mono: 'SpaceMono',
  monoBold: 'SpaceMono-Bold',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 2,
  md: 4,
  lg: 8,
};

export const Shadows = {
  // Subtle shadows for e-ink effect
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  // Inset effect for pressed buttons
  inset: {
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 1,
  },
};
