import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DossierBadge } from '@/components/common/DossierBadge';
import { NoirButton } from '@/components/common/NoirButton';
import { NoirCard } from '@/components/common/NoirCard';
import { EvidenceImages } from '@/constants/assets';
import { MaxContentWidth, NoirColors, Radius, Spacing } from '@/constants/theme';
import { Evidence } from '@/core/types/case';

interface EvidenceInventoryModalProps {
  visible: boolean;
  allEvidence: Evidence[];
  unlockedEvidenceIds: string[];
  onSelectEvidence: (evidence: Evidence) => void;
  onClose: () => void;
}

export function EvidenceInventoryModal({
  visible,
  allEvidence,
  unlockedEvidenceIds,
  onSelectEvidence,
  onClose,
}: EvidenceInventoryModalProps) {
  const collectedCount = unlockedEvidenceIds.length;
  const totalCount = allEvidence.length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <NoirCard variant="elevated" hasGoldAccent style={styles.modalCard}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.headerTitles}>
                <Text style={styles.headerTitle}>EVIDENCE INVENTORY</Text>
                <Text style={styles.headerSub}>
                  {collectedCount} OF {totalCount} MATERIAL CLUES LOGGED
                </Text>
              </View>

              <Pressable
                onPress={onClose}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={({ pressed }) => [
                  styles.closeBtn,
                  pressed && styles.btnPressed,
                ]}>
                <Text style={styles.closeBtnText}>✕</Text>
              </Pressable>
            </View>

            {/* Evidence Cards List */}
            <ScrollView
              style={styles.cardsScroll}
              contentContainerStyle={styles.cardsScrollContent}
              showsVerticalScrollIndicator={false}>
              {allEvidence.map((item) => {
                const isCollected = unlockedEvidenceIds.includes(item.id);
                const itemImage =
                  EvidenceImages[item.id] || EvidenceImages.ev_spent_shell_casing;

                if (!isCollected) {
                  return (
                    <NoirCard
                      key={item.id}
                      variant="surface"
                      style={styles.lockedCard}>
                      <View style={styles.lockedCardRow}>
                        <View style={styles.lockedThumbnail}>
                          <Text style={styles.lockedIcon}>?</Text>
                        </View>
                        <View style={styles.lockedInfo}>
                          <Text style={styles.lockedTitle}>UNDISCOVERED CLUE</Text>
                          <Text style={styles.lockedDesc}>
                            Inspect highlighted objects in the workshop to recover this item.
                          </Text>
                        </View>
                      </View>
                    </NoirCard>
                  );
                }

                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      onClose();
                      onSelectEvidence(item);
                    }}
                    style={({ pressed }) => [
                      styles.cardPressable,
                      pressed && styles.btnPressed,
                    ]}>
                    <NoirCard
                      variant="elevated"
                      hasGoldAccent={item.isKeyEvidence}
                      style={styles.evidenceCard}>
                      <View style={styles.cardRow}>
                        {/* Thumbnail */}
                        <View style={styles.thumbnailContainer}>
                          <Image
                            source={itemImage}
                            style={styles.thumbnail}
                            resizeMode="cover"
                          />
                        </View>

                        {/* Details */}
                        <View style={styles.cardDetails}>
                          <View style={styles.badgeRow}>
                            <DossierBadge
                              label={item.type.toUpperCase()}
                              variant="cyan"
                            />
                            {item.isKeyEvidence && (
                              <DossierBadge label="KEY" variant="crimson" />
                            )}
                          </View>

                          <Text numberOfLines={1} style={styles.cardTitle}>
                            {item.title.toUpperCase()}
                          </Text>

                          <Text
                            numberOfLines={2}
                            style={styles.cardObservation}>
                            {item.shortObservation || item.description}
                          </Text>

                          <Text numberOfLines={1} style={styles.cardLocation}>
                            LOC: {item.locationFound.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </NoirCard>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Bottom Close Action */}
            <View style={styles.footerRow}>
              <NoirButton
                label="RETURN TO CRIME SCENE"
                variant="primary"
                onPress={onClose}
              />
            </View>
          </NoirCard>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 10, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalContainer: {
    width: '100%',
    maxWidth: MaxContentWidth,
    maxHeight: '92%',
  },
  modalCard: {
    padding: Spacing.md,
    gap: Spacing.md,
    maxHeight: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: NoirColors.borderSubtle,
    width: '100%',
  },
  headerTitles: {
    gap: 2,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 1.2,
  },
  headerSub: {
    fontSize: 10,
    fontWeight: '700',
    color: NoirColors.goldLight,
    letterSpacing: 0.6,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: NoirColors.textSecondary,
  },
  btnPressed: {
    opacity: 0.7,
  },
  cardsScroll: {
    maxHeight: 460,
    width: '100%',
  },
  cardsScrollContent: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  cardPressable: {
    width: '100%',
  },
  evidenceCard: {
    padding: Spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
    alignItems: 'center',
    width: '100%',
  },
  thumbnailContainer: {
    width: 68,
    height: 68,
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
  cardDetails: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: NoirColors.textPrimary,
    letterSpacing: 0.6,
  },
  cardObservation: {
    fontSize: 11,
    lineHeight: 15,
    color: NoirColors.textSecondary,
    flexWrap: 'wrap',
  },
  cardLocation: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.goldLight,
    letterSpacing: 0.4,
    marginTop: 2,
  },
  lockedCard: {
    padding: Spacing.sm,
    opacity: 0.5,
  },
  lockedCardRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
    alignItems: 'center',
    width: '100%',
  },
  lockedThumbnail: {
    width: 68,
    height: 68,
    borderRadius: Radius.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  lockedIcon: {
    fontSize: 22,
    fontWeight: '900',
    color: NoirColors.textMuted,
  },
  lockedInfo: {
    flex: 1,
    gap: 2,
  },
  lockedTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: NoirColors.textMuted,
    letterSpacing: 0.8,
  },
  lockedDesc: {
    fontSize: 10,
    lineHeight: 14,
    color: NoirColors.textMuted,
    flexWrap: 'wrap',
  },
  footerRow: {
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: NoirColors.borderSubtle,
    width: '100%',
  },
});
