import React, { useState } from 'react';
import { Globe, Users, Shield, Copy, Check, Radio, Play, X, Wifi } from 'lucide-react';
import { MultiplayerRoom } from '../types/game';

interface MultiplayerLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: MultiplayerRoom;
  onUpdateRoom: (room: MultiplayerRoom) => void;
  onStartOnlineBattle: () => void;
}

export const MultiplayerLobbyModal: React.FC<MultiplayerLobbyModalProps> = ({
  isOpen,
  onClose,
  room,
  onUpdateRoom,
  onStartOnlineBattle,
}) => {
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [selectedMap, setSelectedMap] = useState<'haraz' | 'hadramout' | 'shibam'>('haraz');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinCode = () => {
    if (inputCode.trim().length >= 4) {
      onUpdateRoom({
        ...room,
        code: inputCode.trim().toUpperCase(),
        isHost: false,
        playerCount: 2,
        status: 'ready',
        latencyMs: 38,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-['Cairo',sans-serif] dir-rtl text-stone-100">
      <div className="w-full max-w-lg bg-stone-900 border border-amber-600/50 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-stone-950 to-amber-950 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-300">غرف اللعب الجماعي أونلاين</h3>
              <p className="text-xs text-stone-400">تزامن التضاريس والعمليات التكتيكية المباشرة (P2P / Lockstep)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-sm">
          
          {/* Room Status Pill */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs text-stone-300">حالة الاتصال بالخادم:</span>
              <span className="text-xs font-bold text-emerald-400">متصل (Ping: {room.latencyMs}ms)</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {room.playerCount} / 2 قائد
            </span>
          </div>

          {/* Current Room Code */}
          <div className="space-y-1.5">
            <label className="text-xs text-stone-400 font-semibold">رمز غرفة المعركة المشتركة:</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-2.5 rounded-xl bg-stone-950 border border-amber-600/40 text-center font-mono text-lg font-black tracking-widest text-amber-300">
                {room.code}
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors font-bold text-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
          </div>

          {/* Join Another Room */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs text-stone-400 font-semibold">أو انضم لغرفة قائد آخر:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="أدخل رمز الغرفة (مثال: YEMEN-88)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-500 text-xs font-mono focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleJoinCode}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors"
              >
                انضمام
              </button>
            </div>
          </div>

          {/* Select Theater of War in Yemen */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs text-stone-400 font-semibold">مسرح العمليات اليمني المختار:</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setSelectedMap('haraz')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedMap === 'haraz'
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:bg-stone-800'
                }`}
              >
                مضائق حراز وعيبان
              </button>

              <button
                onClick={() => setSelectedMap('hadramout')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedMap === 'hadramout'
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:bg-stone-800'
                }`}
              >
                وادي حضرموت السحيق
              </button>

              <button
                onClick={() => setSelectedMap('shibam')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedMap === 'shibam'
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:bg-stone-800'
                }`}
              >
                جروف شبام كوكبان
              </button>
            </div>
          </div>

          {/* Tactical Sync Note */}
          <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 text-[11px] text-stone-400 leading-normal">
            💡 يتم مزامنة جميع الحفر الانفجارية، والخنادق، والمتاريس الحجرية اللحظية بين كلا القائدين عبر تقنية بث الفوارق المضغوطة (Delta Compression)، مع خوارزمية ضباب الحرب (Fog-of-War) لإخفاء كمائن الأودية حتى لحظة الاشتباك.
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-950 border-t border-stone-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-stone-400 hover:text-white transition-colors text-xs font-semibold"
          >
            إلغاء
          </button>

          <button
            onClick={() => {
              onStartOnlineBattle();
              onClose();
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-sm shadow-lg shadow-amber-600/30 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>بدء المعركة المشتركة</span>
          </button>
        </div>

      </div>
    </div>
  );
};
