import React, { useState } from 'react';
import { Download, Smartphone, X, QrCode, Copy, Check, Share2, ShieldCheck, Wifi, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../game/audio';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [platformTab, setPlatformTab] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');

  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://yemen-falcons.app';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      sound.playSelect();
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeInstall = async () => {
    sound.playSelect();
    if (isInstallable) {
      await install();
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          sound.playSelect();
          setIsOpen(true);
        }}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#4fd1c5]/20 to-blue-500/20 border border-[#4fd1c5]/40 hover:border-[#4fd1c5] text-white transition-all backdrop-blur-xl cursor-pointer group shadow-lg"
      >
        <Smartphone className="w-5 h-5 text-[#4fd1c5] group-hover:scale-110 transition-transform" />
        <span className="text-xs font-black tracking-wider">تثبيت حزمة الجوال</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 sm:p-6 font-['Cairo',sans-serif] text-right rtl">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="w-full max-w-xl rounded-[2.5rem] bg-[#0b1220] border border-[#4fd1c5]/30 p-6 sm:p-8 shadow-[0_0_80px_rgba(79,209,197,0.25)] text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-[#4fd1c5] via-blue-500 to-transparent" />
              
              <button 
                onClick={() => {
                  sound.playClick();
                  setIsOpen(false);
                }}
                className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4fd1c5] to-blue-600 flex items-center justify-center text-[#0b1220] shadow-[0_0_20px_rgba(79,209,197,0.4)]">
                  <Download className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">حزمة اللعبة للجوال</h3>
                  <p className="text-xs text-[#4fd1c5] font-bold tracking-wider">Mobile App Package (PWA Standalone)</p>
                </div>
              </div>

              {/* Package Specs Cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                  <div className="flex justify-center mb-1"><ShieldCheck className="w-4 h-4 text-[#4fd1c5]" /></div>
                  <p className="text-[9px] text-stone-400 font-bold uppercase">النسخة</p>
                  <p className="text-xs font-black text-white">v1.0.0 Stable</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                  <div className="flex justify-center mb-1"><Wifi className="w-4 h-4 text-green-400" /></div>
                  <p className="text-[9px] text-stone-400 font-bold uppercase">اللعب بدون إنترنت</p>
                  <p className="text-xs font-black text-green-400">Offline Ready</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
                  <div className="flex justify-center mb-1"><Sparkles className="w-4 h-4 text-yellow-400" /></div>
                  <p className="text-[9px] text-stone-400 font-bold uppercase">نوع الحزمة</p>
                  <p className="text-xs font-black text-white">WebAPK PWA</p>
                </div>
              </div>

              {/* Native Install Button if browser supports beforeinstallprompt */}
              {isInstallable && !isInstalled && (
                <div className="mb-6">
                  <button
                    onClick={handleNativeInstall}
                    className="w-full py-4 rounded-2xl bg-[#4fd1c5] hover:bg-[#4fd1c5]/90 text-[#0b1220] font-black text-base shadow-[0_0_30px_rgba(79,209,197,0.4)] transition-all flex items-center justify-center gap-3 active:scale-98"
                  >
                    <Download className="w-5 h-5" />
                    <span>تثبيت فوري ومباشر على هذا الجهاز (1-Click Install)</span>
                  </button>
                </div>
              )}

              {/* Platform Instructions Selector */}
              <div className="bg-white/5 p-1 rounded-2xl flex gap-1 mb-6 border border-white/5">
                <button
                  onClick={() => setPlatformTab('android')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                    platformTab === 'android' ? 'bg-[#4fd1c5] text-[#0b1220] shadow-md' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  أجهزة أندرويد (Android APK)
                </button>
                <button
                  onClick={() => setPlatformTab('ios')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                    platformTab === 'ios' ? 'bg-[#4fd1c5] text-[#0b1220] shadow-md' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  أجهزة آيفون (Apple iOS)
                </button>
              </div>

              {/* Instructions Content */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-5 mb-6 space-y-3 text-xs leading-relaxed">
                {platformTab === 'android' ? (
                  <>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#4fd1c5]/20 text-[#4fd1c5] font-black flex items-center justify-center shrink-0">1</span>
                      <p className="text-stone-300">افتح هذا الرابط على متصفح <b>Chrome</b> أو <b>Samsung Internet</b> على هاتفك.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#4fd1c5]/20 text-[#4fd1c5] font-black flex items-center justify-center shrink-0">2</span>
                      <p className="text-stone-300">اضغط على زر <b>القائمة الثلاثية (⋮)</b> بأعلى المتصفح واختر <b>تثبيت التطبيق (Install App)</b>.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#4fd1c5]/20 text-[#4fd1c5] font-black flex items-center justify-center shrink-0">3</span>
                      <p className="text-stone-300">سيتم إنشاء أيقونة اللعبة مباشرة على شاشة جوالك لتعمل بكامل الشاشة وبدون إنترنت.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#4fd1c5]/20 text-[#4fd1c5] font-black flex items-center justify-center shrink-0">1</span>
                      <p className="text-stone-300">افتح الرابط في متصفح <b>Safari</b> على جهاز iPhone أو iPad.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#4fd1c5]/20 text-[#4fd1c5] font-black flex items-center justify-center shrink-0">2</span>
                      <p className="text-stone-300">اضغط على زر <b>المشاركة (Share)</b> في أسفل شاشة المتصفح.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#4fd1c5]/20 text-[#4fd1c5] font-black flex items-center justify-center shrink-0">3</span>
                      <p className="text-stone-300">اختر <b>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</b> ثم اضغط إضافة.</p>
                    </div>
                  </>
                )}
              </div>

              {/* Share & Copy Link Section */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-stone-300 text-xs font-mono truncate select-all">
                  {shareUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-black text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-[#4fd1c5]" />}
                  <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
