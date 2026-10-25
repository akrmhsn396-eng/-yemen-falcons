import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPinned, Mountain, Building2, Shield } from 'lucide-react';

interface MapSelectionProps {
  onSelect: (provinceId: string) => void;
  onBack: () => void;
}

const maps = [
  {
    id: 'sanaa',
    nameAr: 'صنعاء القديمة',
    subtitle: 'أسوار وجبال ومنحدرات',
    accent: 'from-amber-500/20 to-yellow-500/10',
    icon: Mountain,
  },
  {
    id: 'aden',
    nameAr: 'عدن التاريخية',
    subtitle: 'سواحل وممرات بضائع',
    accent: 'from-blue-500/20 to-cyan-500/10',
    icon: Building2,
  },
  {
    id: 'taiz',
    nameAr: 'تعز الجبلية',
    subtitle: 'ممرات ضيقة ومواقع الدفاع',
    accent: 'from-emerald-500/20 to-green-500/10',
    icon: Shield,
  },
];

export const MapSelection: React.FC<MapSelectionProps> = ({ onSelect, onBack }) => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0b1220] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),_transparent_35%)]" />

      <div className="relative z-10 flex h-full flex-col">
        <header className="flex items-center justify-between p-5">
          <button onClick={onBack} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black">
            <ArrowLeft className="h-4 w-4" />
            العودة
          </button>

          <div className="flex items-center gap-2 text-amber-400">
            <MapPinned className="h-5 w-5" />
            <span className="text-sm font-black">اختيار الخريطة</span>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-black md:text-5xl">اختر منطقة القتال</h2>
              <p className="mt-2 text-sm text-stone-300">
                كل منطقة تضفي طابعًا جديدًا على القتال، الدفاع، والتمويه.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {maps.map((map) => {
                const Icon = map.icon;

                return (
                  <motion.button
                    key={map.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(map.id)}
                    className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${map.accent} p-5 text-right`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent_40%)]" />

                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <Icon className="h-6 w-6 text-white" />
                      </div>

                      <div className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                        Pro Zone
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-xl font-black">{map.nameAr}</h3>
                      <p className="text-sm text-stone-300">{map.subtitle}</p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-xs text-stone-400">التعقيد</div>
                      <div className="text-xs font-black text-amber-400">متوسط</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
