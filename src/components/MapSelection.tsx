import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, ChevronRight, Map as MapIcon, Info, Mountain, Building2, Waves, Compass } from 'lucide-react';
import { sound } from '../game/audio';

interface Province {
  id: string;
  nameAr: string;
  nameEn: string;
  description: string;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  type: 'حضري' | 'جبلي' | 'ساحلي' | 'صحراوي' | 'أرخبيل';
  climate: string;
  icon: React.ReactNode;
}

const provinces: Province[] = [
  {
    id: 'sanaa',
    nameAr: 'صنعاء القديمة',
    nameEn: 'Old Sana\'a',
    description: 'القتال بين المباني التاريخية ذات الطراز المعماري الفريد والأسواق الشعبية العريقة.',
    difficulty: 'سهل',
    type: 'حضري',
    climate: 'معتدل بارد',
    icon: <Building2 className="w-5 h-5 text-amber-500" />
  },
  {
    id: 'aden',
    nameAr: 'ميناء عدن',
    nameEn: 'Aden Port',
    description: 'ساحة قتال ساحلية مفتوحة مع إطلالة على خليج عدن والتلال البركانية التاريخية.',
    difficulty: 'متوسط',
    type: 'ساحلي',
    climate: 'حار رطب',
    icon: <Waves className="w-5 h-5 text-blue-400" />
  },
  {
    id: 'taiz',
    nameAr: 'قلعة القاهرة - تعز',
    nameEn: 'Cairo Castle - Taiz',
    description: 'معارك مرتفعة على سفوح جبل صبر الشاهق المطل على مدينة تعز الحالمة.',
    difficulty: 'صعب',
    type: 'جبلي',
    climate: 'معتدل',
    icon: <Mountain className="w-5 h-5 text-stone-300" />
  },
  {
    id: 'hadramout',
    nameAr: 'وادي حضرموت',
    nameEn: 'Wadi Hadramout',
    description: 'بيئة صحراوية رملية فريدة بين ناطحات السحاب الطينية التاريخية في شبام.',
    difficulty: 'متوسط',
    type: 'صحراوي',
    climate: 'جاف حار',
    icon: <Compass className="w-5 h-5 text-amber-600" />
  },
  {
    id: 'hudaydah',
    nameAr: 'ساحل البحر الأحمر - الحديدة',
    nameEn: 'Al Hudaydah Coast',
    description: 'مواجهات تكتيكية على السواحل الغربية الحارة وسط أشجار النخيل وأمواج البحر.',
    difficulty: 'متوسط',
    type: 'ساحلي',
    climate: 'حار جداً',
    icon: <Waves className="w-5 h-5 text-cyan-400" />
  },
  {
    id: 'socotra',
    nameAr: 'أرخبيل سقطرى',
    nameEn: 'Socotra Island',
    description: 'قتال استثنائي وسط أشجار دم الأخضر الفريدة والطبيعة البكر الساحرة.',
    difficulty: 'صعب',
    type: 'أرخبيل',
    climate: 'مدئي استوائي',
    icon: <Mountain className="w-5 h-5 text-emerald-400" />
  },
  {
    id: 'saada',
    nameAr: 'مرتفعات صعدة',
    nameEn: 'Sa\'ada Highlands',
    description: 'تضاريس جبلية وعرة وممرات صخرية قاسية تختبر مهارات التحمل والقتال.',
    difficulty: 'صعب',
    type: 'جبلي',
    climate: 'جبلي بارد',
    icon: <Mountain className="w-5 h-5 text-red-400" />
  },
  {
    id: 'marib',
    nameAr: 'عرش بلقيس - مأرب',
    nameEn: 'Throne of Bilqis - Marib',
    description: 'معركة تاريخية وسط الآثار العظيمة وسد مأرب التاريخي والمعاصر.',
    difficulty: 'متوسط',
    type: 'صحراوي',
    climate: 'صحراوي دافئ',
    icon: <Building2 className="w-5 h-5 text-amber-400" />
  }
];

interface MapSelectionProps {
  onSelect: (provinceId: string) => void;
  onBack: () => void;
}

export const MapSelection: React.FC<MapSelectionProps> = ({ onSelect, onBack }) => {
  const [selectedId, setSelectedId] = useState<string>(provinces[0].id);

  const currentProvince = provinces.find(p => p.id === selectedId) || provinces[0];

  const handleProvinceClick = (id: string) => {
    setSelectedId(id);
    sound.playSelect();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col font-['Cairo',sans-serif] bg-stone-950/90 backdrop-blur-2xl text-white select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 sm:p-10 border-b border-white/5">
        <div className="space-y-1">
          <h2 className="text-3xl sm:text-4xl font-black flex items-center gap-3">
            <MapIcon className="text-amber-500 w-8 h-8 sm:w-10 sm:h-10" />
            <span>خريطة المحافظات والبيئات اليمنية</span>
          </h2>
          <p className="text-stone-400 text-sm sm:text-base">اختر مسرح المعركة من بين مختلف تضاريس ومحافظات اليمن</p>
        </div>
        
        <button 
          onClick={onBack}
          className="px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-stone-300 hover:text-white font-bold cursor-pointer"
        >
          رجوع للقائمة
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-6 sm:p-10 max-w-7xl mx-auto w-full">
        
        {/* Interactive 3D Map Grid / List */}
        <div className="w-full lg:w-3/5 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {provinces.map((p) => {
            const isSelected = selectedId === p.id;
            return (
              <motion.button
                key={p.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleProvinceClick(p.id)}
                className={`p-4 rounded-3xl border text-right transition-all flex flex-col justify-between gap-4 cursor-pointer relative overflow-hidden ${
                  isSelected 
                    ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30 shadow-2xl shadow-amber-500/10' 
                    : 'bg-stone-900/60 border-white/5 hover:bg-stone-800/80 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isSelected ? 'bg-amber-500 text-stone-950' : 'bg-white/5 text-stone-300'}`}>
                    {p.icon}
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                    p.difficulty === 'سهل' ? 'bg-green-500/20 text-green-400' :
                    p.difficulty === 'متوسط' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {p.difficulty}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black">{p.nameAr}</h4>
                  <p className="text-xs text-stone-400 font-mono">{p.nameEn}</p>
                </div>

                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Selected Province Live Preview Panel */}
        <div className="w-full lg:w-2/5 bg-stone-900/80 border border-white/10 p-6 sm:p-8 rounded-[2.5rem] backdrop-blur-xl flex flex-col justify-between shadow-2xl space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProvince.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-black uppercase tracking-wider">
                  بيئة {currentProvince.type}
                </span>
                <span className="text-stone-400 text-xs font-mono">{currentProvince.climate}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl sm:text-4xl font-black">{currentProvince.nameAr}</h3>
                <h4 className="text-base text-stone-400 font-medium italic">{currentProvince.nameEn}</h4>
              </div>

              <p className="text-stone-300 leading-relaxed text-sm sm:text-base bg-black/30 p-4 rounded-2xl border border-white/5">
                {currentProvince.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-stone-400 block mb-1">مستوى التحدي</span>
                  <span className="text-base font-black text-amber-400">{currentProvince.difficulty}</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-stone-400 block mb-1">جاهزية الساحة</span>
                  <span className="text-base font-black text-emerald-400">100% متاح</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={() => onSelect(selectedId)}
            className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-black text-xl shadow-xl shadow-amber-600/30 transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>انطلق إلى المعركة</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
