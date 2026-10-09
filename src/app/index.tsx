import React, { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DossierBadge } from '@/components/common/DossierBadge';
import { NoirButton } from '@/components/common/NoirButton';
import { NoirCard } from '@/components/common/NoirCard';
import { NoirHeader } from '@/components/common/NoirHeader';
import { MaxContentWidth, NoirColors, Radius, Spacing } from '@/constants/theme';
import { SAMPLE_CASE_001 } from '@/core/data/sample-case';
import { useGameStore } from '@/store/game-store';

export default function HomeScreen() {
  const { isInitialized, initialize, unlockedEvidenceIds, unlockEvidence } =
    useGameStore();
  const [isDossierExpanded, setIsDossierExpanded] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const activeCase = SAMPLE_CASE_001;

  const handleExamineScene = () => {
    // If not all evidence is unlocked yet, discover next clue
    const remainingEvidence = activeCase.evidence.filter(
      (e) => !unlockedEvidenceIds.includes(e.id)
    );

    if (remainingEvidence.length > 0) {
      const nextClue = remainingEvidence[0];
      unlockEvidence(nextClue.id);
      setActionFeedback(`EVIDENCE RECOVERED: ${nextClue.title.toUpperCase()}`);
    } else {
      setActionFeedback('ALL SCENE EVIDENCE CURRENTLY LOGGED IN DOSSIER');
    }

    setIsDossierExpanded(true);
  };

  const handleToggleDossier = () => {
    setIsDossierExpanded((prev) => !prev);
    setActionFeedback(null);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <NoirHeader
            location={activeCase.district.toUpperCase()}
            time={activeCase.timeReported}
          />

          {/* System Telemetry Banner */}
          <View style={styles.systemStatusBanner}>
            <View style={styles.systemStatusItem}>
              <Text style={styles.systemStatusLabel}>MODE</Text>
              <Text style={styles.systemStatusValue}>OFFLINE-FIRST</Text>
            </View>
            <View style={styles.systemStatusDivider} />
            <View style={styles.systemStatusItem}>
              <Text style={styles.systemStatusLabel}>LOGIC</Text>
              <Text style={styles.systemStatusValue}>TRUTH ENGINE</Text>
            </View>
            <View style={styles.systemStatusDivider} />
            <View style={styles.systemStatusItem}>
              <Text style={styles.systemStatusLabel}>BUILD</Text>
              <Text style={styles.systemStatusValue}>MILESTONE 0</Text>
            </View>
          </View>

          {/* Active Case Dossier Card */}
          <NoirCard variant="elevated" hasGoldAccent style={styles.dossierCard}>
            <View style={styles.dossierHeader}>
              <View style={styles.dossierBadgeRow}>
                <DossierBadge label={activeCase.caseNumber} variant="gold" />
                <DossierBadge label="DISTRICT VIII" variant="neutral" />
                <DossierBadge label="HOMISIDE" variant="crimson" />
              </View>
              <Text style={styles.caseTitle}>{activeCase.title.toUpperCase()}</Text>
              <Text style={styles.caseLocation}>{activeCase.district}</Text>
            </View>

            {/* Victim Brief */}
            <View style={styles.metaSection}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>VICTIM</Text>
                <Text style={styles.metaValue}>{activeCase.victim.name}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>OCCUPATION</Text>
                <Text style={styles.metaValue}>{activeCase.victim.occupation}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>CAUSE OF DEATH</Text>
                <Text style={styles.metaValueWarning}>
                  {activeCase.victim.causeOfDeath}
                </Text>
              </View>
            </View>

            {/* Synopsis */}
            <View style={styles.synopsisContainer}>
              <Text style={styles.synopsisLabel}>INCIDENT BRIEFING</Text>
              <Text style={styles.synopsisText}>{activeCase.synopsis}</Text>
            </View>

            {/* Evidence & Suspect Telemetry Counts */}
            <View style={styles.telemetryCounters}>
              <View style={styles.counterBox}>
                <Text style={styles.counterNumber}>
                  {isInitialized ? unlockedEvidenceIds.length : 1} /{' '}
                  {activeCase.evidence.length}
                </Text>
                <Text style={styles.counterLabel}>EVIDENCE LOGGED</Text>
              </View>
              <View style={styles.counterBox}>
                <Text style={styles.counterNumber}>{activeCase.suspects.length}</Text>
                <Text style={styles.counterLabel}>PERSONS OF INTEREST</Text>
              </View>
              <View style={styles.counterBox}>
                <Text style={styles.counterNumber}>{activeCase.timeline.length}</Text>
                <Text style={styles.counterLabel}>TIMELINE ENTRIES</Text>
              </View>
            </View>

            {/* Interactive Evidence Dossier Details (Toggleable) */}
            {isDossierExpanded && (
              <View style={styles.expandedDossier}>
                <Text style={styles.expandedTitle}>REGISTERED EVIDENCE FILES</Text>
                {activeCase.evidence.map((item) => {
                  const isUnlocked = unlockedEvidenceIds.includes(item.id);
                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.evidenceItem,
                        isUnlocked ? styles.evidenceUnlocked : styles.evidenceLocked,
                      ]}>
                      <View style={styles.evidenceTopRow}>
                        <Text
                          style={[
                            styles.evidenceTitle,
                            !isUnlocked && styles.evidenceTitleLocked,
                          ]}>
                          {isUnlocked ? item.title : '/// CLASSIFIED EVIDENCE ///'}
                        </Text>
                        <DossierBadge
                          label={isUnlocked ? item.type : 'UNRECOVERED'}
                          variant={isUnlocked ? 'cyan' : 'neutral'}
                        />
                      </View>
                      {isUnlocked && (
                        <>
                          <Text style={styles.evidenceDescription}>
                            {item.description}
                          </Text>
                          <Text style={styles.evidenceLocation}>
                            LOCATION: {item.locationFound}
                          </Text>
                        </>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {/* Action Feedback Prompt */}
            {actionFeedback && (
              <View style={styles.feedbackBanner}>
                <Text style={styles.feedbackText}>{actionFeedback}</Text>
              </View>
            )}

            {/* Interactive Action Controls */}
            <View style={styles.actionsContainer}>
              <NoirButton
                label={
                  isDossierExpanded
                    ? 'HIDE DOSSIER FILES'
                    : 'INSPECT CASE DOSSIER'
                }
                variant="primary"
                onPress={handleToggleDossier}
              />
              <NoirButton
                label="SCAN CRIME SCENE"
                variant="secondary"
                onPress={handleExamineScene}
              />
            </View>
          </NoirCard>

          {/* Architecture & Truth Model Card */}
          <NoirCard variant="surface" style={styles.systemCard}>
            <Text style={styles.systemCardTitle}>LOGICAL DEDUCTION PROTOCOL</Text>
            <Text style={styles.systemCardBody}>
              CASE ZERO prioritizes deterministic deduction. Each case possesses an
              immutable truth model. The outcome of your investigation is governed by
              verifiable material proof, not synthetic narrative generation.
            </Text>
            <View style={styles.systemCardFooter}>
              <Text style={styles.systemCardNotice}>
                DISTRICT VIII ARCHIVE — NEO-NOIR BUDAPEST
              </Text>
            </View>
          </NoirCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NoirColors.background,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  systemStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: NoirColors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
  },
  systemStatusItem: {
    flex: 1,
    alignItems: 'center',
  },
  systemStatusDivider: {
    width: 1,
    height: 18,
    backgroundColor: NoirColors.borderStrong,
  },
  systemStatusLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 1,
  },
  systemStatusValue: {
    fontSize: 11,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  dossierCard: {
    gap: Spacing.lg,
  },
  dossierHeader: {
    gap: Spacing.xs,
  },
  dossierBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
    flexWrap: 'wrap',
  },
  caseTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 1.5,
    marginTop: Spacing.xs,
  },
  caseLocation: {
    fontSize: 12,
    fontWeight: '600',
    color: NoirColors.goldPrimary,
    letterSpacing: 0.8,
  },
  metaSection: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: Radius.sm,
    padding: Spacing.md,
    gap: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: NoirColors.textPrimary,
  },
  metaValueWarning: {
    fontSize: 12,
    fontWeight: '700',
    color: NoirColors.crimson,
  },
  synopsisContainer: {
    gap: Spacing.xs,
  },
  synopsisLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 1.2,
  },
  synopsisText: {
    fontSize: 13,
    lineHeight: 20,
    color: NoirColors.textSecondary,
  },
  telemetryCounters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  counterBox: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
  },
  counterNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: NoirColors.goldPrimary,
  },
  counterLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: NoirColors.textMuted,
    marginTop: 4,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  expandedDossier: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: NoirColors.goldBorder,
    gap: Spacing.md,
  },
  expandedTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 1.2,
  },
  evidenceItem: {
    padding: Spacing.sm + 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    gap: 4,
  },
  evidenceUnlocked: {
    backgroundColor: NoirColors.surfaceHighlight,
    borderColor: NoirColors.borderStrong,
  },
  evidenceLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: NoirColors.borderSubtle,
    opacity: 0.6,
  },
  evidenceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  evidenceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: NoirColors.textPrimary,
  },
  evidenceTitleLocked: {
    color: NoirColors.textMuted,
    fontFamily: Platform.select({ ios: 'Courier', default: 'monospace' }),
  },
  evidenceDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: NoirColors.textSecondary,
    marginTop: 2,
  },
  evidenceLocation: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.goldLight,
    letterSpacing: 0.5,
  },
  feedbackBanner: {
    backgroundColor: NoirColors.goldMuted,
    borderColor: NoirColors.goldBorder,
    borderWidth: 1,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 1,
  },
  actionsContainer: {
    gap: Spacing.sm,
  },
  systemCard: {
    gap: Spacing.xs + 2,
    borderColor: NoirColors.borderSubtle,
  },
  systemCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 1.5,
  },
  systemCardBody: {
    fontSize: 12,
    lineHeight: 18,
    color: NoirColors.textSecondary,
  },
  systemCardFooter: {
    marginTop: Spacing.xs,
  },
  systemCardNotice: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 1,
  },
});
