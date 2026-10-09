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
});
