import { z } from 'zod';

/**
 * Deduction Relationship Types
 * Core logical links that can exist between evidence, witness claims, and timeline facts.
 */
export const DeductionRelationshipSchema = z.enum([
  'SUPPORTS',
  'CONTRADICTS',
  'RELATED',
  'PROVES',
]);
export type DeductionRelationship = z.infer<typeof DeductionRelationshipSchema>;

/**
 * Entity Types that can form deduction links
 */
export const DeductionTargetTypeSchema = z.enum([
  'evidence',
  'statement',
  'timeline',
  'deduction',
]);
export type DeductionTargetType = z.infer<typeof DeductionTargetTypeSchema>;

/**
 * Node reference representing an item connected in a deduction
 */
export const DeductionNodeRefSchema = z.object({
  type: DeductionTargetTypeSchema,
  id: z.string().min(1),
});
export type DeductionNodeRef = z.infer<typeof DeductionNodeRefSchema>;

/**
 * Valid Deduction Definition in Case Data
 * Every solvable deduction must be deterministically defined in the case truth model.
 */
export const CaseDeductionSchema = z.object({
  id: z.string().min(1),
  caseId: z.string().min(1),
  title: z.string().min(1),
  relationship: DeductionRelationshipSchema,
  source: DeductionNodeRefSchema,
  target: DeductionNodeRefSchema,
  requiredEvidenceIds: z.array(z.string().min(1)).min(1),
  prerequisiteDeductionIds: z.array(z.string()).optional().default([]),
  conclusion: z.string().min(1),
  explanation: z.string().optional(),
  isKeyDeduction: z.boolean().default(false),
});
export type CaseDeduction = z.infer<typeof CaseDeductionSchema>;

/**
 * Player Deduction Attempt
 * Submitted when the player connects two elements and provides supporting material evidence.
 */
export const DeductionAttemptSchema = z.object({
  caseId: z.string().min(1),
  relationship: DeductionRelationshipSchema,
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
  providedEvidenceIds: z.array(z.string().min(1)).min(1),
});
export type DeductionAttempt = z.infer<typeof DeductionAttemptSchema>;

/**
 * Deterministic Evaluation Status Codes
 */
export type DeductionEvaluationStatus =
  | 'VALID'
  | 'INVALID_RELATIONSHIP'
  | 'MISSING_EVIDENCE'
  | 'UNMET_PREREQUISITES'
  | 'UNSUPPORTED'
  | 'ALREADY_DISCOVERED';

/**
 * Output of the pure deduction evaluation engine
 */
export interface DeductionEvaluationResult {
  status: DeductionEvaluationStatus;
  isSuccess: boolean;
  deductionId?: string;
  conclusion?: string;
  message: string;
}
