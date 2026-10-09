import { DeductionHypothesis, DeductionResult, TruthModel } from '../types/case';

/**
 * Pure Game Logic: Deterministic Truth Evaluation Engine
 *
 * Checks a player's deduction hypothesis against the case's fixed truth model.
 * Never delegates verdict determination to AI text generation.
 * Operates with mathematical certainty based on factual evidence and verified links.
 */
export function evaluateDeduction(
  truth: TruthModel,
  hypothesis: DeductionHypothesis
): DeductionResult {
  const culpritMatches = truth.culpritId === hypothesis.culpritId;
  const weaponMatches = truth.murderWeaponId === hypothesis.weaponId;

  // Conclusive evidence validation
  const requiredEvidence = new Set(truth.conclusiveEvidenceIds);
  const playerEvidence = new Set(hypothesis.supportingEvidenceIds);

  const missingEvidenceIds: string[] = [];
  let matchingCount = 0;

  for (const evidenceId of requiredEvidence) {
    if (playerEvidence.has(evidenceId)) {
      matchingCount++;
    } else {
      missingEvidenceIds.push(evidenceId);
    }
  }

  const evidenceCoverage =
    requiredEvidence.size > 0 ? matchingCount / requiredEvidence.size : 1;

  // Fully proven: Culprit matches, weapon matches, and all conclusive evidence is linked
  const isFullyProven = culpritMatches && weaponMatches && missingEvidenceIds.length === 0;

  let verdict: DeductionResult['verdict'];
  let reasoning: string;

  if (isFullyProven) {
    verdict = 'PROVEN';
    reasoning =
      'The chain of evidence is unbreakable. The identity of the perpetrator, the weapon utilized, and conclusive material proof form an incontrovertible conclusion.';
  } else if (!culpritMatches || !weaponMatches) {
    verdict = 'REFUTED';
    reasoning =
      'The deduction contains fundamental contradictions. Either the identified suspect has an unbreached alibi or the weapon does not align with the forensic findings.';
  } else {
    verdict = 'INSUFFICIENT_EVIDENCE';
    reasoning =
      'While the suspect and weapon correspond to the facts, the supporting evidence is circumstantial. Critical conclusive evidence is missing to establish guilt beyond doubt.';
  }

  return {
    isCorrect: isFullyProven,
    culpritMatches,
    weaponMatches,
    evidenceCoverage,
    missingEvidenceIds,
    verdict,
    reasoning,
  };
}
