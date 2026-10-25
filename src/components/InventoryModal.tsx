import React from 'react';
import { motion } from 'motion/react';
import { Backpack, X, Star } from 'lucide-react';
import type { RPGItem } from '../types/game';

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
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-stone-900 p-6 text-white"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400">
              <Backpack className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black">المخزون</h3>
              <p className="text-xs text-stone-400">الأسلحة والعتاد المخصص</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-stone-300 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-3xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-amber-300">
                  <Star className="h-5 w-5" />
                </div>

                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-black ${
                    item.rarity === 'legendary'
                      ? 'bg-amber-500/20 text-amber-400'
                      : item.rarity === 'rare'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-stone-500/20 text-stone-300'
                  }`}
                >
                  {item.rarity}
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-black">{item.nameAr}</h4>
                <p className="text-sm text-stone-300">{item.statsDesc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
