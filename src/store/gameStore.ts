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
  isTrainingOpen: boolean;
  isWeaponCustomizationOpen: boolean;

  tacticalPoints: number;
  weaponUpgrades: WeaponUpgradeState;

  upgradeSkill: (skillKey: SkillKey) => void;
  setQuestCompleted: (questId: string) => void;
  addTacticalPoints: (amount: number) => void;
  spendTacticalPoints: (amount: number) => boolean;
  purchaseAttachment: (weaponId: string, attachmentId: string) => void;
  equipAttachment: (weaponId: string, attachmentId: string) => void;
  upgradeWeaponStat: (weaponId: string, stat: 'reloadSpeed' | 'damage' | 'accuracy') => void;

  openCustomization: () => void;
  closeCustomization: () => void;
  openQuestLog: () => void;
  closeQuestLog: () => void;
  openInventory: () => void;
  closeInventory: () => void;
  openDailyChallenges: () => void;
  closeDailyChallenges: () => void;
  openTraining: () => void;
  closeTraining: () => void;
  openWeaponCustomization: () => void;
  closeWeaponCustomization: () => void;
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

const initialSectors = [
  { id: 's1', nameAr: 'بوابة باب اليمن', controlledBy: 'neutral', progress: 0 },
  { id: 's2', nameAr: 'الميناء الاستراتيجي', controlledBy: 'player', progress: 100 },
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
  isTrainingOpen: false,
  isWeaponCustomizationOpen: false,

  tacticalPoints: 500,
  weaponUpgrades: {
    'i1': { // AKM
      unlockedAttachments: [],
      activeAttachments: {},
      levels: { reloadSpeed: 1, damage: 1, accuracy: 1 }
    },
    'i2': { // RPG-7
      unlockedAttachments: [],
      activeAttachments: {},
      levels: { reloadSpeed: 1, damage: 1, accuracy: 1 }
    }
  },

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

  addTacticalPoints: (amount) => set((state) => ({ tacticalPoints: state.tacticalPoints + amount })),
  
  spendTacticalPoints: (amount) => {
    if (get().tacticalPoints < amount) return false;
    set((state) => ({ tacticalPoints: state.tacticalPoints - amount }));
    return true;
  },

  purchaseAttachment: (weaponId, attachmentId) => {
    const attachment = ALL_ATTACHMENTS.find(a => a.id === attachmentId);
    if (!attachment) return;

    if (get().spendTacticalPoints(attachment.costPT)) {
      set((state) => ({
        weaponUpgrades: {
          ...state.weaponUpgrades,
          [weaponId]: {
            ...state.weaponUpgrades[weaponId],
            unlockedAttachments: [...state.weaponUpgrades[weaponId].unlockedAttachments, attachmentId]
          }
        }
      }));
    }
  },

  equipAttachment: (weaponId, attachmentId) => {
    const attachment = ALL_ATTACHMENTS.find(a => a.id === attachmentId);
    if (!attachment) return;

    set((state) => {
      const weapon = state.weaponUpgrades[weaponId];
      const newActive = { ...weapon.activeAttachments };
      
      // Toggle off if already active
      if (newActive[attachment.type] === attachmentId) {
        delete newActive[attachment.type];
      } else {
        newActive[attachment.type] = attachmentId;
      }

      return {
        weaponUpgrades: {
          ...state.weaponUpgrades,
          [weaponId]: {
            ...weapon,
            activeAttachments: newActive
          }
        }
      };
    });
  },

  upgradeWeaponStat: (weaponId, stat) => {
    const currentLevel = get().weaponUpgrades[weaponId].levels[stat];
    if (currentLevel >= 5) return;
    
    const cost = currentLevel * 200; // Base cost scaling
    if (get().spendTacticalPoints(cost)) {
      set((state) => ({
        weaponUpgrades: {
          ...state.weaponUpgrades,
          [weaponId]: {
            ...state.weaponUpgrades[weaponId],
            levels: {
              ...state.weaponUpgrades[weaponId].levels,
              [stat]: currentLevel + 1
            }
          }
        }
      }));
    }
  },

  openCustomization: () => set({ isCustomizationOpen: true }),
  closeCustomization: () => set({ isCustomizationOpen: false }),
  openQuestLog: () => set({ isQuestLogOpen: true }),
  closeQuestLog: () => set({ isQuestLogOpen: false }),
  openInventory: () => set({ isInventoryOpen: true }),
  closeInventory: () => set({ isInventoryOpen: false }),
  openDailyChallenges: () => set({ isDailyChallengesOpen: true }),
  closeDailyChallenges: () => set({ isDailyChallengesOpen: false }),
  openTraining: () => set({ isTrainingOpen: true }),
  closeTraining: () => set({ isTrainingOpen: false }),
  openWeaponCustomization: () => set({ isWeaponCustomizationOpen: true }),
  closeWeaponCustomization: () => set({ isWeaponCustomizationOpen: false }),
}));

export const ALL_ATTACHMENTS: WeaponAttachment[] = [
  { id: 'opt_reddot', nameAr: 'نقطة حمراء', type: 'optic', costPT: 150, bonus: { accuracy: 1.1 }, descriptionAr: 'منظار ليزر سريع للاستخدام القريب' },
  { id: 'opt_acog', nameAr: 'منظار ACOG', type: 'optic', costPT: 300, bonus: { accuracy: 1.25 }, descriptionAr: 'تكبير متوسط للمسافات البعيدة' },
  { id: 'mag_extended', nameAr: 'مخزن موسع', type: 'magazine', costPT: 250, bonus: { reloadSpeed: 1.1 }, descriptionAr: 'مخزن إضافي وسرعة تلقيم أفضل' },
  { id: 'mag_fast', nameAr: 'تلقيم سريع', type: 'magazine', costPT: 200, bonus: { reloadSpeed: 1.3 }, descriptionAr: 'تصميم خاص لتبديل المخزن بسرعة فائقة' },
  { id: 'bar_heavy', nameAr: 'سبطانة ثقيلة', type: 'barrel', costPT: 400, bonus: { damage: 1.15 }, descriptionAr: 'زيادة قوة الرصاصة واستقرار الإطلاق' },
];
