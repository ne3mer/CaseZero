import { Case, CaseSchema } from '../types/case';

/**
 * Temporary Development Content: The Danube Echo
 * Case Number: CZ-DEV-001 / ID: case_dev_danube
 *
 * Used as the functional testbed for game mechanics, evidence recovery,
 * and deterministic truth evaluation during development milestones.
 */
export const SAMPLE_DEV_CASE: Case = CaseSchema.parse({
  id: 'case_dev_danube',
  caseNumber: 'CZ-DEV-001',
  title: 'The Danube Echo',
  district: 'District VIII (Józsefváros), Budapest',
  timeReported: '23:40 CET',
  status: 'open',
  victim: {
    name: 'Ferenc Kovács',
    age: 52,
    occupation: 'Master Watchmaker & Collector',
    causeOfDeath: 'Perforating gunshot wound, 9mm caliber',
  },
  synopsis:
    'Ferenc Kovács was found dead inside his workshop on Népszínház utca. The workshop safe was left ajar with rare timepieces missing.',
  briefing:
    'At 23:40, a local night patrol discovered the workshop security grille unlocked. Inside, Kovács lay beside his workbench. A single 9mm casing was recovered from the oak floorboards. Three individuals were in contact with the victim during the hours leading up to the murder.',
  microBriefing:
    'Ferenc Kovács lies dead beside his workbench on Népszínház utca, killed by a close-range 9mm shot. The wall safe is forced open with rare chronometers missing.',
  objective:
    'Inspect the crime scene, secure physical ballistics, and uncover the motive.',
  initialFacts: [
    'Victim Ferenc Kovács (52) suffered a close-range 9mm gunshot wound.',
    'A single spent brass cartridge was found on the floorboards.',
    'Workshop safe was forced open with serial ledgers exposed.',
    'Security grille was unlocked at 23:40 CET without signs of forced exterior entry.',
  ],
  isLocked: false,
  coverImageKey: 'watchmakerAtelier',
  hotspots: [
    {
      id: 'hs_wall_safe',
      evidenceId: 'ev_pocket_watch_log',
      label: 'Ajar Wall Safe & Stacked Ledgers',
      x: 0.68,
      y: 0.48,
      radius: 0.08,
      descriptionHint: 'Steel safe swung open with document ledgers visible on shelf',
    },
    {
      id: 'hs_workbench_casing',
      evidenceId: 'ev_spent_shell_casing',
      label: 'Workbench Floorboards & Ballistics',
      x: 0.22,
      y: 0.82,
      radius: 0.08,
      descriptionHint: 'Brass casing resting beside watchmaker tools near floor edge',
    },
    {
      id: 'hs_coat_ticket',
      evidenceId: 'ev_tram_ticket',
      label: 'Transit Stub & Coat Pocket',
      x: 0.42,
      y: 0.62,
      radius: 0.08,
      descriptionHint: 'Transit ticket documented near the victim coat pocket',
    },
  ],
  evidence: [
    {
      id: 'ev_spent_shell_casing',
      title: '9mm Discharged Casing',
      description:
        'A brass shell casing with firing-pin impressions matching vintage Hungarian service pistols.',
      shortObservation:
        '9mm brass casing with firing-pin marks matching vintage service pistols.',
      type: 'physical',
      locationFound: 'Workshop Floorboards, near Workbench',
      isKeyEvidence: true,
      imageKey: 'ev_spent_shell_casing',
    },
    {
      id: 'ev_pocket_watch_log',
      title: 'Encrypted Ledger',
      description:
        'Ledger recording black-market watch serial numbers and undisclosed cash transactions.',
      shortObservation:
        'Clandestine serial numbers and black-market transaction tallies.',
      type: 'document',
      locationFound: 'Ajar Wall Safe',
      isKeyEvidence: true,
      imageKey: 'ev_pocket_watch_log',
    },
    {
      id: 'ev_tram_ticket',
      title: 'Tram Line 4/6 Ticket',
      description:
        'Validated transit ticket stamped at Rákóczi tér station at 22:58.',
      shortObservation:
        'Transit stub validated at Rákóczi tér station at 22:58.',
      type: 'physical',
      locationFound: "Victim's Coat Pocket",
      isKeyEvidence: false,
      imageKey: 'ev_tram_ticket',
    },
  ],
  suspects: [
    {
      id: 'suspect_attila_molnar',
      name: 'Attila Molnár',
      alias: 'The Appraiser',
      occupation: 'Antique Dealer & Partner',
      relationshipToVictim: 'Business Associate',
      alibi: 'Claims to have spent the entire evening at a private card salon in Buda.',
      isCleared: false,
    },
    {
      id: 'suspect_eva_varga',
      name: 'Éva Varga',
      alias: 'The Apprentice',
      occupation: 'Horology Apprentice',
      relationshipToVictim: 'Former Protégé',
      alibi: 'Stated she left the atelier at 19:30 and went straight home to Óbuda.',
      isCleared: false,
    },
    {
      id: 'suspect_tibor_farkas',
      name: 'Tibor Farkas',
      alias: 'The Night Watchman',
      occupation: 'Building Concierge',
      relationshipToVictim: 'Keyholder',
      alibi: 'Claims he was making his scheduled rounds on the second floor.',
      isCleared: false,
    },
  ],
  timeline: [
    {
      id: 'tl_01',
      time: '19:30',
      description: 'Apprentice Éva Varga logs departure from workshop.',
      verified: true,
    },
    {
      id: 'tl_02',
      time: '21:15',
      description: 'A heated argument heard through courtyard window.',
      verified: true,
    },
    {
      id: 'tl_03',
      time: '22:45',
      description: 'Single muffled report noted by neighborhood resident.',
      verified: true,
    },
    {
      id: 'tl_04',
      time: '23:40',
      description: 'Patrol officer discovers unlocked security grille.',
      verified: true,
    },
  ],
  truth: {
    culpritId: 'suspect_attila_molnar',
    motive: 'Dispute over illicit provenance and fraudulent ledger entries.',
    murderWeaponId: 'ev_spent_shell_casing',
    conclusiveEvidenceIds: ['ev_spent_shell_casing', 'ev_pocket_watch_log'],
  },
  deductions: [
    {
      id: 'ded_danube_ballistics_report',
      caseId: 'case_dev_danube',
      title: 'Ballistics Match: Népszínház Gunshot',
      relationship: 'PROVES',
      source: { type: 'evidence', id: 'ev_spent_shell_casing' },
      target: { type: 'timeline', id: 'tl_03' },
      requiredEvidenceIds: ['ev_spent_shell_casing'],
      conclusion:
        'The discharged 9mm cartridge confirms the single report heard at 22:45 was the fatal close-range shot.',
      explanation:
        'FLAGGED FOR REDESIGN: A physical shell casing cannot establish the exact time of a gunshot. Caliber corroboration only; marked for narrative redesign in Milestone 4.',
      isKeyDeduction: true,
    },
    {
      id: 'ded_danube_ledger_motive',
      caseId: 'case_dev_danube',
      title: 'Financial Dispute: Black Market Serial Numbers',
      relationship: 'SUPPORTS',
      source: { type: 'evidence', id: 'ev_pocket_watch_log' },
      target: { type: 'evidence', id: 'ev_spent_shell_casing' },
      requiredEvidenceIds: ['ev_pocket_watch_log', 'ev_spent_shell_casing'],
      conclusion:
        'Coded serial numbers inside the ransacked safe substantiate a fraudulent dispute that culminated in the shooting.',
      explanation:
        'FLAGGED FOR REDESIGN: An encrypted ledger and spent casing establish suspicion but cannot prove dispute causality without documentary or witness links. Marked for narrative redesign in Milestone 4.',
      isKeyDeduction: true,
    },
  ],
});

/**
 * Backward compatibility alias for existing test runners
 */
export const SAMPLE_CASE_001 = SAMPLE_DEV_CASE;
