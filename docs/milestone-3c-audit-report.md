# CASE ZERO — Milestone 3C: Core Gameplay Validation & Deduction Quality Audit Report

**Date**: October 9, 2026  
**Status**: Completed & Verified  
**Target Environment**: `CZ-DEV-001: The Danube Echo` (Development Case)  
**Official Case Status**: `CZ-001: The Last Appointment` remains strictly locked & non-playable  
**Test Suite**: 45/45 Vitest unit & integration tests passing  

---

## 1. Deduction Logical Audit Report

### Overview
A rigorous forensic and epistemological examination was performed on all active deductions defined within the playable development case `CZ-DEV-001` (`The Danube Echo`).

In criminal investigation and deductive logic, hypotheses must maintain strict boundaries between:
- **Suspicion**: An unverified intuitive hypothesis or circumstantial interest without physical or testimonial corroboration.
- **Supporting Evidence**: Corroborating physical or documentary data that increases the probability of a hypothesis without uniquely identifying the culprit or timeline.
- **Contradiction**: A direct, mutually exclusive conflict between two verifiable facts (e.g., physical presence vs. alibi location at the exact same minute).
- **Conclusive Proof**: An irrefutable evidentiary chain establishing an occurrence, culprit identity, or causality beyond reasonable alternative explanation.

---

### Deduction 1: `ded_danube_ballistics_report`

| Criterion | Evaluation |
|---|---|
| **Deduction ID** | `ded_danube_ballistics_report` |
| **Title** | Ballistics Match: Népszínház Gunshot |
| **Available Evidence** | `ev_spent_shell_casing` (9mm Discharged Casing, recovered from floorboards near workbench) |
| **Connected Target** | `tl_03` ("22:45: Single muffled report noted by neighborhood resident.") |
| **Proposed Relationship** | `PROVES` |
| **Claimed Conclusion** | "The discharged 9mm cartridge confirms the single report heard at 22:45 was the fatal close-range shot." |
| **Required Assumptions** | 1. The casing was fired during the murder and not earlier, days ago, or planted.<br>2. The muffled report heard at 22:45 was definitively a gunshot and not an iron door, car backfire, or dropped safe.<br>3. The physical shell casing possesses a temporal timestamp establishing that 22:45 was the exact minute of firing. |
| **Does Conclusion Follow?** | **NO. LOGICAL & FORENSIC FALLACY.** Physical shell casings have no internal clock. A recovered spent brass casing establishes *material caliber and firearm mechanism* (9mm vintage service pistol), but it *cannot* establish the exact hour or minute of discharge. Physical presence is not chronological proof. Conflating physical presence with a specific witness timestamp is correlation treated as proof. |
| **Alternative Explanations** | • The fatal shot occurred during the heated argument at 21:15 (`tl_02`), and the sound at 22:45 was the safe door being levered or slammed shut.<br>• The gunshot occurred at 23:15, and the sound at 22:45 was unrelated neighborhood noise.<br>• The casing was discharged days ago during firearm maintenance and left near the workbench. |
| **Forensic Classification** | Claimed: `PROVES` (Conclusive Proof).<br>**Actual: CORROBORATING / SUPPORTING EVIDENCE (`SUPPORTS`)** at best, indicating a 9mm round was fired in the room. |
| **Status / Action** | **FLAGGED FOR REDESIGN**. Annotated in case data with `explanation` audit flag. Marked for redesign in Milestone 4 without fabricating synthetic narrative facts. |

---

### Deduction 2: `ded_danube_ledger_motive`

| Criterion | Evaluation |
|---|---|
| **Deduction ID** | `ded_danube_ledger_motive` |
| **Title** | Financial Dispute: Black Market Serial Numbers |
| **Available Evidence** | `ev_pocket_watch_log` (Encrypted Ledger with watch serial numbers & unrecorded cash entries, found in ajar wall safe) + `ev_spent_shell_casing` (9mm Discharged Casing) |
| **Proposed Relationship** | `SUPPORTS` |
| **Claimed Conclusion** | "Coded serial numbers inside the ransacked safe substantiate a fraudulent dispute that culminated in the shooting." |
| **Required Assumptions** | 1. The ledger entries relate directly to the person who pulled the trigger.<br>2. The murder was motivated by a fraudulent financial dispute rather than armed robbery, personal vengeance, blackmail, or burglary.<br>3. The killer opened the safe and examined the ledger rather than a third party. |
| **Does Conclusion Follow?** | **NO. LOGICAL LEAP WITHOUT INTERMEDIATE FACT.** An open safe with a clandestine ledger reveals that the victim engaged in illicit or undeclared commerce. A spent casing reveals a firearm was discharged. Connecting these two items together does not substantiate *who* disputed what, nor does it establish that a financial dispute was the causal motive of the homicide. There is zero documentary evidence linking the ledger entries to suspect Molnár, nor any record of an altercation over these specific watches. |
| **Alternative Explanations** | • Opportunistic burglary: an armed intruder discovered the unlocked grille (`tl_04`), shot Kovács during a struggle, and looted watches without reading the ledger.<br>• Murder motivated by apprentice rivalry (`Éva Varga`) or building access dispute (`Tibor Farkas`).<br>• Personal vendetta unrelated to the chronometer serial numbers. |
| **Forensic Classification** | Claimed: `SUPPORTS` (Corroborating Evidence).<br>**Actual: CIRCUMSTANTIAL SUSPICION**. It generates an investigative lead, but does not substantiate motive causality. |
| **Status / Action** | **FLAGGED FOR REDESIGN**. Annotated in case data with `explanation` audit flag. Marked for redesign in Milestone 4 without fabricating synthetic narrative facts. |

---

### Critical Latent Evidence Discrepancy: `ev_tram_ticket`

During the audit, a major evidentiary anomaly was surfaced in `CZ-DEV-001` that is currently unutilized in any active deduction:
- `ev_tram_ticket`: A transit stub stamped at **Rákóczi tér station at 22:58**, recovered directly from **Victim Ferenc Kovács's coat pocket**.
- `tl_03`: Timeline witness report claiming a single gunshot was heard inside the atelier at **22:45**.

**The Anomaly**: If Kovács was fatally shot at close range at 22:45 inside his Népszínház utca atelier, a deceased victim cannot validate a tram ticket 13 minutes later (22:58) at Rákóczi tér.

This represents an authentic, textbook **CONTRADICTION** (`CONTRADICTS`):
- Either Kovács was alive and traveling at 22:58 (rendering the 22:45 gunshot non-fatal or unrelated), or
- Someone else was wearing Kovács's coat / planted the ticket, or
- The neighbor's 22:45 timestamp is incorrect or fabricated.

This discrepancy has genuine deductive weight, yet it currently lacks a formal deduction node in `CZ-DEV-001`. This should form the core contradiction puzzle in Milestone 4.

---

## 2. Gameplay UX Audit

### Detective Experience vs. Multiple-Choice Quiz

| Aspect | Current Experience | Detective Feel vs Quiz Evaluation |
|---|---|---|
| **Crime Scene Discovery** | Visual inspection via 16:9 canvas, Detective Lens toggle, zoom levels (1.0x, 1.5x, 2.0x), interactive hotspots. | **High Detective Feel**: Searching the atelier, noticing tools, casing, and safe feels atmospheric, visual-first, and exploratory. |
| **Evidence Board Presentation** | Neo-noir dark aesthetic, dossier badges, pin-board slot connectors (`⇄`), record thumbnails. | **High Visual Immersion**: Looks and feels like a tactical detective dossier desk rather than a database table. |
| **Hypothesis Formulation** | Freeform selection of Record A + Record B + Relationship verb (`PROVES`, `SUPPORTS`, `CONTRADICTS`, `RELATED`). | **Feels Like a Quiz / Slot Machine**: Without a guiding "Line of Inquiry" prompt, the player is presented with 10 cards and 4 verbs. The cognitive task becomes "Which two cards snap together?" rather than "What answers my investigative question?" |
| **Relationship Verbs** | Abstract categories (`PROVES`, `SUPPORTS`, `CONTRADICTS`, `RELATED`). | **Ambiguous**: In normal human language, a shell casing is "RELATED" to a gunshot. Rejecting `RELATED` when expecting `PROVES` feels pedantic and arbitrary. |
| **Negative Feedback** | "No verifiable connection can be substantiated between these elements." | **Low Informational Value**: The feedback is neutral and prevents spoilers, but gives zero investigative feedback on why the reasoning failed. |

---

## 3. Brute-Force Risk Assessment

### Mathematical Analysis of Combinatorial Space

In `CZ-DEV-001`, the player can select from:
- 3 Evidence records
- 4 Timeline entries
- 3 Suspect testimonies
- **Total selectable items**: $N = 10$ records.

Because the deduction engine evaluates pairs symmetrically (Record A $\leftrightarrow$ Record B is commutative):
$$\text{Total Unique Pairs} = \binom{10}{2} = \frac{10 \times 9}{2} = 45 \text{ pairs}$$

With 4 relationship verbs:
$$\text{Total Combinations} = 45 \times 4 = 180 \text{ combinations}$$

### Brute-Force Feasibility:
- **Time per attempt**: ~2 seconds (selecting two items and tapping a relationship button).
- **Time to test entire case**: $180 \times 2 \text{ seconds} = 360 \text{ seconds} = \mathbf{6.0 \text{ minutes}}$.
- **Failure Penalty**: Zero. No deduction energy, cooldown, or clue expenditure.
- **Risk Level**: **CRITICAL**. A player frustrated by subtle text distinctions can exhaust the entire state space in under 6 minutes through mechanical trial-and-error without reading a single sentence.

### Recommended Architectural Mitigations:
1. **Inquiry-Driven Hypotheses**: Group deductions into structured investigative questions (e.g., *Inquiry 1: Establish the true time of death*). This bounds the selection space to relevant records and provides narrative intention.
2. **Contextual Operational Definitions**: Display dynamic prompt context explaining what `CONTRADICTS` means in the current context (e.g., "Select an alibi and physical evidence that refutes it").
3. **Investigative Focus / Clue Cost**: Introduce a non-punitive focus meter (e.g., 3 hypothesis tests per crime scene visit) that requires deliberate thought rather than rapid clicking.
4. **Near-Miss Feedback**: If a player pairs two genuinely related items but chooses the wrong relationship verb, provide subtle feedback (e.g., *"These records are connected, but physical presence alone does not establish timeline proof"*).

---

## 4. Mobile UX & Accessibility Review

### iPhone Ergonomics & Small-Screen Layout Audit

| Element | Location | Pre-Audit Measurement | Issue | Remedy Applied |
|---|---|---|---|---|
| **Zoom Presets** | `CrimeSceneCanvas.tsx` | ~28x20pt | Failed Apple HIG (44x44pt min target). Hard to tap on small screens. | Added `hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}`. |
| **Detective Lens Toggle** | `CrimeSceneCanvas.tsx` | ~110x26pt | Height below 44pt target. | Added `hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}`. |
| **Fast Action Buttons** | `investigation.tsx` | ~90x22pt | Height below 44pt target. | Added `hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}` to both buttons. |
| **View Full Inventory Link** | `investigation.tsx` | ~120x16pt | Height below 44pt target. | Added `hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}`. |
| **Workspace Reset Button** | `DeductionWorkspace.tsx` | ~45x20pt | Height below 44pt target. | Added `hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}`. |
| **Feedback Dismiss Button** | `evidence-board.tsx` | ~20x20pt | Failed 44x44pt accessibility rule. | Added `hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}`. |
| **Dossier Tabs** | `evidence-board.tsx` | ~110x28pt | Height below 44pt target. | Increased vertical padding to 10, `minHeight: 40`, and added `hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}`. |
| **Clean-Slate State** | `game-store.ts` | Defaulted to `['ev_spent_shell_casing']` | Hardcoded casing pre-unlocked casing on clean runs; blocked "NO EVIDENCE SECURED" empty state. | Corrected `unlockedEvidenceIds` to initialize as `[]` and persist cleanly. |

---

## 5. Confirmed Bugs and Fixes

### 1. State Bug: Forced Shell Casing Initialization
- **Problem**: `src/store/game-store.ts` defaulted `unlockedEvidenceIds` to `['ev_spent_shell_casing']` during store creation, `initialize()`, `setActiveCase()`, and `resetActiveCaseProgress()`.
- **Consequence**: On a brand new installation or after progress reset, the casing was pre-collected (`✓ SECURED` in crime scene) before the player ever inspected the scene. The "NO EVIDENCE SECURED" warning on the Evidence Board was impossible to see.
- **Fix**: Updated `game-store.ts` to initialize `unlockedEvidenceIds` from actual stored state without injecting synthetic evidence. Resetting progress now restores a true clean slate (`[]`).

### 2. Usability Bug: Touch Target Accessibility Violations
- **Problem**: 7 distinct pressable controls across `CrimeSceneCanvas`, `investigation`, `DeductionWorkspace`, and `evidence-board` failed the mandatory 44x44pt touch target rule from `AGENTS.md`.
- **Fix**: Injected `hitSlop` bounding boxes and minimum height constraints across all affected controls.

### 3. Logic Audit Annotations: Unsupported Deduction Claims
- **Problem**: Two deductions in `CZ-DEV-001` made unsubstantiated claims (`PROVES` on a physical shell casing for an auditory clock timestamp, and `SUPPORTS` on a ledger for murder motive causality).
- **Fix**: Added explicit `explanation` audit redesign flags to `sample-case.ts` preserving test assertions while documenting the logical flaws for Milestone 4 redesign.

---

## 6. Manual iPhone Playtest Checklist

Use this checklist during physical device testing on iPhone (via Expo Go / development client):

| Step | Test Objective | Metric / Question to Measure | Expected Value / Target |
|---|---|---|---|
| **1** | **Initial Launch** | Launch app from clean state (use Reset Progress in Settings). Does main menu show "START INVESTIGATION" without "CONTINUE"? | Yes (clean slate, 0 clues). |
| **2** | **Empty State Navigation** | Navigate to Evidence Board before collecting clues. Does "NO EVIDENCE SECURED" card appear with "ENTER CRIME SCENE" button? | Yes. |
| **3** | **Time to Discover First Clue** | Enter crime scene. Tap workbench casing hotspot. Measure seconds from entering scene to securing first clue. | Target: $< 20 \text{ seconds}$. |
| **4** | **Detective Lens & Zoom Usability** | Toggle Detective Lens and tap `1.5x` and `2.0x` zoom presets. Are buttons responsive on the first tap? | 100% tap responsiveness. |
| **5** | **Evidence Collection Flow** | Collect all 3 hotspots (Casing, Safe Ledger, Coat Tram Ticket). Verify locker telemetry shows 3/3 clues secured. | 3/3 clues secured. |
| **6** | **Time to Attempt First Deduction** | Open Evidence Board. Connect Slot 1, Slot 2, select relationship. Measure seconds from opening board to tapping "TEST DEDUCTION HYPOTHESIS". | Target: $< 45 \text{ seconds}$. |
| **7** | **Relationship Comprehension** | Does player understand difference between `PROVES`, `SUPPORTS`, and `CONTRADICTS`? Ask player to explain why they picked a verb. | Observe if choice is deliberate or guess. |
| **8** | **Guessing Behavior Count** | Count number of rapid consecutive attempts without re-reading cards. | Target: $< 3 \text{ random guesses}$. |
| **9** | **The Aha Moment** | Does player spot the tram ticket (22:58) vs gunshot (22:45) discrepancy? | Document if player notices inconsistency. |
| **10** | **Desire to Continue** | After solving or reaching conclusion, ask player: *"Do you want to accuse a suspect or investigate further?"* | Qualitative feedback rating (1–5). |

---

## 7. Recommendations for First Complete Puzzle (Milestone 4)

To elevate CASE ZERO from a card-matching quiz into a genuine detective deduction experience:

1. **Build Around an Authentic Contradiction Chain**:
   - Make the central puzzle of the first case an ironclad alibi contradiction:
     - Suspect claims: *"I was at the card salon in Buda across the river by 22:00."*
     - Recovered stub: Stamped transit ticket placed at *Rákóczi tér station in Pest at 22:58*.
     - Deduction: Ticket `CONTRADICTS` Alibi $\rightarrow$ places suspect in District VIII during the homicide window.
2. **Transform Deductions into Lines of Inquiry**:
   - Rather than an undirected board, present the detective with active investigative questions:
     - *Question 1: Was Ferenc Kovács killed at 22:45?*
     - *Question 2: Does Attila Molnár have a verified alibi?*
3. **Multi-Step Deductive Gating**:
   - Require establishing the falsity of the alibi before unlocking the motive deduction.
4. **Preserve Visual-First Principles**:
   - Use high-contrast macro inspectable evidence graphics (e.g. punch-hole stamps on tickets, microscopic firing-pin striations) so deduction happens through visual observation rather than reading blocks of text.
