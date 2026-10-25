export type SkillKey = 'movementSpeed' | 'aimAccuracy' | 'tacticalDefense';

export type FighterAction = 'idle' | 'move' | 'attack_light' | 'attack_heavy' | 'block' | 'hit_stun' | 'ko';

export interface FighterInstance {
  id: string;
  nameAr: string;
  faction: 'player' | 'enemy';
  x: number;
  z: number;
  y: number;
  rotation: number;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  state: FighterAction;
  stateTime: number;
  score: number;
  comboCount: number;
}

export type ResourceType = 'water' | 'stone' | 'fuel' | 'ammo';

export interface Resources {
  water: number;
  stone: number;
  fuel: number;
  ammo: number;
}

export type GeographicZoneType = 'mountain_peak' | 'wadi_canyon' | 'terrace' | 'plateau' | 'urban_street';

export interface GeographicInfo {
  type: GeographicZoneType;
  arabicName: string;
  elevation: number;
  slope: number;
  camouflageBonus: number; // 0 to 1
  mobilityVehicleMultiplier: number;
  mobilityInfantryMultiplier: number;
  visionRangeMultiplier: number;
  description: string;
}

export type TerrainToolMode = 
  | 'select' 
  | 'trench' 
  | 'barricade' 
  | 'flatten' 
  | 'bombardment'
  | 'build';

export type BuildingType = 
  | 'citadel_hq' 
  | 'water_well' 
  | 'stone_quarry' 
  | 'fuel_depot' 
  | 'armory' 
  | 'watchtower';

export interface BuildingBlueprint {
  type: BuildingType;
  nameAr: string;
  cost: Resources;
  hp: number;
  radius: number;
  descAr: string;
  produces?: Partial<Resources>;
  productionInterval?: number; // seconds
}

export interface BuildingInstance {
  id: string;
  type: BuildingType;
  faction: 'player' | 'enemy';
  x: number;
  z: number;
  y: number;
  hp: number;
  maxHp: number;
  nameAr: string;
  lastProductionTime: number;
  isConstructing?: boolean;
}

export type UnitType = 
  | 'infantry' 
  | 'technical' 
  | 'mortar' 
  | 'drone' 
  | 'engineer';

export interface UnitBlueprint {
  type: UnitType;
  nameAr: string;
  cost: Resources;
  hp: number;
  damage: number;
  range: number;
  speed: number;
  canClimbSteep: boolean;
  baseCamouflage: number; // 0-1
  descAr: string;
}

export interface UnitInstance {
  id: string;
  type: UnitType;
  faction: 'player' | 'enemy';
  x: number;
  z: number;
  y: number;
  rotation: number;
  hp: number;
  maxHp: number;
  targetX?: number;
  targetZ?: number;
  targetUnitId?: string;
  lastAttackTime: number;
  isCamouflaged: boolean;
  inTrench: boolean;
  zoneType: GeographicZoneType;
  currentSpeed: number;
  selected?: boolean;
}

export interface Projectile {
  id: string;
  startX: number;
  startY: number;
  startZ: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  currentX: number;
  currentY: number;
  currentZ: number;
  progress: number; // 0 to 1
  arcHeight: number;
  damage: number;
  isArtillery: boolean;
  faction: 'player' | 'enemy';
}

export interface ExplosionVisual {
  id: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  maxRadius: number;
  duration: number;
  age: number;
  color: string;
}

export interface TerrainDeformationDelta {
  x: number;
  z: number;
  radius: number;
  deltaHeight: number;
  type: 'crater' | 'trench' | 'barricade' | 'flatten';
  timestamp: number;
}

export interface GameStats {
  unitsKilled: number;
  buildingsDestroyed: number;
  terrainDeformedCount: number;
  trenchesDug: number;
  resourcesHarvested: number;
  combosMax: number;
  knockouts: number;
}

export type GameStateMode = 'title' | 'fighting' | 'multiplayer' | 'sandbox' | 'tech_spec';

export interface MultiplayerRoom {
  code: string;
  isHost: boolean;
  playerCount: number;
  status: 'waiting' | 'ready' | 'battling';
  latencyMs: number;
  syncedDeltasCount: number;
}

export interface StrategicSector {
  id: string;
  nameAr: string;
  x: number;
  z: number;
  radius: number;
  controlledBy: 'player' | 'enemy' | 'neutral';
  captureProgress: number; // 0 to 100
  resourceBonus: Partial<Resources>;
  descAr: string;
}

export type HistoricalEraId = 'sheba_himyar' | 'medieval_citadels' | 'modern_tactical';

export interface HistoricalEra {
  id: HistoricalEraId;
  nameAr: string;
  subtitleAr: string;
  timePeriodAr: string;
  doctrineAr: string;
  bonusDescAr: string;
  startingBonus: {
    resources?: Partial<Resources>;
    defenseBonus?: number;
    speedBonus?: number;
    visionBonus?: number;
  };
}

export interface TacticalNotification {
  id: string;
  text: string;
  type: 'info' | 'alert' | 'success' | 'warning';
  timestamp: number;
}

export interface RPGQuest {
  id: string;
  titleAr: string;
  descAr: string;
  provinceAr: string;
  isCompleted: boolean;
  rewardXP: number;
}

export interface RPGItem {
  id: string;
  nameAr: string;
  type: 'weapon' | 'armor' | 'consumable' | 'quest';
  rarity: 'common' | 'rare' | 'legendary';
  statsDesc: string;
  iconName: string;
}

export interface RPGNpc {
  id: string;
  nameAr: string;
  roleAr: string;
  x: number;
  z: number;
  dialogueAr: string[];
}

export interface DailyChallenge {
  id: string;
  titleAr: string;
  requirement: number;
  progress: number;
  rewardXP: number;
  isCompleted: boolean;
  type: 'kills' | 'waves' | 'headshots' | 'survival_time';
}

export interface PlayerSkills {
  movementSpeed: number;
  aimAccuracy: number;
  tacticalDefense: number;
}
