import React from 'react';
import { motion } from 'motion/react';
import { X, Users, Globe } from 'lucide-react';

interface MultiplayerLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: {
    code: string;
    isHost: boolean;
    playerCount: number;
    status: 'waiting' | 'ready' | 'battling';
    latencyMs: number;
    syncedDeltasCount: number;
  };
  onUpdateRoom: (room: {
    code: string;
    isHost: boolean;
    playerCount: number;
    status: 'waiting' | 'ready' | 'battling';
    latencyMs: number;
    syncedDeltasCount: number;
  }) => void;
  onStartOnlineBattle: () => void;
}

export const MultiplayerLobbyModal: React.FC<MultiplayerLobbyModalProps> = ({
  isOpen,
  onClose,
  room,
  onUpdateRoom,
  onStartOnlineBattle,
}) => {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-black">غرفة متعددة</h3>
              <p className="text-xs text-stone-400">تجهيز الانضمام عبر الإنترنت</p>
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
                <h4 className="text-lg font-black">رمز الغرفة</h4>
                <div className="text-2xl font-black">{room.code}</div>
              </div>
              <div className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-400">
                {room.status}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black">التأخير</h4>
              </div>
              <div className="text-lg font-black text-amber-400">{room.latencyMs} ms</div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black">عد�� اللاعبين</h4>
              </div>
              <div className="text-lg font-black text-emerald-400">{room.playerCount}</div>
            </div>
          </div>

          <button
            onClick={onStartOnlineBattle}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-4 text-lg font-black text-white"
          >
            بدء المعركة عبر الإنترنت
          </button>
        </div>
      </motion.div>
    </div>
  );
};
