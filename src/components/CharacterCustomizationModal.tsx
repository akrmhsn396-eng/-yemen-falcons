import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserCheck, Shield, Zap, Sparkles, Check, X } from 'lucide-react';
import { sound } from '../game/audio';

interface CharacterCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OutfitOption {
  id: string;
  nameAr: string;
  descAr: string;
  bonus: string;
  color: string;
}

const outfits: OutfitOption[] = [
  {
    id: 'traditional_tihama',
    nameAr: 'الزي التهامي المعاصر',
    descAr: 'ثوب قطني خفيف مع المعوز التهامي التقليدي والشال العصري، يمنح خفة حركة فائقة.',
    bonus: '+15% سرعة الحركة',
    color: 'from-amber-600 to-yellow-700'
  },
  {
    id: 'mountain_sheba',
    nameAr: 'الزي الجبلي التكتيكي',
    descAr: 'جاكيت صوفي ثقيل مع حزام عتاد ومقاومة عالية للصدمات والهجمات.',
    bonus: '+20% قوة الدفاع',
    color: 'from-stone-700 to-stone-900'
  },
  {
    id: 'urban_street',
    nameAr: 'زي الشارع الحضري',
    descAr: 'سترة عملية بنمط معاصر مع حذاء متين ومقاوم للإنزلاق، مثالي لقتال الشوارع.',
    bonus: '+15% قوة الهجوم الخفيف',
    color: 'from-blue-600 to-indigo-900'
  }
];

export const CharacterCustomizationModal: React.FC<CharacterCustomizationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedOutfit, setSelectedOutfit] = useState<string>(outfits[0].id);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl font-['Cairo',sans-serif] dir-rtl select-none">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl bg-stone-900 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-white space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black">تخصيص المقاتل اليمني</h3>
              <p className="text-xs text-stone-400">اختر الزي والأزياء اليومية الواقعية المناسبة لأسلوب قتالك</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Outfit Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${outfit.color} flex items-center justify-center shadow-md`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    {outfit.bonus}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-black">{outfit.nameAr}</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">{outfit.descAr}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-8 py-4 rounded-2xl bg-amber-500 text-stone-950 font-black hover:bg-amber-400 transition-all shadow-xl cursor-pointer"
          >
            حفظ التغييرات والعودة
          </button>
        </div>
      </motion.div>
    </div>
  );
};
