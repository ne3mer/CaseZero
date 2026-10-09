import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { NoirColors, Radius, Spacing } from '../../constants/theme';

export type BadgeVariant = 'gold' | 'crimson' | 'emerald' | 'cyan' | 'neutral';

interface DossierBadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function DossierBadge({ label, variant = 'gold', style }: DossierBadgeProps) {
  const getColors = () => {
    switch (variant) {
      case 'gold':
        return {
          bg: NoirColors.goldMuted,
          border: NoirColors.goldBorder,
          text: NoirColors.goldLight,
        };
      case 'crimson':
        return {
          bg: NoirColors.crimsonMuted,
          border: 'rgba(217, 69, 69, 0.4)',
          text: '#F28B82',
        };
      case 'emerald':
        return {
          bg: NoirColors.emeraldMuted,
          border: 'rgba(53, 158, 109, 0.4)',
          text: '#81C995',
        };
      case 'cyan':
        return {
          bg: NoirColors.cyanMuted,
          border: 'rgba(88, 159, 184, 0.4)',
          text: '#80DEEA',
        };
      case 'neutral':
      default:
        return {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: NoirColors.borderStrong,
          text: NoirColors.textSecondary,
        };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg, borderColor: colors.border },
        style,
      ]}>
      <Text style={[styles.label, { color: colors.text }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});
