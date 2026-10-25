import React from 'react';
import { Play, Globe, Shield, Settings, ShoppingBag, UserCheck, Sparkles, ChevronRight, Swords, Target } from 'lucide-react';
import { motion } from 'motion/react';

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
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-between p-6 sm:p-12 font-['Cairo',sans-serif] dir-rtl select-none text-white overflow-y-auto pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex items-center justify-between pointer-events-auto z-10"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Swords className="w-7 h-7 text-stone-950" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <span>صقور اليمن</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">v2.4</span>
            </h2>
            <p className="text-[10px] text-stone-400 font-bold tracking-widest uppercase">Yemen Street Fighters</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSettingsStore}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-stone-300 hover:text-white transition-all backdrop-blur-md cursor-pointer"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold hidden sm:inline">الإعدادات المتجر</span>
          </button>
        </div>
      </motion.div>

      <div className="relative flex flex-col items-start max-w-2xl space-y-8 my-auto py-8 pointer-events-auto z-10">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>تجربة قتالية واقعية معاصرة في كل محافظات اليمن</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black leading-none tracking-tighter drop-shadow-2xl">
            نزاع <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600">الشوارع</span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-medium max-w-xl bg-stone-900/40 p-4 rounded-2xl backdrop-blur-md border border-white/5">
            ملحمة قتالية ثلاثية الأبعاد تعكس واقع الشارع اليمني، من شوارع صنعاء القديمة وميناء عدن إلى جبال تعز.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          <button onClick={onStartQuickMatch} className="sm:col-span-2 flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-black">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-950/10 flex items-center justify-center">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div className="text-right">
                <div className="text-lg">البدء السريع</div>
                <div className="text-[10px] font-bold opacity-75">مباراة سريعة في ساحة عشوائية</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6" />
          </button>

          <button onClick={onOpenMapSelection} className="flex items-center gap-3 p-4 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-white/10 text-white font-bold backdrop-blur-md transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Target className="w-5 h-5" />
            </div>
            <div className="text-right flex-1">
              <div className="text-sm">معارك المناطق</div>
              <div className="text-[10px] text-stone-400 font-normal">اختر المحافظة والبيئة</div>
            </div>
          </button>

          <button onClick={onOpenMultiplayer} className="flex items-center gap-3 p-4 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-white/10 text-white font-bold backdrop-blur-md transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div className="text-right flex-1">
              <div className="text-sm">لعب جماعي أونلاين</div>
              <div className="text-[10px] text-stone-400 font-normal">تحدّ الأصدقاء أونلاين</div>
            </div>
          </button>

          <button onClick={onOpenCustomization} className="flex items-center gap-3 p-4 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-white/10 text-white font-bold backdrop-blur-md transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="text-right flex-1">
              <div className="text-sm">تخصيص ال��قاتل</div>
              <div className="text-[10px] text-stone-400 font-normal">الملابس والعتاد اليومي</div>
            </div>
          </button>

          <button onClick={onOpenSettingsStore} className="flex items-center gap-3 p-4 rounded-2xl bg-stone-900/80 hover:bg-stone-800 border border-white/10 text-white font-bold backdrop-blur-md transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="text-right flex-1">
              <div className="text-sm">المتجر والتطويرات</div>
              <div className="text-[10px] text-stone-400 font-normal">ترقية المهارات والمظهر</div>
            </div>
          </button>
        </motion.div>

        <button onClick={onOpenTechSpec} className="text-xs text-stone-500 hover:text-stone-300 transition-colors underline cursor-pointer pointer-events-auto">
          عرض مواصفات المحرك التقنية وتفاصيل التطوير
        </button>
      </div>

      <div className="relative flex justify-between items-center text-xs text-stone-500 pointer-events-auto z-10">
        <p>© 2026 صقور اليمن: نزاع الشوارع. جميع الحقوق محفوظة.</p>
        <p className="font-mono">WebGL 2.0 • 3D Fighting Engine</p>
      </div>
    </div>
  );
};
