import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { NoirColors, Radius, Spacing } from '../../constants/theme';

interface NoirTopBarProps {
  onBack: () => void;
  backLabel?: string;
  rightBadge?: string;
  style?: ViewStyle;
}

export function NoirTopBar({
  onBack,
  backLabel = 'BACK',
  rightBadge,
  style,
}: NoirTopBarProps) {
  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={onBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}>
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.backText}>{backLabel.toUpperCase()}</Text>
      </Pressable>

      {rightBadge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{rightBadge.toUpperCase()}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    minHeight: 44,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.sm,
    gap: Spacing.xs + 2,
  },
  backButtonPressed: {
    opacity: 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  backArrow: {
    fontSize: 16,
    fontWeight: '700',
    color: NoirColors.goldPrimary,
  },
  backText: {
    fontSize: 11,
    fontWeight: '800',
    color: NoirColors.textSecondary,
    letterSpacing: 1,
  },
  badgeContainer: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: NoirColors.borderStrong,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 1,
  },
});
