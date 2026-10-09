import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { DossierBadge } from '@/components/common/DossierBadge';
import { NoirCard } from '@/components/common/NoirCard';
import { EvidenceImages } from '@/constants/assets';
import { NoirColors, Radius, Spacing } from '@/constants/theme';

export interface BoardEntity {
  id: string;
  type: 'evidence' | 'timeline' | 'statement';
  title: string;
  subtitle?: string;
  description: string;
  badgeLabel?: string;
  isKey?: boolean;
}

interface EvidenceBoardRecordItemProps {
  entity: BoardEntity;
  selectionRole: 'slot1' | 'slot2' | 'supporting' | null;
  onPress: () => void;
}

export function EvidenceBoardRecordItem({
  entity,
  selectionRole,
  onPress,
}: EvidenceBoardRecordItemProps) {
  const isSelected = selectionRole !== null;
  const isEvidence = entity.type === 'evidence';
  const evidenceImage = isEvidence
    ? EvidenceImages[entity.id] || EvidenceImages.ev_spent_shell_casing
    : null;

  const getSlotBadge = () => {
    switch (selectionRole) {
      case 'slot1':
        return <DossierBadge label="PRIMARY (A)" variant="gold" />;
      case 'slot2':
        return <DossierBadge label="TARGET (B)" variant="cyan" />;
      case 'supporting':
        return <DossierBadge label="CORROBORATING" variant="emerald" />;
      default:
        return null;
    }
  };

  const getBorderColor = () => {
    switch (selectionRole) {
      case 'slot1':
        return NoirColors.goldPrimary;
      case 'slot2':
        return NoirColors.cyan;
      case 'supporting':
        return NoirColors.emerald;
      default:
        return NoirColors.borderSubtle;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
      ]}>
      <NoirCard
        variant={isSelected ? 'elevated' : 'surface'}
        hasGoldAccent={selectionRole === 'slot1'}
        style={[styles.card, { borderColor: getBorderColor() }]}>
        <View style={styles.cardContentRow}>
          {/* Thumbnail for Evidence items */}
          {isEvidence && evidenceImage && (
            <View style={styles.thumbnailContainer}>
              <Image
                source={evidenceImage}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Icon Badge for Timeline / Statements */}
          {!isEvidence && (
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>
                {entity.type === 'timeline' ? '⏱' : '🗣'}
              </Text>
            </View>
          )}

          {/* Details */}
          <View style={styles.textContainer}>
            <View style={styles.headerRow}>
              <View style={styles.badgesRow}>
                {entity.badgeLabel && (
                  <DossierBadge
                    label={entity.badgeLabel.toUpperCase()}
                    variant={entity.isKey ? 'crimson' : 'neutral'}
                  />
                )}
                {getSlotBadge()}
              </View>
              {entity.subtitle && (
                <Text style={styles.subtitleText}>{entity.subtitle}</Text>
              )}
            </View>

            <Text numberOfLines={1} style={styles.titleText}>
              {entity.title.toUpperCase()}
            </Text>

            <Text numberOfLines={2} style={styles.descriptionText}>
              {entity.description}
            </Text>
          </View>
        </View>
      </NoirCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    padding: Spacing.sm,
    width: '100%',
    borderWidth: 1,
  },
  cardContentRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
    alignItems: 'center',
    width: '100%',
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: Radius.xs,
    overflow: 'hidden',
    backgroundColor: '#050608',
    borderWidth: 1,
    borderColor: NoirColors.borderStrong,
    flexShrink: 0,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: Radius.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconText: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  subtitleText: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.goldLight,
    letterSpacing: 0.4,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '800',
    color: NoirColors.textPrimary,
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 11,
    lineHeight: 15,
    color: NoirColors.textSecondary,
    flexWrap: 'wrap',
  },
});
