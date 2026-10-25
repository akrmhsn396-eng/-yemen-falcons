import { create } from 'zustand';
import { getSkillCost, initialSkills } from '../data/skills';
import type {
  DailyChallenge,
  GameStats,
  MultiplayerRoom,
  PlayerSkills,
  RPGItem,
  RPGQuest,
  SkillKey,
} from '../types/game';

interface GameState {
  totalXP: number;
  playerSkills: PlayerSkills;
  quests: RPGQuest[];
  inventory: RPGItem[];
  dailyChallenges: DailyChallenge[];
  stats: GameStats;
  room: MultiplayerRoom;

  isCustomizationOpen: boolean;
  isQuestLogOpen: boolean;
  isInventoryOpen: boolean;
  isDailyChallengesOpen: boolean;
  isMultiplayerOpen: boolean;

  upgradeSkill: (skillKey: SkillKey) => void;
  setQuestCompleted: (questId: string) => void;
  openCustomization: () => void;
  closeCustomization: () => void;
  openQuestLog: () => void;
  closeQuestLog: () => void;
  openInventory: () => void;
  closeInventory: () => void;
  openDailyChallenges: () => void;
  closeDailyChallenges: () => void;
}

const initialInventory: RPGItem[] = [
  {
    id: 'i1',
    nameAr: 'بندقية AKM',
    type: 'weapon',
    rarity: 'rare',
    statsDesc: 'ضرر عالي وسرعة إطلاق ممتازة',
    iconName: 'rifle',
  },
  {
    id: 'i2',
    nameAr: 'RPG-7',
    type: 'weapon',
    rarity: 'legendary',
    statsDesc: 'قوة تدميرية عالية ضد المدر��ات',
    iconName: 'rocket',
  },
];

const initialQuests: RPGQuest[] = [
  {
    id: 'q1',
    titleAr: 'تحرير وادي حنكة',
    descAr: 'استكشاف الوادي الجبلي وتأمين الممرات',
    provinceAr: 'صعدة',
    isCompleted: false,
    rewardXP: 250,
  },
  {
    id: 'q2',
    titleAr: 'حماية قلعة القاهرة',
    descAr: 'تأمين القلعة وصد الهجوم',
    provinceAr: 'تعز',
    isCompleted: false,
    rewardXP: 300,
  },
];

const initialChallenges: DailyChallenge[] = [
  {
    id: 'dc1',
    titleAr: 'قتل 20 هدفاً',
    requirement: 20,
    progress: 12,
    rewardXP: 250,
    isCompleted: false,
    type: 'kills',
  },
  {
    id: 'dc2',
    titleAr: 'البقاء 10 دقائق',
    requirement: 600,
    progress: 450,
    rewardXP: 400,
    isCompleted: false,
    type: 'survival_time',
  },
];

export const useGameStore = create<GameState>()((set, get) => ({
  totalXP: 2500,
  playerSkills: initialSkills,
  quests: initialQuests,
  inventory: initialInventory,
  dailyChallenges: initialChallenges,
  stats: {
    unitsKilled: 0,
    buildingsDestroyed: 0,
    terrainDeformedCount: 0,
    trenchesDug: 0,
    resourcesHarvested: 0,
    combosMax: 0,
    knockouts: 0,
  },
  room: {
    code: 'YEMEN-STREETS',
    isHost: true,
    playerCount: 1,
    status: 'waiting',
    latencyMs: 34,
    syncedDeltasCount: 0,
  },

  isCustomizationOpen: false,
  isQuestLogOpen: false,
  isInventoryOpen: false,
  isDailyChallengesOpen: false,
  isMultiplayerOpen: false,

  upgradeSkill: (skillKey) => {
    const currentLevel = get().playerSkills[skillKey];
    if (currentLevel >= 5) return;

    const cost = getSkillCost(skillKey, currentLevel);
    if (get().totalXP < cost) return;

    set((state) => ({
      totalXP: state.totalXP - cost,
      playerSkills: {
        ...state.playerSkills,
        [skillKey]: Math.min(5, state.playerSkills[skillKey] + 1),
      },
    }));
  },

  setQuestCompleted: (questId) => {
    const quest = get().quests.find((q) => q.id === questId);
    if (!quest || quest.isCompleted) return;

    set((state) => ({
      totalXP: state.totalXP + quest.rewardXP,
      quests: state.quests.map((q) =>
        q.id === questId ? { ...q, isCompleted: true } : q,
      ),
    }));
  },

  openCustomization: () => set({ isCustomizationOpen: true }),
  closeCustomization: () => set({ isCustomizationOpen: false }),
  openQuestLog: () => set({ isQuestLogOpen: true }),
  closeQuestLog: () => set({ isQuestLogOpen: false }),
  openInventory: () => set({ isInventoryOpen: true }),
  closeInventory: () => set({ isInventoryOpen: false }),
  openDailyChallenges: () => set({ isDailyChallengesOpen: true }),
  closeDailyChallenges: () => set({ isDailyChallengesOpen: false }),
}));
