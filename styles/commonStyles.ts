
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#6B46C1',      // Deep Purple
  secondary: '#8B5CF6',    // Medium Purple  
  accent: '#A78BFA',       // Light Purple
  success: '#10B981',      // Emerald Green
  warning: '#F59E0B',      // Amber
  danger: '#EF4444',       // Red
  background: '#0F0F23',   // Very Dark Blue
  backgroundAlt: '#1A1B3A', // Dark Purple-Blue
  surface: '#252547',      // Medium Dark Purple
  text: '#F8FAFC',         // Almost White
  textSecondary: '#94A3B8', // Light Gray
  border: '#374151',       // Dark Gray
  card: '#1E1E3F',         // Dark Purple Card
  glass: 'rgba(139, 92, 246, 0.1)', // Purple Glass Effect
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  secondary: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quest: {
    backgroundColor: colors.success,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 4px 12px rgba(107, 70, 193, 0.15)',
    elevation: 4,
  },
  glassCard: {
    backgroundColor: colors.glass,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    backdropFilter: 'blur(10px)',
  },
  questCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)',
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  hexagon: {
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    transform: [{ rotate: '45deg' }],
    borderRadius: 8,
  },
  hexagonInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-45deg' }],
  },
});
