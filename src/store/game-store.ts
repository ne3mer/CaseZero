import { create } from 'zustand';
import { evaluateDeductionAttempt } from '../core/logic/deduction-engine';
import {
  CaseDeduction,
  DeductionAttempt,
  DeductionEvaluationResult,
} from '../core/types/deduction';
import { CaseStorage } from '../storage/case-storage';

interface GameState {
  activeCaseId: string;
  unlockedEvidenceIds: string[];
  discoveredDeductionIds: string[];
  solvedCaseIds: string[];
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  setActiveCase: (caseId: string) => Promise<void>;
  unlockEvidence: (evidenceId: string) => Promise<void>;
  submitDeduction: (
    attempt: DeductionAttempt,
    caseDeductions: CaseDeduction[]
  ) => Promise<DeductionEvaluationResult>;
  markCaseSolved: (caseId: string) => Promise<void>;
  resetActiveCaseProgress: (caseId: string) => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  activeCaseId: 'case_dev_danube',
  unlockedEvidenceIds: [],
  discoveredDeductionIds: [],
  solvedCaseIds: [],
  isInitialized: false,

  initialize: async () => {
    // Perform safe migration of legacy dev keys
    await CaseStorage.migrateLegacyProgress();

    const [storedCaseId, solvedCases] = await Promise.all([
      CaseStorage.getActiveCaseId(),
      CaseStorage.getSolvedCases(),
    ]);

    // If stored ID was legacy CZ-001 or case_001, redirect to case_dev_danube
    let activeCaseId = storedCaseId || 'case_dev_danube';
    if (activeCaseId === 'CZ-001' || activeCaseId === 'case_001') {
      activeCaseId = 'case_dev_danube';
      await CaseStorage.setActiveCaseId(activeCaseId);
    }

    const [unlockedEvidence, discoveredDeductions] = await Promise.all([
      CaseStorage.getUnlockedEvidence(activeCaseId),
      CaseStorage.getDiscoveredDeductions(activeCaseId),
    ]);

    set({
      activeCaseId,
      solvedCaseIds: solvedCases,
      unlockedEvidenceIds: unlockedEvidence,
      discoveredDeductionIds: discoveredDeductions,
      isInitialized: true,
    });
  },

  setActiveCase: async (caseId: string) => {
    await CaseStorage.setActiveCaseId(caseId);
    const [unlocked, deductions] = await Promise.all([
      CaseStorage.getUnlockedEvidence(caseId),
      CaseStorage.getDiscoveredDeductions(caseId),
    ]);
    set({
      activeCaseId: caseId,
      unlockedEvidenceIds: unlocked,
      discoveredDeductionIds: deductions,
    });
  },

  unlockEvidence: async (evidenceId: string) => {
    const { activeCaseId, unlockedEvidenceIds } = get();
    if (!unlockedEvidenceIds.includes(evidenceId)) {
      const updated = [...unlockedEvidenceIds, evidenceId];
      set({ unlockedEvidenceIds: updated });
      await CaseStorage.saveUnlockedEvidence(activeCaseId, updated);
    }
  },

  submitDeduction: async (
    attempt: DeductionAttempt,
    caseDeductions: CaseDeduction[]
  ): Promise<DeductionEvaluationResult> => {
    const { activeCaseId, unlockedEvidenceIds, discoveredDeductionIds } = get();

    const result = evaluateDeductionAttempt(
      attempt,
      caseDeductions,
      unlockedEvidenceIds,
      discoveredDeductionIds
    );

    if (result.status === 'VALID' && result.deductionId) {
      if (!discoveredDeductionIds.includes(result.deductionId)) {
        const updated = [...discoveredDeductionIds, result.deductionId];
        set({ discoveredDeductionIds: updated });
        await CaseStorage.saveDiscoveredDeductions(activeCaseId, updated);
      }
    }

    return result;
  },

  markCaseSolved: async (caseId: string) => {
    const { solvedCaseIds } = get();
    if (!solvedCaseIds.includes(caseId)) {
      const updated = [...solvedCaseIds, caseId];
      set({ solvedCaseIds: updated });
      await CaseStorage.markCaseSolved(caseId);
    }
  },

  resetActiveCaseProgress: async (caseId: string) => {
    await Promise.all([
      CaseStorage.saveUnlockedEvidence(caseId, []),
      CaseStorage.saveDiscoveredDeductions(caseId, []),
    ]);
    set({
      unlockedEvidenceIds: [],
      discoveredDeductionIds: [],
    });
  },
}));
