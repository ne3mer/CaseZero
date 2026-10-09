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
import { EvidenceImages, SceneImages } from '@/constants/assets';
import { MaxContentWidth, NoirColors, Radius, Spacing } from '@/constants/theme';
import { getCaseById } from '@/core/data/cases';
import { SAMPLE_DEV_CASE } from '@/core/data/sample-case';
import { useGameStore } from '@/store/game-store';

export default function InvestigationScreen() {
  const router = useRouter();
  const { isInitialized, initialize, unlockedEvidenceIds, unlockEvidence, activeCaseId } =
    useGameStore();
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(
    null
  );
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const activeCase = (activeCaseId ? getCaseById(activeCaseId) : null) || SAMPLE_DEV_CASE;

  const handleExamineScene = () => {
    const remaining = activeCase.evidence.filter(
      (e) => !unlockedEvidenceIds.includes(e.id)
    );

    if (remaining.length > 0) {
      const nextClue = remaining[0];
      unlockEvidence(nextClue.id);
      setSelectedEvidenceId(nextClue.id);
      setActionFeedback(`CLUE RECOVERED: ${nextClue.title.toUpperCase()}`);
    } else {
      setActionFeedback('ALL SCENE EVIDENCE LOGGED');
    }
  };

  const getEvidenceImage = (id: string) => {
    return EvidenceImages[id] || EvidenceImages.ev_spent_shell_casing;
  };

  const getSceneImage = (key?: string) => {
    if (key === 'watchmakerAtelier') return SceneImages.watchmakerAtelier;
    if (key === 'danubeEcho') return SceneImages.danubeEcho;
    return SceneImages.watchmakerAtelier;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Bar Navigation */}
      <View style={styles.topBarWrapper}>
        <NoirTopBar
          onBack={() => router.back()}
          backLabel="CASE BRIEFING"
          rightBadge="CRIME SCENE"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}>
        {/* Crime Scene Visual Snapshot Card */}
        <NoirCard variant="elevated" hasGoldAccent style={styles.sceneCard}>
          <View style={styles.sceneImageContainer}>
            <Image
              source={getSceneImage(activeCase.coverImageKey)}
              style={styles.sceneImage}
              resizeMode="cover"
            />
            <View style={styles.sceneOverlay} />
            <View style={styles.sceneBadges}>
              <DossierBadge label={activeCase.caseNumber} variant="gold" />
              <DossierBadge label="DISTRICT VIII" variant="neutral" />
            </View>
          </View>

          <View style={styles.sceneInfo}>
            <View style={styles.sceneHeaderRow}>
              <Text style={styles.sceneTitle}>{activeCase.title.toUpperCase()}</Text>
              <Text style={styles.sceneTime}>{activeCase.timeReported}</Text>
            </View>
            <Text style={styles.scenePrompt}>
              Népszínház Utca Atelier — Search the environment for physical ballistics and documentation.
            </Text>
          </View>

          {/* Quick Scene Action Button */}
          <View style={styles.sceneActionWrapper}>
            <NoirButton
              label="EXAMINE ENVIRONMENT"
              variant="primary"
              onPress={handleExamineScene}
            />
          </View>
        </NoirCard>

        {/* Action Feedback Prompt */}
        {actionFeedback && (
          <View style={styles.feedbackBanner}>
            <Text style={styles.feedbackText}>{actionFeedback}</Text>
          </View>
        )}

        {/* Visual Telemetry Clue Counters */}
        <View style={styles.countersRow}>
          <View style={styles.counterBox}>
            <Text style={styles.counterNumber}>
              {isInitialized ? unlockedEvidenceIds.length : 1} /{' '}
              {activeCase.evidence.length}
            </Text>
            <Text style={styles.counterLabel}>EVIDENCE</Text>
          </View>
          <View style={styles.counterBox}>
            <Text style={styles.counterNumber}>{activeCase.suspects.length}</Text>
            <Text style={styles.counterLabel}>SUSPECTS</Text>
          </View>
          <View style={styles.counterBox}>
            <Text style={styles.counterNumber}>{activeCase.timeline.length}</Text>
            <Text style={styles.counterLabel}>TIMELINE</Text>
          </View>
        </View>

        {/* Visual-First Evidence Cards List */}
        <View style={styles.evidenceSection}>
          <Text style={styles.sectionHeader}>RECOVERED EVIDENCE</Text>

          <View style={styles.evidenceList}>
            {activeCase.evidence.map((item) => {
              const isUnlocked = unlockedEvidenceIds.includes(item.id);
              const isSelected = selectedEvidenceId === item.id;

              return (
                <Pressable
                  key={item.id}
                  disabled={!isUnlocked}
                  onPress={() =>
                    setSelectedEvidenceId((prev) =>
                      prev === item.id ? null : item.id
                    )
                  }
                  style={({ pressed }) => [
                    styles.evidenceCardPressable,
                    pressed && styles.evidenceCardPressed,
                  ]}>
                  <NoirCard
                    variant={isUnlocked ? 'elevated' : 'surface'}
                    hasGoldAccent={isSelected}
                    style={isUnlocked ? styles.evidenceCardUnlocked : styles.evidenceCardLocked}>
                    <View style={styles.evidenceRow}>
                      {/* Visual Thumbnail */}
                      <View style={styles.thumbnailContainer}>
                        {isUnlocked ? (
                          <Image
                            source={getEvidenceImage(item.id)}
                            style={styles.thumbnail}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.thumbnailLocked}>
                            <Text style={styles.lockIcon}>?</Text>
                          </View>
                        )}
                      </View>

                      {/* Evidence Metadata (Title + 1-Sentence Observation) */}
                      <View style={styles.evidenceTextGroup}>
                        <View style={styles.evidenceTopRow}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.evidenceTitle,
                              !isUnlocked && styles.evidenceTitleLocked,
                            ]}>
                            {isUnlocked ? item.title : 'UNDISCOVERED CLUE'}
                          </Text>
                          <DossierBadge
                            label={isUnlocked ? item.type : 'LOCKED'}
                            variant={isUnlocked ? 'cyan' : 'neutral'}
                          />
                        </View>

                        {/* One Short Description Line (Show, Don't Tell) */}
                        <Text
                          numberOfLines={isSelected ? undefined : 2}
                          style={styles.evidenceObservation}>
                          {isUnlocked
                            ? item.shortObservation || item.description
                            : 'Examine the crime scene to uncover this material proof.'}
                        </Text>
                      </View>
                    </View>

                    {/* Progressive Disclosure: Expanded Location and Forensics */}
                    {isUnlocked && isSelected && (
                      <View style={styles.disclosureSection}>
                        <View style={styles.disclosureDivider} />
                        <Text style={styles.disclosureLocation}>
                          FOUND: {item.locationFound.toUpperCase()}
                        </Text>
                        <Text style={styles.disclosureFullDesc}>
                          {item.description}
                        </Text>
                      </View>
                    )}
                  </NoirCard>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  sceneCard: {
    padding: 0,
    overflow: 'hidden',
  },
  sceneImageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#050608',
  },
  sceneImage: {
    width: '100%',
    height: '100%',
  },
  sceneOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 11, 15, 0.25)',
  },
  sceneBadges: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  sceneInfo: {
    padding: Spacing.md,
    gap: 4,
    width: '100%',
  },
  sceneHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  sceneTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 1,
  },
  sceneTime: {
    fontSize: 10,
    fontWeight: '700',
    color: NoirColors.goldLight,
  },
  scenePrompt: {
    fontSize: 12,
    lineHeight: 17,
    color: NoirColors.textSecondary,
    flexWrap: 'wrap',
  },
  sceneActionWrapper: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    width: '100%',
  },
  feedbackBanner: {
    backgroundColor: NoirColors.goldMuted,
    borderWidth: 1,
    borderColor: NoirColors.goldBorder,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    alignItems: 'center',
    width: '100%',
  },
  feedbackText: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  countersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
    width: '100%',
  },
  counterBox: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: Spacing.sm,
    paddingHorizontal: 2,
    borderRadius: Radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
  },
  counterNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: NoirColors.goldPrimary,
  },
  counterLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.textMuted,
    marginTop: 2,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  evidenceSection: {
    gap: Spacing.sm,
    width: '100%',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 1,
  },
  evidenceList: {
    gap: Spacing.sm + 2,
    width: '100%',
  },
  evidenceCardPressable: {
    width: '100%',
  },
  evidenceCardPressed: {
    opacity: 0.85,
  },
  evidenceCardUnlocked: {
    gap: Spacing.xs,
  },
  evidenceCardLocked: {
    gap: Spacing.xs,
    opacity: 0.5,
  },
  evidenceRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
    width: '100%',
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: Radius.sm,
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
  thumbnailLocked: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  lockIcon: {
    fontSize: 20,
    fontWeight: '900',
    color: NoirColors.textMuted,
  },
  evidenceTextGroup: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  evidenceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.xs,
    width: '100%',
  },
  evidenceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: NoirColors.textPrimary,
    flex: 1,
  },
  evidenceTitleLocked: {
    color: NoirColors.textMuted,
  },
  evidenceObservation: {
    fontSize: 11,
    lineHeight: 16,
    color: NoirColors.textSecondary,
    flexWrap: 'wrap',
  },
  disclosureSection: {
    marginTop: Spacing.xs,
    gap: 4,
    width: '100%',
  },
  disclosureDivider: {
    height: 1,
    backgroundColor: NoirColors.borderSubtle,
    marginVertical: 4,
  },
  disclosureLocation: {
    fontSize: 9,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 0.5,
  },
  disclosureFullDesc: {
    fontSize: 11,
    lineHeight: 16,
    color: NoirColors.textSecondary,
    flexWrap: 'wrap',
  },
});
