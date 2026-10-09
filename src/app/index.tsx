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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}>
        {/* Cinematic Header */}
        <NoirHeader
          location={activeCase.district.toUpperCase()}
          time={activeCase.timeReported}
        />

        {/* Detective Telemetry Status Banner (In-Universe) */}
        <View style={styles.systemStatusBanner}>
          <View style={styles.systemStatusItem}>
            <Text style={styles.systemStatusLabel}>DOSSIER</Text>
            <Text style={styles.systemStatusValue}>ACTIVE FILE</Text>
          </View>
          <View style={styles.systemStatusDivider} />
          <View style={styles.systemStatusItem}>
            <Text style={styles.systemStatusLabel}>SECTOR</Text>
            <Text style={styles.systemStatusValue}>DISTRICT VIII</Text>
          </View>
          <View style={styles.systemStatusDivider} />
          <View style={styles.systemStatusItem}>
            <Text style={styles.systemStatusLabel}>PRIORITY</Text>
            <Text style={styles.systemStatusValue}>CODE 1</Text>
          </View>
        </View>

        {/* Active Case Dossier Card */}
        <NoirCard variant="elevated" hasGoldAccent style={styles.dossierCard}>
          <View style={styles.dossierHeader}>
            <View style={styles.dossierBadgeRow}>
              <DossierBadge label={activeCase.caseNumber} variant="gold" />
              <DossierBadge label="DISTRICT VIII" variant="neutral" />
              <DossierBadge label="HOMICIDE" variant="crimson" />
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
              <Text style={styles.counterLabel}>SUSPECTS</Text>
            </View>
            <View style={styles.counterBox}>
              <Text style={styles.counterNumber}>{activeCase.timeline.length}</Text>
              <Text style={styles.counterLabel}>TIMELINE</Text>
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
                        numberOfLines={1}
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

        {/* Narrative Detective Investigation Directive */}
        <NoirCard variant="surface" style={styles.directiveCard}>
          <Text style={styles.directiveCardTitle}>
            INVESTIGATION DIRECTIVE // BKR
          </Text>
          <Text style={styles.directiveCardBody}>
            All formal accusations require corroborating physical proof. Suspect
            interrogations, ballistic findings, and reconstructed timelines must
            establish guilt beyond doubt. Inconclusive deductions will be rejected by
            the Budapest Prosecutor&apos;s Office.
          </Text>
          <View style={styles.directiveCardFooter}>
            <Text style={styles.directiveCardNotice}>
              BUDAPEST METROPOLITAN POLICE — DISTRICT VIII PRECINCT
            </Text>
          </View>
        </NoirCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: NoirColors.background,
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
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  systemStatusBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: NoirColors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
  },
  systemStatusItem: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
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
    letterSpacing: 0.8,
  },
  systemStatusValue: {
    fontSize: 11,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 0.4,
    marginTop: 2,
    textAlign: 'center',
  },
  dossierCard: {
    gap: Spacing.md,
  },
  dossierHeader: {
    gap: Spacing.xs,
    width: '100%',
  },
  dossierBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
    width: '100%',
  },
  caseTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 1.2,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  caseLocation: {
    fontSize: 12,
    fontWeight: '600',
    color: NoirColors.goldPrimary,
    letterSpacing: 0.6,
    flexWrap: 'wrap',
  },
  metaSection: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: Radius.sm,
    padding: Spacing.md,
    gap: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
    width: '100%',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    width: '100%',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 0.8,
    flexShrink: 0,
    marginTop: 1,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: NoirColors.textPrimary,
    flex: 1,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
  metaValueWarning: {
    fontSize: 12,
    fontWeight: '700',
    color: NoirColors.crimson,
    flex: 1,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
  synopsisContainer: {
    gap: 3,
    width: '100%',
  },
  synopsisLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 1,
  },
  synopsisText: {
    fontSize: 13,
    lineHeight: 19,
    color: NoirColors.textSecondary,
    flexWrap: 'wrap',
  },
  telemetryCounters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
    width: '100%',
  },
  counterBox: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: Spacing.sm + 2,
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
    marginTop: 4,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  expandedDossier: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: NoirColors.goldBorder,
    gap: Spacing.sm + 2,
    width: '100%',
  },
  expandedTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 1,
  },
  evidenceItem: {
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    gap: 4,
    width: '100%',
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
    gap: Spacing.xs,
    width: '100%',
  },
  evidenceTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: NoirColors.textPrimary,
    flex: 1,
    marginRight: Spacing.xs,
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
    flexWrap: 'wrap',
  },
  evidenceLocation: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.goldLight,
    letterSpacing: 0.4,
    flexWrap: 'wrap',
  },
  feedbackBanner: {
    backgroundColor: NoirColors.goldMuted,
    borderColor: NoirColors.goldBorder,
    borderWidth: 1,
    padding: Spacing.sm,
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
  actionsContainer: {
    gap: Spacing.sm,
    width: '100%',
  },
  directiveCard: {
    gap: Spacing.xs + 2,
    borderColor: NoirColors.borderSubtle,
  },
  directiveCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 1.2,
  },
  directiveCardBody: {
    fontSize: 12,
    lineHeight: 18,
    color: NoirColors.textSecondary,
    flexWrap: 'wrap',
  },
  directiveCardFooter: {
    marginTop: Spacing.xs,
  },
  directiveCardNotice: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 0.8,
  },
});
