import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, CheckCircle2, Star, Clock, Target, ShieldCheck } from 'lucide-react';
import { DailyChallenge } from '../types/game';

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
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm rtl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-stone-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden font-['Cairo',sans-serif]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-stone-800 to-stone-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-xl">
                  <Trophy className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">التحديات اليومية</h2>
                  <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest">Daily Challenges</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-stone-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`relative p-5 rounded-2xl border transition-all ${
                    challenge.isCompleted
                      ? 'bg-amber-500/5 border-amber-500/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-sm font-black ${challenge.isCompleted ? 'text-amber-500' : 'text-white'}`}>
                          {challenge.titleAr}
                        </h3>
                        {challenge.isCompleted && (
                          <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-3 space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-stone-400">
                          <span>التقدم</span>
                          <span>{challenge.progress} / {challenge.requirement}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(challenge.progress / challenge.requirement) * 100}%` }}
                            className={`h-full rounded-full ${
                              challenge.isCompleted ? 'bg-amber-500' : 'bg-blue-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Reward */}
                    <div className="text-center min-w-[80px]">
                      <div className="p-2 bg-stone-800 rounded-xl mb-1 flex flex-col items-center justify-center">
                        <Star className="w-4 h-4 text-amber-500 mb-0.5" />
                        <span className="text-xs font-black text-amber-500">{challenge.rewardXP} XP</span>
                      </div>
                      <span className="text-[9px] font-bold text-stone-500 uppercase">مكافأة</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-stone-900/50 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <Clock className="w-4 h-4" />
                <span>تنتهي التحديات خلال 12 ساعة</span>
              </div>
              <button
                onClick={onClose}
                className="px-8 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95"
              >
                موافق
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
