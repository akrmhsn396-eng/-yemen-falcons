import { create } from 'zustand';
import { getSkillCost, initialSkills } from '../data/skills';
import type {
  DailyChallenge,
  GameStats,
  MultiplayerRoom,
  PlayerSkills,
  LeaderSkillKey,
  LeaderSkills,
  WeaponAttachment,
  WeaponUpgradeState,
  RPGItem,
  RPGQuest,
  SkillKey,
} from '../types/game';

export interface LeaderSkillInfo {
  key: LeaderSkillKey;
  titleAr: string;
  descriptionAr: string;
  effectFormulaAr: (level: number) => string;
  iconName: 'heartPulse' | 'crosshair' | 'shield' | 'plane' | 'mountain';
  maxLevel: number;
  baseCostXP: number;
}

export const LEADER_SKILLS_INFO: LeaderSkillInfo[] = [
  {
    key: 'rapidHealing',
    titleAr: 'التئام الجروح الميداني',
    descriptionAr: 'تجديد صحة القائد والفريق تدريجياً خلال المعركة مع تسريع استعادة العافية في وضع التمويه.',
    effectFormulaAr: (lvl) => `استعادة +${lvl * 2.5} HP كل 3 ثواني (+${lvl * 4} أثناء التمويه)`,
    iconName: 'heartPulse',
    maxLevel: 5,
    baseCostXP: 300,
  },
  {
    key: 'sniperPrecision',
    titleAr: 'دقة نيران القناصة',
    descriptionAr: 'تعزيز دقة إطلاق النار وتثبيت السلاح مع زيادة الضرر الحرج (Critical Damage) لجميع أسلحة الفريق.',
    effectFormulaAr: (lvl) => `تخفيض تشتت الرصاص بنسبة ${lvl * 15}% وضرر حرج +${lvl * 20}%`,
    iconName: 'crosshair',
    maxLevel: 5,
    baseCostXP: 350,
  },
  {
    key: 'squadFortification',
    titleAr: 'تحصين دروع الفريق',
    descriptionAr: 'تقوية درع الصد التكتيكي وامتصاص نسبة من ضرر الشظايا والانفجارات المعادية.',
    effectFormulaAr: (lvl) => `درع إضافي +${lvl * 20} وتقليل الضرر المباشر بنسبة ${lvl * 7}%`,
    iconName: 'shield',
    maxLevel: 5,
    baseCostXP: 300,
  },
  {
    key: 'airSupportLogistics',
    titleAr: 'لوجستيات الدعم الجوي',
    descriptionAr: 'تسريع شحن مقياس الدعم الجوي وتخفيض تكلفة نقاط الاستدعاء للغارات والاستطلاع.',
    effectFormulaAr: (lvl) => `شحن المقياس أسرع بنسبة ${lvl * 20}% وتخفيض تكلفة الغارات بنسبة ${lvl * 12}%`,
    iconName: 'plane',
    maxLevel: 5,
    baseCostXP: 400,
  },
  {
    key: 'mountainSurvival',
    titleAr: 'غريزة البقاء الجبلية',
    descriptionAr: 'رفع كفاءة التمويه بين الأشجار والخنادق وتقليل المدى الذي يمكن للأعداء كشفك منه.',
    effectFormulaAr: (lvl) => `تقليص مدى رصد الأعداء بنسبة ${lvl * 14}% وسرعة حركة أسرع في السواتر`,
    iconName: 'mountain',
    maxLevel: 5,
    baseCostXP: 250,
  },
];

interface GameState {
  totalXP: number;
  playerSkills: PlayerSkills;
  leaderSkills: LeaderSkills;
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
  isLeaderSkillsOpen: boolean;

  tacticalPoints: number;
  weaponUpgrades: WeaponUpgradeState;

  upgradeSkill: (skillKey: SkillKey) => void;
  upgradeLeaderSkill: (skillKey: LeaderSkillKey) => void;
  setQuestCompleted: (questId: string) => void;
  addTotalXP: (amount: number) => void;
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
  openLeaderSkills: () => void;
  closeLeaderSkills: () => void;
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

export const initialLeaderSkills: LeaderSkills = {
  rapidHealing: 1,
  sniperPrecision: 1,
  squadFortification: 1,
  airSupportLogistics: 1,
  mountainSurvival: 1,
};

export const useGameStore = create<GameState>()((set, get) => ({
  totalXP: 2500,
  playerSkills: initialSkills,
  leaderSkills: initialLeaderSkills,
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
  isLeaderSkillsOpen: false,

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

  upgradeLeaderSkill: (skillKey) => {
    const currentLevel = get().leaderSkills[skillKey] || 1;
    if (currentLevel >= 5) return;

    const skillInfo = LEADER_SKILLS_INFO.find(s => s.key === skillKey);
    const cost = skillInfo ? skillInfo.baseCostXP * currentLevel : 300 * currentLevel;
    if (get().totalXP < cost) return;

    set((state) => ({
      totalXP: state.totalXP - cost,
      leaderSkills: {
        ...state.leaderSkills,
        [skillKey]: Math.min(5, currentLevel + 1),
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

  addTotalXP: (amount) => set((state) => ({ totalXP: state.totalXP + amount })),

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
      const newActive: Record<string, string | undefined> = { ...weapon.activeAttachments };
      
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
            activeAttachments: newActive as typeof weapon.activeAttachments
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
  openLeaderSkills: () => set({ isLeaderSkillsOpen: true }),
  closeLeaderSkills: () => set({ isLeaderSkillsOpen: false }),
}));

export const ALL_ATTACHMENTS: WeaponAttachment[] = [
  { id: 'opt_reddot', nameAr: 'نقطة حمراء', type: 'optic', costPT: 150, bonus: { accuracy: 1.1 }, descriptionAr: 'منظار ليزر سريع للاستخدام القريب' },
  { id: 'opt_acog', nameAr: 'منظار ACOG', type: 'optic', costPT: 300, bonus: { accuracy: 1.25 }, descriptionAr: 'تكبير متوسط للمسافات البعيدة' },
  { id: 'mag_extended', nameAr: 'مخزن موسع', type: 'magazine', costPT: 250, bonus: { reloadSpeed: 1.1 }, descriptionAr: 'مخزن إضافي وسرعة تلقيم أفضل' },
  { id: 'mag_fast', nameAr: 'تلقيم سريع', type: 'magazine', costPT: 200, bonus: { reloadSpeed: 1.3 }, descriptionAr: 'تصميم خاص لتبديل المخزن بسرعة فائقة' },
  { id: 'bar_heavy', nameAr: 'سبطانة ثقيلة', type: 'barrel', costPT: 400, bonus: { damage: 1.15 }, descriptionAr: 'زيادة قوة الرصاصة واستقرار الإطلاق' },
];
