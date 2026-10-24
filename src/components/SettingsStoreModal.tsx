import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Volume2, VolumeX, Shield, Zap, ShoppingBag, X, Check } from 'lucide-react';
import { sound } from '../game/audio';

interface SettingsStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsStoreModal: React.FC<SettingsStoreModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'store'>('settings');
  const [graphicsQuality, setGraphicsQuality] = useState<'ultra' | 'high' | 'balanced'>('ultra');
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl font-['Cairo',sans-serif] dir-rtl select-none">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-2xl bg-stone-900 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-white space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black">الإعدادات والمتجر</h3>
              <p className="text-xs text-stone-400">تحكم بجودة الرسومات، الصوت، وترقيات المقاتل</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-amber-500 text-stone-950 shadow-lg' : 'text-stone-400 hover:text-white'
            }`}
          >
            إعدادات اللعبة والصوت
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'store' ? 'bg-amber-500 text-stone-950 shadow-lg' : 'text-stone-400 hover:text-white'
            }`}
          >
            متجر التطويرات والترقيات
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'settings' ? (
          <div className="space-y-6 py-2">
            {/* Audio Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-black text-sm">مؤثرات الصوت والموسيقى</h4>
                  <p className="text-xs text-stone-400">تشغيل الأصوات البيئية وأصوات المعارك</p>
                </div>
              </div>
              <button
                onClick={handleToggleMute}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  !isMuted ? 'bg-emerald-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                }`}
              >
                {!isMuted ? 'مفعل' : 'صامت'}
              </button>
            </div>

            {/* Graphics Quality */}
            <div className="space-y-3">
              <h4 className="font-black text-sm text-stone-300">جودة الرسومات الثلاثية الأبعاد (Graphics Quality)</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'balanced', nameAr: 'متوازن (أداء عالٍ)', desc: '60 إطار / ثانية' },
                  { id: 'high', nameAr: 'عالي الواقعية', desc: 'ظلال سينمائية' },
                  { id: 'ultra', nameAr: 'فائق الدقة (Ultra)', desc: 'واقعية سينمائية كاملة' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGraphicsQuality(g.id as any)}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                      graphicsQuality === g.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-white/5 border-white/5 text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-black text-sm">{g.nameAr}</div>
                    <div className="text-[10px] opacity-70 mt-1">{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {[
              { title: 'تقوية الهجوم الثقيل', cost: '500 نقطة صمود', desc: 'يزيد ضرر الهجوم الثقيل بنسبة 25%', icon: <Zap className="w-5 h-5 text-amber-400" /> },
              { title: 'درع الصمود التكتيكي', cost: '750 نقطة صمود', desc: 'يقلل الضرر المتقبل بنسبة 20%', icon: <Shield className="w-5 h-5 text-blue-400" /> },
              { title: 'رشاقة الحركة السريعة', cost: '400 نقطة صمود', desc: 'يسرع استجابة المراوغة والتحرك', icon: <ShoppingBag className="w-5 h-5 text-purple-400" /> },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-sm">{item.title}</h4>
                    <p className="text-xs text-stone-400">{item.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => sound.playSelect()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all cursor-pointer"
                >
                  {item.cost}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-8 py-3.5 rounded-2xl bg-white text-stone-950 font-black hover:bg-amber-400 transition-all cursor-pointer"
          >
            تم وخروج
          </button>
        </div>
      </motion.div>
    </div>
  );
};
