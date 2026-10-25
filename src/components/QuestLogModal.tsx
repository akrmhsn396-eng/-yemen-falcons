import React from 'react';
import { motion } from 'motion/react';
import { MapPinned, X } from 'lucide-react';
import type { RPGQuest } from '../types/game';

interface QuestLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  quests: RPGQuest[];
  onCompleteQuest: (questId: string) => void;
}

export const QuestLogModal: React.FC<QuestLogModalProps> = ({
  isOpen,
  onClose,
  quests,
  onCompleteQuest,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#0b1220] p-6 text-white"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4fd1c5]/20 text-[#4fd1c5]">
              <MapPinned className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black">سجل المهام</h3>
              <p className="text-xs text-stone-400">المهام الرئيسية والإقليمية</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-stone-300 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className="rounded-3xl border border-white/10 bg-black/30 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#4fd1c5]/10 px-2 py-0.5 text-[10px] font-bold text-[#4fd1c5]">
                      {quest.provinceAr}
                    </span>
                    <span className="text-xs text-stone-400">مهمة</span>
                  </div>

                  <h4 className="text-lg font-black">{quest.titleAr}</h4>
                  <p className="text-sm text-stone-300">{quest.descAr}</p>
                </div>

                <button
                  onClick={() => onCompleteQuest(quest.id)}
                  disabled={quest.isCompleted}
                  className={`rounded-2xl px-4 py-2 text-xs font-black transition ${
                    quest.isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-[#4fd1c5] text-[#0b1220] hover:bg-[#7ee7d0]'
                  }`}
                >
                  {quest.isCompleted ? 'مكتملة' : 'إكمال'}
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-stone-300">
                <span>مكافأة XP</span>
                <span className="font-black text-[#4fd1c5]">{quest.rewardXP} XP</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
