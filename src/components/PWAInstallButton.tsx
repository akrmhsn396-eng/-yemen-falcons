import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { motion, AnimatePresence } from 'motion/react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={install}
        className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#4fd1c5] text-[#0b1220] font-black shadow-[0_0_20px_rgba(79,209,197,0.3)] transition-all cursor-pointer group"
      >
        <Download className="w-5 h-5 group-hover:bounce" />
        <span className="text-xs uppercase tracking-wider">تحميل اللعبة</span>
      </motion.button>
    );
  }

  if (isIOS) {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-stone-300 hover:text-white transition-all backdrop-blur-xl cursor-pointer"
        >
          <Smartphone className="w-5 h-5 text-[#4fd1c5]" />
          <span className="text-xs font-black uppercase tracking-wider">تثبيت على iPhone</span>
        </motion.button>

        <AnimatePresence>
          {showIOSGuide && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 font-['Cairo',sans-serif]">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm rounded-[2.5rem] bg-[#0b1220] border border-[#4fd1c5]/20 p-8 shadow-2xl text-white relative"
              >
                <button 
                  onClick={() => setShowIOSGuide(false)}
                  className="absolute top-6 left-6 text-stone-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <h3 className="text-2xl font-black mb-6 text-right">تثبيت صقور اليمن</h3>
                <div className="space-y-6 text-right">
                  <div className="flex flex-row-reverse items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center text-[#4fd1c5] font-black shrink-0">1</div>
                    <p className="text-stone-300 leading-relaxed pt-1">اضغط على أيقونة **مشاركة (Share)** في شريط أدوات متصفح Safari.</p>
                  </div>
                  <div className="flex flex-row-reverse items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#4fd1c5]/10 flex items-center justify-center text-[#4fd1c5] font-black shrink-0">2</div>
                    <p className="text-stone-300 leading-relaxed pt-1">اختر **إضافة إلى الشاشة الرئيسية (Add to Home Screen)** من القائمة.</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="mt-10 w-full rounded-2xl bg-white/5 border border-white/10 py-4 text-sm font-black text-stone-200 hover:bg-white/10 transition-all"
                >
                  فهمت، شكراً
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return null;
};
