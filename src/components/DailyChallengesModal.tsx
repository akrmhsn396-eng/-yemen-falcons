import React from 'react';
import { motion } from 'motion/react';
import { Trophy, X } from 'lucide-react';
import type { DailyChallenge } from '../types/game';

interface DailyChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenges: DailyChallenge[];
}

export const DailyChallengesModal: React.FC<DailyChallengesModalProps> = ({
  isOpen,
  onClose,
  challenges,
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
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black">التحديات اليومية</h3>
              <p className="text-xs text-stone-400">أهداف يومية للمهارات والتقدم</p>
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
          {challenges.map((challenge) => (
            <div key={challenge.id} className="rounded-3xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-lg font-black">{challenge.titleAr}</h4>
                  <div className="text-xs text-stone-400">
                    {challenge.progress}/{challenge.requirement}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#4fd1c5]/10 px-2 py-1 text-[10px] font-bold text-[#4fd1c5]">
                    {challenge.rewardXP} XP
                  </span>

                  <div
                    className={`rounded-full px-2 py-1 text-[10px] font-black ${
                      challenge.isCompleted
                        ? 'bg-[#4fd1c5]/20 text-[#4fd1c5]'
                        : 'bg-stone-500/20 text-stone-300'
                    }`}
                  >
                    {challenge.isCompleted ? 'مكتمل' : 'قيد التقدم'}
                  </div>
                </div>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4fd1c5] to-[#7ee7d0]"
                  style={{
                    width: `${Math.min((challenge.progress / challenge.requirement) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
