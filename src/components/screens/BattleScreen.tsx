import React from 'react';
import { TacticalSurvivalBattleView } from '../TacticalSurvivalBattleView';
import { useGameStore } from '../../store/gameStore';

interface BattleScreenProps {
  onReturnToTitle: () => void;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({ onReturnToTitle }) => {
  const {
    quests,
    inventory,
    dailyChallenges,
    openQuestLog,
    openInventory,
    openDailyChallenges,
    openCustomization,
  } = useGameStore();

  const mockStats = {
    unitsKilled: 50,
    buildingsDestroyed: 5,
    terrainDeformedCount: 10,
    trenchesDug: 3,
    resourcesHarvested: 1000,
    combosMax: 15,
    knockouts: 2,
  };

  return (
    <div className="w-full h-full">
      <TacticalSurvivalBattleView
        currentProvince="صنعاء القديمة"
        quests={quests}
        inventory={inventory}
        dailyChallenges={dailyChallenges}
        stats={mockStats}
        onOpenQuestLog={openQuestLog}
        onOpenInventory={openInventory}
        onOpenDailyChallenges={openDailyChallenges}
        onOpenSettingsStore={openCustomization}
        onOpenTechModal={() => {}}
        onReturnToTitle={onReturnToTitle}
      />
    </div>
  );
};
