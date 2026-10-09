import React, { useState } from 'react';
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
import { SceneImages } from '@/constants/assets';
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

  const getSceneImage = (key: string) => {
    if (key === 'lastAppointment') return SceneImages.lastAppointment;
    return SceneImages.danubeEcho;
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
        </View>

        {/* Temporary Notice Banner */}
        {lockedNotice && (
          <View style={styles.noticeBanner}>
            <Text style={styles.noticeText}>{lockedNotice}</Text>
          </View>
        )}

        {/* Visual-First Case Cards List */}
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
                  style={styles.caseCard}>
                  {/* Visual Scene Artwork Banner */}
                  <View style={styles.imageContainer}>
                    <Image
                      source={getSceneImage(caseItem.coverImageKey)}
                      style={[
                        styles.coverImage,
                        caseItem.isLocked && styles.coverImageLocked,
                      ]}
                      resizeMode="cover"
                    />
                    <View style={styles.imageOverlay} />
                    <View style={styles.imageBadges}>
                      <DossierBadge
                        label={caseItem.caseNumber}
                        variant={caseItem.isLocked ? 'neutral' : 'gold'}
                      />
                      {caseItem.isLocked ? (
                        <DossierBadge label="CLASSIFIED" variant="crimson" />
                      ) : (
                        <DossierBadge label="ACTIVE" variant="emerald" />
                      )}
                    </View>
                  </View>

                  {/* Card Content */}
                  <View style={styles.cardContent}>
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

                    {/* Punchy 1-Sentence Visual Hook */}
                    <Text style={styles.synopsisText}>
                      {caseItem.microSynopsis}
                    </Text>

                    {/* Visual Progress Bar (For Unlocked Case) */}
                    {!caseItem.isLocked && (
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
                    )}

                    {/* Action Button */}
                    <NoirButton
                      label={
                        caseItem.isLocked
                          ? 'CLASSIFIED // LOCKED'
                          : 'INSPECT DOSSIER'
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
            HUNGARIAN NATIONAL POLICE ARCHIVE // 1 ACTIVE // 1 CLASSIFIED
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
    gap: Spacing.lg,
    width: '100%',
  },
  cardPressable: {
    width: '100%',
  },
  cardPressed: {
    opacity: 0.88,
  },
  caseCard: {
    padding: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#050608',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverImageLocked: {
    opacity: 0.35,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 11, 15, 0.35)',
  },
  imageBadges: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  cardContent: {
    padding: Spacing.md,
    gap: Spacing.sm + 2,
    width: '100%',
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
    fontSize: 13,
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
