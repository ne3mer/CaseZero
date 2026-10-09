import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NoirColors, Spacing } from '../../constants/theme';

interface NoirHeaderProps {
  location?: string;
  time?: string;
}

export function NoirHeader({
  location = 'BUDAPEST // DISTRICT VIII',
  time = '03:42 CET',
}: NoirHeaderProps) {
  return (
    <View style={styles.container}>
      {/* City & Time Telemetry Stamp */}
      <View style={styles.telemetryRow}>
        <View style={styles.pulsingDot} />
        <Text style={styles.telemetryText}>
          {location} — {time}
        </Text>
      </View>

      {/* Main Title */}
      <View style={styles.titleWrapper}>
        <Text style={styles.titleMain}>CASE ZERO</Text>
        <Text style={styles.titleSub}>CRIMINAL INVESTIGATION DIVISION</Text>
      </View>

      {/* Decorative Gold Accent Bar */}
      <View style={styles.accentBarContainer}>
        <View style={styles.accentBarGold} />
        <View style={styles.accentBarMuted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  telemetryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: NoirColors.crimson,
  },
  telemetryText: {
    fontSize: 10,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 1.5,
  },
  titleWrapper: {
    marginTop: Spacing.xs,
    gap: 2,
  },
  titleMain: {
    fontSize: 32,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 4,
  },
  titleSub: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.goldLight,
    letterSpacing: 2,
  },
  accentBarContainer: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    height: 2,
    alignItems: 'center',
  },
  accentBarGold: {
    width: 48,
    height: 2,
    backgroundColor: NoirColors.goldPrimary,
  },
  accentBarMuted: {
    flex: 1,
    height: 1,
    backgroundColor: NoirColors.borderStrong,
  },
});
