import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FighterInstance, GameStats } from '../types/game';
import { VirtualControls } from './VirtualControls';
import { Compass, Shield, Zap, Swords, Settings, Clock, MapPin, Crosshair, Flame, Rocket, Plane } from 'lucide-react';

interface FightingHUDProps {
  player: FighterInstance | null;
  enemy: FighterInstance | null;
  stats: GameStats;
  onOpenTechModal: () => void;
  onMove: (x: number, y: number) => void;
  onAction: (type: 'attack_light' | 'attack_heavy' | 'block') => void;
  onStopBlock: () => void;
  onMilitarySkill: (skillType: 'light_weapon' | 'heavy_weapon' | 'tank_support' | 'airstrike') => void;
}

export const FightingHUD: React.FC<FightingHUDProps> = ({
  player,
  enemy,
  stats,
  onOpenTechModal,
  onMove,
  onAction,
  onStopBlock,
  onMilitarySkill,
}) => {
  const [isTouch, setIsTouch] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(180); // 3 minutes round timer

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    const timerInterval = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  if (!player || !enemy) return null;

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden">
      
      {/* Top HUD: HP Bars, Mini-map, and Timer */}
      <div className="flex justify-between items-start gap-4 sm:gap-8 mt-2 sm:mt-4 px-2 sm:px-6 relative z-10">
        
        {/* Player 1 (Sana'a / Yemen Fighter) */}
        <div className="flex-1 max-w-sm">
          <div className="flex items-end justify-between mb-1.5 px-1">
            <span className="text-white font-black text-lg sm:text-xl tracking-tight uppercase italic drop-shadow">
              {player.nameAr}
            </span>
            <span className="text-blue-400 font-mono text-xs font-bold">P1 (اللاعب)</span>
          </div>
          <div className="relative h-2.5 sm:h-3 bg-stone-900/80 rounded-full backdrop-blur-md overflow-hidden border border-white/10 p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(player.hp / player.maxHp) * 100}%` }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />
          </div>
          {/* Stamina / Energy Bar */}
          <div className="flex items-center justify-between mt-1 px-1">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-4 h-1 rounded-full ${i < player.energy / 20 ? 'bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,0.6)]' : 'bg-white/15'}`} />
              ))}
            </div>
            <span className="text-stone-400 font-mono text-[10px] uppercase">الطاقة الخاصة</span>
          </div>
        </div>

        {/* Center Top: Timer and Round Mini-Map */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          {/* Round Timer */}
          <div className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-stone-900/90 border border-white/10 backdrop-blur-xl shadow-2xl">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-white font-mono text-xl sm:text-2xl font-black tracking-widest">{formatTime(secondsRemaining)}</span>
          </div>

          {/* Mini-Map Radar (Top Corner Center) */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-stone-950/80 border border-white/10 backdrop-blur-md flex items-center justify-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent_70%)]" />
            <div className="absolute inset-2 border border-dashed border-white/20 rounded-full" />
            {/* Player Marker */}
            <div className="absolute w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]" style={{ transform: `translate(${(player.x * 2)}px, ${(player.z * 2)}px)` }} />
            {/* Enemy Marker */}
            <div className="absolute w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]" style={{ transform: `translate(${(enemy.x * 2)}px, ${(enemy.z * 2)}px)` }} />
            <div className="absolute bottom-1 right-1 text-[8px] font-mono text-stone-500 flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5 text-amber-500" /> رادار
            </div>
          </div>
        </div>

        {/* Opponent (AI / Player 2) */}
        <div className="flex-1 max-w-sm text-right">
          <div className="flex items-end justify-between mb-1.5 px-1 flex-row-reverse">
            <span className="text-white font-black text-lg sm:text-xl tracking-tight uppercase italic drop-shadow">
              {enemy.nameAr}
            </span>
            <span className="text-red-400 font-mono text-xs font-bold">الخصم (AI)</span>
          </div>
          <div className="relative h-2.5 sm:h-3 bg-stone-900/80 rounded-full backdrop-blur-md overflow-hidden border border-white/10 p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
              className="h-full rounded-full bg-gradient-to-l from-red-600 via-red-500 to-orange-400 shadow-[0_0_10px_rgba(239,68,68,0.5)] ml-auto"
            />
          </div>
          <div className="flex items-center justify-between mt-1 px-1 flex-row-reverse">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-4 h-1 rounded-full ${i < enemy.energy / 20 ? 'bg-red-400' : 'bg-white/15'}`} />
              ))}
            </div>
            <span className="text-stone-400 font-mono text-[10px] uppercase">طاقة الخصم</span>
          </div>
        </div>
      </div>

      {/* KO / Victory Overlay */}
      {player.state === 'ko' || enemy.state === 'ko' ? (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-4"
          >
            <h2 className="text-6xl sm:text-9xl font-black text-white italic tracking-tighter drop-shadow-2xl">
              {player.hp > 0 ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-orange-500 to-red-600 uppercase">انتصار ساحق!</span>
              ) : (
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-stone-400 to-red-700 uppercase">هزيمة صمود</span>
              )}
            </h2>
            <p className="text-stone-300 text-base sm:text-xl tracking-[0.2em] uppercase font-bold">
              اضغط على زر الخروج أو Esc للعودة للقائمة الرئيسية
            </p>
          </motion.div>
        </div>
      ) : null}

      {/* Military Skills Combat Bar (Heavy/Light weapons, Tanks, Airstrikes) */}
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto z-20">
        <div className="text-[10px] font-bold text-amber-400 text-center tracking-widest bg-stone-900/80 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
          المهارات الحربية
        </div>

        <button 
          onClick={() => onMilitarySkill('light_weapon')}
          title="رشاش خفيف مكثف"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-stone-900/80 hover:bg-amber-600/30 border border-white/10 hover:border-amber-500/50 flex flex-col items-center justify-center text-amber-400 transition-all shadow-xl backdrop-blur-md group cursor-pointer active:scale-95"
        >
          <Crosshair className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-bold mt-0.5">رشاش خفيف</span>
        </button>

        <button 
          onClick={() => onMilitarySkill('heavy_weapon')}
          title="قذيفة آر بي جي ثقيلة"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-stone-900/80 hover:bg-orange-600/30 border border-white/10 hover:border-orange-500/50 flex flex-col items-center justify-center text-orange-400 transition-all shadow-xl backdrop-blur-md group cursor-pointer active:scale-95"
        >
          <Rocket className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-bold mt-0.5">آر بي جي</span>
        </button>

        <button 
          onClick={() => onMilitarySkill('tank_support')}
          title="دعم دبابة مدرعة"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-stone-900/80 hover:bg-red-600/30 border border-white/10 hover:border-red-500/50 flex flex-col items-center justify-center text-red-400 transition-all shadow-xl backdrop-blur-md group cursor-pointer active:scale-95"
        >
          <Flame className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-bold mt-0.5">دبابة مدرعة</span>
        </button>

        <button 
          onClick={() => onMilitarySkill('airstrike')}
          title="غارة طائرة حربية"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-stone-900/80 hover:bg-cyan-600/30 border border-white/10 hover:border-cyan-500/50 flex flex-col items-center justify-center text-cyan-400 transition-all shadow-xl backdrop-blur-md group cursor-pointer active:scale-95"
        >
          <Plane className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-bold mt-0.5">طائرة حربية</span>
        </button>
      </div>

      {/* Transparent Touch Controls for Mobile */}
      {isTouch && (
        <VirtualControls 
          onMove={onMove}
          onAction={onAction}
          onStopBlock={onStopBlock}
        />
      )}

      {/* Bottom HUD Bar: Stats & Settings */}
      <div className="flex justify-between items-end mb-4 px-4 relative z-10">
        <div className="flex items-center gap-3">
           <button 
            onClick={onOpenTechModal}
            className="pointer-events-auto px-5 py-3 flex items-center gap-2 bg-stone-900/80 hover:bg-stone-800 rounded-2xl border border-white/10 text-stone-300 hover:text-white transition-all backdrop-blur-md shadow-xl cursor-pointer font-bold text-xs"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>معلومات النظام والمحرك</span>
          </button>
        </div>

        <div className="bg-stone-900/80 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex gap-8 items-center shadow-2xl">
           <div className="text-right">
              <div className="text-[10px] text-stone-400 uppercase tracking-widest">عدد الضربات القاضية</div>
              <div className="text-xl font-black text-amber-400 tabular-nums">{stats.knockouts}</div>
           </div>
           <div className="h-6 w-px bg-white/10" />
           <div className="text-right">
              <div className="text-[10px] text-stone-400 uppercase tracking-widest">المنطقة الحالية</div>
              <div className="text-sm font-bold text-white">صنعاء، اليمن</div>
           </div>
        </div>
      </div>

    </div>
  );
};
