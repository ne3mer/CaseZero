import React from 'react';
import {
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
import { MaxContentWidth, NoirColors, Spacing } from '@/constants/theme';
import { getCaseById } from '@/core/data/cases';
import { SAMPLE_CASE_001 } from '@/core/data/sample-case';
import { useGameStore } from '@/store/game-store';

export default function CaseBriefingScreen() {
  const router = useRouter();
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const { setActiveCase } = useGameStore();

  const caseData = (caseId ? getCaseById(caseId) : null) || SAMPLE_CASE_001;

  const handleBeginInvestigation = async () => {
    await setActiveCase(caseData.caseNumber);
    router.push('/investigation');
  };

  const initialFacts = caseData.initialFacts || [
    `Victim ${caseData.victim.name} (${caseData.victim.age}) sustained fatal trauma.`,
    `Cause of Death: ${caseData.victim.causeOfDeath}.`,
    `Crime Scene: Workshop atelier, safe left unlocked.`,
    `Time of Incident: Reported at ${caseData.timeReported}.`,
  ];

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
        {/* Dossier Header */}
        <View style={styles.headerSection}>
          <View style={styles.badgeRow}>
            <DossierBadge label={caseData.caseNumber} variant="gold" />
            <DossierBadge label="DISTRICT VIII" variant="neutral" />
            <DossierBadge label="DOSSIER BRIEFING" variant="cyan" />
          </View>
          <Text style={styles.caseTitle}>{caseData.title.toUpperCase()}</Text>
          <Text style={styles.caseLocation}>{caseData.district}</Text>
          <View style={styles.accentDivider}>
            <View style={styles.accentBarGold} />
            <View style={styles.accentBarMuted} />
          </View>
        </View>

        {/* Incident Summary Card */}
        <NoirCard variant="elevated" hasGoldAccent style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>INCIDENT BRIEFING</Text>
            <DossierBadge label="REPORT" variant="gold" />
          </View>
          <Text style={styles.bodyText}>{caseData.briefing}</Text>
        </NoirCard>

        {/* Mission Objective Card */}
        <NoirCard variant="surface" style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>MISSION OBJECTIVE</Text>
            <DossierBadge label="MANDATE" variant="emerald" />
          </View>
          <Text style={styles.bodyText}>
            {caseData.objective ||
              'Secure all material evidence at the scene, cross-examine persons of interest, and reconstruct the timeline of events leading up to the incident.'}
          </Text>
        </NoirCard>

        {/* Known Initial Facts Card */}
        <NoirCard variant="surface" style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>KNOWN INITIAL FACTS</Text>
            <DossierBadge label="VERIFIED" variant="neutral" />
          </View>
          <View style={styles.factsList}>
            {initialFacts.map((fact, index) => (
              <View key={index} style={styles.factRow}>
                <View style={styles.factBullet} />
                <Text style={styles.factText}>{fact}</Text>
              </View>
            ))}
          </View>
        </NoirCard>

        {/* Action Controls */}
        <View style={styles.actionSection}>
          <NoirButton
            label="BEGIN INVESTIGATION"
            variant="primary"
            onPress={handleBeginInvestigation}
          />
          <NoirButton
            label="RETURN TO CASE FILES"
            variant="secondary"
            onPress={() => router.back()}
          />
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            BUDAPEST METROPOLITAN POLICE — CID FORENSIC UNIT
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
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  caseTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 1.5,
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
  sectionCard: {
    gap: Spacing.sm + 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 1.2,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
    color: NoirColors.textSecondary,
    flexWrap: 'wrap',
  },
  factsList: {
    gap: Spacing.sm,
    width: '100%',
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    width: '100%',
  },
  factBullet: {
    width: 6,
    height: 6,
    borderRadius: 1,
    backgroundColor: NoirColors.goldPrimary,
    marginTop: 7,
    flexShrink: 0,
  },
  factText: {
    fontSize: 12,
    lineHeight: 18,
    color: NoirColors.textPrimary,
    flex: 1,
    flexWrap: 'wrap',
  },
  actionSection: {
    gap: Spacing.sm,
    width: '100%',
    paddingTop: Spacing.xs,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: NoirColors.borderSubtle,
    width: '100%',
  },
  footerText: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
});
