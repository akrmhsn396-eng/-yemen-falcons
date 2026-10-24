import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FighterInstance, GameStats, RPGQuest } from '../types/game';
import { VirtualControls } from './VirtualControls';
import { Shield, Zap, Swords, Compass, MapPin, Clock, Crosshair, Target, AlertTriangle, Radio, Backpack, Settings, Flame, Rocket, Plane } from 'lucide-react';

interface SurvivalTacticalHUDProps {
  player: FighterInstance | null;
  enemy: FighterInstance | null;
  stats: GameStats;
  currentProvince: string;
  onOpenTechModal: () => void;
  onOpenInventory: () => void;
  onMove: (x: number, z: number) => void;
  onAction: (type: 'attack_light' | 'attack_heavy' | 'block') => void;
  onStopBlock: () => void;
  onMilitarySkill: (skillType: 'light_weapon' | 'heavy_weapon' | 'tank_support' | 'airstrike') => void;
}

export const SurvivalTacticalHUD: React.FC<SurvivalTacticalHUDProps> = ({
  player,
  enemy,
  stats,
  currentProvince,
  onOpenTechModal,
  onOpenInventory,
  onMove,
  onAction,
  onStopBlock,
  onMilitarySkill,
}) => {
  const [isTouch, setIsTouch] = useState(false);
  const [ammo, setAmmo] = useState(30);
  const [maxAmmo, setMaxAmmo] = useState(30);
  const [armorDurability, setArmorDurability] = useState(100);
  const [threatWave, setThreatWave] = useState(1);
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 min survival timer

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!player || !enemy) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden font-['Cairo',sans-serif]">
      
      {/* Top Tactical Status Bar */}
      <div className="flex justify-between items-start gap-4 z-10">
        
        {/* Player Survival Status & Armor */}
        <div className="bg-stone-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-72 shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-black text-base">{player.nameAr}</span>
            <span className="text-amber-400 font-mono text-xs font-bold">مقاتل تكتيكي (المنظور الثالث)</span>
          </div>

          {/* Health Bar */}
          <div className="space-y-1 mb-2">
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>الصحة (Health)</span>
              <span>{Math.round(player.hp)} / {player.maxHp}</span>
            </div>
            <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                className="h-full bg-gradient-to-r from-red-600 to-orange-400 rounded-full" 
              />
            </div>
          </div>

          {/* Armor Durability */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>متانة الدرع التكتيكي (Armor)</span>
              <span>{armorDurability}%</span>
            </div>
            <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
              <div className="h-full w-[88%] bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* Center: Survival Timer & Threat Wave */}
        <div className="flex flex-col items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-stone-900/90 border border-amber-500/30 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-white font-mono text-xl font-black">{formatTime(secondsRemaining)}</span>
            </div>
            <div className="h-5 w-px bg-white/10" />
            <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" /> موجة التهديد #{threatWave}
            </div>
          </div>

          <div className="bg-stone-900/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-xl">
            <span className="text-stone-300 text-xs font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" /> مسرح العمليات: {currentProvince}
            </span>
          </div>
        </div>

        {/* Right Top: Enemy Combat Status & Quick Menu */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="bg-stone-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-60 text-right shadow-2xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-red-400 font-bold text-xs">الهدف المعادي (AI Target)</span>
              <span className="text-white font-black text-sm">{enemy.nameAr}</span>
            </div>
            <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                className="h-full bg-gradient-to-l from-red-600 to-orange-500 ml-auto rounded-full" 
              />
            </div>
          </div>

          <button 
            onClick={onOpenInventory}
            className="p-3 bg-stone-900/90 hover:bg-stone-800 rounded-2xl border border-white/10 text-white backdrop-blur-md shadow-xl flex items-center gap-2 transition-all cursor-pointer"
            title="حقيبة الذخيرة والعتاد"
          >
            <Backpack className="w-5 h-5 text-amber-400" />
          </button>

          <button 
            onClick={onOpenTechModal}
            className="p-3 bg-stone-900/90 hover:bg-stone-800 rounded-2xl border border-white/10 text-white backdrop-blur-md shadow-xl flex items-center gap-2 transition-all cursor-pointer"
            title="الإعدادات"
          >
            <Settings className="w-5 h-5 text-stone-300" />
          </button>
        </div>

      </div>

      {/* Center Screen Crosshair (Tactical Aim) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="relative w-12 h-12 flex items-center justify-center opacity-40">
          <div className="absolute top-0 w-1 h-3 bg-amber-400" />
          <div className="absolute bottom-0 w-1 h-3 bg-amber-400" />
          <div className="absolute left-0 w-3 h-1 bg-amber-400" />
          <div className="absolute right-0 w-3 h-1 bg-amber-400" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]" />
        </div>
      </div>

      {/* Right Side: Tactical Military Support & Weapon Skills */}
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto z-20">
        <div className="text-[10px] font-bold text-amber-400 text-center tracking-widest bg-stone-900/90 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
          المهارات التكتيكية
        </div>

        <button 
          onClick={() => onMilitarySkill('light_weapon')}
          className="w-14 h-14 rounded-2xl bg-stone-900/90 hover:bg-amber-600/30 border border-white/10 flex flex-col items-center justify-center text-amber-400 shadow-xl cursor-pointer active:scale-95"
          title="رشاش تكتيكي خفيف"
        >
          <Zap className="w-5 h-5" />
          <span className="text-[8px] font-bold mt-0.5">رشاش</span>
        </button>

        <button 
          onClick={() => onMilitarySkill('heavy_weapon')}
          className="w-14 h-14 rounded-2xl bg-stone-900/90 hover:bg-orange-600/30 border border-white/10 flex flex-col items-center justify-center text-orange-400 shadow-xl cursor-pointer active:scale-95"
          title="قاذف صاروخي RPG"
        >
          <Rocket className="w-5 h-5" />
          <span className="text-[8px] font-bold mt-0.5">آر بي جي</span>
        </button>

        <button 
          onClick={() => onMilitarySkill('tank_support')}
          className="w-14 h-14 rounded-2xl bg-stone-900/90 hover:bg-red-600/30 border border-white/10 flex flex-col items-center justify-center text-red-400 shadow-xl cursor-pointer active:scale-95"
          title="دعم مدفعية ودبابات"
        >
          <Shield className="w-5 h-5" />
          <span className="text-[8px] font-bold mt-0.5">دبابة</span>
        </button>

        <button 
          onClick={() => onMilitarySkill('airstrike')}
          className="w-14 h-14 rounded-2xl bg-stone-900/90 hover:bg-cyan-600/30 border border-white/10 flex flex-col items-center justify-center text-cyan-400 shadow-xl cursor-pointer active:scale-95"
          title="غارة جوية حربية"
        >
          <Plane className="w-5 h-5" />
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

      {/* Bottom Bar: Ammo & Quick Stats */}
      <div className="flex justify-between items-end px-4 relative z-10">
        <div className="bg-stone-900/90 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex gap-8 items-center shadow-2xl">
          <div className="text-right">
            <div className="text-[10px] text-stone-400 uppercase tracking-widest">الذخيرة المتوفرة</div>
            <div className="text-xl font-black text-amber-400 tabular-nums">30 / 120</div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-right">
            <div className="text-[10px] text-stone-400 uppercase tracking-widest">نمط اللعبة</div>
            <div className="text-sm font-bold text-white">منظور ثالث للبقاء والقتال التكتيكي</div>
          </div>
        </div>
      </div>

    </div>
  );
};
