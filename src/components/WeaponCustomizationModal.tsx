import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Crosshair, Zap, Swords, Shield, Target, 
  ChevronLeft, ChevronRight, Check, Lock, ArrowUpCircle, Settings,
  Eye, ZapOff, Sparkles, Radio, Cpu
} from 'lucide-react';
import { useGameStore, ALL_ATTACHMENTS } from '../store/gameStore';
import { sound } from '../game/audio';

export const WeaponCustomizationModal: React.FC = () => {
  const { 
    isWeaponCustomizationOpen, 
    closeWeaponCustomization,
    weaponUpgrades,
    tacticalPoints,
    purchaseAttachment,
    equipAttachment,
    upgradeWeaponStat,
    inventory
  } = useGameStore();

  const [selectedWeaponId, setSelectedWeaponId] = useState<string>('i1'); // Default to AKM

  if (!isWeaponCustomizationOpen) return null;

  const weapons = inventory.filter(i => i.type === 'weapon');
  const selectedWeapon = weapons.find(w => w.id === selectedWeaponId);
  const upgradeState = weaponUpgrades[selectedWeaponId];

  const handleUpgradeStat = (stat: 'reloadSpeed' | 'damage' | 'accuracy') => {
    sound.playSelect();
    upgradeWeaponStat(selectedWeaponId, stat);
  };

  const handleAttachmentClick = (attachmentId: string) => {
    const isUnlocked = upgradeState.unlockedAttachments.includes(attachmentId);
    if (isUnlocked) {
      equipAttachment(selectedWeaponId, attachmentId);
    } else {
      purchaseAttachment(selectedWeaponId, attachmentId);
    }
    sound.playSelect();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-[#0b1220]/90 backdrop-blur-xl font-['Cairo',sans-serif] text-right rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-6xl h-[85vh] bg-[#0b1220] border border-[#4fd1c5]/30 rounded-[3rem] shadow-[0_0_100px_rgba(79,209,197,0.15)] overflow-hidden flex flex-col"
      >
        {/* Decorative Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(79,209,197,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(79,209,197,0.1)_1px,transparent_1px)] bg-[length:40px_40px]" />
        
        {/* Header */}
        <div className="relative p-8 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#4fd1c5]/10 border border-[#4fd1c5]/30 flex items-center justify-center text-[#4fd1c5]">
              <Settings className="w-8 h-8 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter">تطوير الترسانة</h2>
              <p className="text-[#4fd1c5] text-xs font-black uppercase tracking-[0.3em]">Weapon Customization Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="bg-black/40 px-6 py-3 rounded-2xl border border-[#4fd1c5]/40 flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-stone-500 font-black uppercase">النقاط التكتيكية المتاحة</p>
                <p className="text-[#4fd1c5] text-2xl font-black tabular-nums tracking-tighter">{tacticalPoints} <span className="text-sm">PT</span></p>
              </div>
              <Cpu className="w-8 h-8 text-[#4fd1c5] opacity-50" />
            </div>
            <button 
              onClick={closeWeaponCustomization}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar: Weapon Selection */}
          <div className="w-80 border-l border-white/10 bg-black/20 p-6 space-y-4 overflow-y-auto">
            <h3 className="text-stone-500 text-[10px] font-black uppercase tracking-widest px-2 mb-4">اختر السلاح</h3>
            {weapons.map(weapon => (
              <button
                key={weapon.id}
                onClick={() => setSelectedWeaponId(weapon.id)}
                className={`w-full group relative p-5 rounded-2xl border transition-all flex items-center gap-4 ${
                  selectedWeaponId === weapon.id 
                    ? 'bg-[#4fd1c5]/10 border-[#4fd1c5] shadow-[0_0_20px_rgba(79,209,197,0.1)]' 
                    : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${selectedWeaponId === weapon.id ? 'bg-[#4fd1c5] text-black' : 'bg-white/5 text-stone-500'}`}>
                  {weapon.id === 'i1' ? <Swords className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black tracking-tight ${selectedWeaponId === weapon.id ? 'text-white' : 'text-stone-400'}`}>{weapon.nameAr}</p>
                  <p className="text-[10px] text-stone-600 font-bold uppercase">{weapon.rarity}</p>
                </div>
                {selectedWeaponId === weapon.id && (
                  <motion.div layoutId="activeWeapon" className="absolute left-4 top-1/2 -translate-y-1/2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4fd1c5] shadow-[0_0_10px_#4fd1c5]" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-10 overflow-y-auto space-y-12">
            {/* Weapon Preview Area */}
            <div className="relative h-64 bg-black/40 rounded-[2.5rem] border border-white/5 flex items-center justify-center group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#4fd1c5]/5 to-transparent" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                 <motion.div 
                   key={selectedWeaponId}
                   initial={{ x: 50, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="text-8xl filter drop-shadow-[0_0_30px_rgba(79,209,197,0.3)]"
                 >
                   {selectedWeaponId === 'i1' ? '🔫' : '🚀'}
                 </motion.div>
                 <div className="text-center">
                    <h4 className="text-4xl font-black text-white tracking-tighter mb-2">{selectedWeapon?.nameAr}</h4>
                    <p className="text-stone-400 text-sm font-medium">{selectedWeapon?.statsDesc}</p>
                 </div>
              </div>
              {/* Stats Overlay */}
              <div className="absolute bottom-6 right-10 flex gap-8">
                <StatPreview label="الضرر" value={upgradeState.levels.damage} icon={<Sparkles className="w-4 h-4" />} />
                <StatPreview label="الدقة" value={upgradeState.levels.accuracy} icon={<Crosshair className="w-4 h-4" />} />
                <StatPreview label="التلقيم" value={upgradeState.levels.reloadSpeed} icon={<Zap className="w-4 h-4" />} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12">
              {/* Upgrades Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <ArrowUpCircle className="w-5 h-5 text-[#4fd1c5]" />
                  <h3 className="text-xl font-black text-white">التحسينات الأساسية</h3>
                </div>
                <UpgradeRow 
                  label="قوة النيران" 
                  level={upgradeState.levels.damage} 
                  cost={upgradeState.levels.damage * 200}
                  onUpgrade={() => handleUpgradeStat('damage')}
                  canAfford={tacticalPoints >= upgradeState.levels.damage * 200}
                />
                <UpgradeRow 
                  label="استقرار الإطلاق" 
                  level={upgradeState.levels.accuracy} 
                  cost={upgradeState.levels.accuracy * 200}
                  onUpgrade={() => handleUpgradeStat('accuracy')}
                  canAfford={tacticalPoints >= upgradeState.levels.accuracy * 200}
                />
                <UpgradeRow 
                  label="سرعة التلقيم" 
                  level={upgradeState.levels.reloadSpeed} 
                  cost={upgradeState.levels.reloadSpeed * 200}
                  onUpgrade={() => handleUpgradeStat('reloadSpeed')}
                  canAfford={tacticalPoints >= upgradeState.levels.reloadSpeed * 200}
                />
              </div>

              {/* Attachments Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-black text-white">الملحقات التكتيكية</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {ALL_ATTACHMENTS.map(att => (
                    <AttachmentCard 
                      key={att.id}
                      attachment={att}
                      isUnlocked={upgradeState.unlockedAttachments.includes(att.id)}
                      isActive={upgradeState.activeAttachments[att.type] === att.id}
                      canAfford={tacticalPoints >= att.costPT}
                      onClick={() => handleAttachmentClick(att.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StatPreview: React.FC<{ label: string, value: number, icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex flex-col items-end">
    <span className="text-[10px] text-stone-500 font-black uppercase mb-1">{label}</span>
    <div className="flex items-center gap-2 text-[#4fd1c5]">
      <span className="text-xl font-black tabular-nums">LVL {value}</span>
      {icon}
    </div>
  </div>
);

const UpgradeRow: React.FC<{ label: string, level: number, cost: number, onUpgrade: () => void, canAfford: boolean }> = ({ label, level, cost, onUpgrade, canAfford }) => (
  <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-[#4fd1c5]/30 transition-all">
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-white font-black text-base">{label}</p>
        <div className="flex gap-1 mt-1.5">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`w-6 h-1 rounded-full ${i <= level ? 'bg-[#4fd1c5]' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>
    </div>
    
    <div className="flex items-center gap-4">
      {level < 5 ? (
        <button 
          onClick={onUpgrade}
          disabled={!canAfford}
          className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border font-black text-sm transition-all ${
            canAfford 
              ? 'bg-[#4fd1c5]/10 border-[#4fd1c5]/50 text-[#4fd1c5] hover:bg-[#4fd1c5]/20 active:scale-95' 
              : 'bg-stone-900 border-white/5 text-stone-600 opacity-50'
          }`}
        >
          <span>تطوير</span>
          <span className="bg-black/40 px-2 py-0.5 rounded-lg text-[10px]">{cost} PT</span>
        </button>
      ) : (
        <div className="flex items-center gap-2 text-green-500 font-black text-sm">
          <Check className="w-5 h-5" />
          <span>أقصى مستوى</span>
        </div>
      )}
    </div>
  </div>
);

const AttachmentCard: React.FC<{ 
  attachment: any, 
  isUnlocked: boolean, 
  isActive: boolean, 
  canAfford: boolean,
  onClick: () => void 
}> = ({ attachment, isUnlocked, isActive, canAfford, onClick }) => (
  <button
    onClick={onClick}
    disabled={!isUnlocked && !canAfford}
    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
      isActive 
        ? 'bg-[#4fd1c5]/10 border-[#4fd1c5] shadow-[0_0_15px_rgba(79,209,197,0.1)]' 
        : isUnlocked 
          ? 'bg-white/5 border-white/10 hover:border-white/30'
          : 'bg-black/40 border-dashed border-white/10'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        isActive ? 'bg-[#4fd1c5] text-black' : isUnlocked ? 'bg-white/10 text-[#4fd1c5]' : 'bg-stone-900 text-stone-600'
      }`}>
        {attachment.type === 'optic' ? <Target className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
      </div>
      <div className="text-right">
        <p className={`font-black text-base ${isUnlocked ? 'text-white' : 'text-stone-500'}`}>{attachment.nameAr}</p>
        <p className="text-[10px] text-stone-500 font-medium">{attachment.descriptionAr}</p>
      </div>
    </div>

    <div>
      {isActive ? (
        <div className="bg-[#4fd1c5] text-black px-3 py-1 rounded-lg text-[10px] font-black uppercase">مجهز</div>
      ) : isUnlocked ? (
        <div className="text-stone-400 group-hover:text-white transition-colors"><ChevronLeft className="w-5 h-5" /></div>
      ) : (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black ${
          canAfford ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-stone-900 border-white/5 text-stone-700'
        }`}>
          <Lock className="w-3.5 h-3.5" />
          <span>{attachment.costPT} PT</span>
        </div>
      )}
    </div>
  </button>
);
