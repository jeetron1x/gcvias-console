export type StormCategory =
  | 'Depression'
  | 'Deep Depression'
  | 'Cyclonic Storm'
  | 'Severe Cyclonic Storm'
  | 'Very Severe Cyclonic Storm'
  | 'Extremely Severe Cyclonic Storm'
  | 'Super Cyclonic Storm'
  | 'Category 1 Hurricane'
  | 'Category 2 Hurricane'
  | 'Category 3 Major Hurricane'
  | 'Category 4 Major Hurricane'
  | 'Category 5 Super Typhoon';

export interface QuadrantRadii {
  ne: number; // km
  se: number;
  sw: number;
  nw: number;
}

export interface CycloneTrackPoint {
  timestamp: string;
  offsetHours: number; // relative to reference operational time (-48 to +36)
  lat: number;
  lng: number;
  category: StormCategory;
  maxWindKmh: number;
  maxWindKnots: number;
  centralPressureHpa: number;
  surgeEstimateMeters: number;
  forwardSpeedKmh: number;
  eyeRadiusKm: number;
  windRadiiR34Km: QuadrantRadii;
  windRadiiR50Km: QuadrantRadii;
  uncertaintyRadiusKm: number;
  phase: 'past' | 'current' | 'forecast';
}

export type OceanBasin =
  | 'All Basins'
  | 'Bay of Bengal'
  | 'North Atlantic'
  | 'Western Pacific'
  | 'Eastern Pacific'
  | 'South Indian Ocean';

export interface CycloneEvent {
  id: string;
  name: string;
  basin: OceanBasin;
  basinAuthority: string; // e.g., 'IMD RSMC New Delhi', 'NOAA NHC Miami', 'JMA Tokyo', 'JTWC Pearl Harbor'
  referenceDate: string;
  description: string;
  currentOffsetHours: number;
  centerCoordinates: [number, number];
  defaultZoom: number;
  landfall: {
    locationName: string;
    lat: number;
    lng: number;
    estimatedEtaHours: number;
    categoryAtLandfall: StormCategory;
    maxWindAtLandfallKmh: number;
    peakSurgeMeters: number;
  };
  track: CycloneTrackPoint[];
}

export type AssetType = 'substation' | 'hospital' | 'shelter' | 'highway';

export type RiskBand = 'Severe' | 'High' | 'Moderate' | 'Low' | 'Monitored';

export interface BaseAsset {
  id: string;
  name: string;
  type: AssetType;
  lat: number;
  lng: number;
  district: string;
  state: string;
  country: string;
  block: string;
  elevationMeters: number;
}

export interface SubstationAsset extends BaseAsset {
  type: 'substation';
  voltageKv: number; // e.g. 220, 132, 33, 500
  feederCount: number;
  hasPlinthProtection: boolean;
  generatorBackup: boolean;
}

export interface HospitalAsset extends BaseAsset {
  type: 'hospital';
  bedCapacity: number;
  icuBeds: number;
  hasEmergencyPower: boolean;
  oxygenBufferDays: number;
  traumaLevel: string;
}

export interface ShelterAsset extends BaseAsset {
  type: 'shelter';
  designCapacity: number;
  surgeCapacity: number;
  numFloors: number;
  elevatedStilts: boolean;
  waterStorageLiters: number;
  solarGeneratorPower: boolean;
}

export interface HighwayAsset extends BaseAsset {
  type: 'highway';
  routeDesignation: string;
  lengthKm: number;
  elevationAboveHighTideMeters: number;
  criticalCulverts: number;
}

export type InfrastructureAsset =
  | SubstationAsset
  | HospitalAsset
  | ShelterAsset
  | HighwayAsset;

export interface AssetExposureAssessment {
  asset: InfrastructureAsset;
  riskBand: RiskBand;
  distanceToTrackKm: number;
  inSurgeZone: boolean;
  inCoreWindZone: boolean;
  inGaleWindZone: boolean;
  projectedSurgeDepthMeters: number;
  recommendedAction: string;
}

export interface ExposureSummary {
  offsetHours: number;
  totalAssetsExposed: number;
  byRiskBand: Record<RiskBand, number>;
  byAssetType: Record<AssetType, number>;
  severeAssets: AssetExposureAssessment[];
  allExposed: AssetExposureAssessment[];
  estimatedAffectedPopulation: number;
  peakSurgeBandMaxMeters: number;
}

export interface AdvisoryDirective {
  sector: string;
  directive: string;
  targetAuthority: string;
  urgency: 'IMMEDIATE' | 'HIGH_PRIORITY' | 'MONITORING';
}

export interface PriorityEvacuationFacility {
  assetName: string;
  assetType: AssetType;
  district: string;
  riskBand: RiskBand;
  actionRequired: string;
}

export interface AdvisoryPayload {
  advisoryId: string;
  cycloneName: string;
  category: StormCategory;
  hoursToLandfall: number;
  severityHeadline: string;
  bulletinTimeUtc: string;
  affectedDistricts: string[];
  immediateDirectives: AdvisoryDirective[];
  priorityFacilities: PriorityEvacuationFacility[];
  targetLanguage: string;
  speechText: string;
}

export type AuthorityRole = 'SDMA' | 'DISTRICT_COLLECTOR' | 'MUNICIPAL_COMMANDER';

export interface AuthorityProfile {
  role: AuthorityRole;
  roleTitle: string;
  jurisdictionName: string;
  centerCoordinates: [number, number];
  defaultZoom: number;
  availableDistricts: string[];
}

export interface DispatchAuditRecord {
  id: string;
  timestamp: string;
  advisoryId: string;
  cycloneName: string;
  dispatchedByRole: AuthorityRole;
  jurisdiction: string;
  targetChannels: string[];
  recipientCount: number;
  payloadSummary: string;
}

// Zoom Earth UI Display Modes
export type MapDisplayMode =
  | 'satellite'
  | 'radar'
  | 'precipitation'
  | 'wind'
  | 'surge'
  | 'temperature'
  | 'humidity'
  | 'pressure';

export type SatelliteSubMode = 'live' | 'hd';
export type WindSubMode = 'speed' | 'gusts';

// Gemini 3.7 Flash Multimodal Risk Assessment Types
export interface GeminiDamagePathway {
  pathwayId: string;
  title: string;
  mechanism: string;
  severity: 'CATASTROPHIC' | 'SEVERE' | 'HIGH' | 'MODERATE';
  physicalExposureDetail: string;
  affectedInfrastructure: string[];
  cascadingImpact: string;
  mitigationProtocol: string;
}

export interface GeminiRiskReport {
  reportId: string;
  generatedAt: string;
  model: string;
  satelliteFeedSource: string;
  cycloneName: string;
  oceanBasin: string;
  telemetrySummary: {
    maxSustainedWindKmh: number;
    centralPressureHpa: number;
    forwardVelocityKmh: number;
    peakSurgeHeightMeters: number;
    rainAccumulation24hMm: number;
  };
  stormSurgeSimulation: {
    hydrodynamicRunupMeters: number;
    estuarinePenetrationKm: number;
    highestRiskSectors: string[];
    criticalBreachPoints: string[];
  };
  rainfallDamagePathways: {
    peakIntensityMmPerHour: number;
    flashFloodVulnerability: 'CATASTROPHIC' | 'SEVERE' | 'MODERATE';
    culvertWashoutCorridors: string[];
    orographicRainBands: string[];
  };
  infrastructureExposureScore: {
    substationsCompromised: number;
    highwaysInundatedKm: number;
    hospitalsRequiringCriticalBackup: number;
    shelterReadinessCount: number;
  };
  damagePathways: GeminiDamagePathway[];
  statutoryAdvisories: {
    stateFederalDirective: string;
    districtOperationsDirective: string;
    municipalPortDirective: string;
  };
  multilingualAcousticAlert: {
    language: string;
    alertText: string;
  };
}
