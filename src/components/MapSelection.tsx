import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPinned, Mountain, Building2, Shield, ChevronLeft, Zap } from 'lucide-react';

interface MapSelectionProps {
  onSelect: (provinceId: string) => void;
  onBack: () => void;
}

const maps = [
  {
    id: 'sanaa',
    nameAr: 'صنعاء القديمة',
    subtitle: 'ممرات ضيقة وعمارة تاريخية',
    desc: 'القتال في شوارع صنعاء يتطلب دقة عالية وقدرة على المناورة في المساحات المغلقة.',
    accent: 'from-[#4fd1c5]/20 to-[#0b1220]/20',
    icon: Mountain,
    stats: { difficulty: 'عالي', size: 'متوسط' }
  },
  {
    id: 'aden',
    nameAr: 'عدن التاريخية',
    subtitle: 'سواحل مفتوحة ومناطق صناعية',
    desc: 'ميناء عدن يوفر خطوط رؤية واسعة، مما يجعله مثالياً لاستخدام القناصة والدعم الجوي.',
    accent: 'from-blue-600/40 to-cyan-900/20',
    icon: Building2,
    stats: { difficulty: 'متوسط', size: 'كبير' }
  },
  {
    id: 'taiz',
    nameAr: 'تعز الجبلية',
    subtitle: 'مرتفعات شاهقة وحصون أثرية',
    desc: 'تضاريس تعز الجبلية تمنح أفضلية تكتيكية لمن يسيطر على المرتفعات والقمم.',
    accent: 'from-emerald-600/40 to-teal-900/20',
    icon: Shield,
    stats: { difficulty: 'خبير', size: 'متوسط' }
  },
];

export const MapSelection: React.FC<MapSelectionProps> = ({ onSelect, onBack }) => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0b1220] text-white font-['Cairo',sans-serif]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(79,209,197,0.08),_transparent_45%)]" />
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="relative z-10 flex h-full flex-col">
        {/* Header Section */}
        <header className="flex items-center justify-between p-6 sm:p-8 backdrop-blur-md border-b border-white/5">
          <motion.button 
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack} 
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 text-[#4fd1c5]" />
            <span>رجوع للرئيسية</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-[0.2em]">Select AO</p>
              <p className="text-sm font-black text-[#4fd1c5] uppercase">منطقة العمليات</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#4fd1c5]/10 border border-[#4fd1c5]/30 flex items-center justify-center">
              <MapPinned className="h-6 w-6 text-[#4fd1c5]" />
            </div>
          </div>
        </header>

        {/* Main Selection Area */}
        <main className="flex flex-1 flex-col items-center justify-center p-6 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#4fd1c5]/10 border border-[#4fd1c5]/30 text-[#4fd1c5] text-[10px] font-black uppercase tracking-widest shadow-xl">
              <Zap className="w-3 h-3 fill-current" />
              <span>جاهز للانتشار التكتيكي</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter drop-shadow-2xl">اختر ساحة <span className="text-[#4fd1c5]">المعركة</span></h2>
            <p className="max-w-xl text-sm sm:text-base text-stone-400 font-medium leading-relaxed mx-auto">
              كل محافظة في اليمن تقدم تحديات فريدة وتضاريس تتطلب استراتيجيات قتالية مختلفة لضمان البقاء.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3 w-full max-w-6xl">
            {maps.map((map, index) => {
              const Icon = map.icon;

              return (
                <motion.button
                  key={map.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(map.id)}
                  className={`group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br ${map.accent} p-8 text-right flex flex-col justify-between min-h-[420px] transition-all cursor-pointer shadow-2xl`}
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-colors" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-current opacity-5 rounded-full -ml-12 -mb-12 blur-xl" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md transition-transform group-hover:scale-110 duration-500">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="rounded-full bg-black/40 border border-white/5 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#4fd1c5] backdrop-blur-md shadow-inner">
                        Sector {index + 1}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-3xl font-black tracking-tighter group-hover:text-[#4fd1c5] transition-colors">{map.nameAr}</h3>
                      <div className="flex items-center gap-2 text-stone-300 font-bold text-xs uppercase tracking-wider">
                        <span className="w-4 h-px bg-[#4fd1c5]" />
                        <span>{map.subtitle}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 mt-4 translate-y-4 group-hover:translate-y-0 transform">
                        {map.desc}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-500">
                      <span>الصعوبة القصوى</span>
                      <span className="text-[#4fd1c5]">{map.stats.difficulty}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-500">
                      <span>حجم الخريطة</span>
                      <span className="text-white">{map.stats.size}</span>
                    </div>
                    
                    <motion.div 
                      className="mt-2 w-full py-3 bg-[#4fd1c5] text-[#0b1220] rounded-2xl font-black text-xs uppercase tracking-widest text-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      بدء الانتشار
                    </motion.div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </main>

        <footer className="p-8 text-center">
          <p className="text-[9px] text-stone-600 font-black uppercase tracking-[0.4em]">Tactical Map Selection Interface • Secure Connection</p>
        </footer>
      </div>
    </div>
  );
};
