import type { PlayerSkills, SkillKey } from '../types/game';

export const MAX_SKILL_LEVEL = 5;

export const SKILL_DEFS: Record<SkillKey, { label: string; baseCost: number }> = {
  movementSpeed: { label: 'سرعة الحركة', baseCost: 500 },
  aimAccuracy: { label: 'دقة التصويب', baseCost: 500 },
  tacticalDefense: { label: 'الدفاع التكتيكي', baseCost: 500 },
};

export const initialSkills: PlayerSkills = {
  movementSpeed: 1,
  aimAccuracy: 1,
  tacticalDefense: 1,
};

export const getSkillCost = (skillKey: SkillKey, level: number) => {
  return SKILL_DEFS[skillKey].baseCost * (level + 1);
};
