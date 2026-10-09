# CASE ZERO — Architecture & Engineering Rules

CASE ZERO is a premium-quality, narrative detective mystery mobile game for iOS and Android, set in a fictionalized neo-noir Budapest.

Players investigate crime scenes, collect evidence, interrogate suspects, connect clues, reconstruct timelines, test hypotheses, and prove what actually happened using genuine logical deduction.

---

## 1. Core Architectural Tenets

1. **Modular, Data-Driven Architecture**:
   Game logic, case data, state management, and presentation layers are strictly decoupled.
2. **Game Logic Separation**:
   Game logic, deduction math, and truth verification must live in `src/core/` and contain **zero React or React Native dependencies**.
3. **Structured Case Data**:
   All case dossiers, evidence records, suspects, and timelines must be structured data models validated by **Zod** (`src/core/types/case.ts`).
4. **Immutable Fixed Truth Model**:
   Every case possesses a deterministic ground truth (`TruthModel`). Solvability is verifiable by checking player hypotheses against this fixed truth model.
5. **No AI-Determined Correctness**:
   Never allow AI-generated narrative text to decide whether a player's deduction or answer is correct. Correctness is governed exclusively by deterministic logic in `src/core/logic/truth-evaluator.ts`.
6. **Offline-First Architecture**:
   The game must function completely offline. Progress, bookmarks, and evidence records persist locally via `AsyncStorage` (`src/storage/`).
7. **Strict TypeScript**:
   No `any` unless strictly required for external library bridging. Use explicit return types on domain logic.
8. **Lean Dependencies**:
   Avoid unnecessary dependencies. Rely on recommended Expo packages and lean utilities (`zustand`, `zod`, `vitest`).
9. **Cross-Platform Compatibility**:
   Ensure smooth, consistent execution on both iOS and Android. Keep platform-specific code behind clean abstractions.
10. **Mobile-First & Portrait-Oriented**:
    The UI is strictly mobile-first and locked to portrait orientation (`app.json`). All hit targets must meet mobile accessibility criteria (minimum 44x44pt).
11. **Reusable UI Component System**:
    Use the unified design system in `src/components/common/` (`NoirCard`, `NoirButton`, `NoirHeader`, `DossierBadge`). Never inline duplicate styles.
12. **Automated Testing for Critical Logic**:
    All deduction algorithms, timeline verifications, and case validation schemas must be covered by **Vitest** tests in `src/core/__tests__/`.
13. **No Case-Specific Logic in UI Screens**:
    Never hardcode case-specific IDs, conditions, or puzzle branches directly in screen components. Screens are generic consumers of case data.
14. **No Hollow Mock Features**:
    Never create mock features or buttons that appear functional but do nothing. Every interactive element must update state or trigger real behavior.
15. **No Backend or AI Services Yet**:
    Do not implement cloud servers, remote databases, or external AI APIs until explicitly designated in future milestones.

---

## 2. Directory Structure

```
CaseZero/
├── src/
│   ├── app/                 # Expo Router routes and navigation layouts ONLY
│   │   ├── _layout.tsx      # Root Stack layout (Neo-noir theme, StatusBar)
│   │   └── index.tsx        # Case Zero Home / Investigation Desk
│   ├── core/                # PURE DOMAIN LOGIC (Zero React/RN imports)
│   │   ├── types/           # Zod schemas & TypeScript domain types
│   │   ├── logic/           # Deterministic deduction & truth evaluation
│   │   ├── data/            # Validated structured case records
│   │   └── __tests__/       # Vitest unit test suites
│   ├── store/               # Zustand game session state
│   ├── storage/             # AsyncStorage adapters (offline-first)
│   ├── components/
│   │   └── common/          # Reusable Noir UI components
│   ├── constants/
│   │   └── theme.ts         # Design tokens: palette, typography, spacing
│   └── hooks/               # Custom React hooks
├── assets/                  # Static assets (icons, splash, imagery)
├── declarations.d.ts        # TypeScript asset module declarations
├── app.json                 # Expo configuration
├── package.json             # Dependencies and build scripts
└── tsconfig.json            # Strict TypeScript compiler options
```

---

## 3. Visual & Aesthetic Standards

- **Palette**:
  - Dark Charcoal Abyss (`#090B0F`), Matte Charcoal (`#12151D`), Elevated Charcoal (`#1A1E29`)
  - Warm Muted Gold Accents (`#C5A059`, `#DFC07B`, `#8F6E31`)
  - Readable Off-White Typography (`#F2F4F7`, `#A3A8B5`, `#646D7D`)
  - Semantic Detective Indicators: Crimson (`#D94545`), Emerald (`#359E6D`), Cyan (`#589FB8`)
- **Atmosphere**: Fictionalized neo-noir Budapest. Gritty, cinematic, analytical, high contrast, clean lines.

---

## 4. Commands & Tooling

Expo ships breaking changes every SDK release. Follow these verified patterns:

```bash
# Dependency Installation (ALWAYS use expo install for native/SDK compatibility)
npx expo install <package>

# Type Checking
npm run typecheck       # npx tsc --noEmit

# Linting
npm run lint            # npx expo lint

# Unit Testing (Pure game logic)
npm test                # npx vitest run

# Development Server
npm start               # npx expo start

# Diagnostic Check
npx expo-doctor
```

Always run `npm run typecheck`, `npm run lint`, and `npm test` before declaring any task or milestone complete.

---

## 5. Milestone Workflow Protocol

- Work strictly milestone by milestone.
- Do not jump ahead or implement future milestone systems prematurely.
- Always validate with typecheck, lint, and tests before concluding a milestone.
- Wait for user evaluation and approval before advancing.
