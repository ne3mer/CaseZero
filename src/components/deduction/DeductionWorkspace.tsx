import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DossierBadge } from '@/components/common/DossierBadge';
import { NoirButton } from '@/components/common/NoirButton';
import { NoirCard } from '@/components/common/NoirCard';
import { NoirColors, Radius, Spacing } from '@/constants/theme';
import { DeductionRelationship } from '@/core/types/deduction';
import { BoardEntity } from './EvidenceBoardRecordItem';

const RELATIONSHIP_OPTIONS: {
  type: DeductionRelationship;
  label: string;
  description: string;
  variant: 'gold' | 'crimson' | 'cyan' | 'emerald';
}[] = [
  {
    type: 'PROVES',
    label: 'PROVES',
    description: 'Establishes factual truth or occurrence',
    variant: 'emerald',
  },
  {
    type: 'SUPPORTS',
    label: 'SUPPORTS',
    description: 'Corroborates motive or disputed claim',
    variant: 'gold',
  },
  {
    type: 'CONTRADICTS',
    label: 'CONTRADICTS',
    description: 'Directly refutes an alibi or statement',
    variant: 'crimson',
  },
  {
    type: 'RELATED',
    label: 'RELATED',
    description: 'Shares direct material connection',
    variant: 'cyan',
  },
];

interface DeductionWorkspaceProps {
  slot1Entity: BoardEntity | null;
  slot2Entity: BoardEntity | null;
  selectedRelationship: DeductionRelationship | null;
  corroboratingEvidence: BoardEntity[];
  onSelectRelationship: (rel: DeductionRelationship) => void;
  onClearSlot1: () => void;
  onClearSlot2: () => void;
  onRemoveCorroborating: (id: string) => void;
  onResetAll: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function DeductionWorkspace({
  slot1Entity,
  slot2Entity,
  selectedRelationship,
  corroboratingEvidence,
  onSelectRelationship,
  onClearSlot1,
  onClearSlot2,
  onRemoveCorroborating,
  onResetAll,
  onSubmit,
  isSubmitting,
}: DeductionWorkspaceProps) {
  // Check if hypothesis has the minimum elements to test
  const hasBothSlots = slot1Entity !== null && slot2Entity !== null;
  const hasRelationship = selectedRelationship !== null;
  const containsEvidence =
    slot1Entity?.type === 'evidence' ||
    slot2Entity?.type === 'evidence' ||
    corroboratingEvidence.length > 0;

  const canSubmit = hasBothSlots && hasRelationship && containsEvidence && !isSubmitting;

  return (
    <NoirCard variant="elevated" hasGoldAccent style={styles.workspaceCard}>
      {/* Workspace Header */}
      <View style={styles.workspaceHeader}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.workspaceTitle}>INQUIRY WORKSPACE</Text>
          <Text style={styles.workspaceSub}>
            CONNECT TWO RECORDS &amp; DESIGNATE LOGICAL RELATIONSHIP
          </Text>
        </View>

        {(slot1Entity || slot2Entity || selectedRelationship) && (
          <Pressable onPress={onResetAll} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>RESET</Text>
          </Pressable>
        )}
      </View>

      {/* Connection Builder Strip */}
      <View style={styles.slotsRow}>
        {/* Slot 1 (Entity A) */}
        <View style={styles.slotWrapper}>
          <Text style={styles.slotLabel}>RECORD A (PRIMARY)</Text>
          {slot1Entity ? (
            <Pressable onPress={onClearSlot1} style={styles.filledSlot}>
              <View style={styles.slotTopRow}>
                <DossierBadge
                  label={slot1Entity.type.toUpperCase()}
                  variant="gold"
                />
                <Text style={styles.slotRemoveText}>✕</Text>
              </View>
              <Text numberOfLines={2} style={styles.slotEntityTitle}>
                {slot1Entity.title.toUpperCase()}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.emptySlot}>
              <Text style={styles.emptySlotText}>SELECT ITEM FROM DOSSIER</Text>
            </View>
          )}
        </View>

        {/* Logical Link Connector */}
        <View style={styles.connectorColumn}>
          <View style={styles.connectorLine} />
          <View style={styles.connectorNode}>
            <Text style={styles.connectorSymbol}>⇄</Text>
          </View>
          <View style={styles.connectorLine} />
        </View>

        {/* Slot 2 (Entity B) */}
        <View style={styles.slotWrapper}>
          <Text style={styles.slotLabel}>RECORD B (TARGET)</Text>
          {slot2Entity ? (
            <Pressable onPress={onClearSlot2} style={styles.filledSlot}>
              <View style={styles.slotTopRow}>
                <DossierBadge
                  label={slot2Entity.type.toUpperCase()}
                  variant="cyan"
                />
                <Text style={styles.slotRemoveText}>✕</Text>
              </View>
              <Text numberOfLines={2} style={styles.slotEntityTitle}>
                {slot2Entity.title.toUpperCase()}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.emptySlot}>
              <Text style={styles.emptySlotText}>SELECT ITEM FROM DOSSIER</Text>
            </View>
          )}
        </View>
      </View>

      {/* Relationship Selector */}
      <View style={styles.relationshipSection}>
        <Text style={styles.relationshipSectionTitle}>
          PROPOSED LOGICAL RELATIONSHIP
        </Text>
        <View style={styles.relationshipGrid}>
          {RELATIONSHIP_OPTIONS.map((opt) => {
            const isSelected = selectedRelationship === opt.type;
            return (
              <Pressable
                key={opt.type}
                onPress={() => onSelectRelationship(opt.type)}
                style={({ pressed }) => [
                  styles.relationshipBtn,
                  isSelected && styles.relationshipBtnSelected,
                  pressed && styles.btnPressed,
                ]}>
                <View style={styles.relationshipBtnHeader}>
                  <Text
                    style={[
                      styles.relationshipBtnText,
                      isSelected && styles.relationshipBtnTextSelected,
                    ]}>
                    {opt.label}
                  </Text>
                  {isSelected && <Text style={styles.selectedTick}>✓</Text>}
                </View>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.relationshipBtnSub,
                    isSelected && styles.relationshipBtnSubSelected,
                  ]}>
                  {opt.description}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Corroborating Supporting Evidence Tray (if selected) */}
      {corroboratingEvidence.length > 0 && (
        <View style={styles.corroboratingTray}>
          <Text style={styles.corroboratingTitle}>
            CORROBORATING MATERIAL EVIDENCE ({corroboratingEvidence.length})
          </Text>
          <View style={styles.corroboratingChips}>
            {corroboratingEvidence.map((ev) => (
              <Pressable
                key={ev.id}
                onPress={() => onRemoveCorroborating(ev.id)}
                style={styles.corroboratingChip}>
                <Text numberOfLines={1} style={styles.corroboratingChipText}>
                  {ev.title.toUpperCase()}
                </Text>
                <Text style={styles.corroboratingChipRemove}>✕</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Submit Button */}
      <View style={styles.submitSection}>
        <NoirButton
          label={
            isSubmitting
              ? 'ANALYZING DEDUCTION...'
              : !hasBothSlots
              ? 'SELECT TWO RECORDS TO CONNECT'
              : !hasRelationship
              ? 'DESIGNATE A RELATIONSHIP'
              : !containsEvidence
              ? 'ATTACH MATERIAL EVIDENCE'
              : 'TEST DEDUCTION HYPOTHESIS'
          }
          variant="primary"
          disabled={!canSubmit}
          onPress={onSubmit}
        />
      </View>
    </NoirCard>
  );
}

const styles = StyleSheet.create({
  workspaceCard: {
    padding: Spacing.md,
    gap: Spacing.sm + 2,
    width: '100%',
  },
  workspaceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: NoirColors.borderSubtle,
    width: '100%',
  },
  headerTitleGroup: {
    gap: 2,
    flex: 1,
  },
  workspaceTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: NoirColors.textPrimary,
    letterSpacing: 1,
  },
  workspaceSub: {
    fontSize: 8,
    fontWeight: '700',
    color: NoirColors.goldLight,
    letterSpacing: 0.5,
  },
  resetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  resetBtnText: {
    fontSize: 9,
    fontWeight: '800',
    color: NoirColors.textMuted,
    letterSpacing: 0.6,
  },
  slotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '100%',
  },
  slotWrapper: {
    flex: 1,
    gap: 4,
  },
  slotLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: NoirColors.textMuted,
    letterSpacing: 0.6,
  },
  emptySlot: {
    height: 72,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: NoirColors.borderStrong,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xs,
  },
  emptySlotText: {
    fontSize: 8,
    fontWeight: '700',
    color: NoirColors.textMuted,
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  filledSlot: {
    height: 72,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: NoirColors.goldBorder,
    backgroundColor: 'rgba(18, 21, 29, 0.9)',
    padding: 6,
    justifyContent: 'space-between',
  },
  slotTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotRemoveText: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.textMuted,
    paddingHorizontal: 4,
  },
  slotEntityTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: NoirColors.textPrimary,
    letterSpacing: 0.4,
  },
  connectorColumn: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorLine: {
    width: 1,
    height: 12,
    backgroundColor: NoirColors.borderStrong,
  },
  connectorNode: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: NoirColors.surface,
    borderWidth: 1,
    borderColor: NoirColors.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorSymbol: {
    fontSize: 10,
    color: NoirColors.goldLight,
  },
  relationshipSection: {
    gap: 6,
    width: '100%',
    paddingTop: 2,
  },
  relationshipSectionTitle: {
    fontSize: 8,
    fontWeight: '800',
    color: NoirColors.goldLight,
    letterSpacing: 0.8,
  },
  relationshipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    width: '100%',
  },
  relationshipBtn: {
    flex: 1,
    minWidth: '47%',
    padding: Spacing.xs + 2,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: NoirColors.borderSubtle,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    gap: 2,
  },
  relationshipBtnSelected: {
    backgroundColor: 'rgba(197, 160, 89, 0.16)',
    borderColor: NoirColors.goldPrimary,
  },
  relationshipBtnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relationshipBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: NoirColors.textSecondary,
    letterSpacing: 0.8,
  },
  relationshipBtnTextSelected: {
    color: NoirColors.goldLight,
  },
  selectedTick: {
    fontSize: 10,
    fontWeight: '900',
    color: NoirColors.goldLight,
  },
  relationshipBtnSub: {
    fontSize: 8,
    lineHeight: 11,
    color: NoirColors.textMuted,
  },
  relationshipBtnSubSelected: {
    color: NoirColors.textSecondary,
  },
  corroboratingTray: {
    backgroundColor: 'rgba(61, 184, 126, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(61, 184, 126, 0.25)',
    borderRadius: Radius.xs,
    padding: Spacing.xs + 2,
    gap: 4,
    width: '100%',
  },
  corroboratingTitle: {
    fontSize: 8,
    fontWeight: '800',
    color: NoirColors.emerald,
    letterSpacing: 0.6,
  },
  corroboratingChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  corroboratingChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: NoirColors.emerald,
    borderRadius: Radius.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  corroboratingChipText: {
    fontSize: 9,
    fontWeight: '700',
    color: NoirColors.textPrimary,
  },
  corroboratingChipRemove: {
    fontSize: 9,
    fontWeight: '800',
    color: NoirColors.emerald,
  },
  submitSection: {
    width: '100%',
    paddingTop: 4,
  },
  btnPressed: {
    opacity: 0.8,
  },
});
