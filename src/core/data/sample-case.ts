import { Case, CaseSchema } from '../types/case';

/**
 * Structured Case File: CZ-001
 * Budapest, District VIII (Józsefváros)
 *
 * All cases are data-driven records validated with Zod.
 */
export const SAMPLE_CASE_001: Case = CaseSchema.parse({
  id: 'case_001',
  caseNumber: 'CZ-001',
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
  evidence: [
    {
      id: 'ev_spent_shell_casing',
      title: '9mm Discharged Casing',
      description:
        'A brass shell casing with firing-pin impressions matching vintage Hungarian service pistols.',
      type: 'physical',
      locationFound: 'Workshop Floorboards, near Workbench',
      isKeyEvidence: true,
    },
    {
      id: 'ev_pocket_watch_log',
      title: 'Encrypted Ledger',
      description:
        'Ledger recording black-market watch serial numbers and undisclosed cash transactions.',
      type: 'document',
      locationFound: 'Ajar Wall Safe',
      isKeyEvidence: true,
    },
    {
      id: 'ev_tram_ticket',
      title: 'Tram Line 4/6 Ticket',
      description:
        'Validated transit ticket stamped at Rákóczi tér station at 22:58.',
      type: 'physical',
      locationFound: "Victim's Coat Pocket",
      isKeyEvidence: false,
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
});
