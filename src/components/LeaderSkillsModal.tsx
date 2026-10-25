import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, X, HeartPulse, Crosshair, Shield, Plane, Mountain, 
  Sparkles, Check, ChevronLeft, Zap, Award, ArrowUpRight, AlertCircle,
  Radio, ShieldAlert, Target
} from 'lucide-react';
import { useGameStore, LEADER_SKILLS_INFO } from '../store/gameStore';
import { sound } from '../game/audio';
import type { LeaderSkillKey } from '../types/game';

export const LeaderSkillsModal: React.FC = () => {
  const { 
    isLeaderSkillsOpen, 
    closeLeaderSkills, 
    leaderSkills, 
    upgradeLeaderSkill, 
    totalXP,
    tacticalPoints 
  } = useGameStore();

  const [activeSkillKey, setActiveSkillKey] = React.useState<LeaderSkillKey>('rapidHealing');

  if (!isLeaderSkillsOpen) return null;

  const activeSkillInfo = LEADER_SKILLS_INFO.find(s => s.key === activeSkillKey) || LEADER_SKILLS_INFO[0];
  const currentLevel = leaderSkills[activeSkillKey] || 1;
  const upgradeCost = activeSkillInfo.baseCostXP * currentLevel;
  const canAfford = totalXP >= upgradeCost && currentLevel < activeSkillInfo.maxLevel;

  const handleUpgrade = (key: LeaderSkillKey) => {
    sound.playSelect();
    upgradeLeaderSkill(key);
  };

  const getSkillIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'heartPulse': return <HeartPulse className={className} />;
      case 'crosshair': return <Crosshair className={className} />;
      case 'shield': return <Shield className={className} />;
      case 'plane': return <Plane className={className} />;
      case 'mountain': return <Mountain className={className} />;
      default: return <Crown className={className} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8 bg-[#07101a]/95 backdrop-blur-2xl font-['Cairo',sans-serif] text-right rtl select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="relative w-full max-w-5xl h-[88vh] bg-[#0b1220] border border-[#4fd1c5]/40 rounded-[2.5rem] shadow-[0_0_80px_rgba(79,209,197,0.2)] overflow-hidden flex flex-col"
      >
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(rgba(79,209,197,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(79,209,197,0.1)_1px,transparent_1px)] bg-[length:32px_32px]" />
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-[#4fd1c5] via-teal-400 to-transparent shadow-[0_0_15px_rgba(79,209,197,0.6)]" />

        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4fd1c5]/20 to-teal-900/40 border border-[#4fd1c5]/40 flex items-center justify-center text-[#4fd1c5] shadow-[0_0_20px_rgba(79,209,197,0.25)]">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">مهارات القائد التكتيكي</h2>
                <span className="text-[10px] bg-[#4fd1c5]/20 text-[#4fd1c5] px-2.5 py-0.5 rounded-full border border-[#4fd1c5]/40 font-black uppercase tracking-widest">
                  Leader Perks
                </span>
              </div>
              <p className="text-stone-400 text-xs font-bold mt-0.5">
                تطوير قدرات القيادة يعزز كفاءة الفريق بالكامل (سرعة العلاج، دقة القنص، تحصين الدروع، والدعم الجوي)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* XP Available Balance */}
            <div className="bg-[#07101a]/80 px-5 py-2.5 rounded-2xl border border-yellow-500/30 flex items-center gap-3 shadow-lg">
              <div className="text-right">
                <span className="text-[9px] text-stone-400 font-black uppercase tracking-wider block">نقاط الخبرة (XP)</span>
                <span className="text-yellow-400 text-xl font-black tabular-nums tracking-tighter">
                  {totalXP.toLocaleString()} <span className="text-xs">XP</span>
                </span>
              </div>
              <Award className="w-6 h-6 text-yellow-400" />
            </div>

            <button
              onClick={() => { sound.playClick(); closeLeaderSkills(); }}
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Skill List Sidebar */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-l border-white/10 bg-black/30 p-5 space-y-3 overflow-y-auto">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] text-stone-400 font-black uppercase tracking-widest">فروع القيادة الميدانية</span>
              <span className="text-[10px] text-[#4fd1c5] font-black">5 مهارات</span>
            </div>

            {LEADER_SKILLS_INFO.map((skill) => {
              const lvl = leaderSkills[skill.key] || 1;
              const isSelected = activeSkillKey === skill.key;
              const isMax = lvl >= skill.maxLevel;

              return (
                <button
                  key={skill.key}
                  onClick={() => { sound.playSelect(); setActiveSkillKey(skill.key); }}
                  className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer group relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#4fd1c5]/15 border-[#4fd1c5] shadow-[0_0_20px_rgba(79,209,197,0.15)]'
                      : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-[#4fd1c5] text-[#0b1220] shadow-[0_0_12px_rgba(79,209,197,0.5)]' 
                        : 'bg-white/5 text-[#4fd1c5] group-hover:bg-white/10'
                    }`}>
                      {getSkillIcon(skill.iconName, 'w-5 h-5')}
                    </div>
                    <div>
                      <p className={`text-sm font-black tracking-tight ${isSelected ? 'text-white' : 'text-stone-300'}`}>
                        {skill.titleAr}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-mono font-bold text-[#4fd1c5]">
                          مستوى {lvl}/{skill.maxLevel}
                        </span>
                        {isMax && (
                          <span className="text-[8px] bg-green-500/20 text-green-400 px-1.5 py-0.2 rounded font-black">
                            مكتمل
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-0.5">
                      {Array.from({ length: skill.maxLevel }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-3.5 rounded-sm ${
                            i < lvl ? 'bg-[#4fd1c5]' : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Skill Detailed Info & Upgrade Center */}
          <div className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8 bg-gradient-to-b from-transparent to-black/30">
            {/* Active Skill Banner */}
            <div className="relative p-7 rounded-[2rem] bg-gradient-to-r from-[#4fd1c5]/10 via-[#0b1220] to-blue-500/10 border border-[#4fd1c5]/30 overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-2 h-full bg-[#4fd1c5]" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#4fd1c5]/20 border border-[#4fd1c5]/40 flex items-center justify-center text-[#4fd1c5] shadow-lg">
                    {getSkillIcon(activeSkillInfo.iconName, 'w-8 h-8')}
                  </div>
                  <div>
                    <span className="text-[10px] text-[#4fd1c5] font-black uppercase tracking-widest">مهارة قيادية نشطة</span>
                    <h3 className="text-3xl font-black text-white tracking-tight mt-0.5">{activeSkillInfo.titleAr}</h3>
                    <p className="text-stone-300 text-sm mt-1 max-w-xl leading-relaxed">
                      {activeSkillInfo.descriptionAr}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right bg-black/40 px-5 py-3 rounded-2xl border border-white/10 self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end">
                  <span className="text-[10px] text-stone-400 font-black uppercase">المستوى الحالي</span>
                  <span className="text-2xl font-black text-[#4fd1c5] font-mono">
                    LVL {currentLevel} <span className="text-xs text-stone-500">/ 5</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Current & Next Level Effects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-stone-400 uppercase tracking-wider">الأثر الحالي (Level {currentLevel})</span>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
                <p className="text-lg font-black text-white leading-snug">
                  {activeSkillInfo.effectFormulaAr(currentLevel)}
                </p>
                <span className="text-[11px] text-stone-400 block">
                  يطبق على القائد وكافة عناصر الدعم في أرض المعركة تلقائياً
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#4fd1c5]/5 border border-[#4fd1c5]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#4fd1c5] uppercase tracking-wider">
                    {currentLevel < activeSkillInfo.maxLevel 
                      ? `الأثر بعد الترقية (Level ${currentLevel + 1})`
                      : 'تم الوصول لأقصى كفاءة قتالية'}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#4fd1c5]" />
                </div>
                <p className="text-lg font-black text-teal-300 leading-snug">
                  {currentLevel < activeSkillInfo.maxLevel
                    ? activeSkillInfo.effectFormulaAr(currentLevel + 1)
                    : 'المهارة في ذروة تأثيرها الميداني (Maxed)'}
                </p>
                <span className="text-[11px] text-stone-400 block">
                  {currentLevel < activeSkillInfo.maxLevel
                    ? 'تعزيز فوري ينعكس على حسابات الضرر وسرعة الشفاء التكتيكي'
                    : 'لا توجد ترقيات إضافية لهذا التخصص'}
                </span>
              </div>
            </div>

            {/* Tactical Perks Overview */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#4fd1c5]" />
                <span>التأثير الميداني المباشر في BattleScreen:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-stone-300">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                  <HeartPulse className="w-5 h-5 text-red-400 shrink-0" />
                  <span>تجدد حيوي مستمر للدم (HP Regen) دون الحاجة لحزم إسعاف</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                  <Crosshair className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>تثبيت ارتداد القناصة وتقليل تشتت الرصاص إلى أدنى حد</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                  <Plane className="w-5 h-5 text-[#4fd1c5] shrink-0" />
                  <span>استدعاء الغارات الجوية والاستطلاع بتكلفة موارد أقل وسرعة شحن</span>
                </div>
              </div>
            </div>

            {/* Upgrade Action Bar */}
            <div className="p-6 rounded-[2rem] bg-gradient-to-r from-black/60 to-black/30 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 text-right">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-black uppercase">تكلفة الترقية للمستوى القادم</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-yellow-400 font-mono">
                      {currentLevel < activeSkillInfo.maxLevel ? upgradeCost.toLocaleString() : 0}
                    </span>
                    <span className="text-xs text-yellow-500 font-bold uppercase">XP</span>
                    {currentLevel < activeSkillInfo.maxLevel && totalXP < upgradeCost && (
                      <span className="text-[10px] text-red-400 mr-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> تحتاج { (upgradeCost - totalXP).toLocaleString() } XP إضافي
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {currentLevel < activeSkillInfo.maxLevel ? (
                <button
                  onClick={() => handleUpgrade(activeSkillKey)}
                  disabled={!canAfford}
                  className={`px-8 py-4 rounded-2xl font-black text-base flex items-center gap-3 transition-all cursor-pointer shadow-lg active:scale-95 ${
                    canAfford
                      ? 'bg-gradient-to-r from-[#4fd1c5] to-teal-400 text-[#0b1220] hover:shadow-[0_0_30px_rgba(79,209,197,0.4)]'
                      : 'bg-stone-800 text-stone-500 border border-white/5 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>ترقية مهارة القائد (+1)</span>
                </button>
              ) : (
                <div className="px-8 py-3.5 rounded-2xl bg-green-500/20 border border-green-500/40 text-green-400 font-black text-sm flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>وصلت المهارة للمستوى الأقصى</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
