import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { NoirColors, Radius, Spacing } from '../../constants/theme';

interface NoirCardProps {
  children: ReactNode;
  variant?: 'surface' | 'elevated';
  hasGoldAccent?: boolean;
  style?: ViewStyle;
}

export function NoirCard({
  children,
  variant = 'surface',
  hasGoldAccent = false,
  style,
}: NoirCardProps) {
  const backgroundColor =
    variant === 'elevated' ? NoirColors.surfaceElevated : NoirColors.surface;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor: hasGoldAccent ? NoirColors.goldBorder : NoirColors.borderSubtle,
        },
        hasGoldAccent && styles.accentBorder,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignSelf: 'stretch',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    overflow: 'hidden',
  },
  accentBorder: {
    borderLeftWidth: 3,
    borderLeftColor: NoirColors.goldPrimary,
  },
});
