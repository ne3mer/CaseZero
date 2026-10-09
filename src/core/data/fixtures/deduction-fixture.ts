import { Case, CaseSchema } from '../../types/case';

/**
 * Dedicated Test Fixture: Artificial Deduction Mystery
 * Used exclusively for deterministic unit testing of the deduction engine.
 * Contains explicit SUPPORTS, CONTRADICTS, and PROVES relationships, as well
 * as prerequisite gating and multi-evidence requirements.
 */
export const MOCK_DEDUCTION_CASE: Case = CaseSchema.parse({
  id: 'case_fixture_deduction_test',
  caseNumber: 'CZ-FIXTURE-001',
  title: 'The Clockwork Alibi (Test Fixture)',
  district: 'District V, Budapest',
  timeReported: '23:00 CET',
  status: 'open',
  victim: {
    name: 'József Vágó',
    age: 48,
    occupation: 'Antiquarian',
    causeOfDeath: 'Gunshot wound',
  },
  synopsis: 'A test case designed to verify logical deduction evaluation.',
  briefing: 'A simulated crime scene with explicit contradiction and proof chains.',
  microBriefing: 'Test case for deterministic deduction engine verification.',
  objective: 'Test deduction logic.',
  initialFacts: ['Simulated factual event 1', 'Simulated factual event 2'],
  isLocked: false,
  coverImageKey: 'watchmakerAtelier',
  evidence: [
    {
      id: 'ev_fixture_casing',
      title: '9mm Spent Casing',
      description: 'Discharged brass cartridge matching Hungarian service pistol.',
      shortObservation: '9mm brass casing with distinctive firing pin strikes.',
      type: 'physical',
      locationFound: 'Courtyard Flagstones',
      isKeyEvidence: true,
    },
    {
      id: 'ev_fixture_ledger',
      title: 'Smuggling Ledger',
      description: 'Clandestine ledger logging illicit diamond watch deliveries.',
      shortObservation: 'Secret transaction ledger with coded client names.',
      type: 'document',
      locationFound: 'Desk Drawer',
      isKeyEvidence: true,
    },
    {
      id: 'ev_fixture_ticket',
      title: 'Validated Metro Stub',
      description: 'Transit stub validated at Deák Ferenc tér at 22:30.',
      shortObservation: 'Ticket validated at Deák tér at 22:30.',
      type: 'physical',
      locationFound: 'Alleyway Rain Gutter',
      isKeyEvidence: false,
    },
  ],
  suspects: [
    {
      id: 'suspect_fixture_toth',
      name: 'Béla Tóth',
      alias: 'The Smuggler',
      occupation: 'Courier',
      relationshipToVictim: 'Business Partner',
      alibi: 'Claims he stayed home all evening in Buda across the river.',
      isCleared: false,
    },
  ],
  timeline: [
    {
      id: 'tl_fixture_gunshot',
      time: '22:45',
      description: 'Single 9mm gunshot heard in courtyard.',
      verified: true,
    },
  ],
  truth: {
    culpritId: 'suspect_fixture_toth',
    motive: 'Dispute over smuggled stones in ledger.',
    murderWeaponId: 'ev_fixture_casing',
    conclusiveEvidenceIds: ['ev_fixture_casing', 'ev_fixture_ledger'],
  },
  deductions: [
    {
      id: 'ded_ticket_contradicts_alibi',
      caseId: 'case_fixture_deduction_test',
      title: 'Alibi Contradiction: Deák Square Transit',
      relationship: 'CONTRADICTS',
      source: { type: 'evidence', id: 'ev_fixture_ticket' },
      target: { type: 'statement', id: 'suspect_fixture_toth' },
      requiredEvidenceIds: ['ev_fixture_ticket'],
      conclusion:
        'The metro ticket validated in Pest at 22:30 directly refutes Tóth’s alibi of remaining in Buda all night.',
      isKeyDeduction: true,
    },
    {
      id: 'ded_ballistics_proves_shot',
      caseId: 'case_fixture_deduction_test',
      title: 'Physical Proof: Courtyard Gunshot',
      relationship: 'PROVES',
      source: { type: 'evidence', id: 'ev_fixture_casing' },
      target: { type: 'timeline', id: 'tl_fixture_gunshot' },
      requiredEvidenceIds: ['ev_fixture_casing'],
      conclusion:
        'The 9mm shell casing establishes that the acoustic report heard at 22:45 was the fatal gunshot.',
      isKeyDeduction: false,
    },
    {
      id: 'ded_ledger_supports_motive',
      caseId: 'case_fixture_deduction_test',
      title: 'Corroboration: Illicit Ledger Dispute',
      relationship: 'SUPPORTS',
      source: { type: 'evidence', id: 'ev_fixture_ledger' },
      target: { type: 'evidence', id: 'ev_fixture_casing' },
      requiredEvidenceIds: ['ev_fixture_ledger', 'ev_fixture_casing'],
      conclusion:
        'Unrecorded transactions in the ledger explain the sudden escalation to violence at the workbench.',
      isKeyDeduction: true,
    },
    {
      id: 'ded_gated_mastermind',
      caseId: 'case_fixture_deduction_test',
      title: 'Culprit Placement: Broken Alibi & Motive',
      relationship: 'PROVES',
      source: { type: 'evidence', id: 'ev_fixture_ledger' },
      target: { type: 'statement', id: 'suspect_fixture_toth' },
      requiredEvidenceIds: ['ev_fixture_ledger', 'ev_fixture_ticket'],
      prerequisiteDeductionIds: ['ded_ticket_contradicts_alibi'],
      conclusion:
        'With his alibi dismantled and connection to the illicit transactions confirmed, Tóth is placed at the scene.',
      isKeyDeduction: true,
    },
  ],
});
