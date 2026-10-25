import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Target, Zap, Shield, ChevronRight, 
  RefreshCw, TrendingUp, Star, Award, Clock
} from 'lucide-react';
import { sound } from '../game/audio';

interface PostBattleSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    kills: number;
    accuracy: number;
    pointsEarned: number;
    survivalTime: number;
  };
  provinceName: string;
}

export const PostBattleSummary: React.FC<PostBattleSummaryProps> = ({
  isOpen,
  onClose,
  stats,
  provinceName,
}) => {
  if (!isOpen) return null;

  const xpReward = Math.floor(stats.kills * 15 + (stats.accuracy / 100) * 100 + stats.pointsEarned * 0.5);

  const handleContinue = () => {
    sound.playSelect();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0b1220]/95 backdrop-blur-2xl font-['Cairo',sans-serif] text-right rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-2xl bg-[#0b1220] border border-[#4fd1c5]/30 rounded-[3rem] shadow-[0_0_100px_rgba(79,209,197,0.2)] overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(79,209,197,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(79,209,197,0.1)_1px,transparent_1px)] bg-[length:40px_40px]" />
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-[#4fd1c5] to-transparent shadow-[0_0_15px_rgba(79,209,197,0.5)]" />

        <div className="p-10 space-y-10 relative z-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#4fd1c5]/10 border border-[#4fd1c5]/40 text-[#4fd1c5] mb-4"
            >
              <Trophy className="w-10 h-10" />
            </motion.div>
            <h2 className="text-4xl font-black text-white tracking-tighter">اكتملت المهمة بنجاح</h2>
            <div className="flex items-center justify-center gap-2 text-[#4fd1c5] text-sm font-black uppercase tracking-[0.2em]">
              <span className="w-2 h-2 rounded-full bg-[#4fd1c5] animate-pulse" />
              <span>القطاع: {provinceName}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              label="الأهداف التي تمت تصفيتها" 
              value={stats.kills} 
              subValue="Kills"
              icon={<Target className="w-5 h-5" />} 
              delay={0.3}
            />
            <StatCard 
              label="دقة التصويب" 
              value={`${stats.accuracy}%`} 
              subValue="Accuracy"
              icon={<Crosshair className="w-5 h-5" />} 
              delay={0.4}
            />
            <StatCard 
              label="النقاط التكتيكية المكتسبة" 
              value={stats.pointsEarned} 
              subValue="Tactical PT"
              icon={<Zap className="w-5 h-5" />} 
              delay={0.5}
            />
            <StatCard 
              label="مدة الصمود" 
              value={`${Math.floor(stats.survivalTime / 60)}د ${stats.survivalTime % 60}ث`} 
              subValue="Survival Time"
              icon={<Clock className="w-5 h-5" />} 
              delay={0.6}
            />
          </div>

          {/* Rewards Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-[#4fd1c5]/10 to-blue-500/10 rounded-[2rem] border border-white/5 p-8 flex items-center justify-between"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-right">
                <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest">مكافأة الخبرة (XP)</p>
                <p className="text-white text-3xl font-black tabular-nums tracking-tighter">+{xpReward} <span className="text-sm text-yellow-500">XP</span></p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="text-[#4fd1c5]/20"
            >
              <TrendingUp className="w-16 h-16" />
            </motion.div>
          </motion.div>

          {/* Action Button */}
          <button
            onClick={handleContinue}
            className="w-full h-16 bg-[#4fd1c5] hover:bg-[#4fd1c5]/90 text-black font-black text-xl rounded-2xl shadow-[0_0_30px_rgba(79,209,197,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
          >
            <span>العودة للقيادة</span>
            <ChevronRight className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: string | number, subValue: string, icon: React.ReactNode, delay: number }> = ({ label, value, subValue, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="bg-white/5 border border-white/5 p-5 rounded-[1.5rem] flex items-center gap-4 group hover:border-[#4fd1c5]/30 transition-all"
  >
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-stone-400 group-hover:text-[#4fd1c5] transition-colors">
      {icon}
    </div>
    <div className="text-right">
      <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-white text-xl font-black tabular-nums">{value}</p>
        <p className="text-stone-600 text-[8px] font-bold uppercase">{subValue}</p>
      </div>
    </div>
  </motion.div>
);
