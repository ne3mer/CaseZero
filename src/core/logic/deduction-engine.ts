import { Case } from '../types/case';
import {
  CaseDeduction,
  DeductionAttempt,
  DeductionEvaluationResult,
} from '../types/deduction';

/**
 * Pure Domain Engine: Evaluates player deduction attempts deterministically.
 * Contains ZERO React or React Native dependencies.
 *
 * Enforces:
 * - Evidence ownership (player must have collected the evidence)
 * - Exact relationship matching without revealing correct answer
 * - Corroborating evidence completeness
 * - Prerequisite unlocks
 * - Idempotency
 * - Zero answer leakage on negative evaluations
 */
export function evaluateDeductionAttempt(
  attempt: DeductionAttempt,
  caseDeductions: CaseDeduction[],
  playerInventoryEvidenceIds: string[],
  alreadyDiscoveredDeductionIds: string[]
): DeductionEvaluationResult {
  const inventorySet = new Set(playerInventoryEvidenceIds);
  const discoveredSet = new Set(alreadyDiscoveredDeductionIds);

  // 1. Verify that player actually possesses the evidence items they submitted
  const missingFromInventory = attempt.providedEvidenceIds.filter(
    (evId) => !inventorySet.has(evId)
  );
  if (missingFromInventory.length > 0) {
    return {
      status: 'MISSING_EVIDENCE',
      isSuccess: false,
      message: 'One or more referenced evidence items have not been secured in your evidence locker.',
    };
  }

  // 2. Locate matching deduction definition in case data (bidirectional match)
  const matchedDeduction = caseDeductions.find(
    (d) =>
      (d.source.id === attempt.sourceId && d.target.id === attempt.targetId) ||
      (d.source.id === attempt.targetId && d.target.id === attempt.sourceId)
  );

  // 3. Reject if no valid deduction exists between these two entities
  if (!matchedDeduction) {
    return {
      status: 'UNSUPPORTED',
      isSuccess: false,
      message: 'No verifiable connection can be substantiated between these elements.',
    };
  }

  // 4. Idempotency: check if deduction is already discovered
  if (discoveredSet.has(matchedDeduction.id)) {
    return {
      status: 'ALREADY_DISCOVERED',
      isSuccess: true,
      deductionId: matchedDeduction.id,
      conclusion: matchedDeduction.conclusion,
      message: 'This deduction has already been established in your dossier.',
    };
  }

  // 5. Prerequisite gating: check if required previous deductions have been resolved
  const prerequisites = matchedDeduction.prerequisiteDeductionIds || [];
  const unmetPrerequisites = prerequisites.filter((preId) => !discoveredSet.has(preId));
  if (unmetPrerequisites.length > 0) {
    return {
      status: 'UNMET_PREREQUISITES',
      isSuccess: false,
      message: 'Prerequisite lines of inquiry must be substantiated before drawing this conclusion.',
    };
  }

  // 6. Relationship validation: verify relationship without revealing the target relationship
  if (attempt.relationship !== matchedDeduction.relationship) {
    return {
      status: 'INVALID_RELATIONSHIP',
      isSuccess: false,
      message: 'The proposed relationship is not supported by logical deduction.',
    };
  }

  // 7. Evidence completeness: verify all required pieces of evidence are provided
  const requiredSet = new Set(matchedDeduction.requiredEvidenceIds);
  const providedSet = new Set(attempt.providedEvidenceIds);
  const missingRequired = Array.from(requiredSet).filter((reqId) => !providedSet.has(reqId));

  if (missingRequired.length > 0) {
    return {
      status: 'MISSING_EVIDENCE',
      isSuccess: false,
      message: 'Additional corroborating evidence is required to substantiate this deduction.',
    };
  }

  // 8. All constraints satisfied — valid deduction discovered
  return {
    status: 'VALID',
    isSuccess: true,
    deductionId: matchedDeduction.id,
    conclusion: matchedDeduction.conclusion,
    message: `Deduction verified: ${matchedDeduction.conclusion}`,
  };
}

/**
 * Pure Domain Engine: Telemetry without revealing solutions.
 * Analyzes case deductions to return counts of discovered vs currently discoverable deductions.
 */
export function getAvailableDeductionsForPlayer(
  caseDeductions: CaseDeduction[],
  playerInventoryEvidenceIds: string[],
  alreadyDiscoveredDeductionIds: string[]
): {
  totalCount: number;
  discoveredCount: number;
  discoverableCount: number;
} {
  const inventorySet = new Set(playerInventoryEvidenceIds);
  const discoveredSet = new Set(alreadyDiscoveredDeductionIds);

  let discoverableCount = 0;

  for (const deduction of caseDeductions) {
    if (discoveredSet.has(deduction.id)) {
      continue;
    }

    // Check prerequisites
    const prereqsMet = (deduction.prerequisiteDeductionIds || []).every((id) =>
      discoveredSet.has(id)
    );
    if (!prereqsMet) {
      continue;
    }

    // Check evidence availability
    const evidencePossessed = deduction.requiredEvidenceIds.every((id) =>
      inventorySet.has(id)
    );
    if (evidencePossessed) {
      discoverableCount++;
    }
  }

  return {
    totalCount: caseDeductions.length,
    discoveredCount: alreadyDiscoveredDeductionIds.length,
    discoverableCount,
  };
}

/**
 * Pure Domain Engine: Validates consistency and integrity of all deductions in a case.
 */
export function validateCaseDeductions(caseData: Case): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const deductions = caseData.deductions || [];
  const deductionIds = new Set<string>();

  const allEvidenceIds = new Set(caseData.evidence.map((e) => e.id));
  const allSuspectIds = new Set(caseData.suspects.map((s) => s.id));
  const allTimelineIds = new Set(caseData.timeline.map((t) => t.id));

  const validEntityIds = new Set<string>([
    ...allEvidenceIds,
    ...allSuspectIds,
    ...allTimelineIds,
  ]);

  for (const d of deductions) {
    // Unique ID check
    if (deductionIds.has(d.id)) {
      errors.push(`Duplicate deduction ID detected: '${d.id}'`);
    }
    deductionIds.add(d.id);

    // Self-reference check
    if (d.source.id === d.target.id) {
      errors.push(`Deduction '${d.id}' cannot connect an entity to itself: '${d.source.id}'`);
    }

    // Source entity check
    if (d.source.type !== 'deduction' && !validEntityIds.has(d.source.id)) {
      errors.push(`Deduction '${d.id}' references unknown source entity ID: '${d.source.id}'`);
    }

    // Target entity check
    if (d.target.type !== 'deduction' && !validEntityIds.has(d.target.id)) {
      errors.push(`Deduction '${d.id}' references unknown target entity ID: '${d.target.id}'`);
    }

    // Required evidence existence check
    for (const reqId of d.requiredEvidenceIds) {
      if (!allEvidenceIds.has(reqId)) {
        errors.push(`Deduction '${d.id}' requires non-existent evidenceId: '${reqId}'`);
      }
    }
  }

  // Second pass: Validate prerequisite references and check for circular dependency cycles
  for (const d of deductions) {
    for (const preId of d.prerequisiteDeductionIds || []) {
      if (!deductionIds.has(preId)) {
        errors.push(`Deduction '${d.id}' references non-existent prerequisite deduction: '${preId}'`);
      }
      if (preId === d.id) {
        errors.push(`Deduction '${d.id}' cannot have itself as a prerequisite.`);
      }
    }
  }

  // Cycle detection in prerequisites
  const visited = new Set<string>();
  const inStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    visited.add(nodeId);
    inStack.add(nodeId);

    const deduction = deductions.find((d) => d.id === nodeId);
    for (const preId of deduction?.prerequisiteDeductionIds || []) {
      if (!visited.has(preId) && hasCycle(preId)) {
        return true;
      } else if (inStack.has(preId)) {
        return true;
      }
    }

    inStack.delete(nodeId);
    return false;
  };

  for (const d of deductions) {
    if (!visited.has(d.id) && hasCycle(d.id)) {
      errors.push(`Circular prerequisite dependency cycle detected involving deduction '${d.id}'`);
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
