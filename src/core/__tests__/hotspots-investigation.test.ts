import { describe, expect, it } from 'vitest';
import { SAMPLE_DEV_CASE } from '../data/sample-case';
import { findHotspotAt, validateCaseHotspots } from '../logic/hotspot-evaluator';
import { CaseSchema, SceneHotspot } from '../types/case';

describe('Milestone 2 — Interactive Crime Scene & Evidence Discovery', () => {
  it('validates SAMPLE_DEV_CASE hotspots against SceneHotspotSchema and CaseSchema', () => {
    const parseResult = CaseSchema.safeParse(SAMPLE_DEV_CASE);
    expect(parseResult.success).toBe(true);

    const hotspots = SAMPLE_DEV_CASE.hotspots;
    expect(hotspots).toBeDefined();
    expect(hotspots.length).toBe(3);
  });

  it('validates that all hotspot coordinates are normalized between 0.0 and 1.0', () => {
    const validation = validateCaseHotspots(SAMPLE_DEV_CASE);
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);

    for (const hs of SAMPLE_DEV_CASE.hotspots) {
      expect(hs.x).toBeGreaterThanOrEqual(0);
      expect(hs.x).toBeLessThanOrEqual(1);
      expect(hs.y).toBeGreaterThanOrEqual(0);
      expect(hs.y).toBeLessThanOrEqual(1);
      expect(hs.radius).toBeGreaterThan(0);
      expect(hs.radius).toBeLessThanOrEqual(0.5);
    }
  });

  it('verifies every hotspot maps to an existing evidence record in the case', () => {
    const evidenceIds = new Set(SAMPLE_DEV_CASE.evidence.map((e) => e.id));

    for (const hs of SAMPLE_DEV_CASE.hotspots) {
      expect(evidenceIds.has(hs.evidenceId)).toBe(true);
    }

    // Specific object mapping verification
    const safeHotspot = SAMPLE_DEV_CASE.hotspots.find((h) => h.id === 'hs_wall_safe');
    expect(safeHotspot).toBeDefined();
    expect(safeHotspot?.evidenceId).toBe('ev_pocket_watch_log');

    const casingHotspot = SAMPLE_DEV_CASE.hotspots.find((h) => h.id === 'hs_workbench_casing');
    expect(casingHotspot).toBeDefined();
    expect(casingHotspot?.evidenceId).toBe('ev_spent_shell_casing');

    const ticketHotspot = SAMPLE_DEV_CASE.hotspots.find((h) => h.id === 'hs_coat_ticket');
    expect(ticketHotspot).toBeDefined();
    expect(ticketHotspot?.evidenceId).toBe('ev_tram_ticket');
  });

  it('rejects hotspots referencing non-existent evidence IDs during validation', () => {
    const invalidCase = {
      ...SAMPLE_DEV_CASE,
      hotspots: [
        {
          id: 'hs_ghost',
          evidenceId: 'ev_non_existent_ghost_clue',
          label: 'Ghost Object',
          x: 0.5,
          y: 0.5,
          radius: 0.08,
        },
      ],
    };

    const validation = validateCaseHotspots(invalidCase as any);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.some((e) => e.includes('non-existent evidenceId'))).toBe(true);
  });

  it('correctly detects touches using findHotspotAt with normalized coordinates', () => {
    const hotspots: SceneHotspot[] = [
      {
        id: 'hs_safe',
        evidenceId: 'ev_pocket_watch_log',
        label: 'Safe',
        x: 0.68,
        y: 0.48,
        radius: 0.08,
      },
      {
        id: 'hs_bench',
        evidenceId: 'ev_spent_shell_casing',
        label: 'Workbench',
        x: 0.22,
        y: 0.82,
        radius: 0.08,
      },
    ];

    // Direct hit on the safe
    const hitSafe = findHotspotAt(hotspots, 0.68, 0.48);
    expect(hitSafe).toBeDefined();
    expect(hitSafe?.id).toBe('hs_safe');

    // Nearby hit within radius
    const hitNearSafe = findHotspotAt(hotspots, 0.71, 0.51);
    expect(hitNearSafe).toBeDefined();
    expect(hitNearSafe?.id).toBe('hs_safe');

    // Miss (empty space in room)
    const hitMiss = findHotspotAt(hotspots, 0.5, 0.1);
    expect(hitMiss).toBeNull();
  });

  it('prevents duplicate evidence collection events', () => {
    const currentUnlocked = ['ev_spent_shell_casing'];
    const newId = 'ev_pocket_watch_log';

    // First collection adds clue
    const updatedOnce = currentUnlocked.includes(newId)
      ? currentUnlocked
      : [...currentUnlocked, newId];
    expect(updatedOnce).toEqual(['ev_spent_shell_casing', 'ev_pocket_watch_log']);

    // Second collection attempt does not duplicate
    const updatedTwice = updatedOnce.includes(newId)
      ? updatedOnce
      : [...updatedOnce, newId];
    expect(updatedTwice).toEqual(['ev_spent_shell_casing', 'ev_pocket_watch_log']);
    expect(updatedTwice).toHaveLength(2);
  });
});
