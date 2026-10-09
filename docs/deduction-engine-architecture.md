# CASE ZERO — Deterministic Deduction Engine Architecture (Milestone 3A)

## 1. Overview & Core Philosophy

In CASE ZERO, **finding evidence is not the same as understanding it**. 

Players do not progress simply by hoovering up clues in crime scenes or triggering sequential unlocks. True mystery comprehension requires genuine logical deduction: actively hypothesizing how pieces of physical evidence corroborate, refute, or prove witness testimony, crime scene facts, and timelines.

### Principles:
1. **Zero AI Inference**: All deduction correctness is governed strictly by deterministic algorithms (`src/core/logic/deduction-engine.ts`). No generative AI hallucinations determine whether a player's conclusion is sound.
2. **Pure Game Logic Decoupling**: The deduction engine is pure TypeScript containing zero React or React Native dependencies, adhering strictly to Rule 2 in `AGENTS.md`.
3. **No Answer Leakage**: Failed deduction submissions return neutral failure codes (`INVALID_RELATIONSHIP`, `MISSING_EVIDENCE`, `UNSUPPORTED`) without disclosing the true expected relationship, required evidence items, or culprit identity.
4. **Idempotence & State Safety**: Evaluating or re-discovering deductions is strictly idempotent. Progress persists locally in offline-first storage (`AsyncStorage`).

---

## 2. Structured Domain Schemas

Defined in [`src/core/types/deduction.ts`](file:///Users/nimaafsharfar/Desktop/game/code/CaseZero/src/core/types/deduction.ts) and integrated into [`CaseSchema`](file:///Users/nimaafsharfar/Desktop/game/code/CaseZero/src/core/types/case.ts).

### Relationship Types
```typescript
export const DeductionRelationshipSchema = z.enum([
  'SUPPORTS',     // Evidence corroborates a claim or motive
  'CONTRADICTS', // Evidence logically refutes a statement or alibi
  'RELATED',     // Elements share material provenance or connection
  'PROVES',      // Evidence conclusively establishes a factual event
]);
```

### Valid Deduction Definition (`CaseDeduction`)
```typescript
export interface CaseDeduction {
  id: string;
  caseId: string;
  title: string;
  relationship: DeductionRelationship;
  source: DeductionNodeRef;
  target: DeductionNodeRef;
  requiredEvidenceIds: string[];
  prerequisiteDeductionIds?: string[];
  conclusion: string;
  explanation?: string;
  isKeyDeduction: boolean;
}
```

### Player Attempt (`DeductionAttempt`)
```typescript
export interface DeductionAttempt {
  caseId: string;
  relationship: DeductionRelationship;
  sourceId: string;
  targetId: string;
  providedEvidenceIds: string[];
}
```

### Evaluation Output (`DeductionEvaluationResult`)
```typescript
export interface DeductionEvaluationResult {
  status:
    | 'VALID'
    | 'INVALID_RELATIONSHIP'
    | 'MISSING_EVIDENCE'
    | 'UNMET_PREREQUISITES'
    | 'UNSUPPORTED'
    | 'ALREADY_DISCOVERED';
  isSuccess: boolean;
  deductionId?: string;
  conclusion?: string;
  message: string;
}
```

---

## 3. Evaluation Pipeline

The pure function `evaluateDeductionAttempt()` executes 8 deterministic stages:

1. **Inventory Verification**:
   - Ensures the player physically possesses every evidence item submitted in `providedEvidenceIds`.
   - Prevents players from referencing uncollected evidence.
2. **Entity Pairing Lookup (Symmetric)**:
   - Matches `(sourceId == s && targetId == t) || (sourceId == t && targetId == s)`.
   - Eliminates directional frustration so players are not penalized for the tap order of two valid items.
3. **Existence Check**:
   - Rejects arbitrary, non-defined connections with `UNSUPPORTED`.
4. **Idempotency Check**:
   - If the deduction is already in `alreadyDiscoveredDeductionIds`, returns `ALREADY_DISCOVERED` with `isSuccess: true` and the existing conclusion, preventing duplicate event triggers.
5. **Prerequisite Gating**:
   - Evaluates `prerequisiteDeductionIds`. Rejects with `UNMET_PREREQUISITES` if earlier foundational conclusions have not yet been drawn.
6. **Relationship Verification**:
   - Rejects mismatching relationship types with `INVALID_RELATIONSHIP` without revealing the target relationship.
7. **Corroborating Evidence Completeness**:
   - Ensures all `requiredEvidenceIds` are present in `providedEvidenceIds`. Rejects partial submissions with `MISSING_EVIDENCE`.
8. **Confirmation**:
   - Returns `VALID`, updates game state, and unlocks the deterministic `conclusion`.

---

## 4. Local Persistence Integration

- **Storage Key**: `@casezero:discovered_deductions:<caseId>`
- **Adapter** ([`src/storage/case-storage.ts`](file:///Users/nimaafsharfar/Desktop/game/code/CaseZero/src/storage/case-storage.ts)):
  - `getDiscoveredDeductions(caseId: string): Promise<string[]>`
  - `saveDiscoveredDeductions(caseId: string, deductionIds: string[]): Promise<void>`
  - `migrateLegacyProgress()`: Migrates any legacy stored deductions safely from old keys without data loss.
- **Store** ([`src/store/game-store.ts`](file:///Users/nimaafsharfar/Desktop/game/code/CaseZero/src/store/game-store.ts)):
  - Holds `discoveredDeductionIds: string[]`.
  - Exposes `submitDeduction(attempt, caseDeductions)` which executes pure evaluation and persists on discovery.

---

## 5. Case Content & Current Status

### CZ-DEV-001 (The Danube Echo)
- Grounded deductions implemented:
  - `ded_danube_ballistics_report` (`ev_spent_shell_casing` PROVES `tl_03` gunshot report).
  - `ded_danube_ledger_motive` (`ev_pocket_watch_log` + `ev_spent_shell_casing` SUPPORTS fraudulent transaction motive).
- **Contradiction Analysis**:
  - The development testbed does not currently feature a fully formalized contradiction between Molnár's alibi and transit records.
  - To preserve narrative truth and avoid fabricating ungrounded puzzle answers, complete contradiction chains are isolated in the unit test fixture ([`deduction-fixture.ts`](file:///Users/nimaafsharfar/Desktop/game/code/CaseZero/src/core/data/fixtures/deduction-fixture.ts)).

### Official Case 1: CZ-001 (The Last Appointment)
- Remains locked and non-playable. No synthetic deduction rules or premature truth models have been injected.
