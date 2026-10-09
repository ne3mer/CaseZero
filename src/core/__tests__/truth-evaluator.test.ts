import { describe, expect, it } from 'vitest';
import { evaluateDeduction } from '../logic/truth-evaluator';
import { CaseSchema, TruthModel } from '../types/case';

describe('Case Zero — Truth Evaluation Engine', () => {
  const sampleTruth: TruthModel = {
    culpritId: 'suspect_attila_molnar',
    motive: 'Financial embezzlement coverup',
    murderWeaponId: 'weapon_vintage_revolver',
    conclusiveEvidenceIds: ['ev_spent_shell_casing', 'ev_forged_ledger'],
  };

  it('proves the case when culprit, weapon, and all conclusive evidence match', () => {
    const result = evaluateDeduction(sampleTruth, {
      culpritId: 'suspect_attila_molnar',
      weaponId: 'weapon_vintage_revolver',
      supportingEvidenceIds: ['ev_spent_shell_casing', 'ev_forged_ledger', 'ev_footprints'],
    });

    expect(result.isCorrect).toBe(true);
    expect(result.verdict).toBe('PROVEN');
    expect(result.culpritMatches).toBe(true);
    expect(result.weaponMatches).toBe(true);
    expect(result.missingEvidenceIds).toHaveLength(0);
    expect(result.evidenceCoverage).toBe(1);
  });

  it('refutes deduction if an innocent person is accused', () => {
    const result = evaluateDeduction(sampleTruth, {
      culpritId: 'suspect_eva_varga',
      weaponId: 'weapon_vintage_revolver',
      supportingEvidenceIds: ['ev_spent_shell_casing', 'ev_forged_ledger'],
    });

    expect(result.isCorrect).toBe(false);
    expect(result.verdict).toBe('REFUTED');
    expect(result.culpritMatches).toBe(false);
  });

  it('refutes deduction if the wrong weapon is claimed', () => {
    const result = evaluateDeduction(sampleTruth, {
      culpritId: 'suspect_attila_molnar',
      weaponId: 'weapon_hunting_knife',
      supportingEvidenceIds: ['ev_spent_shell_casing', 'ev_forged_ledger'],
    });

    expect(result.isCorrect).toBe(false);
    expect(result.verdict).toBe('REFUTED');
    expect(result.weaponMatches).toBe(false);
  });

  it('returns INSUFFICIENT_EVIDENCE when conclusive proof is missing', () => {
    const result = evaluateDeduction(sampleTruth, {
      culpritId: 'suspect_attila_molnar',
      weaponId: 'weapon_vintage_revolver',
      supportingEvidenceIds: ['ev_spent_shell_casing'], // Missing 'ev_forged_ledger'
    });

    expect(result.isCorrect).toBe(false);
    expect(result.verdict).toBe('INSUFFICIENT_EVIDENCE');
    expect(result.culpritMatches).toBe(true);
    expect(result.weaponMatches).toBe(true);
    expect(result.missingEvidenceIds).toEqual(['ev_forged_ledger']);
    expect(result.evidenceCoverage).toBe(0.5);
  });

  it('validates structured case data against Zod CaseSchema', () => {
    const validCase = {
      id: 'case_001',
      caseNumber: 'CZ-001',
      title: 'The Danube Echo',
      district: 'District VIII (Józsefváros), Budapest',
      timeReported: '23:40 CET',
      status: 'open' as const,
      victim: {
        name: 'Ferenc Kovács',
        age: 52,
        occupation: 'Antique Watchmaker',
        causeOfDeath: 'Gunshot wound, close proximity',
      },
      synopsis: 'A prominent horologist is found dead inside his workshop near Rákóczi tér.',
      briefing: 'Initial call logged by patrol unit at 23:40. Safe forced open. No signs of struggle.',
      evidence: [
        {
          id: 'ev_spent_shell_casing',
          title: '9mm Spent Casing',
          description: 'Discharged 9mm casing found near the workbench.',
          type: 'physical' as const,
          locationFound: 'Workshop Floor, East Corner',
          isKeyEvidence: true,
        },
      ],
      suspects: [
        {
          id: 'suspect_attila_molnar',
          name: 'Attila Molnár',
          occupation: 'Business Partner',
          relationshipToVictim: 'Co-owner of the atelier',
          alibi: 'Claims to have been at Gellért Baths until 23:00.',
          isCleared: false,
        },
      ],
      timeline: [
        {
          id: 'tl_01',
          time: '22:15',
          description: 'Victim seen closing security shutters.',
          verified: true,
        },
      ],
      truth: sampleTruth,
    };

    const parseResult = CaseSchema.safeParse(validCase);
    expect(parseResult.success).toBe(true);
  });

  it('validates SAMPLE_DEV_CASE against CaseSchema', async () => {
    const { SAMPLE_DEV_CASE } = await import('../data/sample-case');
    const parseResult = CaseSchema.safeParse(SAMPLE_DEV_CASE);
    expect(parseResult.success).toBe(true);
    expect(SAMPLE_DEV_CASE.id).toBe('case_dev_danube');
    expect(SAMPLE_DEV_CASE.caseNumber).toBe('CZ-DEV-001');
    expect(SAMPLE_DEV_CASE.title).toBe('The Danube Echo');
    expect(SAMPLE_DEV_CASE.isLocked).toBe(false);
    expect(SAMPLE_DEV_CASE.objective).toBeDefined();
    expect(SAMPLE_DEV_CASE.initialFacts?.length).toBeGreaterThan(0);
  });

  describe('Official First Case Regression: The Last Appointment (CZ-001)', () => {
    it('establishes CZ-001: The Last Appointment as official first case with exact premise', async () => {
      const { CASE_REGISTRY, getCaseById, getCaseMetadata } = await import('../data/cases');

      const cz001 = CASE_REGISTRY.find((c) => c.caseNumber === 'CZ-001');
      expect(cz001).toBeDefined();
      expect(cz001?.title).toBe('The Last Appointment');
      expect(cz001?.district).toBe('Budapest, Hungary');
      expect(cz001?.isOfficialCase).toBe(true);
      expect(cz001?.status).toBe('classified');
      expect(cz001?.isLocked).toBe(true);

      // Premise verification
      expect(cz001?.synopsis).toContain('Ádám Varga');
      expect(cz001?.synopsis).toContain('watchmaker');
      expect(cz001?.synopsis).toContain('locked from the inside');
      expect(cz001?.synopsis).toContain('pocket watch');

      // Artwork mapping: must be associated with watchmaker workshop
      expect(cz001?.coverImageKey).toBe('watchmakerAtelier');

      // Known characters verification
      const expectedCharacters = [
        { name: 'Márton Fekete', role: 'Business Partner' },
        { name: 'Eszter Kovács', role: 'Former Apprentice' },
        { name: 'László Horváth', role: 'Collector' },
        { name: 'Bence Nagy', role: 'Courier' },
      ];
      expect(cz001?.knownCharacters).toEqual(expectedCharacters);

      // Metadata lookup
      const meta = getCaseMetadata('CZ-001');
      expect(meta).toBeDefined();
      expect(meta?.title).toBe('The Last Appointment');

      // Crucial constraint: Official case remains locked & non-playable until complete logical design is approved
      // No synthetic truth model or fake culprit is invented
      expect(getCaseById('case_001')).toBeUndefined();
      expect(getCaseById('CZ-001')).toBeUndefined();
    });

    it('maintains CZ-DEV-001: The Danube Echo as separate playable dev content', async () => {
      const { CASE_REGISTRY, getCaseById, getCaseMetadata } = await import('../data/cases');

      const devCase = CASE_REGISTRY.find((c) => c.caseNumber === 'CZ-DEV-001');
      expect(devCase).toBeDefined();
      expect(devCase?.id).toBe('case_dev_danube');
      expect(devCase?.title).toBe('The Danube Echo');
      expect(devCase?.isLocked).toBe(false);
      expect(devCase?.status).toBe('open');
      expect(devCase?.isOfficialCase).toBe(false);

      const meta = getCaseMetadata('case_dev_danube');
      expect(meta).toBeDefined();
      expect(meta?.caseNumber).toBe('CZ-DEV-001');

      // Dev sandbox is playable via getCaseById
      const loadedDevCase = getCaseById('case_dev_danube');
      expect(loadedDevCase).toBeDefined();
      expect(loadedDevCase?.title).toBe('The Danube Echo');
      expect(loadedDevCase?.truth).toBeDefined();
    });

    it('confirms no psychiatrist office descriptions exist in case registry', async () => {
      const { CASE_REGISTRY } = await import('../data/cases');
      const allText = JSON.stringify(CASE_REGISTRY).toLowerCase();
      expect(allText).not.toContain('psychiatrist');
      expect(allText).not.toContain('balint');
      expect(allText).not.toContain('somogyi');
      expect(allText).not.toContain('therapy');
    });
  });
});
