import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserCheck,
  Check,
  X,
  Crosshair,
  Move,
  ShieldAlert,
  Star,
  ChevronUp,
} from 'lucide-react';
import { sound } from '../game/audio';
import { PlayerSkills } from '../types/game';

interface CharacterCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerXP: number;
  skills: PlayerSkills;
  onUpgradeSkill: (skillKey: keyof PlayerSkills, cost: number) => void;
  upgradeCosts?: Partial<Record<keyof PlayerSkills, number>>;
}

interface OutfitOption {
  id: string;
  nameAr: string;
  descAr: string;
  bonus: string;
  gradient: string;
}

const outfits: OutfitOption[] = [
  {
    id: 'traditional_tihama',
    nameAr: 'الزي التهامي المعاصر',
    descAr: 'ثوب قطني خفيف مع المعوز التهامي التقليدي والشال العصري، يمنح خفة حركة فائقة.',
    bonus: '+15% سرعة الحركة',
    gradient: 'from-amber-600 to-yellow-700',
  },
  {
    id: 'mountain_sheba',
    nameAr: 'الزي الجبلي التكتيكي',
    descAr: 'جاكيت صوفي ثقيل مع حزام عتاد ومقاومة عالية للصدمات والهجمات.',
    bonus: '+20% قوة الدفاع',
    gradient: 'from-stone-700 to-stone-900',
  },
  {
    id: 'urban_street',
    nameAr: 'زي الشارع الحضري',
    descAr: 'سترة عملية بنمط معاصر مع حذاء متين ومقاوم للإنزلاق، مثالي لقتال الشوارع.',
    bonus: '+15% قوة الهجوم الخفيف',
    gradient: 'from-blue-600 to-indigo-900',
  },
];

const skillPalette = {
  movementSpeed: {
    label: 'سرعة الحركة',
    iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    progressBg: 'bg-blue-500',
    button: 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-stone-950',
  },
  aimAccuracy: {
    label: 'دقة التصويب',
    iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    progressBg: 'bg-amber-500',
    button: 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-stone-950',
  },
  tacticalDefense: {
    label: 'الدفاع التكتيكي',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    progressBg: 'bg-emerald-500',
    button: 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-stone-950',
  },
} as const;

export const CharacterCustomizationModal: React.FC<CharacterCustomizationModalProps> = ({
  isOpen,
  onClose,
  playerXP,
  skills,
  onUpgradeSkill,
  upgradeCosts,
}) => {
  const [selectedOutfit, setSelectedOutfit] = useState<string>(outfits[0].id);
  const [activeTab, setActiveTab] = useState<'outfits' | 'skills'>('outfits');

  const skillItems = useMemo(
    () =>
      (Object.keys(skillPalette) as Array<keyof PlayerSkills>).map((key) => ({
        key,
        nameAr: skillPalette[key].label,
        icon: key === 'movementSpeed' ? <Move className="w-5 h-5" /> : key === 'aimAccuracy' ? <Crosshair className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />,
        cost: upgradeCosts?.[key] ?? skills[key] * 500,
      })),
    [skills, upgradeCosts],
  );

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl font-['Cairo',sans-serif] dir-rtl select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl bg-stone-900 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-white space-y-6 overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black">تخصيص المقاتل اليمني</h3>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-xs text-amber-500 font-black tracking-widest uppercase">
                  {playerXP.toLocaleString()} XP متاح
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('outfits')}
            className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'outfits' ? 'bg-white/10 text-white shadow-lg' : 'text-stone-500 hover:text-stone-300'}`}
          >
            الأزياء والملابس
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'skills' ? 'bg-white/10 text-white shadow-lg' : 'text-stone-500 hover:text-stone-300'}`}
          >
            شجرة المهارات
          </button>
        </div>

        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === 'outfits' ? (
              <motion.div
                key="outfits"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {outfits.map((outfit) => {
                  const isSelected = selectedOutfit === outfit.id;

                  return (
                    <button
                      key={outfit.id}
                      onClick={() => {
                        setSelectedOutfit(outfit.id);
                        sound.playSelect();
                      }}
                      className={`p-5 rounded-3xl border text-right flex flex-col justify-between gap-4 transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30 shadow-xl'
                          : 'bg-black/40 border-white/5 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${outfit.gradient} flex items-center justify-center shadow-md`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                          {outfit.bonus}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-black">{outfit.nameAr}</h4>
                        <p className="text-[10px] text-stone-400 leading-relaxed">{outfit.descAr}</p>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="skills"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {skillItems.map((skill) => {
                  const level = skills[skill.key];
                  const isMax = level >= 5;
                  const canAfford = playerXP >= skill.cost;
                  const palette = skillPalette[skill.key];

                  return (
                    <div
                      key={skill.key}
                      className="p-5 bg-black/40 border border-white/5 rounded-3xl flex items-center justify-between gap-6"
                    >
                      <div className="flex items-center gap-4 grow">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${palette.iconBg}`}>
                          {skill.icon}
                        </div>
                        <div className="space-y-2 grow">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-black text-white">{skill.nameAr}</h4>
                            <span className="text-[10px] font-bold text-stone-500">المستوى {level}/5</span>
                          </div>
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-all ${
                                  i <= level ? `${palette.progressBg} shadow-[0_0_8px_rgba(0,0,0,0.5)]` : 'bg-white/5'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        disabled={isMax || !canAfford}
                        onClick={() => onUpgradeSkill(skill.key, skill.cost)}
                        className={`min-w-[120px] p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          isMax
                            ? 'bg-stone-800 border-stone-700 text-stone-500 cursor-not-allowed'
                            : !canAfford
                              ? 'bg-red-500/5 border-red-500/20 text-red-400/50 cursor-not-allowed'
                              : `${palette.button} cursor-pointer active:scale-95 shadow-lg shadow-amber-500/5`
                        }`}
                      >
                        {isMax ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <>
                            <div className="flex items-center gap-1">
                              <ChevronUp className="w-4 h-4 animate-bounce" />
                              <span className="text-xs font-black">ترقية</span>
                            </div>
                            <span className="text-[10px] font-bold opacity-80">{skill.cost} XP</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-8 py-4 rounded-2xl bg-amber-500 text-stone-950 font-black hover:bg-amber-400 transition-all shadow-xl cursor-pointer active:scale-95"
          >
            حفظ التغييرات والعودة
          </button>
        </div>
      </motion.div>
    </div>
  );
};
