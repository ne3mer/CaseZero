import React, { useEffect, useState } from 'react';
import {
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
import { DeductionWorkspace } from '@/components/deduction/DeductionWorkspace';
import { DiscoveredDeductionsList } from '@/components/deduction/DiscoveredDeductionsList';
import {
  BoardEntity,
  EvidenceBoardRecordItem,
} from '@/components/deduction/EvidenceBoardRecordItem';
import { MaxContentWidth, NoirColors, Radius, Spacing } from '@/constants/theme';
import { getCaseById } from '@/core/data/cases';
import { SAMPLE_DEV_CASE } from '@/core/data/sample-case';
import { DeductionRelationship } from '@/core/types/deduction';
import { useGameStore } from '@/store/game-store';

type RecordTab = 'evidence' | 'timeline' | 'suspects';

export default function EvidenceBoardScreen() {
  const router = useRouter();
  const {
    initialize,
    activeCaseId,
    unlockedEvidenceIds,
    discoveredDeductionIds,
    submitDeduction,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<RecordTab>('evidence');
  const [slot1Entity, setSlot1Entity] = useState<BoardEntity | null>(null);
  const [slot2Entity, setSlot2Entity] = useState<BoardEntity | null>(null);
  const [selectedRelationship, setSelectedRelationship] =
    useState<DeductionRelationship | null>(null);
  const [corroboratingEvidence, setCorroboratingEvidence] = useState<BoardEntity[]>([]);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'neutral';
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const activeCase =
    (activeCaseId ? getCaseById(activeCaseId) : null) || SAMPLE_DEV_CASE;
  const isCaseLocked = activeCase.isLocked;

  // Map case records into uniform BoardEntity structures
  const collectedEvidenceEntities: BoardEntity[] = activeCase.evidence
    .filter((e) => unlockedEvidenceIds.includes(e.id))
    .map((e) => ({
      id: e.id,
      type: 'evidence',
      title: e.title,
      subtitle: e.locationFound,
      description: e.shortObservation || e.description,
      badgeLabel: e.type,
      isKey: e.isKeyEvidence,
    }));

  const timelineEntities: BoardEntity[] = activeCase.timeline.map((t) => ({
    id: t.id,
    type: 'timeline',
    title: `TIMELINE: ${t.time}`,
    subtitle: 'VERIFIED REPORT',
    description: t.description,
    badgeLabel: 'CHRONOLOGY',
  }));

  const suspectEntities: BoardEntity[] = activeCase.suspects.map((s) => ({
    id: s.id,
    type: 'statement',
    title: `${s.name} (${s.occupation})`,
    subtitle: s.relationshipToVictim,
    description: `ALIBI: "${s.alibi}"`,
    badgeLabel: 'TESTIMONY',
  }));

  const getDisplayedEntities = (): BoardEntity[] => {
    switch (activeTab) {
      case 'evidence':
        return collectedEvidenceEntities;
      case 'timeline':
        return timelineEntities;
      case 'suspects':
        return suspectEntities;
      default:
        return [];
    }
  };

  const getSelectionRole = (id: string): 'slot1' | 'slot2' | 'supporting' | null => {
    if (slot1Entity?.id === id) return 'slot1';
    if (slot2Entity?.id === id) return 'slot2';
    if (corroboratingEvidence.some((e) => e.id === id)) return 'supporting';
    return null;
  };

  const handleToggleEntitySelection = (entity: BoardEntity) => {
    // 1. If entity is currently in Slot 1 -> deselect from Slot 1
    if (slot1Entity?.id === entity.id) {
      setSlot1Entity(null);
      return;
    }

    // 2. If entity is currently in Slot 2 -> deselect from Slot 2
    if (slot2Entity?.id === entity.id) {
      setSlot2Entity(null);
      return;
    }

    // 3. If entity is currently in Corroborating -> remove it
    if (corroboratingEvidence.some((e) => e.id === entity.id)) {
      setCorroboratingEvidence((prev) => prev.filter((e) => e.id !== entity.id));
      return;
    }

    // 4. If Slot 1 is empty -> assign to Slot 1
    if (!slot1Entity) {
      setSlot1Entity(entity);
      return;
    }

    // 5. If Slot 2 is empty -> assign to Slot 2
    if (!slot2Entity) {
      setSlot2Entity(entity);
      return;
    }

    // 6. If both slots are occupied and this item is evidence -> add to corroborating
    if (entity.type === 'evidence') {
      setCorroboratingEvidence((prev) => [...prev, entity]);
    } else {
      // Replace Slot 2 if non-evidence item chosen
      setSlot2Entity(entity);
    }
  };

  const handleResetAll = () => {
    setSlot1Entity(null);
    setSlot2Entity(null);
    setSelectedRelationship(null);
    setCorroboratingEvidence([]);
    setFeedback(null);
  };

  const handleSubmitDeduction = async () => {
    if (!slot1Entity || !slot2Entity || !selectedRelationship) return;

    setIsSubmitting(true);

    // Aggregate all provided evidence IDs from Slot 1, Slot 2, and Corroborating tray
    const providedEvidenceIds: string[] = [];
    if (slot1Entity.type === 'evidence') providedEvidenceIds.push(slot1Entity.id);
    if (slot2Entity.type === 'evidence') providedEvidenceIds.push(slot2Entity.id);
    for (const ev of corroboratingEvidence) {
      if (!providedEvidenceIds.includes(ev.id)) {
        providedEvidenceIds.push(ev.id);
      }
    }

    const attempt = {
      caseId: activeCase.id,
      relationship: selectedRelationship,
      sourceId: slot1Entity.id,
      targetId: slot2Entity.id,
      providedEvidenceIds,
    };

    const result = await submitDeduction(attempt, activeCase.deductions || []);

    setIsSubmitting(false);

    if (result.isSuccess) {
      setFeedback({
        type: 'success',
        message: result.message,
      });
      // Clear workspace slots on success
      setSlot1Entity(null);
      setSlot2Entity(null);
      setSelectedRelationship(null);
      setCorroboratingEvidence([]);
    } else {
      // Neutral, spoiler-free feedback
      setFeedback({
        type: 'neutral',
        message: result.message,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Bar Navigation */}
      <View style={styles.topBarWrapper}>
        <NoirTopBar
          onBack={() => router.back()}
          backLabel="CRIME SCENE"
          rightBadge={`${activeCase.caseNumber} // DEDUCTION BOARD`}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}>
        {/* Header Branding */}
        <View style={styles.headerSection}>
          <View style={styles.headerBadgesRow}>
            <DossierBadge label={activeCase.caseNumber} variant="gold" />
            <DossierBadge label="EVIDENCE BOARD" variant="neutral" />
            <DossierBadge
              label={`${discoveredDeductionIds.length} / ${
                activeCase.deductions?.length || 0
              } SOLVED`}
              variant="emerald"
            />
          </View>
          <Text style={styles.screenTitle}>{activeCase.title.toUpperCase()}</Text>
          <Text style={styles.screenSub}>
            CORRELATE SECURED EVIDENCE WITH WITNESS CLAIMS &amp; TIMELINE TO UNCOVER TRUTH
          </Text>
        </View>

        {/* Feedback Banner */}
        {feedback && (
          <View
            style={[
              styles.feedbackBanner,
              feedback.type === 'success'
                ? styles.feedbackBannerSuccess
                : styles.feedbackBannerNeutral,
            ]}>
            <View style={styles.feedbackContent}>
              <Text
                style={[
                  styles.feedbackTitle,
                  feedback.type === 'success'
                    ? styles.feedbackTitleSuccess
                    : styles.feedbackTitleNeutral,
                ]}>
                {feedback.type === 'success'
                  ? '✓ DEDUCTION CONFIRMED'
                  : 'INQUIRY INCONCLUSIVE'}
              </Text>
              <Text
                style={[
                  styles.feedbackBody,
                  feedback.type === 'success'
                    ? styles.feedbackBodySuccess
                    : styles.feedbackBodyNeutral,
                ]}>
                {feedback.message}
              </Text>
            </View>
            <Pressable
              onPress={() => setFeedback(null)}
              hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
              style={styles.feedbackDismiss}>
              <Text style={styles.feedbackDismissText}>✕</Text>
            </Pressable>
          </View>
        )}

        {/* Locked Case Guard */}
        {isCaseLocked ? (
          <NoirCard variant="surface" style={styles.lockedCaseCard}>
            <Text style={styles.lockedCaseTitle}>DOSSIER CLASSIFIED</Text>
            <Text style={styles.lockedCaseSub}>
              This case is in pre-investigation. Evidence board deduction logic is locked pending official truth model clearance.
            </Text>
            <NoirButton
              label="RETURN TO CASE ARCHIVE"
              variant="secondary"
              onPress={() => router.push('/cases')}
            />
          </NoirCard>
        ) : unlockedEvidenceIds.length === 0 ? (
          /* Empty Inventory Warning Guard */
          <NoirCard variant="surface" style={styles.emptyInventoryCard}>
            <Text style={styles.emptyInventoryTitle}>NO EVIDENCE SECURED</Text>
            <Text style={styles.emptyInventorySub}>
              You must investigate the crime scene and recover physical material evidence before establishing deductions on the board.
            </Text>
            <NoirButton
              label="ENTER CRIME SCENE"
              variant="primary"
              onPress={() => router.push('/investigation')}
            />
          </NoirCard>
        ) : (
          <>
            {/* Deduction Builder Workspace */}
            <DeductionWorkspace
              slot1Entity={slot1Entity}
              slot2Entity={slot2Entity}
              selectedRelationship={selectedRelationship}
              corroboratingEvidence={corroboratingEvidence}
              onSelectRelationship={setSelectedRelationship}
              onClearSlot1={() => setSlot1Entity(null)}
              onClearSlot2={() => setSlot2Entity(null)}
              onRemoveCorroborating={(id) =>
                setCorroboratingEvidence((prev) => prev.filter((e) => e.id !== id))
              }
              onResetAll={handleResetAll}
              onSubmit={handleSubmitDeduction}
              isSubmitting={isSubmitting}
            />

            {/* Material Records Explorer */}
            <View style={styles.recordsSection}>
              <View style={styles.recordsSectionHeader}>
                <Text style={styles.recordsTitle}>DOSSIER MATERIAL RECORDS</Text>
                <Text style={styles.recordsSub}>TAP ITEMS TO ATTACH TO SLOTS ABOVE</Text>
              </View>

              {/* Filter Tabs */}
              <View style={styles.tabsRow}>
                <Pressable
                  onPress={() => setActiveTab('evidence')}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  style={[
                    styles.tabBtn,
                    activeTab === 'evidence' && styles.tabBtnActive,
                  ]}>
                  <Text
                    style={[
                      styles.tabBtnText,
                      activeTab === 'evidence' && styles.tabBtnTextActive,
                    ]}>
                    EVIDENCE ({collectedEvidenceEntities.length})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveTab('timeline')}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  style={[
                    styles.tabBtn,
                    activeTab === 'timeline' && styles.tabBtnActive,
                  ]}>
                  <Text
                    style={[
                      styles.tabBtnText,
                      activeTab === 'timeline' && styles.tabBtnTextActive,
                    ]}>
                    TIMELINE ({timelineEntities.length})
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setActiveTab('suspects')}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  style={[
                    styles.tabBtn,
                    activeTab === 'suspects' && styles.tabBtnActive,
                  ]}>
                  <Text
                    style={[
                      styles.tabBtnText,
                      activeTab === 'suspects' && styles.tabBtnTextActive,
                    ]}>
                    STATEMENTS ({suspectEntities.length})
                  </Text>
                </Pressable>
              </View>

              {/* Records List */}
              <View style={styles.recordsList}>
                {getDisplayedEntities().map((entity) => (
                  <EvidenceBoardRecordItem
                    key={entity.id}
                    entity={entity}
                    selectionRole={getSelectionRole(entity.id)}
                    onPress={() => handleToggleEntitySelection(entity)}
                  />
                ))}
              </View>
            </View>

            {/* Discovered Deductions Archive */}
            <DiscoveredDeductionsList
              allCaseDeductions={activeCase.deductions || []}
              discoveredDeductionIds={discoveredDeductionIds}
            />
          </>
        )}
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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  headerSection: {
    gap: 4,
    width: '100%',
  },
  headerBadgesRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 1.5,
  },
  screenSub: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.goldLight,
    letterSpacing: 0.8,
  },
  feedbackBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1,
    gap: Spacing.sm,
    width: '100%',
  },
  feedbackBannerSuccess: {
    backgroundColor: 'rgba(61, 184, 126, 0.15)',
    borderColor: NoirColors.emerald,
  },
  feedbackBannerNeutral: {
    backgroundColor: 'rgba(197, 160, 89, 0.12)',
    borderColor: NoirColors.goldBorder,
  },
  feedbackContent: {
    flex: 1,
    gap: 2,
  },
  feedbackTitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  feedbackTitleSuccess: {
    color: NoirColors.emerald,
  },
  feedbackTitleNeutral: {
    color: NoirColors.goldLight,
  },
  feedbackBody: {
    fontSize: 11,
    lineHeight: 16,
  },
  feedbackBodySuccess: {
    color: NoirColors.textPrimary,
  },
  feedbackBodyNeutral: {
    color: NoirColors.textSecondary,
  },
  feedbackDismiss: {
    padding: 4,
  },
  feedbackDismissText: {
    fontSize: 12,
    color: NoirColors.textMuted,
  },
  lockedCaseCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
    alignItems: 'center',
  },
  lockedCaseTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: NoirColors.textMuted,
    letterSpacing: 1,
  },
  lockedCaseSub: {
    fontSize: 11,
    lineHeight: 16,
    color: NoirColors.textSecondary,
    textAlign: 'center',
  },
  emptyInventoryCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
    alignItems: 'center',
  },
  emptyInventoryTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: NoirColors.goldLight,
    letterSpacing: 1,
  },
  emptyInventorySub: {
    fontSize: 11,
    lineHeight: 16,
    color: NoirColors.textSecondary,
    textAlign: 'center',
  },
  recordsSection: {
    gap: Spacing.sm,
    width: '100%',
  },
  recordsSectionHeader: {
    gap: 2,
    paddingHorizontal: 2,
  },
  recordsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 0.8,
  },
  recordsSub: {
    fontSize: 8,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 0.5,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    width: '100%',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: Radius.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(197, 160, 89, 0.15)',
    borderColor: NoirColors.goldPrimary,
  },
  tabBtnText: {
    fontSize: 9,
    fontWeight: '800',
    color: NoirColors.textMuted,
    letterSpacing: 0.5,
  },
  tabBtnTextActive: {
    color: NoirColors.goldLight,
  },
  recordsList: {
    gap: Spacing.sm,
    width: '100%',
  },
});
