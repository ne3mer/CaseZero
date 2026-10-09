import React, { useState } from 'react';
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
import { MaxContentWidth, NoirColors, Radius, Spacing } from '@/constants/theme';
import { CASE_REGISTRY, CaseListItem } from '@/core/data/cases';
import { useGameStore } from '@/store/game-store';

export default function CaseSelectionScreen() {
  const router = useRouter();
  const { unlockedEvidenceIds } = useGameStore();
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const handleSelectCase = (caseItem: CaseListItem) => {
    if (caseItem.isLocked) {
      setLockedNotice(
        caseItem.lockReason || 'Dossier classified by Central Command.'
      );
      setTimeout(() => setLockedNotice(null), 3500);
      return;
    }

    router.push({
      pathname: '/briefing',
      params: { caseId: caseItem.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Bar Navigation */}
      <View style={styles.topBarWrapper}>
        <NoirTopBar
          onBack={() => router.back()}
          backLabel="MAIN MENU"
          rightBadge="DOSSIER ARCHIVE"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}>
        {/* Screen Header */}
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>CASE FILES</Text>
          <Text style={styles.screenSub}>
            SELECT AN INVESTIGATION DOSSIER TO BEGIN BRIEFING
          </Text>
          <View style={styles.accentDivider}>
            <View style={styles.accentBarGold} />
            <View style={styles.accentBarMuted} />
          </View>
        </View>

        {/* Temporary Notice / Info Banner */}
        {lockedNotice && (
          <View style={styles.noticeBanner}>
            <Text style={styles.noticeText}>{lockedNotice}</Text>
          </View>
        )}

        {/* Case Cards List */}
        <View style={styles.caseList}>
          {CASE_REGISTRY.map((caseItem) => {
            const isCZ001 = caseItem.id === 'case_001';
            const evidenceCount = isCZ001 ? unlockedEvidenceIds.length : 0;
            const progressRatio = isCZ001
              ? evidenceCount / caseItem.totalEvidenceCount
              : 0;

            return (
              <Pressable
                key={caseItem.id}
                onPress={() => handleSelectCase(caseItem)}
                style={({ pressed }) => [
                  styles.cardPressable,
                  pressed && styles.cardPressed,
                ]}>
                <NoirCard
                  variant={caseItem.isLocked ? 'surface' : 'elevated'}
                  hasGoldAccent={!caseItem.isLocked}
                  style={caseItem.isLocked ? styles.lockedCard : styles.unlockedCard}>
                  {/* Card Top Row */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.badgeGroup}>
                      <DossierBadge
                        label={caseItem.caseNumber}
                        variant={caseItem.isLocked ? 'neutral' : 'gold'}
                      />
                      {caseItem.isLocked ? (
                        <DossierBadge label="CLASSIFIED" variant="crimson" />
                      ) : (
                        <DossierBadge label="ACTIVE" variant="emerald" />
                      )}
                      {caseItem.id === 'case_002' && (
                        <DossierBadge label="OFFICIAL FIRST CASE" variant="neutral" />
                      )}
                    </View>
                    <Text style={styles.cardStatusLabel}>
                      {caseItem.isLocked ? 'SEALED' : 'OPEN'}
                    </Text>
                  </View>

                  {/* Title & Location */}
                  <View style={styles.titleWrapper}>
                    <Text
                      style={[
                        styles.caseTitle,
                        caseItem.isLocked && styles.caseTitleLocked,
                      ]}>
                      {caseItem.title.toUpperCase()}
                    </Text>
                    <Text style={styles.caseDistrict}>{caseItem.district}</Text>
                  </View>

                  {/* Synopsis */}
                  <Text style={styles.synopsisText}>{caseItem.synopsis}</Text>

                  {/* Progress Indicator (For Unlocked Case) */}
                  {!caseItem.isLocked ? (
                    <View style={styles.progressSection}>
                      <View style={styles.progressLabels}>
                        <Text style={styles.progressLabel}>EVIDENCE DISCOVERED</Text>
                        <Text style={styles.progressValue}>
                          {evidenceCount} / {caseItem.totalEvidenceCount} LOGGED
                        </Text>
                      </View>
                      <View style={styles.progressBarTrack}>
                        <View
                          style={[
                            styles.progressBarFill,
                            { width: `${Math.max(progressRatio * 100, 15)}%` },
                          ]}
                        />
                      </View>
                    </View>
                  ) : (
                    <View style={styles.lockedInfoBox}>
                      <Text style={styles.lockedInfoText}>
                        DOSSIER CZ-002 PENDING CLEARANCE FROM CENTRAL COMMAND
                      </Text>
                    </View>
                  )}

                  {/* Action Button */}
                  <View style={styles.cardActionWrapper}>
                    <NoirButton
                      label={
                        caseItem.isLocked
                          ? 'CLASSIFIED DOSSIER'
                          : 'INSPECT DOSSIER BRIEFING'
                      }
                      variant={caseItem.isLocked ? 'ghost' : 'primary'}
                      disabled={caseItem.isLocked}
                      onPress={() => handleSelectCase(caseItem)}
                    />
                  </View>
                </NoirCard>
              </Pressable>
            );
          })}
        </View>

        {/* Registry Summary Footer */}
        <View style={styles.registryFooter}>
          <Text style={styles.registryFooterText}>
            HUNGARIAN NATIONAL POLICE ARCHIVE // 1 CASE ACTIVE // 1 CLASSIFIED
          </Text>
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
    gap: Spacing.lg,
  },
  headerSection: {
    gap: Spacing.xs,
    width: '100%',
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 2,
  },
  screenSub: {
    fontSize: 10,
    fontWeight: '700',
    color: NoirColors.goldLight,
    letterSpacing: 1,
  },
  accentDivider: {
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
  noticeBanner: {
    backgroundColor: NoirColors.crimsonMuted,
    borderWidth: 1,
    borderColor: NoirColors.crimsonBorder,
    padding: Spacing.sm + 2,
    borderRadius: Radius.sm,
    width: '100%',
  },
  noticeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFA4A4',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  caseList: {
    gap: Spacing.md,
    width: '100%',
  },
  cardPressable: {
    width: '100%',
  },
  cardPressed: {
    opacity: 0.85,
  },
  unlockedCard: {
    gap: Spacing.sm + 2,
  },
  lockedCard: {
    gap: Spacing.sm + 2,
    opacity: 0.75,
    borderColor: NoirColors.borderSubtle,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  badgeGroup: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
    alignItems: 'center',
    flex: 1,
  },
  cardStatusLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.textMuted,
    letterSpacing: 1,
    marginLeft: Spacing.xs,
  },
  titleWrapper: {
    gap: 2,
    width: '100%',
  },
  caseTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 1.2,
    flexWrap: 'wrap',
  },
  caseTitleLocked: {
    color: NoirColors.textSecondary,
  },
  caseDistrict: {
    fontSize: 11,
    fontWeight: '600',
    color: NoirColors.goldPrimary,
    letterSpacing: 0.5,
    flexWrap: 'wrap',
  },
  synopsisText: {
    fontSize: 12,
    lineHeight: 18,
    color: NoirColors.textSecondary,
    flexWrap: 'wrap',
  },
  progressSection: {
    gap: 4,
    width: '100%',
    paddingTop: Spacing.xs,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 0.5,
  },
  progressValue: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.goldLight,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: Radius.full,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: NoirColors.goldPrimary,
    borderRadius: Radius.full,
  },
  lockedInfoBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
  },
  lockedInfoText: {
    fontSize: 10,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 0.5,
  },
  cardActionWrapper: {
    marginTop: Spacing.xs,
    width: '100%',
  },
  registryFooter: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: NoirColors.borderSubtle,
    width: '100%',
  },
  registryFooterText: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
});
