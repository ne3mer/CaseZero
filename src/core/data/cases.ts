import { Case } from '../types/case';
import { SAMPLE_CASE_001 } from './sample-case';

export interface CaseListItem {
  id: string;
  caseNumber: string;
  title: string;
  district: string;
  synopsis: string;
  status: 'open' | 'in_progress' | 'solved' | 'classified';
  isLocked: boolean;
  lockReason?: string;
  totalEvidenceCount: number;
}

/**
 * Registry of cases in the Budapest Criminal Investigation Division
 */
export const CASE_REGISTRY: CaseListItem[] = [
  {
    id: SAMPLE_CASE_001.id,
    caseNumber: SAMPLE_CASE_001.caseNumber,
    title: SAMPLE_CASE_001.title,
    district: SAMPLE_CASE_001.district,
    synopsis: SAMPLE_CASE_001.synopsis,
    status: 'open',
    isLocked: false,
    totalEvidenceCount: SAMPLE_CASE_001.evidence.length,
  },
  {
    id: 'case_002',
    caseNumber: 'CZ-002',
    title: 'The Last Appointment',
    district: 'District V (Belváros), Budapest',
    synopsis:
      'A high-profile psychiatrist is found dead inside his private practice on Váci utca. Client records shredded, no signs of forced entry.',
    status: 'classified',
    isLocked: true,
    lockReason: 'Dossier classified by Central Command pending forensic clearance.',
    totalEvidenceCount: 4,
  },
];

/**
 * Case Data Store Map
 */
const CASE_DATA_MAP: Record<string, Case> = {
  [SAMPLE_CASE_001.id]: SAMPLE_CASE_001,
  // Note: CZ-002 "The Last Appointment" will be introduced in its designated milestone
};

export function getCaseById(id: string): Case | undefined {
  return CASE_DATA_MAP[id];
}
