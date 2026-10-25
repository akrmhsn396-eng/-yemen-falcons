import React from 'react';
import { motion } from 'motion/react';
import { X, ShoppingBag, Settings2 } from 'lucide-react';

interface SettingsStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsStoreModal: React.FC<SettingsStoreModalProps> = ({ isOpen, onClose }) => {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black">المتجر والإعدادات</h3>
              <p className="text-xs text-stone-400">التعديلات والملحقات</p>
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
                <h4 className="text-lg font-black">حزمة أساسية</h4>
              </div>
              <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-400">150 XP</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black">ترقية القناع التكتيكي</h4>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400">300 XP</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
