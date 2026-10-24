import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RPGItem } from '../types/game';
import { X, Backpack, Shield, Zap, Swords, Sparkles } from 'lucide-react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: RPGItem[];
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg font-['Cairo',sans-serif]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-stone-900 border border-white/10 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-right"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-stone-950/60">
            <div className="flex items-center gap-3">
              <Backpack className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-black text-white">حقيبة العتاد والأسلحة (Inventory & Weapons)</h2>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid of Items */}
          <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {items.map((item) => (
              <div 
                key={item.id}
                className="bg-stone-800/40 border border-white/10 hover:border-amber-500/50 rounded-2xl p-4 flex items-start gap-4 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  {item.type === 'weapon' ? <Swords className="w-7 h-7" /> : <Shield className="w-7 h-7" />}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{item.rarity}</span>
                    <span className="text-[10px] bg-white/10 text-stone-300 px-2 py-0.5 rounded-full">{item.type}</span>
                  </div>
                  <h3 className="text-white font-black text-base">{item.nameAr}</h3>
                  <p className="text-stone-300 text-xs">{item.statsDesc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
