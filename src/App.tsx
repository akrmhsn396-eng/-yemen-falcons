import React, { useEffect, useMemo, useState } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { MapSelection } from './components/MapSelection';
import { CharacterCustomizationModal } from './components/CharacterCustomizationModal';
import { SettingsStoreModal } from './components/SettingsStoreModal';
import { TechArchitectureModal } from './components/TechArchitectureModal';
import { MultiplayerLobbyModal } from './components/MultiplayerLobbyModal';
import { QuestLogModal } from './components/QuestLogModal';
import { InventoryModal } from './components/InventoryModal';
import { DailyChallengesModal } from './components/DailyChallengesModal';
import { TacticalSurvivalBattleView } from './components/TacticalSurvivalBattleView';
import {
  GameStats,
  MultiplayerRoom,
  RPGQuest,
  RPGItem,
  DailyChallenge,
  PlayerSkills,
} from './types/game';
import { sound } from './game/audio';

const initialPlayerSkills: PlayerSkills = {
  movementSpeed: 1,
  aimAccuracy: 1,
  tacticalDefense: 1,
};

const initialDailyChallenges: DailyChallenge[] = [
  { id: 'dc1', titleAr: 'القضاء على 20 متمرد', type: 'kills', requirement: 20, progress: 12, rewardXP: 250, isCompleted: false },
  { id: 'dc2', titleAr: 'البقاء على قيد الحياة لمدة 10 دقائق', type: 'survival_time', requirement: 600, progress: 450, rewardXP: 400, isCompleted: false },
  { id: 'dc3', titleAr: 'إصابة 5 أهداف بـ RPG-7', type: 'kills', requirement: 5, progress: 5, rewardXP: 300, isCompleted: true },
  { id: 'dc4', titleAr: 'صد 3 موجات متتالية', type: 'waves', requirement: 3, progress: 1, rewardXP: 500, isCompleted: false },
];

const initialQuests: RPGQuest[] = [
  { id: 'q1', titleAr: 'تحرير وادي حنكة التاريخي', descAr: 'استكشاف ممرات الوادي الجبلي وتأمين نقاط الحراسة في صعدة.', provinceAr: 'صعدة', isCompleted: false, rewardXP: 250 },
  { id: 'q2', titleAr: 'حماية قلعة القاهرة التاريخية', descAr: 'التصدي للقوات المعادية وحماية القلعة الأثرية في تعز.', provinceAr: 'تعز', isCompleted: false, rewardXP: 300 },
  { id: 'q3', titleAr: 'تأمين الميناء التجاري', descAr: 'تأمين الشوارع الحضرية والميناء الرئيسي في عدن.', provinceAr: 'عدن', isCompleted: false, rewardXP: 350 },
  { id: 'q4', titleAr: 'استكشاف قصور شبام الطينية', descAr: 'مهمة استطلاع في مدينة ناطحات السحاب التاريخية بحضرموت.', provinceAr: 'حضرموت', isCompleted: false, rewardXP: 400 },
];

const initialInventory: RPGItem[] = [
  { id: 'i1', nameAr: 'بندقية آلية تكتيكية (AKM)', type: 'weapon', rarity: 'rare', statsDesc: 'ضرر مرتفع، سرعة إطلاق نار ممتازة في المدن الجبلية.', iconName: 'rifle' },
  { id: 'i2', nameAr: 'قاذف صواريخ مضاد للدروع (RPG-7)', type: 'weapon', rarity: 'legendary', statsDesc: 'قوة تدميرية هائلة ضد المدرعات وتحصينات العدو.', iconName: 'rocket' },
  { id: 'i3', nameAr: 'خنجر الجنبية التراثية المرصعة', type: 'weapon', rarity: 'legendary', statsDesc: 'رمز الصمود والتراث اليمني الأصيل.', iconName: 'blade' },
  { id: 'i4', nameAr: 'شماغ يمني أحمر وأبيض تكتيكي', type: 'armor', rarity: 'common', statsDesc: 'حماية خفيفة مع قدرة تمويه عالية في التضاريس الجبلية.', iconName: 'scarf' },
];

const initialStats: GameStats = {
  unitsKilled: 0,
  buildingsDestroyed: 0,
  terrainDeformedCount: 0,
  trenchesDug: 0,
  resourcesHarvested: 0,
  combosMax: 0,
  knockouts: 0,
};

const initialRoom: MultiplayerRoom = {
  code: 'YEMEN-STREETS',
  isHost: true,
  playerCount: 1,
  status: 'waiting',
  latencyMs: 34,
  syncedDeltasCount: 0,
};

export default function App() {
  const [gameState, setGameState] = useState<'title' | 'map-selection' | 'playing'>('title');
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isSettingsStoreOpen, setIsSettingsStoreOpen] = useState(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [isMultiplayerModalOpen, setIsMultiplayerModalOpen] = useState(false);
  const [isDailyChallengesOpen, setIsDailyChallengesOpen] = useState(false);

  const [totalXP, setTotalXP] = useState(2500);
  const [playerSkills, setPlayerSkills] = useState<PlayerSkills>(initialPlayerSkills);

  const [isQuestLogOpen, setIsQuestLogOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [currentProvince, setCurrentProvince] = useState('صنعاء القديمة');

  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(initialDailyChallenges);
  const [quests, setQuests] = useState<RPGQuest[]>(initialQuests);
  const [inventory, setInventory] = useState<RPGItem[]>(initialInventory);
  const [stats, setStats] = useState<GameStats>(initialStats);
  const [room, setRoom] = useState<MultiplayerRoom>(initialRoom);

  const skillUpgradeCost = useMemo(() => {
    return {
      movementSpeed: playerSkills.movementSpeed * 500,
      aimAccuracy: playerSkills.aimAccuracy * 500,
      tacticalDefense: playerSkills.tacticalDefense * 500,
    };
  }, [playerSkills]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState === 'playing') {
          setGameState('title');
          sound.stopMountainAmbience();
        } else if (gameState === 'map-selection') {
          setGameState('title');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      sound.stopMountainAmbience();
    };
  }, [gameState]);

  const handleStartQuickMatch = () => {
    sound.playSelect();
    sound.startMountainAmbience();
    setCurrentProvince('صنعاء القديمة');
    setGameState('playing');
  };

  const handleStartBattle = (provinceId: string) => {
    sound.playSelect();
    sound.startMountainAmbience();
    setCurrentProvince(
      provinceId === 'sanaa' ? 'صنعاء القديمة' :
      provinceId === 'aden' ? 'عدن التاريخية' :
      provinceId === 'taiz' ? 'تعز الجبلية' :
      'محافظة حضرموت',
    );
    setGameState('playing');
  };

  const handleUpgradeSkill = (skillKey: keyof PlayerSkills, cost: number) => {
    if (totalXP < cost) return;
    if (playerSkills[skillKey] >= 5) return;

    setTotalXP((prev) => prev - cost);
    setPlayerSkills((prev) => ({
      ...prev,
      [skillKey]: Math.min(5, prev[skillKey] + 1),
    }));
    sound.playSelect();
  };

  const handleCompleteQuest = (id: string) => {
    const completedQuest = quests.find((q) => q.id === id);
    if (!completedQuest || completedQuest.isCompleted) return;

    setQuests((prev) => prev.map((q) => q.id === id ? { ...q, isCompleted: true } : q));
    setTotalXP((prev) => prev + completedQuest.rewardXP);
    sound.playSectorCapture();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-['Cairo',sans-serif]">
      {gameState === 'title' && (
        <TitleScreen
          onStartQuickMatch={handleStartQuickMatch}
          onOpenMapSelection={() => setGameState('map-selection')}
          onOpenMultiplayer={() => setIsMultiplayerModalOpen(true)}
          onOpenCustomization={() => setIsCustomizationOpen(true)}
          onOpenSettingsStore={() => setIsSettingsStoreOpen(true)}
          onOpenTechSpec={() => setIsTechModalOpen(true)}
        />
      )}

      {gameState === 'map-selection' && (
        <MapSelection
          onSelect={handleStartBattle}
          onBack={() => setGameState('title')}
        />
      )}

      {gameState === 'playing' && (
        <TacticalSurvivalBattleView
          currentProvince={currentProvince}
          quests={quests}
          inventory={inventory}
          stats={stats}
          dailyChallenges={dailyChallenges}
          onOpenQuestLog={() => setIsQuestLogOpen(true)}
          onOpenInventory={() => setIsInventoryOpen(true)}
          onOpenDailyChallenges={() => setIsDailyChallengesOpen(true)}
          onOpenSettingsStore={() => setIsSettingsStoreOpen(true)}
          onOpenTechModal={() => setIsTechModalOpen(true)}
          onReturnToTitle={() => {
            sound.stopMountainAmbience();
            setGameState('title');
          }}
        />
      )}

      <QuestLogModal
        isOpen={isQuestLogOpen}
        onClose={() => setIsQuestLogOpen(false)}
        quests={quests}
        onCompleteQuest={handleCompleteQuest}
      />

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        items={inventory}
      />

      <DailyChallengesModal
        isOpen={isDailyChallengesOpen}
        onClose={() => setIsDailyChallengesOpen(false)}
        challenges={dailyChallenges}
      />

      <CharacterCustomizationModal
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        playerXP={totalXP}
        skills={playerSkills}
        onUpgradeSkill={handleUpgradeSkill}
        upgradeCosts={skillUpgradeCost}
      />

      <SettingsStoreModal
        isOpen={isSettingsStoreOpen}
        onClose={() => setIsSettingsStoreOpen(false)}
      />

      <TechArchitectureModal
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
      />

      <MultiplayerLobbyModal
        isOpen={isMultiplayerModalOpen}
        onClose={() => setIsMultiplayerModalOpen(false)}
        room={room}
        onUpdateRoom={setRoom}
        onStartOnlineBattle={() => {
          setGameState('map-selection');
        }}
      />
    </div>
  );
}
