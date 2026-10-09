import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DossierBadge } from '@/components/common/DossierBadge';
import { NoirCard } from '@/components/common/NoirCard';
import { NoirColors, Radius, Spacing } from '@/constants/theme';
import { CaseDeduction } from '@/core/types/deduction';

interface DiscoveredDeductionsListProps {
  allCaseDeductions: CaseDeduction[];
  discoveredDeductionIds: string[];
}

export function DiscoveredDeductionsList({
  allCaseDeductions,
  discoveredDeductionIds,
}: DiscoveredDeductionsListProps) {
  const discoveredItems = allCaseDeductions.filter((d) =>
    discoveredDeductionIds.includes(d.id)
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.titleText}>ESTABLISHED DOSSIER DISCOVERIES</Text>
        <Text style={styles.counterText}>
          {discoveredItems.length} OF {allCaseDeductions.length} UNCOVERED
        </Text>
      </View>

      {discoveredItems.length === 0 ? (
        <NoirCard variant="surface" style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>NO FORMAL DEDUCTIONS ESTABLISHED</Text>
          <Text style={styles.emptySub}>
            Select collected evidence and correlate it with timeline events or witness statements above.
          </Text>
        </NoirCard>
      ) : (
        <View style={styles.list}>
          {discoveredItems.map((item) => (
            <NoirCard
              key={item.id}
              variant="elevated"
              hasGoldAccent={item.isKeyDeduction}
              style={styles.deductionCard}>
              <View style={styles.cardHeader}>
                <View style={styles.badgeGroup}>
                  <DossierBadge label="ESTABLISHED" variant="emerald" />
                  <DossierBadge
                    label={item.relationship}
                    variant={
                      item.relationship === 'CONTRADICTS'
                        ? 'crimson'
                        : item.relationship === 'PROVES'
                        ? 'emerald'
                        : 'gold'
                    }
                  />
                  {item.isKeyDeduction && (
                    <DossierBadge label="KEY INSIGHT" variant="gold" />
                  )}
                </View>
              </View>

              <Text style={styles.deductionTitle}>
                {item.title.toUpperCase()}
              </Text>

              {/* Deductive Conclusion Statement */}
              <View style={styles.conclusionBox}>
                <View style={styles.conclusionAccentBar} />
                <Text style={styles.conclusionText}>
                  {item.conclusion}
                </Text>
              </View>
            </NoirCard>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  titleText: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 0.8,
  },
  counterText: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.textMuted,
    letterSpacing: 0.4,
  },
  emptyCard: {
    padding: Spacing.md,
    gap: 4,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderStyle: 'dashed',
    borderColor: NoirColors.borderStrong,
  },
  emptyTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.textMuted,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 10,
    lineHeight: 14,
    color: NoirColors.textMuted,
    textAlign: 'center',
  },
  list: {
    gap: Spacing.sm,
    width: '100%',
  },
  deductionCard: {
    padding: Spacing.md,
    gap: Spacing.xs + 2,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeGroup: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  deductionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 0.8,
  },
  conclusionBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
    overflow: 'hidden',
    marginTop: 2,
  },
  conclusionAccentBar: {
    width: 3,
    backgroundColor: NoirColors.emerald,
  },
  conclusionText: {
    padding: Spacing.sm,
    fontSize: 11,
    lineHeight: 16,
    color: NoirColors.textSecondary,
    fontWeight: '600',
    flex: 1,
  },
});
