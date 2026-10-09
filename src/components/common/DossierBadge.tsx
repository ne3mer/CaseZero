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
          border: NoirColors.crimsonBorder,
          text: '#FFA4A4',
        };
      case 'emerald':
        return {
          bg: NoirColors.emeraldMuted,
          border: 'rgba(61, 184, 126, 0.45)',
          text: '#9AE8BE',
        };
      case 'cyan':
        return {
          bg: NoirColors.cyanMuted,
          border: 'rgba(100, 178, 206, 0.45)',
          text: '#A6E4F8',
        };
      case 'neutral':
      default:
        return {
          bg: 'rgba(255, 255, 255, 0.06)',
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
      <Text
        numberOfLines={1}
        style={[styles.label, { color: colors.text }]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    borderWidth: 1,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    flexShrink: 1,
  },
});
