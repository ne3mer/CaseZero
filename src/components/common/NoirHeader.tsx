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
        <Text style={styles.telemetryText} numberOfLines={2}>
          {location} — {time}
        </Text>
      </View>

      {/* Main Title */}
      <View style={styles.titleWrapper}>
        <Text
          style={styles.titleMain}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}>
          CASE ZERO
        </Text>
        <Text style={styles.titleSub} numberOfLines={1}>
          CRIMINAL INVESTIGATION DIVISION
        </Text>
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
    width: '100%',
    alignSelf: 'stretch',
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  telemetryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    flexWrap: 'wrap',
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: NoirColors.crimson,
    flexShrink: 0,
  },
  telemetryText: {
    fontSize: 10,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 1,
    flexShrink: 1,
  },
  titleWrapper: {
    marginTop: 2,
    gap: 2,
    width: '100%',
  },
  titleMain: {
    fontSize: 30,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 3,
  },
  titleSub: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.goldLight,
    letterSpacing: 1.5,
  },
  accentBarContainer: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
    height: 2,
    alignItems: 'center',
    width: '100%',
  },
  accentBarGold: {
    width: 44,
    height: 2,
    backgroundColor: NoirColors.goldPrimary,
  },
  accentBarMuted: {
    flex: 1,
    height: 1,
    backgroundColor: NoirColors.borderStrong,
  },
});
