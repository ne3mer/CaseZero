import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ACTIVE_CASE_ID: '@casezero:active_case_id',
  SOLVED_CASES: '@casezero:solved_cases',
  UNLOCKED_EVIDENCE_PREFIX: '@casezero:unlocked_evidence:',
  DETECTIVE_NOTES_PREFIX: '@casezero:detective_notes:',
  SETTINGS: '@casezero:settings',
} as const;

export interface GameSettings {
  hapticsEnabled: boolean;
  ambientSoundEnabled: boolean;
  textSize: 'default' | 'large';
}

const DEFAULT_SETTINGS: GameSettings = {
  hapticsEnabled: true,
  ambientSoundEnabled: true,
  textSize: 'default',
};

/**
 * Offline-first persistence adapter using AsyncStorage
 */
export const CaseStorage = {
  /**
   * Safe migration of legacy development case identifiers.
   * If a player accumulated saved progress on "The Danube Echo" under the old
   * 'CZ-001' key, copies that evidence to 'case_dev_danube' without data loss.
   */
  async migrateLegacyProgress(): Promise<void> {
    try {
      const activeId = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_CASE_ID);
      if (activeId === 'CZ-001' || activeId === 'case_001') {
        await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_CASE_ID, 'case_dev_danube');
      }

      const legacyEvidence =
        (await AsyncStorage.getItem(`${STORAGE_KEYS.UNLOCKED_EVIDENCE_PREFIX}CZ-001`)) ||
        (await AsyncStorage.getItem(`${STORAGE_KEYS.UNLOCKED_EVIDENCE_PREFIX}case_001`));

      const devEvidence = await AsyncStorage.getItem(
        `${STORAGE_KEYS.UNLOCKED_EVIDENCE_PREFIX}case_dev_danube`
      );

      if (legacyEvidence && !devEvidence) {
        await AsyncStorage.setItem(
          `${STORAGE_KEYS.UNLOCKED_EVIDENCE_PREFIX}case_dev_danube`,
          legacyEvidence
        );
      }
    } catch {
      // Safe fallback
    }
  },

  async getActiveCaseId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_CASE_ID);
    } catch {
      return null;
    }
  },

  async setActiveCaseId(caseId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_CASE_ID, caseId);
    } catch {
      // Offline fallback silent failure
    }
  },

  async getSolvedCases(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SOLVED_CASES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async markCaseSolved(caseId: string): Promise<void> {
    try {
      const solved = await this.getSolvedCases();
      if (!solved.includes(caseId)) {
        solved.push(caseId);
        await AsyncStorage.setItem(STORAGE_KEYS.SOLVED_CASES, JSON.stringify(solved));
      }
    } catch {
      // Offline fallback
    }
  },

  async getUnlockedEvidence(caseId: string): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(
        `${STORAGE_KEYS.UNLOCKED_EVIDENCE_PREFIX}${caseId}`
      );
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveUnlockedEvidence(caseId: string, evidenceIds: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.UNLOCKED_EVIDENCE_PREFIX}${caseId}`,
        JSON.stringify(evidenceIds)
      );
    } catch {
      // Offline fallback
    }
  },

  async getSettings(): Promise<GameSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: Partial<GameSettings>): Promise<void> {
    try {
      const current = await this.getSettings();
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify({ ...current, ...settings })
      );
    } catch {
      // Offline fallback
    }
  },
};
