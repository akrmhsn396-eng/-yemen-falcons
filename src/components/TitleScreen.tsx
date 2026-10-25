import { Play, Globe, Settings, ShoppingBag, UserCheck, Sparkles, ChevronRight, Swords, Target, Info, Crown } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { motion } from 'motion/react';
import { useGameStore } from '../store/gameStore';

interface TitleScreenProps {
  onStartQuickMatch: () => void;
  onOpenMapSelection: () => void;
  onOpenMultiplayer: () => void;
  onOpenCustomization: () => void;
  onOpenSettingsStore: () => void;
  onOpenTechSpec: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartQuickMatch,
  onOpenMapSelection,
  onOpenMultiplayer,
  onOpenCustomization,
  onOpenSettingsStore,
  onOpenTechSpec,
}) => {
  const { openLeaderSkills } = useGameStore();
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-between p-6 sm:p-12 font-['Cairo',sans-serif] dir-rtl select-none text-white overflow-hidden pointer-events-none">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 bg-[#0b1220] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_rgba(79,209,197,0.15),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,_#0b1220_10%,_transparent_50%)]" />
      
      {/* Animated Dust Particles Simulation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <motion.div 
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"
        />
      </div>

      {/* Top Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex items-center justify-between pointer-events-auto z-10"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4fd1c5] to-[#2d3748] flex items-center justify-center shadow-[0_0_25px_rgba(79,209,197,0.3)] border border-[#4fd1c5]/30"
          >
            <Swords className="w-8 h-8 text-[#0b1220]" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-l from-white to-[#9fb3c9]">صقور اليمن</span>
              <span className="text-[10px] px-2.5 py-1 rounded-lg bg-[#4fd1c5]/10 text-[#4fd1c5] border border-[#4fd1c5]/30 font-black tracking-widest uppercase">Premium</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] text-stone-400 font-black tracking-[0.2em] uppercase">Tactical Survival Shooter</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <PWAInstallButton />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openLeaderSkills}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#4fd1c5]/15 border border-[#4fd1c5]/40 hover:bg-[#4fd1c5]/25 text-[#4fd1c5] hover:text-white transition-all backdrop-blur-xl cursor-pointer group shadow-lg"
          >
            <Crown className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black tracking-wider">مهارات القائد</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSettingsStore}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-[#e6eef8] hover:text-white transition-all backdrop-blur-xl cursor-pointer group"
          >
            <Settings className="w-5 h-5 text-[#4fd1c5] group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-xs font-black hidden sm:inline uppercase tracking-wider">الإعدادات</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Hero Branding Section */}
      <div className="relative flex flex-col items-start max-w-3xl space-y-10 my-auto py-12 pointer-events-auto z-10">
        <motion.div 
          initial={{ opacity: 0, x: -40 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut" }} 
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#4fd1c5]/10 border border-[#4fd1c5]/30 text-[#4fd1c5] text-[11px] font-black tracking-wider backdrop-blur-md uppercase shadow-lg shadow-[#4fd1c5]/5">
            <Sparkles className="w-4 h-4" />
            <span>تجربة تكتيكية واقعية معاصرة في تضاريس اليمن</span>
          </div>

          <div className="relative">
            <h1 className="text-6xl sm:text-9xl font-black leading-none tracking-tighter drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              صقور <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fd1c5] via-[#7ee7d0] to-[#4fd1c5] italic">اليمن</span>
            </h1>
            <div className="absolute -right-4 top-0 w-2 h-full bg-gradient-to-b from-[#4fd1c5] to-transparent rounded-full opacity-50" />
          </div>

          <p className="text-stone-400 text-base sm:text-lg leading-relaxed font-medium max-w-xl bg-black/30 p-6 rounded-3xl backdrop-blur-xl border border-white/5 shadow-2xl">
            انخرط في عمليات تكتيكية عالية الدقة تعكس واقع التضاريس اليمنية. من ممرات <span className="text-white font-bold">صنعاء القديمة</span> التاريخية إلى سواحل <span className="text-white font-bold">عدن</span> الاستراتيجية.
          </p>
        </motion.div>

        {/* Main Action Menu Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3, duration: 0.6 }} 
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl"
        >
          <motion.button 
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartQuickMatch} 
            className="sm:col-span-2 flex items-center justify-between p-6 rounded-[2rem] bg-gradient-to-r from-[#4fd1c5] to-[#38b2ac] hover:from-[#7ee7d0] hover:to-[#4fd1c5] text-[#0b1220] font-black shadow-[0_10px_40px_rgba(79,209,197,0.2)] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-black/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                <Play className="w-7 h-7 fill-current" />
              </div>
              <div className="text-right">
                <div className="text-2xl tracking-tighter uppercase">الانتشار السريع</div>
                <div className="text-[11px] font-bold opacity-80 uppercase tracking-widest mt-0.5">Quick Tactical Deployment</div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors">
              <ChevronRight className="w-7 h-7" />
            </div>
          </motion.button>

          <ActionButton 
            onClick={onOpenMapSelection} 
            icon={<Target className="w-6 h-6" />} 
            label="ساحات العمليات" 
            subLabel="اختر البيئة والتضاريس" 
            color="teal"
          />

          <ActionButton 
            onClick={onOpenMultiplayer} 
            icon={<Globe className="w-6 h-6" />} 
            label="العمليات المشتركة" 
            subLabel="تحدّ الأصدقاء أونلاين" 
            color="blue"
          />

          <ActionButton 
            onClick={onOpenCustomization} 
            icon={<UserCheck className="w-6 h-6" />} 
            label="تجهيز المقاتل" 
            subLabel="ترقية العتاد والمهارات" 
            color="purple"
          />

          <ActionButton 
            onClick={onOpenSettingsStore} 
            icon={<Swords className="w-6 h-6" />} 
            label="مركز التدريب" 
            subLabel="تدريب رد الفعل والمناورة" 
            color="emerald"
          />
        </motion.div>

        <motion.button 
          whileHover={{ opacity: 1, x: 5 }}
          onClick={onOpenTechSpec} 
          className="flex items-center gap-2 text-xs text-[#9fb3c9] font-bold hover:text-[#4fd1c5] transition-all underline cursor-pointer pointer-events-auto group"
        >
          <Info className="w-4 h-4" />
          عرض مواصفات المحرك التقنية وتفاصيل التطوير
        </motion.button>
      </div>

      {/* Footer Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative flex justify-between items-end text-[10px] text-stone-500 font-black uppercase tracking-[0.3em] pointer-events-auto z-10"
      >
        <div className="space-y-1">
          <p>© 2026 YEMEN FALCONS: URBAN WARFARE</p>
          <p className="text-stone-700">All Tactical Rights Reserved.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-stone-600">Engine Build</span>
            <span className="text-[#4fd1c5]/50 font-mono">v8.3.5-PRO</span>
          </div>
          <div className="w-12 h-px bg-stone-800" />
          <span className="font-mono bg-white/5 px-2 py-1 rounded border border-white/5">WebGL 2.0 API</span>
        </div>
      </motion.div>
    </div>
  );
};

const ActionButton: React.FC<{ onClick: () => void, icon: React.ReactNode, label: string, subLabel: string, color: string }> = ({ onClick, icon, label, subLabel, color }) => {
  const colorMap: Record<string, string> = {
    teal: 'bg-[#4fd1c5]/10 border-[#4fd1c5]/30 text-[#4fd1c5] shadow-[#4fd1c5]/10',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-blue-500/10',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-purple-500/10',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10',
  };

  return (
    <motion.button 
      whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick} 
      className="flex items-center gap-5 p-5 rounded-[1.5rem] bg-black/40 border border-white/10 text-white font-black backdrop-blur-xl transition-all cursor-pointer group shadow-2xl relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-1 h-full opacity-30 bg-current transition-all group-hover:w-full group-hover:opacity-5`} />
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorMap[color]} transition-transform group-hover:scale-110 duration-300`}>
        {icon}
      </div>
      <div className="text-right flex-1 z-10">
        <div className="text-base tracking-tighter uppercase">{label}</div>
        <div className="text-[9px] text-stone-500 font-bold uppercase tracking-widest mt-0.5 group-hover:text-stone-300 transition-colors">{subLabel}</div>
      </div>
    </motion.button>
  );
};
