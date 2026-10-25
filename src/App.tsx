import React from 'react';
import { TitleScreen } from './components/TitleScreen';
import { MapSelection } from './components/MapSelection';
import { CharacterCustomizationModal } from './components/CharacterCustomizationModal';
import { QuestLogModal } from './components/QuestLogModal';
import { InventoryModal } from './components/InventoryModal';
import { DailyChallengesModal } from './components/DailyChallengesModal';
import { TrainingMiniGameModal } from './components/TrainingMiniGameModal';
import { WeaponCustomizationModal } from './components/WeaponCustomizationModal';
import { BattleScreen } from './components/screens/BattleScreen';
import { useGameStore } from './store/gameStore';
import { useGameState } from './hooks/useGameState';
import { sound } from './game/audio';

export default function App() {
  const { gameState, setGameState } = useGameState();

  const {
    totalXP,
    playerSkills,
    quests,
    inventory,
    dailyChallenges,
    isCustomizationOpen,
    isQuestLogOpen,
    isInventoryOpen,
    isDailyChallengesOpen,
    isTrainingOpen,
    upgradeSkill,
    setQuestCompleted,
    openCustomization,
    openTraining,
    closeCustomization,
    closeQuestLog,
    closeInventory,
    closeDailyChallenges,
    closeTraining,
  } = useGameStore();

  const handleStartQuickMatch = () => {
    sound.playSelect();
    sound.startMountainAmbience();
    setGameState('playing');
  };

  const handleStartBattle = (_provinceId: string) => {
    sound.playSelect();
    sound.startMountainAmbience();
    setGameState('playing');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b1220] font-['Cairo',sans-serif]">
      {gameState === 'title' && (
        <TitleScreen
          onStartQuickMatch={handleStartQuickMatch}
          onOpenMapSelection={() => setGameState('map-selection')}
          onOpenMultiplayer={() => undefined}
          onOpenCustomization={openCustomization}
          onOpenSettingsStore={openTraining}
          onOpenTechSpec={() => undefined}
        />
      )}

      {gameState === 'map-selection' && (
        <MapSelection onSelect={handleStartBattle} onBack={() => setGameState('title')} />
      )}

      {gameState === 'playing' && (
        <BattleScreen 
          onReturnToTitle={() => setGameState('title')}
        />
      )}

      <CharacterCustomizationModal
        isOpen={isCustomizationOpen}
        onClose={closeCustomization}
        playerXP={totalXP}
        skills={playerSkills}
        onUpgradeSkill={(key, cost) => {
          if (totalXP >= cost) {
            upgradeSkill(key);
          }
        }}
      />

      <QuestLogModal
        isOpen={isQuestLogOpen}
        onClose={closeQuestLog}
        quests={quests}
        onCompleteQuest={setQuestCompleted}
      />

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={closeInventory}
        items={inventory}
      />

      <DailyChallengesModal
        isOpen={isDailyChallengesOpen}
        onClose={closeDailyChallenges}
        challenges={dailyChallenges}
      />

      <TrainingMiniGameModal
        isOpen={isTrainingOpen}
        onClose={closeTraining}
      />

      <WeaponCustomizationModal />
    </div>
  );
}
