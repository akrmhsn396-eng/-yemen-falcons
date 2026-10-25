import { useState } from 'react';

export type ScreenState = 'title' | 'map-selection' | 'playing';

export const useGameState = () => {
  const [gameState, setGameState] = useState<ScreenState>('title');

  return {
    gameState,
    setGameState,
  };
};
