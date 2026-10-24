import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FighterInstance, GameStats, RPGQuest } from '../types/game';
import { VirtualControls } from './VirtualControls';
import { Shield, Zap, Swords, Compass, MapPin, Clock, Backpack, Scroll, Award, Settings, ChevronRight } from 'lucide-react';

interface OpenWorldHUDProps {
  player: FighterInstance | null;
  enemy: FighterInstance | null;
  stats: GameStats;
  currentProvince: string;
  quests: RPGQuest[];
  onOpenQuestLog: () => void;
  onOpenInventory: () => void;
  onOpenTechModal: () => void;
  onMove: (x: number, z: number) => void;
  onAction: (type: 'attack_light' | 'attack_heavy' | 'block') => void;
  onStopBlock: () => void;
  onMilitarySkill: (skillType: 'light_weapon' | 'heavy_weapon' | 'tank_support' | 'airstrike') => void;
}

export const OpenWorldHUD: React.FC<OpenWorldHUDProps> = ({
  player,
  enemy,
  stats,
  currentProvince,
  quests,
  onOpenQuestLog,
  onOpenInventory,
  onOpenTechModal,
  onMove,
  onAction,
  onStopBlock,
  onMilitarySkill,
}) => {
  const [isTouch, setIsTouch] = useState(false);
  const activeQuest = quests.find(q => !q.isCompleted) || quests[0];

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (!player) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden font-['Cairo',sans-serif]">
      
      {/* Top Header Bar: Player Stats, Province, Quest Tracker */}
      <div className="flex justify-between items-start gap-4 z-10">
        
        {/* Player Level & HP Bar */}
        <div className="bg-stone-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-72 shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-black text-base">{player.nameAr}</span>
            <span className="text-amber-400 font-mono text-xs font-bold">المستوى 12 (بطل اليمن)</span>
          </div>
          {/* HP */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>الصحة (HP)</span>
              <span>{Math.round(player.hp)} / {player.maxHp}</span>
            </div>
            <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" 
              />
            </div>
          </div>
          {/* XP / Stamina */}
          <div className="space-y-1 mt-2">
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>طاقة التحمل (Stamina)</span>
              <span>85%</span>
            </div>
            <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full" />
            </div>
          </div>
        </div>

        {/* Center: Active Quest Tracker & Province Name */}
        <div className="flex flex-col items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-stone-900/90 border border-amber-500/30 backdrop-blur-xl shadow-2xl text-center">
            <MapPin className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="text-white font-bold text-sm">منطقة التواجد: {currentProvince}</span>
          </div>

          {activeQuest && (
            <div 
              onClick={onOpenQuestLog}
              className="bg-stone-900/80 hover:bg-stone-800/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 max-w-xs text-right shadow-xl cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold mb-0.5">
                <span className="flex items-center gap-1"><Scroll className="w-3 h-3" /> المهمة النشطة</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-white text-xs font-bold truncate">{activeQuest.titleAr}</div>
              <div className="text-stone-400 text-[10px] truncate mt-0.5">{activeQuest.descAr}</div>
            </div>
          )}
        </div>

        {/* Right Top: Quick Menu Buttons (Inventory, Quests, Settings) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button 
            onClick={onOpenInventory}
            className="p-3 bg-stone-900/90 hover:bg-stone-800 rounded-2xl border border-white/10 text-white backdrop-blur-md shadow-xl flex items-center gap-2 transition-all cursor-pointer"
            title="حقيبة العتاد"
          >
            <Backpack className="w-5 h-5 text-amber-400" />
            <span className="hidden sm:inline text-xs font-bold">العتاد</span>
          </button>

          <button 
            onClick={onOpenQuestLog}
            className="p-3 bg-stone-900/90 hover:bg-stone-800 rounded-2xl border border-white/10 text-white backdrop-blur-md shadow-xl flex items-center gap-2 transition-all cursor-pointer"
            title="سجل المهام"
          >
            <Scroll className="w-5 h-5 text-blue-400" />
            <span className="hidden sm:inline text-xs font-bold">المهام</span>
          </button>

          <button 
            onClick={onOpenTechModal}
            className="p-3 bg-stone-900/90 hover:bg-stone-800 rounded-2xl border border-white/10 text-white backdrop-blur-md shadow-xl flex items-center gap-2 transition-all cursor-pointer"
            title="الإعدادات والمحرك"
          >
            <Settings className="w-5 h-5 text-stone-300" />
          </button>
        </div>

      </div>

      {/* Right Side: Military Skills Bar */}
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto z-20">
        <div className="text-[10px] font-bold text-amber-400 text-center tracking-widest bg-stone-900/90 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
          دعم تكتيكي
        </div>

        <button 
          onClick={() => onMilitarySkill('light_weapon')}
          className="w-14 h-14 rounded-2xl bg-stone-900/90 hover:bg-amber-600/30 border border-white/10 flex flex-col items-center justify-center text-amber-400 shadow-xl cursor-pointer active:scale-95"
          title="رشاش خفيف"
        >
          <Zap className="w-5 h-5" />
          <span className="text-[8px] font-bold mt-0.5">رشاش</span>
        </button>

        <button 
          onClick={() => onMilitarySkill('heavy_weapon')}
          className="w-14 h-14 rounded-2xl bg-stone-900/90 hover:bg-orange-600/30 border border-white/10 flex flex-col items-center justify-center text-orange-400 shadow-xl cursor-pointer active:scale-95"
          title="آر بي جي"
        >
          <Swords className="w-5 h-5" />
          <span className="text-[8px] font-bold mt-0.5">آر بي جي</span>
        </button>

        <button 
          onClick={() => onMilitarySkill('tank_support')}
          className="w-14 h-14 rounded-2xl bg-stone-900/90 hover:bg-red-600/30 border border-white/10 flex flex-col items-center justify-center text-red-400 shadow-xl cursor-pointer active:scale-95"
          title="دبابة مدرعة"
        >
          <Shield className="w-5 h-5" />
          <span className="text-[8px] font-bold mt-0.5">دبابة</span>
        </button>

        <button 
          onClick={() => onMilitarySkill('airstrike')}
          className="w-14 h-14 rounded-2xl bg-stone-900/90 hover:bg-cyan-600/30 border border-white/10 flex flex-col items-center justify-center text-cyan-400 shadow-xl cursor-pointer active:scale-95"
          title="طائرة حربية"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[8px] font-bold mt-0.5">غارة</span>
        </button>
      </div>

      {/* Touch Controls for Mobile */}
      {isTouch && (
        <VirtualControls 
          onMove={onMove}
          onAction={onAction}
          onStopBlock={onStopBlock}
        />
      )}

      {/* Bottom Bar: Quick Stats */}
      <div className="flex justify-between items-end px-4 relative z-10">
        <div className="bg-stone-900/90 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex gap-8 items-center shadow-2xl">
          <div className="text-right">
            <div className="text-[10px] text-stone-400 uppercase tracking-widest">الأعداء المقضي عليهم</div>
            <div className="text-xl font-black text-amber-400 tabular-nums">{stats.knockouts}</div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-right">
            <div className="text-[10px] text-stone-400 uppercase tracking-widest">نوع اللعبة</div>
            <div className="text-sm font-bold text-white">آر بي جي عالم مفتوح (3rd Person)</div>
          </div>
        </div>
      </div>

    </div>
  );
};
