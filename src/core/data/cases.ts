import { Case } from '../types/case';
import { SAMPLE_DEV_CASE } from './sample-case';

export interface KnownCharacter {
  name: string;
  role: string;
}

export interface CaseListItem {
  id: string;
  caseNumber: string;
  title: string;
  district: string;
  synopsis: string;
  microSynopsis: string;
  coverImageKey: string;
  status: 'open' | 'in_progress' | 'solved' | 'classified';
  isLocked: boolean;
  lockReason?: string;
  isOfficialCase?: boolean;
  knownCharacters?: KnownCharacter[];
  totalEvidenceCount: number;
}

/**
 * Registry of cases in CASE ZERO
 *
 * OFFICIAL FIRST CASE: CZ-001: The Last Appointment (Watchmaker workshop disappearance, locked from inside)
 * TEMPORARY DEV TESTBED: CZ-DEV-001: The Danube Echo (Functional testbed for deduction and evidence recovery)
 */
export const CASE_REGISTRY: CaseListItem[] = [
  {
    id: 'case_001',
    caseNumber: 'CZ-001',
    title: 'The Last Appointment',
    district: 'Budapest, Hungary',
    synopsis:
      'Ádám Varga, a renowned watchmaker, has mysteriously disappeared from his antique watchmaking workshop. The workshop was found locked from the inside. A valuable pocket watch scheduled for delivery that evening is also missing.',
    microSynopsis:
      'Watchmaker Ádám Varga vanishes from his workshop, locked from the inside; valuable pocket watch missing.',
    coverImageKey: 'watchmakerAtelier',
    status: 'classified',
    isLocked: true,
    isOfficialCase: true,
    lockReason:
      'Official Case 1 in pre-investigation. Complete logical truth design and evidence chain pending final approval.',
    knownCharacters: [
      { name: 'Márton Fekete', role: 'Business Partner' },
      { name: 'Eszter Kovács', role: 'Former Apprentice' },
      { name: 'László Horváth', role: 'Collector' },
      { name: 'Bence Nagy', role: 'Courier' },
    ],
    totalEvidenceCount: 0,
  },
  {
    id: SAMPLE_DEV_CASE.id,
    caseNumber: SAMPLE_DEV_CASE.caseNumber,
    title: SAMPLE_DEV_CASE.title,
    district: SAMPLE_DEV_CASE.district,
    synopsis: SAMPLE_DEV_CASE.synopsis,
    microSynopsis:
      'Master watchmaker Ferenc Kovács shot inside atelier; wall safe ransacked. (Development Testbed)',
    coverImageKey: 'watchmakerAtelier',
    status: 'open',
    isLocked: false,
    isOfficialCase: false,
    totalEvidenceCount: SAMPLE_DEV_CASE.evidence.length,
  },
];

export function getCaseMetadata(idOrNumber: string): CaseListItem | undefined {
  return CASE_REGISTRY.find(
    (c) => c.id === idOrNumber || c.caseNumber === idOrNumber
  );
}

export function getCaseById(id: string): Case | undefined {
  if (id === 'case_dev_danube' || id === 'CZ-DEV-001') {
    return SAMPLE_DEV_CASE;
  }
  // Official Case 1 (CZ-001) is strictly locked and non-playable
  // Truth model, culprit, and timeline have not been finalized.
  return undefined;
}
