import { describe, expect, it } from 'vitest';
import { MOCK_DEDUCTION_CASE } from '../data/fixtures/deduction-fixture';
import { SAMPLE_DEV_CASE } from '../data/sample-case';
import {
  evaluateDeductionAttempt,
  getAvailableDeductionsForPlayer,
  validateCaseDeductions,
} from '../logic/deduction-engine';
import { CaseDeduction, DeductionAttempt } from '../types/deduction';

describe('Milestone 3A — Deterministic Deduction Engine', () => {
  const deductions = MOCK_DEDUCTION_CASE.deductions;

  describe('1. Valid Deduction Acceptance', () => {
    it('accepts a valid CONTRADICTS deduction when player possesses and provides required evidence', () => {
      const attempt: DeductionAttempt = {
        caseId: MOCK_DEDUCTION_CASE.id,
        relationship: 'CONTRADICTS',
        sourceId: 'ev_fixture_ticket',
        targetId: 'suspect_fixture_toth',
        providedEvidenceIds: ['ev_fixture_ticket'],
      };

      const result = evaluateDeductionAttempt(
        attempt,
        deductions,
        ['ev_fixture_ticket', 'ev_fixture_casing'], // Player inventory
        [] // No prior discoveries
      );

      expect(result.status).toBe('VALID');
      expect(result.isSuccess).toBe(true);
      expect(result.deductionId).toBe('ded_ticket_contradicts_alibi');
      expect(result.conclusion).toContain('directly refutes Tóth’s alibi');
    });

    it('accepts a valid PROVES deduction connecting evidence to timeline', () => {
      const attempt: DeductionAttempt = {
        caseId: MOCK_DEDUCTION_CASE.id,
        relationship: 'PROVES',
        sourceId: 'ev_fixture_casing',
        targetId: 'tl_fixture_gunshot',
        providedEvidenceIds: ['ev_fixture_casing'],
      };

      const result = evaluateDeductionAttempt(
        attempt,
        deductions,
        ['ev_fixture_casing'],
        []
      );

      expect(result.status).toBe('VALID');
      expect(result.isSuccess).toBe(true);
      expect(result.deductionId).toBe('ded_ballistics_proves_shot');
    });

    it('supports entity pairing symmetry regardless of selection order', () => {
      // Reversed source and target (target chosen first by user)
      const attempt: DeductionAttempt = {
        caseId: MOCK_DEDUCTION_CASE.id,
        relationship: 'CONTRADICTS',
        sourceId: 'suspect_fixture_toth',
        targetId: 'ev_fixture_ticket',
        providedEvidenceIds: ['ev_fixture_ticket'],
      };

      const result = evaluateDeductionAttempt(
        attempt,
        deductions,
        ['ev_fixture_ticket'],
        []
      );

      expect(result.status).toBe('VALID');
      expect(result.isSuccess).toBe(true);
      expect(result.deductionId).toBe('ded_ticket_contradicts_alibi');
    });

    it('accepts a SUPPORTS deduction requiring multiple corroborating evidence items', () => {
      const attempt: DeductionAttempt = {
        caseId: MOCK_DEDUCTION_CASE.id,
        relationship: 'SUPPORTS',
        sourceId: 'ev_fixture_ledger',
        targetId: 'ev_fixture_casing',
        providedEvidenceIds: ['ev_fixture_ledger', 'ev_fixture_casing'],
      };

      const result = evaluateDeductionAttempt(
        attempt,
        deductions,
        ['ev_fixture_ledger', 'ev_fixture_casing'],
        []
      );

      expect(result.status).toBe('VALID');
      expect(result.isSuccess).toBe(true);
      expect(result.deductionId).toBe('ded_ledger_supports_motive');
    });
  });

  describe('2. Invalid Relationship Rejection & Anti-Leakage', () => {
    it('rejects an incorrect relationship type without leaking the expected relationship', () => {
      const attempt: DeductionAttempt = {
        caseId: MOCK_DEDUCTION_CASE.id,
        relationship: 'SUPPORTS', // Actual is CONTRADICTS
        sourceId: 'ev_fixture_ticket',
        targetId: 'suspect_fixture_toth',
        providedEvidenceIds: ['ev_fixture_ticket'],
      };

      const result = evaluateDeductionAttempt(
        attempt,
        deductions,
        ['ev_fixture_ticket'],
        []
      );

      expect(result.status).toBe('INVALID_RELATIONSHIP');
      expect(result.isSuccess).toBe(false);
      expect(result.message).toBe('The proposed relationship is not supported by logical deduction.');
      // Confirm no secret answer leakage
      expect(result.conclusion).toBeUndefined();
      expect(result.deductionId).toBeUndefined();
    });

    it('rejects arbitrary unsupported pairings between unrelated entities', () => {
      const attempt: DeductionAttempt = {
        caseId: MOCK_DEDUCTION_CASE.id,
        relationship: 'CONTRADICTS',
        sourceId: 'ev_fixture_casing',
        targetId: 'suspect_fixture_toth',
        providedEvidenceIds: ['ev_fixture_casing'],
      };

      const result = evaluateDeductionAttempt(
        attempt,
        deductions,
        ['ev_fixture_casing'],
        []
      );

      expect(result.status).toBe('UNSUPPORTED');
      expect(result.isSuccess).toBe(false);
      expect(result.message).toContain('No verifiable connection');
    });
  });

  describe('3. Evidence Possession & Corroboration Checks', () => {
    it('rejects deduction when player does not own the submitted evidence in inventory', () => {
      const attempt: DeductionAttempt = {
        caseId: MOCK_DEDUCTION_CASE.id,
        relationship: 'CONTRADICTS',
        sourceId: 'ev_fixture_ticket',
        targetId: 'suspect_fixture_toth',
        providedEvidenceIds: ['ev_fixture_ticket'],
      };

      // Player inventory is completely empty
      const result = evaluateDeductionAttempt(
        attempt,
        deductions,
        [],
        []
      );

      expect(result.status).toBe('MISSING_EVIDENCE');
      expect(result.isSuccess).toBe(false);
      expect(result.message).toContain('not been secured in your evidence locker');
    });

    it('rejects multi-evidence deduction when partial evidence is missing from submission', () => {
      const attempt: DeductionAttempt = {
        caseId: MOCK_DEDUCTION_CASE.id,
        relationship: 'SUPPORTS',
        sourceId: 'ev_fixture_ledger',
        targetId: 'ev_fixture_casing',
        providedEvidenceIds: ['ev_fixture_ledger'], // Missing 'ev_fixture_casing'
      };

      const result = evaluateDeductionAttempt(
        attempt,
        deductions,
        ['ev_fixture_ledger', 'ev_fixture_casing'], // Player possesses both
        []
      );

      expect(result.status).toBe('MISSING_EVIDENCE');
      expect(result.isSuccess).toBe(false);
      expect(result.message).toContain('Additional corroborating evidence is required');
    });
  });

  describe('4. Prerequisite Gating & Discovery Unlocks', () => {
    it('rejects gated deduction when prerequisite deduction has not been established', () => {
      const attempt: DeductionAttempt = {
        caseId: MOCK_DEDUCTION_CASE.id,
        relationship: 'PROVES',
        sourceId: 'ev_fixture_ledger',
        targetId: 'suspect_fixture_toth',
        providedEvidenceIds: ['ev_fixture_ledger', 'ev_fixture_ticket'],
      };

      // Player possesses all evidence but hasn't resolved 'ded_ticket_contradicts_alibi'
      const result = evaluateDeductionAttempt(
        attempt,
        deductions,
        ['ev_fixture_ledger', 'ev_fixture_ticket'],
        []
      );

      expect(result.status).toBe('UNMET_PREREQUISITES');
      expect(result.isSuccess).toBe(false);
      expect(result.message).toContain('Prerequisite lines of inquiry must be substantiated');
    });

    it('accepts gated deduction once prerequisite deduction has been discovered', () => {
      const attempt: DeductionAttempt = {
        caseId: MOCK_DEDUCTION_CASE.id,
        relationship: 'PROVES',
        sourceId: 'ev_fixture_ledger',
        targetId: 'suspect_fixture_toth',
        providedEvidenceIds: ['ev_fixture_ledger', 'ev_fixture_ticket'],
      };

      // Player has discovered 'ded_ticket_contradicts_alibi'
      const result = evaluateDeductionAttempt(
        attempt,
        deductions,
        ['ev_fixture_ledger', 'ev_fixture_ticket'],
        ['ded_ticket_contradicts_alibi']
      );

      expect(result.status).toBe('VALID');
      expect(result.isSuccess).toBe(true);
      expect(result.deductionId).toBe('ded_gated_mastermind');
    });
  });

  describe('5. Idempotency & Duplicate Prevention', () => {
    it('returns ALREADY_DISCOVERED idempotently when submitting an existing discovery', () => {
      const attempt: DeductionAttempt = {
        caseId: MOCK_DEDUCTION_CASE.id,
        relationship: 'CONTRADICTS',
        sourceId: 'ev_fixture_ticket',
        targetId: 'suspect_fixture_toth',
        providedEvidenceIds: ['ev_fixture_ticket'],
      };

      const result = evaluateDeductionAttempt(
        attempt,
        deductions,
        ['ev_fixture_ticket'],
        ['ded_ticket_contradicts_alibi'] // Already discovered
      );

      expect(result.status).toBe('ALREADY_DISCOVERED');
      expect(result.isSuccess).toBe(true);
      expect(result.deductionId).toBe('ded_ticket_contradicts_alibi');
      expect(result.message).toContain('already been established');
    });
  });

  describe('6. Telemetry & Discovery Counters', () => {
    it('calculates discoverable deductions without exposing answers', () => {
      const telemetryBefore = getAvailableDeductionsForPlayer(
        deductions,
        ['ev_fixture_ticket'], // Only ticket collected
        []
      );

      // Only 'ded_ticket_contradicts_alibi' can be made right now
      expect(telemetryBefore.totalCount).toBe(4);
      expect(telemetryBefore.discoveredCount).toBe(0);
      expect(telemetryBefore.discoverableCount).toBe(1);

      // Collect all evidence and establish prerequisite
      const telemetryAfter = getAvailableDeductionsForPlayer(
        deductions,
        ['ev_fixture_ticket', 'ev_fixture_casing', 'ev_fixture_ledger'],
        ['ded_ticket_contradicts_alibi']
      );

      expect(telemetryAfter.discoveredCount).toBe(1);
      // Remaining 3 are all discoverable
      expect(telemetryAfter.discoverableCount).toBe(3);
    });
  });

  describe('7. Case Data Validation & Integrity', () => {
    it('passes schema validation on MOCK_DEDUCTION_CASE and SAMPLE_DEV_CASE', () => {
      const fixtureValidation = validateCaseDeductions(MOCK_DEDUCTION_CASE);
      expect(fixtureValidation.isValid).toBe(true);
      expect(fixtureValidation.errors).toHaveLength(0);

      const devCaseValidation = validateCaseDeductions(SAMPLE_DEV_CASE);
      expect(devCaseValidation.isValid).toBe(true);
      expect(devCaseValidation.errors).toHaveLength(0);
    });

    it('catches invalid entity references and missing evidence IDs', () => {
      const invalidCase = {
        ...MOCK_DEDUCTION_CASE,
        deductions: [
          {
            id: 'ded_broken',
            caseId: MOCK_DEDUCTION_CASE.id,
            title: 'Broken Deduction',
            relationship: 'CONTRADICTS' as const,
            source: { type: 'evidence' as const, id: 'ev_ghost_nonexistent' },
            target: { type: 'statement' as const, id: 'suspect_ghost_nonexistent' },
            requiredEvidenceIds: ['ev_ghost_nonexistent'],
            conclusion: 'Invalid',
            isKeyDeduction: false,
          },
        ],
      };

      const result = validateCaseDeductions(invalidCase as any);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes('unknown source entity ID'))).toBe(true);
      expect(result.errors.some((e) => e.includes('unknown target entity ID'))).toBe(true);
      expect(result.errors.some((e) => e.includes('non-existent evidenceId'))).toBe(true);
    });

    it('detects circular prerequisite dependency cycles', () => {
      const circularDeductions: CaseDeduction[] = [
        {
          id: 'ded_cycle_A',
          caseId: MOCK_DEDUCTION_CASE.id,
          title: 'Cycle A',
          relationship: 'PROVES',
          source: { type: 'evidence', id: 'ev_fixture_casing' },
          target: { type: 'timeline', id: 'tl_fixture_gunshot' },
          requiredEvidenceIds: ['ev_fixture_casing'],
          prerequisiteDeductionIds: ['ded_cycle_B'],
          conclusion: 'A',
          isKeyDeduction: false,
        },
        {
          id: 'ded_cycle_B',
          caseId: MOCK_DEDUCTION_CASE.id,
          title: 'Cycle B',
          relationship: 'PROVES',
          source: { type: 'evidence', id: 'ev_fixture_ticket' },
          target: { type: 'statement', id: 'suspect_fixture_toth' },
          requiredEvidenceIds: ['ev_fixture_ticket'],
          prerequisiteDeductionIds: ['ded_cycle_A'], // Cycle A -> B -> A
          conclusion: 'B',
          isKeyDeduction: false,
        },
      ];

      const cycleCase = {
        ...MOCK_DEDUCTION_CASE,
        deductions: circularDeductions,
      };

      const result = validateCaseDeductions(cycleCase);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Circular prerequisite dependency cycle'))).toBe(
        true
      );
    });
  });

  describe('8. Grounded Deductions in CZ-DEV-001 (The Danube Echo)', () => {
    it('evaluates ballistics PROVES timeline deduction in CZ-DEV-001', () => {
      const attempt: DeductionAttempt = {
        caseId: SAMPLE_DEV_CASE.id,
        relationship: 'PROVES',
        sourceId: 'ev_spent_shell_casing',
        targetId: 'tl_03',
        providedEvidenceIds: ['ev_spent_shell_casing'],
      };

      const result = evaluateDeductionAttempt(
        attempt,
        SAMPLE_DEV_CASE.deductions,
        ['ev_spent_shell_casing'],
        []
      );

      expect(result.status).toBe('VALID');
      expect(result.isSuccess).toBe(true);
      expect(result.deductionId).toBe('ded_danube_ballistics_report');
    });

    it('evaluates ledger SUPPORTS motive deduction in CZ-DEV-001', () => {
      const attempt: DeductionAttempt = {
        caseId: SAMPLE_DEV_CASE.id,
        relationship: 'SUPPORTS',
        sourceId: 'ev_pocket_watch_log',
        targetId: 'ev_spent_shell_casing',
        providedEvidenceIds: ['ev_pocket_watch_log', 'ev_spent_shell_casing'],
      };

      const result = evaluateDeductionAttempt(
        attempt,
        SAMPLE_DEV_CASE.deductions,
        ['ev_pocket_watch_log', 'ev_spent_shell_casing'],
        []
      );

      expect(result.status).toBe('VALID');
      expect(result.isSuccess).toBe(true);
      expect(result.deductionId).toBe('ded_danube_ledger_motive');
    });
  });
});
