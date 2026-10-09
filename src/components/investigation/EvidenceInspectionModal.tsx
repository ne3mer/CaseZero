import React, { useState } from 'react';
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
import { Evidence, SceneHotspot } from '@/core/types/case';

interface EvidenceInspectionModalProps {
  visible: boolean;
  evidence: Evidence | null;
  hotspot: SceneHotspot | null;
  isAlreadyCollected: boolean;
  onCollect: (evidenceId: string) => void;
  onClose: () => void;
}

export function EvidenceInspectionModal({
  visible,
  evidence,
  hotspot,
  isAlreadyCollected,
  onCollect,
  onClose,
}: EvidenceInspectionModalProps) {
  const [showFullForensics, setShowFullForensics] = useState(false);

  if (!evidence) return null;

  const evidenceImage =
    EvidenceImages[evidence.id] || EvidenceImages.ev_spent_shell_casing;

  const observationText =
    evidence.shortObservation || evidence.description;

  const handleCollect = () => {
    if (!isAlreadyCollected) {
      onCollect(evidence.id);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <NoirCard variant="elevated" hasGoldAccent style={styles.modalCard}>
            {/* Header Strip */}
            <View style={styles.headerStrip}>
              <View style={styles.headerBadges}>
                <DossierBadge label={evidence.type.toUpperCase()} variant="cyan" />
                {evidence.isKeyEvidence && (
                  <DossierBadge label="KEY EVIDENCE" variant="crimson" />
                )}
                {isAlreadyCollected && (
                  <DossierBadge label="SECURED" variant="emerald" />
                )}
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

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}>
              {/* Large High-Contrast Evidence Illustration */}
              <View style={styles.imageContainer}>
                <Image
                  source={evidenceImage}
                  style={styles.evidenceImage}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay} />
                <View style={styles.locationTag}>
                  <Text style={styles.locationTagLabel}>FOUND AT</Text>
                  <Text style={styles.locationTagText}>
                    {evidence.locationFound.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Title & Scene Context */}
              <View style={styles.titleGroup}>
                <Text style={styles.evidenceTitle}>
                  {evidence.title.toUpperCase()}
                </Text>
                {hotspot && (
                  <Text style={styles.hotspotContext}>
                    SCENE OBJECT: {hotspot.label.toUpperCase()}
                  </Text>
                )}
              </View>

              {/* Primary 1-Sentence Observation (Show, Don't Tell) */}
              <View style={styles.observationBox}>
                <View style={styles.observationAccentBar} />
                <View style={styles.observationContent}>
                  <Text style={styles.observationLabel}>OBSERVATION</Text>
                  <Text style={styles.observationText}>
                    {observationText}
                  </Text>
                </View>
              </View>

              {/* Progressive Disclosure: Deep Forensic Readout */}
              <Pressable
                onPress={() => setShowFullForensics((prev) => !prev)}
                style={({ pressed }) => [
                  styles.toggleForensicsBtn,
                  pressed && styles.btnPressed,
                ]}>
                <Text style={styles.toggleForensicsText}>
                  {showFullForensics
                    ? '▲ CONCEAL LABORATORY READOUT'
                    : '▼ EXPAND DETAILED FORENSIC REPORT'}
                </Text>
              </Pressable>

              {showFullForensics && (
                <View style={styles.forensicsCard}>
                  <Text style={styles.forensicsLabel}>TRACE ANALYSIS</Text>
                  <Text style={styles.forensicsBody}>
                    {evidence.description}
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              {isAlreadyCollected ? (
                <NoirButton
                  label="✓ EVIDENCE SECURED IN INVENTORY"
                  variant="ghost"
                  disabled={true}
                  onPress={() => {}}
                />
              ) : (
                <NoirButton
                  label="LOG AS MATERIAL EVIDENCE"
                  variant="primary"
                  onPress={handleCollect}
                />
              )}

              <NoirButton
                label="RETURN TO SCENE"
                variant="secondary"
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
    backgroundColor: 'rgba(5, 7, 10, 0.88)',
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
    gap: Spacing.sm,
    maxHeight: '100%',
  },
  headerStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: NoirColors.borderSubtle,
    width: '100%',
  },
  headerBadges: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
    flexWrap: 'wrap',
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
    opacity: 0.65,
  },
  modalScroll: {
    maxHeight: 460,
    width: '100%',
  },
  modalScrollContent: {
    gap: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    backgroundColor: '#050608',
    borderWidth: 1,
    borderColor: NoirColors.borderStrong,
    position: 'relative',
  },
  evidenceImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 11, 15, 0.15)',
  },
  locationTag: {
    position: 'absolute',
    bottom: Spacing.xs + 2,
    left: Spacing.xs + 2,
    backgroundColor: 'rgba(9, 11, 15, 0.9)',
    borderWidth: 1,
    borderColor: NoirColors.borderStrong,
    borderRadius: Radius.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  locationTagLabel: {
    fontSize: 7,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 0.5,
  },
  locationTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.textPrimary,
  },
  titleGroup: {
    gap: 2,
    width: '100%',
  },
  evidenceTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 1.2,
    flexWrap: 'wrap',
  },
  hotspotContext: {
    fontSize: 10,
    fontWeight: '700',
    color: NoirColors.goldPrimary,
    letterSpacing: 0.6,
  },
  observationBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
    overflow: 'hidden',
    width: '100%',
  },
  observationAccentBar: {
    width: 4,
    backgroundColor: NoirColors.goldPrimary,
  },
  observationContent: {
    padding: Spacing.sm,
    gap: 2,
    flex: 1,
  },
  observationLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 1,
  },
  observationText: {
    fontSize: 12,
    lineHeight: 18,
    color: NoirColors.textPrimary,
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  toggleForensicsBtn: {
    alignSelf: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  toggleForensicsText: {
    fontSize: 9,
    fontWeight: '800',
    color: NoirColors.textMuted,
    letterSpacing: 0.8,
  },
  forensicsCard: {
    backgroundColor: 'rgba(18, 21, 29, 0.8)',
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
    borderRadius: Radius.xs,
    padding: Spacing.sm,
    gap: 4,
    width: '100%',
  },
  forensicsLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 0.8,
  },
  forensicsBody: {
    fontSize: 11,
    lineHeight: 16,
    color: NoirColors.textSecondary,
    flexWrap: 'wrap',
  },
  actionsContainer: {
    gap: Spacing.xs + 2,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: NoirColors.borderSubtle,
    width: '100%',
  },
});
