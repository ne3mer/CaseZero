import { create } from 'zustand';
import { CaseStorage } from '../storage/case-storage';

interface GameState {
  activeCaseId: string;
  unlockedEvidenceIds: string[];
  solvedCaseIds: string[];
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  setActiveCase: (caseId: string) => Promise<void>;
  unlockEvidence: (evidenceId: string) => Promise<void>;
  markCaseSolved: (caseId: string) => Promise<void>;
  resetActiveCaseProgress: (caseId: string) => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  activeCaseId: 'case_dev_danube',
  unlockedEvidenceIds: ['ev_spent_shell_casing'],
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

    const unlockedEvidence = await CaseStorage.getUnlockedEvidence(activeCaseId);

    set({
      activeCaseId,
      solvedCaseIds: solvedCases,
      unlockedEvidenceIds:
        unlockedEvidence.length > 0 ? unlockedEvidence : ['ev_spent_shell_casing'],
      isInitialized: true,
    });
  },

  setActiveCase: async (caseId: string) => {
    await CaseStorage.setActiveCaseId(caseId);
    const unlocked = await CaseStorage.getUnlockedEvidence(caseId);
    set({
      activeCaseId: caseId,
      unlockedEvidenceIds: unlocked.length > 0 ? unlocked : ['ev_spent_shell_casing'],
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

  markCaseSolved: async (caseId: string) => {
    const { solvedCaseIds } = get();
    if (!solvedCaseIds.includes(caseId)) {
      const updated = [...solvedCaseIds, caseId];
      set({ solvedCaseIds: updated });
      await CaseStorage.markCaseSolved(caseId);
    }
  },

  resetActiveCaseProgress: async (caseId: string) => {
    await CaseStorage.saveUnlockedEvidence(caseId, ['ev_spent_shell_casing']);
    set({ unlockedEvidenceIds: ['ev_spent_shell_casing'] });
  },
}));
