import React from 'react';
import { motion } from 'motion/react';
import { X, Cpu } from 'lucide-react';

interface TechArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechArchitectureModal: React.FC<TechArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-stone-900 p-6 text-white"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black">هندسة المشروع</h3>
              <p className="text-xs text-stone-400">React + Vite + Tailwind + Zustand</p>
            </div>
          </div>

          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-stone-300 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black">تقنية الواجهة</h4>
              </div>
            </div>
            <div className="mt-3 text-sm text-stone-300">React 19، Vite، Tailwind CSS، Motion، Lucide، Zustand</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black">محرك العالم</h4>
              </div>
            </div>
            <div className="mt-3 text-sm text-stone-300">يتضمن بنية قابلة للتوسع لدمج Three.js أو WebGL في وقت لاحق.</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black">التعامل مع البيانات</h4>
              </div>
            </div>
            <div className="mt-3 text-sm text-stone-300">ا��طبقات المنفصلة: UI، Store، Data، Logic</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
