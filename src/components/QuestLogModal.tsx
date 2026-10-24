import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RPGQuest } from '../types/game';
import { X, Scroll, CheckCircle2, Award, MapPin } from 'lucide-react';

interface QuestLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  quests: RPGQuest[];
  onCompleteQuest: (id: string) => void;
}

export const QuestLogModal: React.FC<QuestLogModalProps> = ({
  isOpen,
  onClose,
  quests,
  onCompleteQuest,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg font-['Cairo',sans-serif]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-stone-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-right"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-stone-950/60">
            <div className="flex items-center gap-3">
              <Scroll className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-black text-white">سجل المهام والأسرار (Open World Quests)</h2>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quests List */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {quests.map((quest) => (
              <div 
                key={quest.id}
                className={`p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  quest.isCompleted 
                    ? 'bg-stone-950/40 border-green-500/30 opacity-75' 
                    : 'bg-stone-800/40 border-white/10 hover:border-amber-500/50'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {quest.provinceAr}
                    </span>
                    {quest.isCompleted && (
                      <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> مکتملة
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-black text-lg">{quest.titleAr}</h3>
                  <p className="text-stone-300 text-sm leading-relaxed">{quest.descAr}</p>
                  <div className="text-xs text-amber-300 font-mono flex items-center gap-1 pt-1">
                    <Award className="w-4 h-4" /> المكافأة: +{quest.rewardXP} نقطة خبرة XP
                  </div>
                </div>

                {!quest.isCompleted && (
                  <button 
                    onClick={() => onCompleteQuest(quest.id)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-lg shrink-0 cursor-pointer"
                  >
                    إنجاز المهمة
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
