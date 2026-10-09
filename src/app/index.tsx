import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DossierBadge } from '@/components/common/DossierBadge';
import { NoirButton } from '@/components/common/NoirButton';
import { NoirCard } from '@/components/common/NoirCard';
import { MaxContentWidth, NoirColors, Radius, Spacing } from '@/constants/theme';
import { SAMPLE_DEV_CASE } from '@/core/data/sample-case';
import { CaseStorage, GameSettings } from '@/storage/case-storage';
import { useGameStore } from '@/store/game-store';

export default function MainMenuScreen() {
  const router = useRouter();
  const { isInitialized, initialize, unlockedEvidenceIds, resetActiveCaseProgress } =
    useGameStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({
    hapticsEnabled: true,
    ambientSoundEnabled: true,
    textSize: 'default',
  });
  const [resetConfirmMsg, setResetConfirmMsg] = useState<string | null>(null);

  useEffect(() => {
    initialize();
    CaseStorage.getSettings().then(setSettings);
  }, [initialize]);

  const activeCase = SAMPLE_DEV_CASE;
  const hasProgress = isInitialized && unlockedEvidenceIds.length > 0;

  const handleUpdateSetting = async (key: keyof GameSettings, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    await CaseStorage.saveSettings({ [key]: value });
  };

  const handleResetProgress = async () => {
    await resetActiveCaseProgress(activeCase.id);
    setResetConfirmMsg('PROGRESS RESET TO CRIME SCENE INITIAL STATE');
    setTimeout(() => setResetConfirmMsg(null), 3000);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/* Top Atmosphere Telemetry */}
        <View style={styles.topTelemetry}>
          <View style={styles.telemetryDot} />
          <Text style={styles.telemetryText}>
            BUDAPEST // LAT 47.4979° N // 03:42 CET
          </Text>
        </View>

        {/* Central Emblem & Title Hero */}
        <View style={styles.heroSection}>
          {/* Precinct Monogram Badge */}
          <View style={styles.emblemContainer}>
            <View style={styles.emblemOuterRing}>
              <View style={styles.emblemInnerRing}>
                <Text style={styles.emblemMonogram}>CZ</Text>
              </View>
            </View>
            <View style={styles.emblemRibbon}>
              <Text style={styles.emblemRibbonText}>DISTRICT VIII PRECINCT</Text>
            </View>
          </View>

          {/* Title Branding */}
          <View style={styles.titleGroup}>
            <Text
              style={styles.gameTitle}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}>
              CASE ZERO
            </Text>
            <Text style={styles.subTitle}>
              HUNGARIAN FORENSIC &amp; CRIMINAL INVESTIGATION
            </Text>
            <View style={styles.taglineWrapper}>
              <View style={styles.taglineLine} />
              <Text style={styles.taglineText}>
                &ldquo;Every Lie Leaves a Trace&rdquo;
              </Text>
              <View style={styles.taglineLine} />
            </View>
          </View>
        </View>

        {/* Active Investigation Telemetry Strip (if progress exists) */}
        {hasProgress && (
          <NoirCard variant="elevated" hasGoldAccent style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <DossierBadge label="ACTIVE INVESTIGATION" variant="gold" />
              <Text style={styles.progressCaseNum}>
                {activeCase.caseNumber}
              </Text>
            </View>
            <Text style={styles.progressCaseTitle}>
              {activeCase.title.toUpperCase()}
            </Text>
            <View style={styles.progressStatsRow}>
              <Text style={styles.progressStatsLabel}>EVIDENCE LOGGED</Text>
              <Text style={styles.progressStatsValue}>
                {unlockedEvidenceIds.length} OF {activeCase.evidence.length} SECURED
              </Text>
            </View>
          </NoirCard>
        )}

        {/* Action Controls */}
        <View style={styles.menuActions}>
          {hasProgress ? (
            <>
              <NoirButton
                label="CONTINUE INVESTIGATION"
                variant="primary"
                onPress={() => router.push('/investigation')}
              />
              <NoirButton
                label="CASE SELECTION"
                variant="secondary"
                onPress={() => router.push('/cases')}
              />
            </>
          ) : (
            <>
              <NoirButton
                label="START INVESTIGATION"
                variant="primary"
                onPress={() => router.push('/cases')}
              />
              <NoirButton
                label="CASE SELECTION"
                variant="secondary"
                onPress={() => router.push('/cases')}
              />
            </>
          )}

          <NoirButton
            label="INVESTIGATION SETTINGS"
            variant="ghost"
            onPress={() => setIsSettingsOpen(true)}
          />
        </View>

        {/* Atmospheric Bottom Note */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerDepartment}>
            BUDAPESTI RENDŐR-FŐKAPITÁNYSÁG
          </Text>
          <Text style={styles.footerPrecinct}>
            CRIMINAL INVESTIGATION DIVISION — JÓZSEFVÁROS ARCHIVE
          </Text>
        </View>
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        visible={isSettingsOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsSettingsOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <NoirCard variant="elevated" hasGoldAccent style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>INVESTIGATION SETTINGS</Text>
                <DossierBadge label="PREFERENCES" variant="gold" />
              </View>

              <View style={styles.settingsRow}>
                <View style={styles.settingsLabelGroup}>
                  <Text style={styles.settingItemLabel}>HAPTIC FEEDBACK</Text>
                  <Text style={styles.settingItemSub}>
                    Tactile clues upon evidence recovery
                  </Text>
                </View>
                <Switch
                  value={settings.hapticsEnabled}
                  onValueChange={(val) =>
                    handleUpdateSetting('hapticsEnabled', val)
                  }
                  trackColor={{
                    false: NoirColors.borderStrong,
                    true: NoirColors.goldPrimary,
                  }}
                  thumbColor={
                    settings.hapticsEnabled ? '#0A0C10' : NoirColors.textSecondary
                  }
                />
              </View>

              <View style={styles.settingsRow}>
                <View style={styles.settingsLabelGroup}>
                  <Text style={styles.settingItemLabel}>AMBIENT AUDIO</Text>
                  <Text style={styles.settingItemSub}>
                    Neo-noir atmospheric precinct audio
                  </Text>
                </View>
                <Switch
                  value={settings.ambientSoundEnabled}
                  onValueChange={(val) =>
                    handleUpdateSetting('ambientSoundEnabled', val)
                  }
                  trackColor={{
                    false: NoirColors.borderStrong,
                    true: NoirColors.goldPrimary,
                  }}
                  thumbColor={
                    settings.ambientSoundEnabled
                      ? '#0A0C10'
                      : NoirColors.textSecondary
                  }
                />
              </View>

              {resetConfirmMsg && (
                <View style={styles.resetFeedbackBox}>
                  <Text style={styles.resetFeedbackText}>{resetConfirmMsg}</Text>
                </View>
              )}

              <View style={styles.modalActions}>
                <NoirButton
                  label="RESET ACTIVE DOSSIER PROGRESS"
                  variant="secondary"
                  onPress={handleResetProgress}
                />
                <NoirButton
                  label="CLOSE SETTINGS"
                  variant="primary"
                  onPress={() => setIsSettingsOpen(false)}
                />
              </View>
            </NoirCard>
          </View>
        </View>
      </Modal>
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.xl,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  topTelemetry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    alignSelf: 'center',
    paddingVertical: Spacing.xs,
  },
  telemetryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: NoirColors.crimson,
  },
  telemetryText: {
    fontSize: 10,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 1.2,
  },
  heroSection: {
    alignItems: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  emblemContainer: {
    alignItems: 'center',
  },
  emblemOuterRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: NoirColors.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 21, 29, 0.7)',
  },
  emblemInnerRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: NoirColors.goldPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NoirColors.surface,
  },
  emblemMonogram: {
    fontSize: 24,
    fontWeight: '900',
    color: NoirColors.goldLight,
    letterSpacing: 2,
  },
  emblemRibbon: {
    marginTop: -8,
    backgroundColor: NoirColors.surfaceElevated,
    borderColor: NoirColors.goldBorder,
    borderWidth: 1,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  emblemRibbonText: {
    fontSize: 9,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 1,
  },
  titleGroup: {
    alignItems: 'center',
    gap: Spacing.xs,
    width: '100%',
  },
  gameTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 4,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.goldLight,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  taglineWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    width: '100%',
    justifyContent: 'center',
  },
  taglineLine: {
    flex: 1,
    maxWidth: 36,
    height: 1,
    backgroundColor: NoirColors.goldBorder,
  },
  taglineText: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
    color: NoirColors.textSecondary,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  progressCard: {
    gap: Spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressCaseNum: {
    fontSize: 11,
    fontWeight: '700',
    color: NoirColors.goldLight,
    letterSpacing: 1,
  },
  progressCaseTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 1,
  },
  progressStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: NoirColors.borderSubtle,
  },
  progressStatsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 0.6,
  },
  progressStatsValue: {
    fontSize: 11,
    fontWeight: '800',
    color: NoirColors.goldPrimary,
  },
  menuActions: {
    gap: Spacing.sm + 2,
    width: '100%',
    paddingVertical: Spacing.sm,
  },
  footerContainer: {
    alignItems: 'center',
    gap: 3,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: NoirColors.borderSubtle,
    width: '100%',
  },
  footerDepartment: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.textSecondary,
    letterSpacing: 1.2,
  },
  footerPrecinct: {
    fontSize: 8,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
  },
  modalCard: {
    gap: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 1,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  settingsLabelGroup: {
    gap: 2,
    flex: 1,
    marginRight: Spacing.md,
  },
  settingItemLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: NoirColors.textPrimary,
    letterSpacing: 0.8,
  },
  settingItemSub: {
    fontSize: 10,
    color: NoirColors.textMuted,
  },
  resetFeedbackBox: {
    backgroundColor: NoirColors.goldMuted,
    borderWidth: 1,
    borderColor: NoirColors.goldBorder,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  resetFeedbackText: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  modalActions: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
