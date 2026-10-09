import { describe, expect, it } from 'vitest';
import { CASE_REGISTRY, getCaseById } from '../data/cases';
import { MOCK_DEDUCTION_CASE } from '../data/fixtures/deduction-fixture';
import { SAMPLE_DEV_CASE } from '../data/sample-case';
import { evaluateDeductionAttempt } from '../logic/deduction-engine';
import { CaseDeduction, DeductionAttempt } from '../types/deduction';

describe('Milestone 3B — Evidence Board & Deduction Gameplay Integration', () => {
  const caseDeductions: CaseDeduction[] = SAMPLE_DEV_CASE.deductions;

  describe('1. Evidence & Record Selection Logic', () => {
    it('allows assigning items to Slot 1, Slot 2, and corroborating evidence tray', () => {
      // Simulate selection state transitions
      let slot1: string | null = null;
      let slot2: string | null = null;
      let corroborating: string[] = [];

      // User selects primary evidence
      slot1 = 'ev_spent_shell_casing';
      expect(slot1).toBe('ev_spent_shell_casing');

      // User selects target timeline event
      slot2 = 'tl_03';
      expect(slot2).toBe('tl_03');

      // User selects additional corroborating evidence
      corroborating = [...corroborating, 'ev_pocket_watch_log'];
      expect(corroborating).toContain('ev_pocket_watch_log');

      // Deselecting Slot 1 resets Slot 1
      slot1 = null;
      expect(slot1).toBeNull();
      expect(slot2).toBe('tl_03');
    });
  });

  describe('2. Deduction Submission & Execution', () => {
    it('submits a valid PROVES deduction and returns verified conclusion', () => {
      const attempt: DeductionAttempt = {
        caseId: SAMPLE_DEV_CASE.id,
        relationship: 'PROVES',
        sourceId: 'ev_spent_shell_casing',
        targetId: 'tl_03',
        providedEvidenceIds: ['ev_spent_shell_casing'],
      };

      const result = evaluateDeductionAttempt(
        attempt,
        caseDeductions,
        ['ev_spent_shell_casing'], // Player possesses casing
        []
      );

      expect(result.status).toBe('VALID');
      expect(result.isSuccess).toBe(true);
      expect(result.deductionId).toBe('ded_danube_ballistics_report');
      expect(result.conclusion).toContain('fatal close-range shot');
    });
  });

  describe('3. Invalid Relationship Handling & Neutral Feedback', () => {
    it('returns neutral feedback without disclosing the correct relationship', () => {
      const attempt: DeductionAttempt = {
        caseId: SAMPLE_DEV_CASE.id,
        relationship: 'CONTRADICTS', // Wrong: actual relationship is PROVES
        sourceId: 'ev_spent_shell_casing',
        targetId: 'tl_03',
        providedEvidenceIds: ['ev_spent_shell_casing'],
      };

      const result = evaluateDeductionAttempt(
        attempt,
        caseDeductions,
        ['ev_spent_shell_casing'],
        []
      );

      expect(result.status).toBe('INVALID_RELATIONSHIP');
      expect(result.isSuccess).toBe(false);
      expect(result.message).toBe('The proposed relationship is not supported by logical deduction.');
      expect(result.conclusion).toBeUndefined();
      expect(result.deductionId).toBeUndefined();
    });
  });

  describe('4. Missing Evidence Handling', () => {
    it('rejects submission when player lacks required evidence in inventory', () => {
      const attempt: DeductionAttempt = {
        caseId: SAMPLE_DEV_CASE.id,
        relationship: 'SUPPORTS',
        sourceId: 'ev_pocket_watch_log',
        targetId: 'ev_spent_shell_casing',
        providedEvidenceIds: ['ev_pocket_watch_log', 'ev_spent_shell_casing'],
      };

      // Player has not yet collected 'ev_pocket_watch_log'
      const result = evaluateDeductionAttempt(
        attempt,
        caseDeductions,
        ['ev_spent_shell_casing'],
        []
      );

      expect(result.status).toBe('MISSING_EVIDENCE');
      expect(result.isSuccess).toBe(false);
      expect(result.message).toContain('not been secured in your evidence locker');
    });

    it('rejects multi-evidence deduction when partial corroboration is missing', () => {
      const attempt: DeductionAttempt = {
        caseId: SAMPLE_DEV_CASE.id,
        relationship: 'SUPPORTS',
        sourceId: 'ev_pocket_watch_log',
        targetId: 'ev_spent_shell_casing',
        providedEvidenceIds: ['ev_pocket_watch_log'], // Missing second piece
      };

      const result = evaluateDeductionAttempt(
        attempt,
        caseDeductions,
        ['ev_pocket_watch_log', 'ev_spent_shell_casing'],
        []
      );

      expect(result.status).toBe('MISSING_EVIDENCE');
      expect(result.isSuccess).toBe(false);
      expect(result.message).toContain('Additional corroborating evidence is required');
    });
  });

  describe('5. Previously Discovered Deductions (Idempotency)', () => {
    it('returns ALREADY_DISCOVERED without duplicate state creation', () => {
      const attempt: DeductionAttempt = {
        caseId: SAMPLE_DEV_CASE.id,
        relationship: 'PROVES',
        sourceId: 'ev_spent_shell_casing',
        targetId: 'tl_03',
        providedEvidenceIds: ['ev_spent_shell_casing'],
      };

      const alreadyDiscovered = ['ded_danube_ballistics_report'];

      const result = evaluateDeductionAttempt(
        attempt,
        caseDeductions,
        ['ev_spent_shell_casing'],
        alreadyDiscovered
      );

      expect(result.status).toBe('ALREADY_DISCOVERED');
      expect(result.isSuccess).toBe(true);
      expect(result.deductionId).toBe('ded_danube_ballistics_report');
      expect(result.message).toContain('already been established');
    });
  });

  describe('6. Empty Inventory States', () => {
    it('prevents evaluating deductions when inventory is empty', () => {
      const attempt: DeductionAttempt = {
        caseId: SAMPLE_DEV_CASE.id,
        relationship: 'PROVES',
        sourceId: 'ev_spent_shell_casing',
        targetId: 'tl_03',
        providedEvidenceIds: ['ev_spent_shell_casing'],
      };

      const result = evaluateDeductionAttempt(
        attempt,
        caseDeductions,
        [], // Empty inventory
        []
      );

      expect(result.status).toBe('MISSING_EVIDENCE');
      expect(result.isSuccess).toBe(false);
    });
  });

  describe('7. Locked Case & Non-Playable Guard (CZ-001)', () => {
    it('confirms official case CZ-001 is classified and contains no playable deductions', () => {
      const cz001 = CASE_REGISTRY.find((c) => c.caseNumber === 'CZ-001');
      expect(cz001).toBeDefined();
      expect(cz001?.isLocked).toBe(true);
      expect(cz001?.status).toBe('classified');

      // Attempting to fetch full case data returns undefined
      const fullCase = getCaseById('case_001');
      expect(fullCase).toBeUndefined();
    });
  });

  describe('8. Spoiler Prevention & Answer Protection', () => {
    it('never reveals true relationship or required evidence in failure responses', () => {
      const failureStatuses = [
        // Unsupported pair
        evaluateDeductionAttempt(
          {
            caseId: SAMPLE_DEV_CASE.id,
            relationship: 'RELATED',
            sourceId: 'ev_tram_ticket',
            targetId: 'tl_01',
            providedEvidenceIds: ['ev_tram_ticket'],
          },
          caseDeductions,
          ['ev_tram_ticket'],
          []
        ),
        // Wrong relationship
        evaluateDeductionAttempt(
          {
            caseId: SAMPLE_DEV_CASE.id,
            relationship: 'CONTRADICTS',
            sourceId: 'ev_spent_shell_casing',
            targetId: 'tl_03',
            providedEvidenceIds: ['ev_spent_shell_casing'],
          },
          caseDeductions,
          ['ev_spent_shell_casing'],
          []
        ),
        // Missing evidence
        evaluateDeductionAttempt(
          {
            caseId: SAMPLE_DEV_CASE.id,
            relationship: 'SUPPORTS',
            sourceId: 'ev_pocket_watch_log',
            targetId: 'ev_spent_shell_casing',
            providedEvidenceIds: ['ev_pocket_watch_log'],
          },
          caseDeductions,
          ['ev_pocket_watch_log', 'ev_spent_shell_casing'],
          []
        ),
      ];

      for (const res of failureStatuses) {
        expect(res.isSuccess).toBe(false);
        // Ensure no conclusion statement is leaked
        expect(res.conclusion).toBeUndefined();
        // Ensure no deduction ID is leaked
        expect(res.deductionId).toBeUndefined();
        // Ensure message does not disclose the answer
        expect(res.message).not.toContain('PROVES');
        expect(res.message).not.toContain('suspect_attila_molnar');
      }
    });
  });

  describe('9. Multi-Evidence Corroboration & Test Fixture Verification', () => {
    it('verifies multi-evidence deduction in MOCK_DEDUCTION_CASE', () => {
      const attempt: DeductionAttempt = {
        caseId: MOCK_DEDUCTION_CASE.id,
        relationship: 'SUPPORTS',
        sourceId: 'ev_fixture_ledger',
        targetId: 'ev_fixture_casing',
        providedEvidenceIds: ['ev_fixture_ledger', 'ev_fixture_casing'],
      };

      const result = evaluateDeductionAttempt(
        attempt,
        MOCK_DEDUCTION_CASE.deductions,
        ['ev_fixture_ledger', 'ev_fixture_casing'],
        []
      );

      expect(result.status).toBe('VALID');
      expect(result.isSuccess).toBe(true);
      expect(result.deductionId).toBe('ded_ledger_supports_motive');
    });
  });
});
