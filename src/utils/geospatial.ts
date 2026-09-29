import {
  CycloneTrackPoint,
  InfrastructureAsset,
  RiskBand,
  AssetExposureAssessment,
  ExposureSummary,
  AssetType,
  StormCategory
} from '../types';

// Approximate radius of the Earth in km
const EARTH_RADIUS_KM = 6371.0;

/**
 * Calculate Great-Circle distance using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Bearing in degrees from point 1 to point 2
 */
export function calculateBearingDegrees(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const dLonRad = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(dLonRad) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLonRad);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/**
 * Destination point given start, bearing and distance
 */
export function calculateDestinationPoint(
  lat: number,
  lon: number,
  bearingDeg: number,
  distanceKm: number
): [number, number] {
  const δ = distanceKm / EARTH_RADIUS_KM;
  const θ = (bearingDeg * Math.PI) / 180;
  const φ1 = (lat * Math.PI) / 180;
  const λ1 = (lon * Math.PI) / 180;

  const sinφ2 = Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ);
  const φ2 = Math.asin(sinφ2);
  const y = Math.sin(θ) * Math.sin(δ) * Math.cos(φ1);
  const x = Math.cos(δ) - Math.sin(φ1) * sinφ2;
  const λ2 = λ1 + Math.atan2(y, x);

  return [(φ2 * 180) / Math.PI, (((λ2 * 180) / Math.PI + 540) % 360) - 180];
}

/**
 * Interpolate track point at exact scrubber offsetHours
 */
export function interpolateTrackPoint(
  track: CycloneTrackPoint[],
  targetOffsetHours: number
): CycloneTrackPoint {
  if (track.length === 0) {
    throw new Error('Track must contain points');
  }

  // Exact match
  const exact = track.find((p) => p.offsetHours === targetOffsetHours);
  if (exact) return exact;

  // Before range
  if (targetOffsetHours <= track[0].offsetHours) {
    return track[0];
  }

  // After range
  if (targetOffsetHours >= track[track.length - 1].offsetHours) {
    return track[track.length - 1];
  }

  // Find bounding segment
  for (let i = 0; i < track.length - 1; i++) {
    const p1 = track[i];
    const p2 = track[i + 1];

    if (targetOffsetHours >= p1.offsetHours && targetOffsetHours <= p2.offsetHours) {
      const span = p2.offsetHours - p1.offsetHours;
      const ratio = span === 0 ? 0 : (targetOffsetHours - p1.offsetHours) / span;

      const lat = p1.lat + (p2.lat - p1.lat) * ratio;
      const lng = p1.lng + (p2.lng - p1.lng) * ratio;
      const maxWindKmh = Math.round(p1.maxWindKmh + (p2.maxWindKmh - p1.maxWindKmh) * ratio);
      const centralPressureHpa = Math.round(
        p1.centralPressureHpa + (p2.centralPressureHpa - p1.centralPressureHpa) * ratio
      );
      const surgeEstimateMeters = Number(
        (p1.surgeEstimateMeters + (p2.surgeEstimateMeters - p1.surgeEstimateMeters) * ratio).toFixed(2)
      );
      const uncertaintyRadiusKm = Math.round(
        p1.uncertaintyRadiusKm + (p2.uncertaintyRadiusKm - p1.uncertaintyRadiusKm) * ratio
      );

      let category: StormCategory = p1.category;
      if (maxWindKmh >= 166) category = 'Super Cyclonic Storm';
      else if (maxWindKmh >= 118) category = 'Very Severe Cyclonic Storm';
      else if (maxWindKmh >= 89) category = 'Severe Cyclonic Storm';
      else if (maxWindKmh >= 62) category = 'Cyclonic Storm';
      else if (maxWindKmh >= 51) category = 'Deep Depression';
      else category = 'Depression';

      return {
        timestamp: new Date(Date.now() + targetOffsetHours * 3600000).toISOString(),
        offsetHours: targetOffsetHours,
        lat,
        lng,
        category,
        maxWindKmh,
        maxWindKnots: Math.round(maxWindKmh / 1.852),
        centralPressureHpa,
        surgeEstimateMeters,
        forwardSpeedKmh: Math.round(p1.forwardSpeedKmh + (p2.forwardSpeedKmh - p1.forwardSpeedKmh) * ratio),
        eyeRadiusKm: Math.round(p1.eyeRadiusKm + (p2.eyeRadiusKm - p1.eyeRadiusKm) * ratio),
        windRadiiR34Km: {
          ne: Math.round(p1.windRadiiR34Km.ne + (p2.windRadiiR34Km.ne - p1.windRadiiR34Km.ne) * ratio),
          se: Math.round(p1.windRadiiR34Km.se + (p2.windRadiiR34Km.se - p1.windRadiiR34Km.se) * ratio),
          sw: Math.round(p1.windRadiiR34Km.sw + (p2.windRadiiR34Km.sw - p1.windRadiiR34Km.sw) * ratio),
          nw: Math.round(p1.windRadiiR34Km.nw + (p2.windRadiiR34Km.nw - p1.windRadiiR34Km.nw) * ratio),
        },
        windRadiiR50Km: {
          ne: Math.round(p1.windRadiiR50Km.ne + (p2.windRadiiR50Km.ne - p1.windRadiiR50Km.ne) * ratio),
          se: Math.round(p1.windRadiiR50Km.se + (p2.windRadiiR50Km.se - p1.windRadiiR50Km.se) * ratio),
          sw: Math.round(p1.windRadiiR50Km.sw + (p2.windRadiiR50Km.sw - p1.windRadiiR50Km.sw) * ratio),
          nw: Math.round(p1.windRadiiR50Km.nw + (p2.windRadiiR50Km.nw - p1.windRadiiR50Km.nw) * ratio),
        },
        uncertaintyRadiusKm,
        phase: targetOffsetHours > 0 ? 'forecast' : targetOffsetHours === 0 ? 'current' : 'past',
      };
    }
  }

  return track[track.length - 1];
}

/**
 * Generate uncertainty forecast cone polygon points [lat, lng]
 */
export function generateForecastConePolygon(
  track: CycloneTrackPoint[],
  currentOffsetHours: number
): [number, number][] {
  // Collect all forecast points from currentOffsetHours forward
  const futurePoints = track.filter((p) => p.offsetHours >= currentOffsetHours);
  if (futurePoints.length < 2) return [];

  const leftBoundary: [number, number][] = [];
  const rightBoundary: [number, number][] = [];

  for (let i = 0; i < futurePoints.length; i++) {
    const pt = futurePoints[i];
    let bearing: number;

    if (i < futurePoints.length - 1) {
      const next = futurePoints[i + 1];
      bearing = calculateBearingDegrees(pt.lat, pt.lng, next.lat, next.lng);
    } else {
      const prev = futurePoints[i - 1];
      bearing = calculateBearingDegrees(prev.lat, prev.lng, pt.lat, pt.lng);
    }

    // Cone expansion offset: uncertainty radius + time expansion
    const radius = pt.uncertaintyRadiusKm;
    const leftPt = calculateDestinationPoint(pt.lat, pt.lng, (bearing - 90 + 360) % 360, radius);
    const rightPt = calculateDestinationPoint(pt.lat, pt.lng, (bearing + 90) % 360, radius);

    leftBoundary.push(leftPt);
    rightBoundary.push(rightPt);
  }

  // Build closed polygon: left boundary forward, right boundary reversed
  return [...leftBoundary, ...rightBoundary.reverse()];
}

/**
 * Coastline reference points representing the Bay of Bengal Odisha-West Bengal coastal arc
 */
export const COASTAL_REFERENCE_LINE: [number, number][] = [
  [19.25, 84.95], // Ganjam / Gopalpur
  [19.75, 85.55], // Chilika mouth
  [19.80, 85.82], // Puri Town
  [19.89, 86.10], // Konark
  [20.08, 86.32], // Astaranga
  [20.25, 86.60], // Paradip outer
  [20.45, 86.75], // Hukitola / Batighar
  [20.65, 86.92], // Habalikhati / Bhitarkanika
  [20.80, 86.95], // Dhamra River Mouth
  [21.05, 86.82], // Chudamani / Basudevpur
  [21.28, 86.94], // Kasafal
  [21.46, 87.05], // Chandipur
  [21.58, 87.25], // Digha border
  [21.70, 87.55], // Kanthi / East Midnapore
];

export interface CoastalHazardZone {
  segmentId: string;
  name: string;
  polygon: [number, number][];
  estimatedSurgeHeightMeters: number;
  riskBand: RiskBand;
  peakInundationDistanceKm: number;
}

/**
 * Compute coastal storm surge hazard zones along the coastal arc based on current eye position & intensity
 */
export function computeCoastalSurgeHazardZones(
  currentEye: CycloneTrackPoint
): CoastalHazardZone[] {
  const zones: CoastalHazardZone[] = [];

  for (let i = 0; i < COASTAL_REFERENCE_LINE.length - 1; i++) {
    const c1 = COASTAL_REFERENCE_LINE[i];
    const c2 = COASTAL_REFERENCE_LINE[i + 1];

    const midLat = (c1[0] + c2[0]) / 2;
    const midLng = (c1[1] + c2[1]) / 2;

    const distToEye = calculateDistanceKm(midLat, midLng, currentEye.lat, currentEye.lng);

    // Coriolis Right-Front Quadrant Amplification in Northern Hemisphere
    // Calculate if mid-point is north/east of the cyclone center (bearing ~ 300 to 90 degrees)
    const bearingFromEye = calculateBearingDegrees(currentEye.lat, currentEye.lng, midLat, midLng);
    const inRightQuadrant = bearingFromEye >= 315 || bearingFromEye <= 135;
    const quadrantFactor = inRightQuadrant ? 1.25 : 0.75;

    // Decay factor over distance from eye
    const proximityFactor = Math.max(0, 1 - distToEye / 280);

    // Rule-based surge calculation
    const baseSurge = currentEye.surgeEstimateMeters * quadrantFactor * Math.pow(proximityFactor, 1.2);
    const estimatedSurge = Number(Math.max(0.2, baseSurge).toFixed(2));

    let riskBand: RiskBand = 'Low';
    let inlandDepthKm = 1.5;

    if (estimatedSurge >= 2.0) {
      riskBand = 'Severe';
      inlandDepthKm = 6.5;
    } else if (estimatedSurge >= 1.2) {
      riskBand = 'High';
      inlandDepthKm = 4.2;
    } else if (estimatedSurge >= 0.7) {
      riskBand = 'Moderate';
      inlandDepthKm = 2.5;
    }

    // Generate inland buffer polygon
    // Perpendicular inward vector into land (roughly towards West-Northwest, bearing ~ 285 deg)
    const inwardBearing = 285;
    const p1Inland = calculateDestinationPoint(c1[0], c1[1], inwardBearing, inlandDepthKm);
    const p2Inland = calculateDestinationPoint(c2[0], c2[1], inwardBearing, inlandDepthKm);

    zones.push({
      segmentId: `SURGE-SEG-${i}`,
      name: `Coastal Sector ${i + 1}`,
      polygon: [c1, c2, p2Inland, p1Inland],
      estimatedSurgeHeightMeters: estimatedSurge,
      riskBand,
      peakInundationDistanceKm: inlandDepthKm,
    });
  }

  return zones;
}

/**
 * Evaluate single asset exposure based on cyclone position and surge zones
 */
export function evaluateAssetExposure(
  asset: InfrastructureAsset,
  eye: CycloneTrackPoint,
  surgeZones: CoastalHazardZone[]
): AssetExposureAssessment {
  const distToEye = calculateDistanceKm(asset.lat, asset.lng, eye.lat, eye.lng);

  // Wind zone evaluation
  const inCoreWindZone = distToEye <= Math.max(eye.eyeRadiusKm * 1.5, 35);
  const inGaleWindZone = distToEye <= (eye.windRadiiR34Km.ne + eye.windRadiiR34Km.nw) / 2;

  // Surge zone evaluation: find closest coastal surge segment
  let maxLocalSurge = 0;
  let inSurgeZone = false;

  for (const zone of surgeZones) {
    const distToZone = calculateDistanceKm(
      asset.lat,
      asset.lng,
      (zone.polygon[0][0] + zone.polygon[1][0]) / 2,
      (zone.polygon[0][1] + zone.polygon[1][1]) / 2
    );

    if (distToZone <= zone.peakInundationDistanceKm + 3.0) {
      if (zone.estimatedSurgeHeightMeters > maxLocalSurge) {
        maxLocalSurge = zone.estimatedSurgeHeightMeters;
      }
      if (asset.elevationMeters <= zone.estimatedSurgeHeightMeters + 1.0) {
        inSurgeZone = true;
      }
    }
  }

  // Project inundation depth over asset ground level
  const projectedSurgeDepthMeters = Math.max(
    0,
    Number((maxLocalSurge - asset.elevationMeters).toFixed(2))
  );

  // Assign overall Risk Band
  let riskBand: RiskBand = 'Monitored';
  let recommendedAction = 'Routine telemetry monitoring; verify communications link.';

  if (inCoreWindZone || projectedSurgeDepthMeters > 1.0) {
    riskBand = 'Severe';
    if (asset.type === 'substation') {
      recommendedAction = 'Execute controlled load-shedding and de-energize 33kV switchyard to avert catastrophic short-circuit.';
    } else if (asset.type === 'hospital') {
      recommendedAction = 'Activate emergency diesel generator room on upper level; move ground-floor ICU patients to 2nd floor.';
    } else if (asset.type === 'shelter') {
      recommendedAction = 'Commence vertical evacuation to 2nd floor; seal flood gates and deploy emergency chlorination units.';
    } else {
      recommendedAction = 'Impose total vehicular restriction; mobilize rescue boats and NDRF clearing units.';
    }
  } else if (inGaleWindZone || projectedSurgeDepthMeters > 0.2 || distToEye < 80) {
    riskBand = 'High';
    if (asset.type === 'substation') {
      recommendedAction = 'Place emergency line-repair crews on standby; verify fuel reserves for auxiliary power.';
    } else if (asset.type === 'hospital') {
      recommendedAction = 'Check liquid medical oxygen buffer; ensure 72h backup diesel supply is secured.';
    } else if (asset.type === 'shelter') {
      recommendedAction = 'Verify drinking water storage and activate community public address systems.';
    } else {
      recommendedAction = 'Issue diversion alerts for heavy cargo trucks; inspect culvert discharge pathways.';
    }
  } else if (distToEye < 150) {
    riskBand = 'Moderate';
    recommendedAction = 'Pre-position emergency restoration supplies; notify district control room.';
  } else if (distToEye < 250) {
    riskBand = 'Low';
    recommendedAction = 'Maintain standby status; review district disaster management plan.';
  }

  return {
    asset,
    riskBand,
    distanceToTrackKm: Math.round(distToEye),
    inSurgeZone,
    inCoreWindZone,
    inGaleWindZone,
    projectedSurgeDepthMeters,
    recommendedAction,
  };
}

/**
 * Compute aggregate exposure summary for all infrastructure
 */
export function computeExposureSummary(
  assets: InfrastructureAsset[],
  currentEye: CycloneTrackPoint,
  surgeZones: CoastalHazardZone[]
): ExposureSummary {
  const assessments: AssetExposureAssessment[] = assets.map((a) =>
    evaluateAssetExposure(a, currentEye, surgeZones)
  );

  const byRiskBand: Record<RiskBand, number> = {
    Severe: 0,
    High: 0,
    Moderate: 0,
    Low: 0,
    Monitored: 0,
  };

  const byAssetType: Record<AssetType, number> = {
    substation: 0,
    hospital: 0,
    shelter: 0,
    highway: 0,
  };

  let totalExposed = 0;
  const severeAssets: AssetExposureAssessment[] = [];

  for (const item of assessments) {
    byRiskBand[item.riskBand]++;
    if (item.riskBand === 'Severe' || item.riskBand === 'High') {
      byAssetType[item.asset.type]++;
      totalExposed++;
    }
    if (item.riskBand === 'Severe') {
      severeAssets.push(item);
    }
  }

  // Peak surge across all coastal segments
  const peakSurge = surgeZones.reduce(
    (max, z) => Math.max(max, z.estimatedSurgeHeightMeters),
    0
  );

  // Population vulnerability estimate based on coastal exposure radius
  const populationDensityPerKm2 = 480; // Coastal Odisha average density
  const coreImpactAreaKm2 = Math.PI * Math.pow(Math.min(currentEye.windRadiiR34Km.ne, 160), 2) * 0.4;
  const estimatedAffectedPopulation = Math.round(coreImpactAreaKm2 * populationDensityPerKm2);

  return {
    offsetHours: currentEye.offsetHours,
    totalAssetsExposed: totalExposed,
    byRiskBand,
    byAssetType,
    severeAssets,
    allExposed: assessments.sort((a, b) => {
      const priority: Record<RiskBand, number> = { Severe: 0, High: 1, Moderate: 2, Low: 3, Monitored: 4 };
      return priority[a.riskBand] - priority[b.riskBand];
    }),
    estimatedAffectedPopulation,
    peakSurgeBandMaxMeters: peakSurge,
  };
}
