import { Case, SceneHotspot } from '../types/case';

export interface HotspotValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Pure domain logic: Validates that all hotspots in a case:
 * 1. Have normalized coordinates within 0.0 and 1.0
 * 2. Possess positive hit radii
 * 3. Have unique hotspot IDs
 * 4. Map directly to existing evidence records in the case
 */
export function validateCaseHotspots(caseData: Case): HotspotValidationResult {
  const errors: string[] = [];
  const hotspots = caseData.hotspots || [];
  const evidenceIds = new Set(caseData.evidence.map((e) => e.id));
  const seenHotspotIds = new Set<string>();

  for (const hs of hotspots) {
    if (seenHotspotIds.has(hs.id)) {
      errors.push(`Duplicate hotspot ID: '${hs.id}'`);
    }
    seenHotspotIds.add(hs.id);

    if (hs.x < 0 || hs.x > 1) {
      errors.push(`Hotspot '${hs.id}' x coordinate ${hs.x} is out of normalized bounds [0, 1]`);
    }
    if (hs.y < 0 || hs.y > 1) {
      errors.push(`Hotspot '${hs.id}' y coordinate ${hs.y} is out of normalized bounds [0, 1]`);
    }
    if (hs.radius <= 0 || hs.radius > 0.5) {
      errors.push(`Hotspot '${hs.id}' radius ${hs.radius} is invalid`);
    }
    if (!evidenceIds.has(hs.evidenceId)) {
      errors.push(`Hotspot '${hs.id}' references non-existent evidenceId: '${hs.evidenceId}'`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Pure domain logic: Hit-testing touch coordinates against normalized hotspots.
 * Returns the closest hotspot whose radius contains the touch, or null.
 */
export function findHotspotAt(
  hotspots: SceneHotspot[],
  touchX: number,
  touchY: number,
  toleranceMultiplier: number = 1.0
): SceneHotspot | null {
  let closest: SceneHotspot | null = null;
  let closestDistance = Infinity;

  for (const hs of hotspots) {
    const distance = Math.hypot(touchX - hs.x, touchY - hs.y);
    const effectiveRadius = hs.radius * toleranceMultiplier;

    if (distance <= effectiveRadius && distance < closestDistance) {
      closest = hs;
      closestDistance = distance;
    }
  }

  return closest;
}
