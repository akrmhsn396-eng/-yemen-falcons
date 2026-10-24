import React, { useEffect, useState } from 'react';
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
} from './types/game';
import { sound } from './game/audio';

export default function App() {
  // App UI State
  const [gameState, setGameState] = useState<'title' | 'map-selection' | 'playing'>('title');
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isSettingsStoreOpen, setIsSettingsStoreOpen] = useState(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [isMultiplayerModalOpen, setIsMultiplayerModalOpen] = useState(false);
  const [isDailyChallengesOpen, setIsDailyChallengesOpen] = useState(false);
  
  // Open World RPG State
  const [isQuestLogOpen, setIsQuestLogOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [currentProvince, setCurrentProvince] = useState('صنعاء القديمة');
  
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([
    { id: 'dc1', titleAr: 'القضاء على 20 متمرد', type: 'kills', requirement: 20, progress: 12, rewardXP: 250, isCompleted: false },
    { id: 'dc2', titleAr: 'البقاء على قيد الحياة لمدة 10 دقائق', type: 'survival_time', requirement: 600, progress: 450, rewardXP: 400, isCompleted: false },
    { id: 'dc3', titleAr: 'إصابة 5 أهداف بـ RPG-7', type: 'kills', requirement: 5, progress: 5, rewardXP: 300, isCompleted: true },
    { id: 'dc4', titleAr: 'صد 3 موجات متتالية', type: 'waves', requirement: 3, progress: 1, rewardXP: 500, isCompleted: false },
  ]);
  
  const [quests, setQuests] = useState<RPGQuest[]>([
    { id: 'q1', titleAr: 'تحرير وادي حنكة التاريخي', descAr: 'استكشاف ممرات الوادي الجبلي وتأمين نقاط الحراسة في صعدة.', provinceAr: 'صعدة', isCompleted: false, rewardXP: 500 },
    { id: 'q2', titleAr: 'حماية قلعة القاهرة التاريخية', descAr: 'التصدي للقوات المعادية وحماية القلعة الأثرية في تعز.', provinceAr: 'تعز', isCompleted: false, rewardXP: 800 },
    { id: 'q3', titleAr: 'تأمين الميناء التجاري', descAr: 'تأمين الشوارع الحضرية والميناء الرئيسي في عدن.', provinceAr: 'عدن', isCompleted: false, rewardXP: 600 },
    { id: 'q4', titleAr: 'استكشاف قصور شبام الطينية', descAr: 'مهمة استطلاع في مدينة ناطحات السحاب التاريخية بحضرموت.', provinceAr: 'حضرموت', isCompleted: true, rewardXP: 1000 },
  ]);

  const [inventory, setInventory] = useState<RPGItem[]>([
    { id: 'i1', nameAr: 'بندقية آلية تكتيكية (AKM)', type: 'weapon', rarity: 'rare', statsDesc: 'ضرر مرتفع، سرعة إطلاق نار ممتازة في المدن الجبلية.', iconName: 'swords' },
    { id: 'i2', nameAr: 'قاذف صواريخ مضاد للدروع (RPG-7)', type: 'weapon', rarity: 'legendary', statsDesc: 'قوة تدميرية هائلة ضد المدرعات وتحصينات الأعداء.', iconName: 'swords' },
    { id: 'i3', nameAr: 'خنجر الجنبية التراثية المرصعة', type: 'weapon', rarity: 'legendary', statsDesc: 'رمز الصمود والتراث اليمني الأصيل، هجوم قريب فتاك.', iconName: 'shield' },
    { id: 'i4', nameAr: 'شماغ يمني احمر وأبيض تكتيكي', type: 'armor', rarity: 'common', statsDesc: 'حماية خفيفة مع قدرة تمويه عالية في التضاريس الصخرية.', iconName: 'shield' },
  ]);

  const [stats, setStats] = useState<GameStats>({
    unitsKilled: 0,
    buildingsDestroyed: 0,
    terrainDeformedCount: 0,
    trenchesDug: 0,
    resourcesHarvested: 0,
    combosMax: 0,
    knockouts: 0,
  });

  // Multiplayer Room State
  const [room, setRoom] = useState<MultiplayerRoom>({
    code: 'YEMEN-STREETS',
    isHost: true,
    playerCount: 1,
    status: 'waiting',
    latencyMs: 34,
    syncedDeltasCount: 0,
  });

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
    setCurrentProvince(provinceId === 'sanaa' ? 'صنعاء القديمة' : (provinceId === 'aden' ? 'عدن التاريخية' : (provinceId === 'taiz' ? 'تعز الجبلية' : 'محافظات اليمن')));
    setGameState('playing');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-['Cairo',sans-serif]">
      {/* Title Screen Overlay */}
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

      {/* Map Selection Screen */}
      {gameState === 'map-selection' && (
        <MapSelection 
          onSelect={handleStartBattle}
          onBack={() => setGameState('title')}
        />
      )}

      {/* Third-Person Tactical Battle & Survival Shooter View */}
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

      {/* Quest Log Modal */}
      <QuestLogModal
        isOpen={isQuestLogOpen}
        onClose={() => setIsQuestLogOpen(false)}
        quests={quests}
        onCompleteQuest={(id) => {
          setQuests(quests.map(q => q.id === id ? { ...q, isCompleted: true } : q));
        }}
      />

      {/* Inventory Modal */}
      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        items={inventory}
      />

      {/* Daily Challenges Modal */}
      <DailyChallengesModal
        isOpen={isDailyChallengesOpen}
        onClose={() => setIsDailyChallengesOpen(false)}
        challenges={dailyChallenges}
      />

      {/* Character Customization Modal */}
      <CharacterCustomizationModal
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
      />

      {/* Settings & Store Modal */}
      <SettingsStoreModal
        isOpen={isSettingsStoreOpen}
        onClose={() => setIsSettingsStoreOpen(false)}
      />

      {/* Tech Architecture Modal */}
      <TechArchitectureModal
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
      />

      {/* Multiplayer Room Modal */}
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
