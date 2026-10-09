import { z } from 'zod';

/**
 * Evidence item types encountered in crime scenes across Budapest
 */
export const EvidenceTypeSchema = z.enum([
  'physical',
  'forensic',
  'document',
  'testimony',
  'digital',
]);
export type EvidenceType = z.infer<typeof EvidenceTypeSchema>;

/**
 * Evidence collected during investigation
 */
export const EvidenceSchema = z.record(z.string(), z.any()).and(
  z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    type: EvidenceTypeSchema,
    locationFound: z.string().min(1),
    isKeyEvidence: z.boolean().default(false),
  })
);
export type Evidence = z.infer<typeof EvidenceSchema>;

/**
 * Person of Interest / Suspect record
 */
export const SuspectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  alias: z.string().optional(),
  occupation: z.string(),
  relationshipToVictim: z.string(),
  alibi: z.string(),
  isCleared: z.boolean().default(false),
});
export type Suspect = z.infer<typeof SuspectSchema>;

/**
 * Timeline event reconstructed during the case
 */
export const TimelineEventSchema = z.object({
  id: z.string().min(1),
  time: z.string(),
  description: z.string(),
  verified: z.boolean().default(false),
});
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

/**
 * Fixed Truth Model
 * Every case has an immutable ground truth.
 * Correct deductions are evaluated purely against this model.
 */
export const TruthModelSchema = z.object({
  culpritId: z.string().min(1),
  motive: z.string().min(1),
  murderWeaponId: z.string().min(1),
  keyContradictionId: z.string().optional(),
  conclusiveEvidenceIds: z.array(z.string()).min(1),
});
export type TruthModel = z.infer<typeof TruthModelSchema>;

/**
 * Player Deduction Hypothesis
 * Submitted when the player attempts to present findings to prove what happened.
 */
export const DeductionHypothesisSchema = z.object({
  culpritId: z.string().min(1),
  weaponId: z.string().min(1),
  supportingEvidenceIds: z.array(z.string()).min(1),
});
export type DeductionHypothesis = z.infer<typeof DeductionHypothesisSchema>;

/**
 * Deduction Evaluation Result
 */
export interface DeductionResult {
  isCorrect: boolean;
  culpritMatches: boolean;
  weaponMatches: boolean;
  evidenceCoverage: number; // 0 to 1 ratio of conclusive evidence provided
  missingEvidenceIds: string[];
  verdict: 'PROVEN' | 'REFUTED' | 'INSUFFICIENT_EVIDENCE';
  reasoning: string;
}

/**
 * Victim Information
 */
export const VictimSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
  occupation: z.string(),
  causeOfDeath: z.string(),
});
export type Victim = z.infer<typeof VictimSchema>;

/**
 * Case Data Contract
 * Cases are structured, validated data records.
 */
export const CaseSchema = z.object({
  id: z.string().min(1),
  caseNumber: z.string().min(1),
  title: z.string().min(1),
  district: z.string().min(1), // e.g. "District VIII (Józsefváros), Budapest"
  timeReported: z.string().min(1),
  status: z.enum(['open', 'in_progress', 'solved', 'cold']),
  victim: VictimSchema,
  synopsis: z.string().min(1),
  briefing: z.string().min(1),
  objective: z.string().optional(),
  initialFacts: z.array(z.string()).optional(),
  isLocked: z.boolean().default(false),
  evidence: z.array(EvidenceSchema),
  suspects: z.array(SuspectSchema),
  timeline: z.array(TimelineEventSchema),
  truth: TruthModelSchema,
});
export type Case = z.infer<typeof CaseSchema>;
