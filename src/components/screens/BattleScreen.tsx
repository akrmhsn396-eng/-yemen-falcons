import React from 'react';
import { motion } from 'motion/react';
import { Crosshair, Shield, Swords, Trophy, Backpack, ListTodo, MapPinned, Zap } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const BattleScreen: React.FC = () => {
  const {
    totalXP,
    playerSkills,
    quests,
    inventory,
    dailyChallenges,
    openQuestLog,
    openInventory,
    openDailyChallenges,
    openCustomization,
  } = useGameStore();

  const playerLevel = Math.floor(totalXP / 1000) + 1;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_center,_#2b2a2a_0%,_#111827_35%,_#020617_100%)] text-white">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(234,179,8,0.18),_transparent_40%)]" />

      <div className="relative z-10 flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-white/10 bg-black/20 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-2 text-amber-400">
              <Shield className="h-5 w-5" />
            </div>

            <div>
              <div className="text-xs text-stone-400">المستوى الحالي</div>
              <div className="text-xl font-black">لـ {playerLevel}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-black">{totalXP} XP</span>
          </div>
        </header>

        <main className="flex flex-1 gap-4 p-4">
          <div className="flex flex-1 flex-col gap-4">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-stone-400">منطقة القتال</div>
                  <h2 className="text-2xl font-black">صنعاء القديمة</h2>
                </div>

                <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-400">
                  Online Squad Ready
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-stone-300">
                    <Swords className="h-4 w-4 text-amber-400" />
                    الهجوم
                  </div>
                  <div className="mt-2 text-xl font-black">{playerSkills.aimAccuracy * 10 + 25}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-stone-300">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    الدفاع
                  </div>
                  <div className="mt-2 text-xl font-black">{playerSkills.tacticalDefense * 12 + 30}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-stone-300">
                    <Crosshair className="h-4 w-4 text-blue-400" />
                    السرعة
                  </div>
                  <div className="mt-2 text-xl font-black">{playerSkills.movementSpeed * 10 + 20}</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPinned className="h-4 w-4 text-amber-400" />
                  <span className="text-lg font-black">تجربة القتال</span>
                </div>

                <button onClick={() => openCustomization()} className="rounded-2xl bg-amber-500 px-4 py-2 text-xs font-black text-stone-950">
                  تخصيص
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-stone-400">الهدف الحالي</div>
                  <div className="mt-2 text-lg font-black">
                    {quests[0]?.titleAr ?? 'لا توجد مهام'}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-stone-400">الأسلحة المتاحة</div>
                  <div className="mt-2 text-lg font-black">
                    {inventory[0]?.nameAr ?? 'لا توجد أسلحة'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <aside className="w-full max-w-sm space-y-4">
            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-amber-400" />
                  <span className="text-lg font-black">المهام</span>
                </div>

                <button onClick={openQuestLog} className="rounded-xl bg-white/5 px-3 py-2 text-xs font-black text-stone-200">
                  تفاصيل
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {quests.slice(0, 3).map((quest) => (
                  <div key={quest.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-sm font-black">{quest.titleAr}</div>
                    <div className="text-xs text-stone-300">
                      {quest.isCompleted ? 'مكتملة' : 'قيد التنفيذ'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Backpack className="h-4 w-4 text-violet-400" />
                  <span className="text-lg font-black">المخزون</span>
                </div>

                <button onClick={openInventory} className="rounded-xl bg-white/5 px-3 py-2 text-xs font-black text-stone-200">
                  عرض
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {inventory.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-sm font-black">{item.nameAr}</div>
                    <div className="text-xs text-stone-300">{item.rarity}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-emerald-400" />
                  <span className="text-lg font-black">التحديات</span>
                </div>

                <button onClick={openDailyChallenges} className="rounded-xl bg-white/5 px-3 py-2 text-xs font-black text-stone-200">
                  عرض
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {dailyChallenges.slice(0, 2).map((challenge) => (
                  <div key={challenge.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-sm font-black">{challenge.titleAr}</div>
                    <div className="text-xs text-stone-300">
                      {challenge.progress}/{challenge.requirement}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};
