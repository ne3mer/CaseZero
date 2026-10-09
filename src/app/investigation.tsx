import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DossierBadge } from '@/components/common/DossierBadge';
import { NoirButton } from '@/components/common/NoirButton';
import { NoirCard } from '@/components/common/NoirCard';
import { NoirTopBar } from '@/components/common/NoirTopBar';
import { CrimeSceneCanvas } from '@/components/investigation/CrimeSceneCanvas';
import { EvidenceInspectionModal } from '@/components/investigation/EvidenceInspectionModal';
import { EvidenceInventoryModal } from '@/components/investigation/EvidenceInventoryModal';
import { EvidenceImages, SceneImages } from '@/constants/assets';
import { MaxContentWidth, NoirColors, Radius, Spacing } from '@/constants/theme';
import { getCaseById } from '@/core/data/cases';
import { SAMPLE_DEV_CASE } from '@/core/data/sample-case';
import { Evidence, SceneHotspot } from '@/core/types/case';
import { useGameStore } from '@/store/game-store';

export default function InvestigationScreen() {
  const router = useRouter();
  const { initialize, unlockedEvidenceIds, unlockEvidence, activeCaseId } =
    useGameStore();

  const [inspectingHotspot, setInspectingHotspot] = useState<SceneHotspot | null>(null);
  const [inspectingEvidence, setInspectingEvidence] = useState<Evidence | null>(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [collectionToast, setCollectionToast] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const activeCase = (activeCaseId ? getCaseById(activeCaseId) : null) || SAMPLE_DEV_CASE;
  const hotspots: SceneHotspot[] = activeCase.hotspots || [];

  const handleSelectHotspot = (hotspot: SceneHotspot) => {
    const matchedEvidence = activeCase.evidence.find(
      (e) => e.id === hotspot.evidenceId
    );
    if (matchedEvidence) {
      setInspectingHotspot(hotspot);
      setInspectingEvidence(matchedEvidence);
    }
  };

  const handleSelectEvidenceDirectly = (evidence: Evidence) => {
    const matchedHotspot = hotspots.find((h) => h.evidenceId === evidence.id) || null;
    setInspectingHotspot(matchedHotspot);
    setInspectingEvidence(evidence);
  };

  const handleCollectEvidence = async (evidenceId: string) => {
    if (unlockedEvidenceIds.includes(evidenceId)) return;

    await unlockEvidence(evidenceId);
    const item = activeCase.evidence.find((e) => e.id === evidenceId);
    const itemName = item ? item.title.toUpperCase() : 'MATERIAL EVIDENCE';
    setCollectionToast(`CLUE SECURED: ${itemName}`);
    setTimeout(() => setCollectionToast(null), 3500);
  };

  const getSceneImage = (key?: string) => {
    if (key === 'watchmakerAtelier') return SceneImages.watchmakerAtelier;
    if (key === 'danubeEcho') return SceneImages.danubeEcho;
    return SceneImages.watchmakerAtelier;
  };

  const collectedCount = unlockedEvidenceIds.length;
  const totalEvidenceCount = activeCase.evidence.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Bar with Quick Access to Evidence Inventory */}
      <View style={styles.topBarWrapper}>
        <NoirTopBar
          onBack={() => router.back()}
          backLabel="BRIEFING"
          rightBadge={`${activeCase.caseNumber} // SCENE`}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}>
        {/* Crime Scene Atmospheric Header */}
        <View style={styles.sceneHeader}>
          <View style={styles.sceneHeaderTop}>
            <View style={styles.sceneBadgeRow}>
              <DossierBadge label={activeCase.caseNumber} variant="gold" />
              <DossierBadge label="DISTRICT VIII" variant="neutral" />
              <DossierBadge label="ACTIVE INVESTIGATION" variant="emerald" />
            </View>

            {/* Evidence Locker Fast-Access Button */}
            <Pressable
              onPress={() => setIsInventoryOpen(true)}
              style={({ pressed }) => [
                styles.inventoryFastBtn,
                pressed && styles.btnPressed,
              ]}>
              <Text style={styles.inventoryFastBtnText}>
                DOSSIER INVENTORY ({collectedCount}/{totalEvidenceCount})
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sceneTitle}>
            NÉPSZÍNHÁZ UTCA // ATELIER
          </Text>
          <Text style={styles.sceneSub}>
            EXAMINE VISIBLE OBJECTS IN THE WORKSHOP TO COLLECT MATERIAL CLUES
          </Text>
        </View>

        {/* Collection Feedback Toast */}
        {collectionToast && (
          <View style={styles.toastBanner}>
            <Text style={styles.toastText}>✓ {collectionToast}</Text>
          </View>
        )}

        {/* Interactive Crime Scene Canvas with Touch Hotspots & Zoom */}
        <CrimeSceneCanvas
          imageSource={getSceneImage(activeCase.coverImageKey)}
          hotspots={hotspots}
          unlockedEvidenceIds={unlockedEvidenceIds}
          onSelectHotspot={handleSelectHotspot}
        />

        {/* Crime Scene Quick Telemetry */}
        <View style={styles.telemetryRow}>
          <View style={styles.telemetryBox}>
            <Text style={styles.telemetryValue}>{hotspots.length}</Text>
            <Text style={styles.telemetryLabel}>SCENE HOTSPOTS</Text>
          </View>
          <View style={styles.telemetryBox}>
            <Text style={styles.telemetryValue}>
              {collectedCount} / {totalEvidenceCount}
            </Text>
            <Text style={styles.telemetryLabel}>CLUES SECURED</Text>
          </View>
          <View style={styles.telemetryBox}>
            <Text style={styles.telemetryValue}>
              {totalEvidenceCount - collectedCount}
            </Text>
            <Text style={styles.telemetryLabel}>REMAINING</Text>
          </View>
        </View>

        {/* Recovered Evidence Quick Drawer Section */}
        <View style={styles.evidenceDrawerSection}>
          <View style={styles.drawerHeaderRow}>
            <Text style={styles.drawerTitle}>RECOVERED MATERIAL CLUES</Text>
            <Pressable onPress={() => setIsInventoryOpen(true)}>
              <Text style={styles.viewAllText}>VIEW FULL INVENTORY →</Text>
            </Pressable>
          </View>

          <View style={styles.evidenceCardList}>
            {activeCase.evidence.map((item) => {
              const isCollected = unlockedEvidenceIds.includes(item.id);
              const itemImage =
                EvidenceImages[item.id] || EvidenceImages.ev_spent_shell_casing;

              return (
                <Pressable
                  key={item.id}
                  disabled={!isCollected}
                  onPress={() => handleSelectEvidenceDirectly(item)}
                  style={({ pressed }) => [
                    styles.clueCardPressable,
                    pressed && styles.btnPressed,
                  ]}>
                  <NoirCard
                    variant={isCollected ? 'elevated' : 'surface'}
                    hasGoldAccent={isCollected && item.isKeyEvidence}
                    style={isCollected ? styles.clueCardUnlocked : styles.clueCardLocked}>
                    <View style={styles.clueRow}>
                      {/* Clue Thumbnail */}
                      <View style={styles.clueThumbnailContainer}>
                        {isCollected ? (
                          <Image
                            source={itemImage}
                            style={styles.clueThumbnail}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.clueThumbnailLocked}>
                            <Text style={styles.clueLockedQuestion}>?</Text>
                          </View>
                        )}
                      </View>

                      {/* Clue Info */}
                      <View style={styles.clueTextGroup}>
                        <View style={styles.clueTopRow}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.clueTitle,
                              !isCollected && styles.clueTitleLocked,
                            ]}>
                            {isCollected ? item.title : 'UNDISCOVERED CLUE'}
                          </Text>
                          <DossierBadge
                            label={isCollected ? item.type : 'UNSEARCHED'}
                            variant={isCollected ? 'cyan' : 'neutral'}
                          />
                        </View>

                        <Text numberOfLines={2} style={styles.clueObservation}>
                          {isCollected
                            ? item.shortObservation || item.description
                            : 'Inspect the highlighted objects inside the workshop.'}
                        </Text>
                      </View>
                    </View>
                  </NoirCard>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Inventory Action Button */}
        <View style={styles.actionsFooter}>
          <NoirButton
            label={`OPEN EVIDENCE INVENTORY (${collectedCount}/${totalEvidenceCount})`}
            variant="primary"
            onPress={() => setIsInventoryOpen(true)}
          />
        </View>
      </ScrollView>

      {/* Focused Evidence Inspection Modal */}
      <EvidenceInspectionModal
        visible={!!inspectingEvidence}
        evidence={inspectingEvidence}
        hotspot={inspectingHotspot}
        isAlreadyCollected={
          inspectingEvidence ? unlockedEvidenceIds.includes(inspectingEvidence.id) : false
        }
        onCollect={handleCollectEvidence}
        onClose={() => {
          setInspectingEvidence(null);
          setInspectingHotspot(null);
        }}
      />

      {/* Full Evidence Inventory Modal */}
      <EvidenceInventoryModal
        visible={isInventoryOpen}
        allEvidence={activeCase.evidence}
        unlockedEvidenceIds={unlockedEvidenceIds}
        onSelectEvidence={handleSelectEvidenceDirectly}
        onClose={() => setIsInventoryOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NoirColors.background,
  },
  topBarWrapper: {
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: NoirColors.borderSubtle,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  sceneHeader: {
    gap: 4,
    width: '100%',
  },
  sceneHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  sceneBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  inventoryFastBtn: {
    backgroundColor: 'rgba(197, 160, 89, 0.12)',
    borderWidth: 1,
    borderColor: NoirColors.goldBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  inventoryFastBtnText: {
    fontSize: 9,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 0.6,
  },
  sceneTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 1.2,
    marginTop: 2,
  },
  sceneSub: {
    fontSize: 10,
    fontWeight: '700',
    color: NoirColors.goldLight,
    letterSpacing: 0.6,
  },
  toastBanner: {
    backgroundColor: NoirColors.emeraldMuted,
    borderWidth: 1,
    borderColor: NoirColors.emerald,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    alignItems: 'center',
    width: '100%',
  },
  toastText: {
    fontSize: 11,
    fontWeight: '800',
    color: NoirColors.emerald,
    letterSpacing: 0.8,
  },
  telemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
    width: '100%',
  },
  telemetryBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  telemetryValue: {
    fontSize: 15,
    fontWeight: '800',
    color: NoirColors.goldPrimary,
  },
  telemetryLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: NoirColors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  evidenceDrawerSection: {
    gap: Spacing.sm,
    width: '100%',
  },
  drawerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 1,
  },
  viewAllText: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.goldPrimary,
    letterSpacing: 0.5,
  },
  evidenceCardList: {
    gap: Spacing.sm,
    width: '100%',
  },
  clueCardPressable: {
    width: '100%',
  },
  clueCardUnlocked: {
    padding: Spacing.sm,
  },
  clueCardLocked: {
    padding: Spacing.sm,
    opacity: 0.55,
  },
  clueRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
    alignItems: 'center',
    width: '100%',
  },
  clueThumbnailContainer: {
    width: 54,
    height: 54,
    borderRadius: Radius.xs,
    overflow: 'hidden',
    backgroundColor: '#050608',
    borderWidth: 1,
    borderColor: NoirColors.borderStrong,
    flexShrink: 0,
  },
  clueThumbnail: {
    width: '100%',
    height: '100%',
  },
  clueThumbnailLocked: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  clueLockedQuestion: {
    fontSize: 18,
    fontWeight: '900',
    color: NoirColors.textMuted,
  },
  clueTextGroup: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  clueTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  clueTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: NoirColors.textPrimary,
    flex: 1,
  },
  clueTitleLocked: {
    color: NoirColors.textMuted,
  },
  clueObservation: {
    fontSize: 10,
    lineHeight: 14,
    color: NoirColors.textSecondary,
    flexWrap: 'wrap',
  },
  actionsFooter: {
    width: '100%',
    paddingTop: Spacing.xs,
  },
  btnPressed: {
    opacity: 0.75,
  },
});
