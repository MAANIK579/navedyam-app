// src/theme.js — Enhanced design system
export const COLORS = {
  saffron:      '#E8621A',
  saffronLight: '#F5873A',
  saffronDeep:  '#C04E0E',
  saffronPale:  '#FFF0E6',
  cream:        '#FDF6EC',
  creamDark:    '#F5E8D0',
  turmeric:     '#D4A017',
  brown:        '#3D1F0A',
  brownMid:     '#6B3A1F',
  brownLight:   '#8B5E3C',
  green:        '#2D6A4F',
  greenLight:   '#40916C',
  greenPale:    '#E8F5E9',
  text:         '#2C1500',
  textMuted:    '#8C6A4A',
  textLight:    '#A08060',
  white:        '#FFFDF9',
  cardBg:       '#FFFAF3',
  border:       '#E8D5B5',
  borderLight:  '#F0E4D0',
  error:        '#C0392B',
  errorPale:    '#FDECEA',
  success:      '#27AE60',
  successPale:  '#E8F8F0',
  overlay:      'rgba(61, 31, 10, 0.5)',
};

export const FONTS = {
  regular:  { fontFamily: 'System', fontWeight: '400' },
  medium:   { fontFamily: 'System', fontWeight: '500' },
  semibold: { fontFamily: 'System', fontWeight: '600' },
  bold:     { fontFamily: 'System', fontWeight: '700' },
  heavy:    { fontFamily: 'System', fontWeight: '900' },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const SHADOW = {
  small: {
    shadowColor: '#3D1F0A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#3D1F0A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  large: {
    shadowColor: '#3D1F0A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
};
