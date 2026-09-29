export type StormCategory =
  | 'Depression'
  | 'Deep Depression'
  | 'Cyclonic Storm'
  | 'Severe Cyclonic Storm'
  | 'Very Severe Cyclonic Storm'
  | 'Extremely Severe Cyclonic Storm'
  | 'Super Cyclonic Storm';

export interface QuadrantRadii {
  ne: number; // km
  se: number;
  sw: number;
  nw: number;
}

export interface CycloneTrackPoint {
  timestamp: string;
  offsetHours: number; // relative to landfall / current time reference (-72 to +24)
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

export interface CycloneEvent {
  id: string;
  name: string;
  basin: string;
  referenceDate: string;
  description: string;
  currentOffsetHours: number;
  track: CycloneTrackPoint[];
  landfall: {
    locationName: string;
    lat: number;
    lng: number;
    estimatedEtaHours: number;
    categoryAtLandfall: StormCategory;
    maxWindAtLandfallKmh: number;
    peakSurgeMeters: number;
  };
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
  block: string;
  elevationMeters: number;
}

export interface SubstationAsset extends BaseAsset {
  type: 'substation';
  voltageKv: number; // e.g. 220, 132, 33
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
