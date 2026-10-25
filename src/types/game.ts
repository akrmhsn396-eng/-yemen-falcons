export type SkillKey = 'movementSpeed' | 'aimAccuracy' | 'tacticalDefense';

export interface PlayerSkills {
  movementSpeed: number;
  aimAccuracy: number;
  tacticalDefense: number;
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

export interface DailyChallenge {
  id: string;
  titleAr: string;
  requirement: number;
  progress: number;
  rewardXP: number;
  isCompleted: boolean;
  type: 'kills' | 'waves' | 'headshots' | 'survival_time';
}

export interface MultiplayerRoom {
  code: string;
  isHost: boolean;
  playerCount: number;
  status: 'waiting' | 'ready' | 'battling';
  latencyMs: number;
  syncedDeltasCount: number;
}
