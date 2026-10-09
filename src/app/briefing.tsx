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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DossierBadge } from '@/components/common/DossierBadge';
import { NoirButton } from '@/components/common/NoirButton';
import { NoirCard } from '@/components/common/NoirCard';
import { NoirTopBar } from '@/components/common/NoirTopBar';
import { SceneImages } from '@/constants/assets';
import { MaxContentWidth, NoirColors, Radius, Spacing } from '@/constants/theme';
import { getCaseById } from '@/core/data/cases';
import { SAMPLE_CASE_001 } from '@/core/data/sample-case';
import { useGameStore } from '@/store/game-store';

export default function CaseBriefingScreen() {
  const router = useRouter();
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const { setActiveCase } = useGameStore();
  const [showFullDossier, setShowFullDossier] = useState(false);

  const caseData = (caseId ? getCaseById(caseId) : null) || SAMPLE_CASE_001;

  const handleBeginInvestigation = async () => {
    await setActiveCase(caseData.caseNumber);
    router.push('/investigation');
  };

  const microBriefing =
    caseData.microBriefing ||
    'Ferenc Kovács lies dead beside his workbench on Népszínház utca, killed by a close-range 9mm shot. The wall safe is forced open with rare chronometers missing.';

  const objective =
    caseData.objective ||
    'Inspect the crime scene, secure physical ballistics, and uncover the motive.';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Bar Navigation */}
      <View style={styles.topBarWrapper}>
        <NoirTopBar
          onBack={() => router.back()}
          backLabel="CASE FILES"
          rightBadge={caseData.caseNumber}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}>
        {/* Crime Scene Hero Card (Visual-First) */}
        <NoirCard variant="elevated" hasGoldAccent style={styles.heroCard}>
          <View style={styles.imageWrapper}>
            <Image
              source={SceneImages.danubeEcho}
              style={styles.sceneImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay} />
            <View style={styles.imageHeaderBadges}>
              <DossierBadge label={caseData.caseNumber} variant="gold" />
              <DossierBadge label="DISTRICT VIII" variant="neutral" />
              <DossierBadge label="HOMICIDE" variant="crimson" />
            </View>
          </View>

          {/* Incident Headline */}
          <View style={styles.headlineSection}>
            <Text style={styles.caseTitle}>{caseData.title.toUpperCase()}</Text>
            <Text style={styles.caseLocation}>{caseData.district}</Text>

            {/* 2-Sentence Micro-Briefing (Under 30 Seconds Comprehension) */}
            <Text style={styles.microBriefingText}>{microBriefing}</Text>
          </View>
        </NoirCard>

        {/* Visual Crime Scene Clue Pills */}
        <View style={styles.cluePillsRow}>
          <View style={styles.cluePill}>
            <Text style={styles.cluePillLabel}>VICTIM</Text>
            <Text style={styles.cluePillValue}>Ferenc Kovács (52)</Text>
          </View>
          <View style={styles.cluePill}>
            <Text style={styles.cluePillLabel}>WOUND</Text>
            <Text style={styles.cluePillValue}>9mm Close-Range</Text>
          </View>
          <View style={styles.cluePill}>
            <Text style={styles.cluePillLabel}>SCENE</Text>
            <Text style={styles.cluePillValue}>Safe Looted</Text>
          </View>
        </View>

        {/* Objective Strip */}
        <NoirCard variant="surface" style={styles.objectiveCard}>
          <View style={styles.objectiveHeader}>
            <DossierBadge label="MISSION OBJECTIVE" variant="emerald" />
            <Text style={styles.objectiveTime}>{caseData.timeReported}</Text>
          </View>
          <Text style={styles.objectiveText}>{objective}</Text>
        </NoirCard>

        {/* Progressive Disclosure: Optional Forensic Archive */}
        <Pressable
          onPress={() => setShowFullDossier((prev) => !prev)}
          style={({ pressed }) => [
            styles.toggleDossierBtn,
            pressed && styles.toggleDossierBtnPressed,
          ]}>
          <Text style={styles.toggleDossierText}>
            {showFullDossier ? '▲ HIDE ARCHIVAL NOTES' : '▼ OPTIONAL FORENSIC DOSSIER'}
          </Text>
        </Pressable>

        {showFullDossier && (
          <NoirCard variant="surface" style={styles.archivalCard}>
            <Text style={styles.archivalTitle}>PATROL DISPATCH REPORT</Text>
            <Text style={styles.archivalBody}>{caseData.briefing}</Text>
            <View style={styles.archivalFacts}>
              {caseData.initialFacts?.map((fact, idx) => (
                <View key={idx} style={styles.archivalFactRow}>
                  <View style={styles.archivalBullet} />
                  <Text style={styles.archivalFactText}>{fact}</Text>
                </View>
              ))}
            </View>
          </NoirCard>
        )}

        {/* Call to Action Controls */}
        <View style={styles.actionSection}>
          <NoirButton
            label="ENTER CRIME SCENE"
            variant="primary"
            onPress={handleBeginInvestigation}
          />
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
  heroCard: {
    padding: 0,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: 190,
    position: 'relative',
    backgroundColor: '#050608',
  },
  sceneImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9, 11, 15, 0.25)',
  },
  imageHeaderBadges: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  headlineSection: {
    padding: Spacing.md,
    gap: Spacing.xs + 2,
    width: '100%',
  },
  caseTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 1.5,
    flexWrap: 'wrap',
  },
  caseLocation: {
    fontSize: 11,
    fontWeight: '700',
    color: NoirColors.goldPrimary,
    letterSpacing: 0.6,
    flexWrap: 'wrap',
  },
  microBriefingText: {
    fontSize: 13,
    lineHeight: 19,
    color: NoirColors.textSecondary,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  cluePillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
    width: '100%',
  },
  cluePill: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: Spacing.sm,
    paddingHorizontal: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
    alignItems: 'center',
  },
  cluePillLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: NoirColors.textMuted,
    letterSpacing: 0.8,
  },
  cluePillValue: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.goldLight,
    marginTop: 2,
    textAlign: 'center',
  },
  objectiveCard: {
    gap: Spacing.xs + 2,
  },
  objectiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  objectiveTime: {
    fontSize: 10,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 0.5,
  },
  objectiveText: {
    fontSize: 12,
    lineHeight: 18,
    color: NoirColors.textPrimary,
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  toggleDossierBtn: {
    alignSelf: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  toggleDossierBtnPressed: {
    opacity: 0.6,
  },
  toggleDossierText: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.textMuted,
    letterSpacing: 1,
  },
  archivalCard: {
    gap: Spacing.sm,
  },
  archivalTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 1,
  },
  archivalBody: {
    fontSize: 12,
    lineHeight: 18,
    color: NoirColors.textSecondary,
    flexWrap: 'wrap',
  },
  archivalFacts: {
    gap: Spacing.xs + 2,
    marginTop: Spacing.xs,
  },
  archivalFactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs + 2,
  },
  archivalBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: NoirColors.goldPrimary,
    marginTop: 6,
    flexShrink: 0,
  },
  archivalFactText: {
    fontSize: 11,
    lineHeight: 16,
    color: NoirColors.textMuted,
    flex: 1,
    flexWrap: 'wrap',
  },
  actionSection: {
    width: '100%',
    paddingTop: Spacing.xs,
  },
});
