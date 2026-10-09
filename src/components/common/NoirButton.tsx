import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { NoirColors, Radius, Spacing } from '../../constants/theme';

interface NoirButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  isLoading?: boolean;
  style?: ViewStyle;
}

export function NoirButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  isLoading = false,
  style,
}: NoirButtonProps) {
  const getContainerStyle = (pressed: boolean) => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: pressed
            ? NoirColors.goldLight
            : disabled
            ? 'rgba(197, 160, 89, 0.3)'
            : NoirColors.goldPrimary,
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: pressed
            ? NoirColors.surfaceHighlight
            : NoirColors.surface,
          borderColor: pressed
            ? NoirColors.goldLight
            : disabled
            ? NoirColors.borderSubtle
            : NoirColors.goldBorder,
          borderWidth: 1,
        };
      case 'ghost':
      default:
        return {
          backgroundColor: pressed ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return NoirColors.textMuted;
    switch (variant) {
      case 'primary':
        return '#0A0C10';
      case 'secondary':
        return NoirColors.goldLight;
      case 'ghost':
      default:
        return NoirColors.textSecondary;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      style={({ pressed }) => [
        styles.button,
        getContainerStyle(pressed),
        disabled && styles.disabled,
        style,
      ]}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#0A0C10' : NoirColors.goldPrimary}
        />
      ) : (
        <Text
          numberOfLines={2}
          style={[styles.text, { color: getTextColor() }]}>
          {label.toUpperCase()}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    alignSelf: 'stretch',
    minHeight: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    flexDirection: 'row',
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    flexShrink: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
