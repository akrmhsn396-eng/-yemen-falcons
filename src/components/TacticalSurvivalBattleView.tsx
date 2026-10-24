import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Zap, Swords, Compass, MapPin, Clock, Backpack, Scroll, 
  Settings, ChevronRight, Crosshair, Flame, Target, Trophy, AlertTriangle, RefreshCw,
  Activity, User, Target as TargetIcon, Shell, Star, Sparkles, Navigation, Radio, Plane, Scan
} from 'lucide-react';
import { FighterInstance, GameStats, RPGItem, RPGQuest, DailyChallenge } from '../types/game';
import { VirtualControls } from './VirtualControls';
import { sound } from '../game/audio';

interface TacticalSurvivalBattleViewProps {
  currentProvince: string;
  quests: RPGQuest[];
  inventory: RPGItem[];
  dailyChallenges: DailyChallenge[];
  stats: GameStats;
  onOpenQuestLog: () => void;
  onOpenInventory: () => void;
  onOpenDailyChallenges: () => void;
  onOpenSettingsStore: () => void;
  onOpenTechModal: () => void;
  onReturnToTitle: () => void;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isRpg?: boolean;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  type: 'militant' | 'sniper' | 'armored_car' | 'drone';
}

interface Effect {
  id: number;
  x: number;
  y: number;
  type: 'explosion' | 'muzzle' | 'airstrike' | 'recon';
  life: number;
  maxLife: number;
}

export const TacticalSurvivalBattleView: React.FC<TacticalSurvivalBattleViewProps> = ({
  currentProvince,
  quests,
  inventory,
  dailyChallenges,
  stats: initialStats,
  onOpenQuestLog,
  onOpenInventory,
  onOpenDailyChallenges,
  onOpenSettingsStore,
  onOpenTechModal,
  onReturnToTitle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const activeQuest = quests.find(q => !q.isCompleted) || quests[0];

  // Player State
  const [playerPos, setPlayerPos] = useState({ x: 500, y: 450 });
  const [playerHp, setPlayerHp] = useState(100);
  const [playerArmor, setPlayerArmor] = useState(90);
  const [ammo, setAmmo] = useState(30);
  const [activeWeapon, setActiveWeapon] = useState<'akm' | 'rpg' | 'sniper'>('akm');
  const [kills, setKills] = useState(0);
  const [tacticalPoints, setTacticalPoints] = useState(0);
  const [isReloading, setIsReloading] = useState(false);
  const [aimAngle, setAimAngle] = useState(0);

  // Airstrike System State
  const [targetingMode, setTargetingMode] = useState<'airstrike' | 'recon' | null>(null);
  const [activeSupport, setActiveSupport] = useState<{ type: 'recon' | 'airstrike'; x: number; y: number } | null>(null);

  const entitiesRef = useRef<{
    enemies: Enemy[];
    bullets: Bullet[];
    effects: Effect[];
    keys: { [key: string]: boolean };
    mouse: { x: number; y: number };
  }>({
    enemies: [
      { id: 1, x: 250, y: 220, hp: 60, maxHp: 60, type: 'militant' },
      { id: 2, x: 780, y: 380, hp: 100, maxHp: 100, type: 'armored_car' },
      { id: 3, x: 620, y: 180, hp: 45, maxHp: 45, type: 'sniper' },
    ],
    bullets: [],
    effects: [],
    keys: {},
    mouse: { x: 500, y: 450 },
  });

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    sound.startMountainAmbience();

    const handleKeyDown = (e: KeyboardEvent) => {
      entitiesRef.current.keys[e.key.toLowerCase()] = true;
      if (e.key === 'r' || e.key === 'R') handleReload();
      if (e.key === '1') setActiveWeapon('akm');
      if (e.key === '2') setActiveWeapon('rpg');
      if (e.key === 'Escape') setTargetingMode(null);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      entitiesRef.current.keys[e.key.toLowerCase()] = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      entitiesRef.current.mouse = { x: mouseX, y: mouseY };

      const dx = mouseX - playerPos.x;
      const dy = mouseY - playerPos.y;
      setAimAngle(Math.atan2(dy, dx));
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (targetingMode) {
        confirmAirstrike(entitiesRef.current.mouse.x, entitiesRef.current.mouse.y);
      } else {
        fireWeapon();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    let animationId: number;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      
      const updateGame = () => {
        if (!ctx || !canvas) return;

        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
        }

        const keys = entitiesRef.current.keys;
        const speed = 4.5;
        let dx = 0;
        let dy = 0;

        if (!targetingMode) {
          if (keys['w'] || keys['arrowup']) dy -= speed;
          if (keys['s'] || keys['arrowdown']) dy += speed;
          if (keys['a'] || keys['arrowleft']) dx -= speed;
          if (keys['d'] || keys['arrowright']) dx += speed;
        }

        setPlayerPos(prev => ({
          x: Math.max(60, Math.min(canvas.width - 60, prev.x + dx)),
          y: Math.max(60, Math.min(canvas.height - 60, prev.y + dy)),
        }));

        // Render Background (Daytime Sana'a)
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.5);
        skyGradient.addColorStop(0, '#7dd3fc');
        skyGradient.addColorStop(1, '#e0f2fe');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5);

        ctx.fillStyle = '#57534e';
        ctx.fillRect(0, canvas.height * 0.5, canvas.width, canvas.height * 0.5);

        // Simple Buildings
        ctx.fillStyle = '#8b5e3c';
        [100, 300, 550, 800].forEach(bx => {
          ctx.fillRect(bx, 150, 120, canvas.height * 0.4);
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(bx, 170, 120, 5);
          ctx.fillStyle = '#8b5e3c';
        });

        // Bullets
        const bullets = entitiesRef.current.bullets;
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.x += b.vx; b.y += b.vy;
          ctx.fillStyle = b.isRpg ? '#ef4444' : '#fbbf24';
          ctx.beginPath(); ctx.arc(b.x, b.y, b.isRpg ? 7 : 3.5, 0, Math.PI * 2); ctx.fill();

          if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
            bullets.splice(i, 1); continue;
          }

          const enemies = entitiesRef.current.enemies;
          for (let j = enemies.length - 1; j >= 0; j--) {
            const en = enemies[j];
            if (Math.hypot(b.x - en.x, b.y - en.y) < 35) {
              en.hp -= b.isRpg ? 80 : 30;
              bullets.splice(i, 1);
              entitiesRef.current.effects.push({ id: Math.random(), x: en.x, y: en.y, type: b.isRpg ? 'explosion' : 'muzzle', life: 18, maxLife: 18 });
              if (en.hp <= 0) {
                enemies.splice(j, 1);
                setKills(k => k + 1);
                setTacticalPoints(p => p + 25);
                sound.playDigOrBuild(false);
                setTimeout(() => enemies.push({ id: Math.random(), x: Math.random() * (canvas.width - 120) + 60, y: Math.random() * (canvas.height - 120) + 60, hp: 60, maxHp: 60, type: 'militant' }), 2000);
              }
              break;
            }
          }
        }

        // Enemies
        entitiesRef.current.enemies.forEach(en => {
          const angle = Math.atan2(playerPos.y - en.y, playerPos.x - en.x);
          en.x += Math.cos(angle) * 0.7; en.y += Math.sin(angle) * 0.7;
          ctx.save(); ctx.translate(en.x, en.y);
          ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(-22, -30, 44, 6);
          ctx.fillStyle = '#22c55e'; ctx.fillRect(-22, -30, (en.hp / en.maxHp) * 44, 6);
          ctx.restore();
        });

        // Effects
        const effects = entitiesRef.current.effects;
        for (let i = effects.length - 1; i >= 0; i--) {
          const ef = effects[i]; ef.life--;
          const maxL = ef.maxLife || 18;
          ctx.save(); ctx.translate(ef.x, ef.y);
          if (ef.type === 'recon') {
            ctx.strokeStyle = `rgba(34, 197, 94, ${ef.life / maxL})`;
            ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, (maxL - ef.life) * 15, 0, Math.PI * 2); ctx.stroke();
          } else {
            ctx.fillStyle = ef.type === 'explosion' || ef.type === 'airstrike' ? `rgba(239, 68, 68, ${ef.life / maxL})` : `rgba(251, 191, 36, ${ef.life / maxL})`;
            ctx.beginPath(); ctx.arc(0, 0, (maxL - ef.life) * (ef.type === 'airstrike' ? 10 : 3.5), 0, Math.PI * 2); ctx.fill();
          }
          ctx.restore();
          if (ef.life <= 0) effects.splice(i, 1);
        }

        // Player
        ctx.save(); ctx.translate(playerPos.x, playerPos.y); ctx.rotate(aimAngle);
        ctx.fillStyle = '#444'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = '#1c1917'; ctx.fillRect(10, -6, 40, 12);
        ctx.restore();

        // UI Target Crosshair
        const mouse = entitiesRef.current.mouse;
        if (targetingMode) {
          ctx.strokeStyle = targetingMode === 'airstrike' ? '#ef4444' : '#22c55e';
          ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 40, 0, Math.PI * 2); ctx.stroke();
          ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = targetingMode === 'airstrike' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)';
          ctx.fill();
        } else {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2); ctx.stroke();
        }

        animationId = requestAnimationFrame(updateGame);
      };

      animationId = requestAnimationFrame(updateGame);
      return () => cancelAnimationFrame(animationId);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mousedown', handleMouseDown);
      sound.stopMountainAmbience();
    };
  }, [currentProvince, playerPos.x, playerPos.y, targetingMode]);

  const fireWeapon = () => {
    if (ammo <= 0 || isReloading) { sound.playClick(); return; }
    setAmmo(a => a - 1); sound.playGunfire(activeWeapon === 'rpg');
    const speed = activeWeapon === 'rpg' ? 9 : 16;
    entitiesRef.current.bullets.push({ id: Math.random(), x: playerPos.x + Math.cos(aimAngle) * 35, y: playerPos.y + Math.sin(aimAngle) * 35, vx: Math.cos(aimAngle) * speed, vy: Math.sin(aimAngle) * speed, isRpg: activeWeapon === 'rpg' });
  };

  const handleReload = () => {
    if (isReloading) return;
    setIsReloading(true); sound.playClick();
    setTimeout(() => { setAmmo(30); setIsReloading(false); }, 1200);
  };

  const handleMilitarySkillCall = (skillType: 'light_weapon' | 'heavy_weapon' | 'tank_support' | 'airstrike') => {
    sound.playExplosion();
    if (skillType === 'tank_support') {
      entitiesRef.current.effects.push({
        id: Math.random(),
        x: playerPos.x + 90,
        y: playerPos.y + 50,
        type: 'explosion',
        life: 25,
        maxLife: 25,
      });
    }
  };

  const handleCallSupport = (type: 'airstrike' | 'recon') => {
    const cost = type === 'airstrike' ? 250 : 100;
    if (tacticalPoints < cost) {
      sound.playClick();
      return;
    }
    setTargetingMode(type);
    sound.playSelect();
  };

  const confirmAirstrike = (x: number, y: number) => {
    if (!targetingMode) return;
    const type = targetingMode;
    const cost = type === 'airstrike' ? 250 : 100;
    
    setTacticalPoints(p => p - cost);
    setTargetingMode(null);
    sound.playExplosion();

    if (type === 'airstrike') {
      entitiesRef.current.effects.push({ id: Math.random(), x, y, type: 'airstrike', life: 60, maxLife: 60 });
      // Damage enemies in area
      entitiesRef.current.enemies.forEach(en => {
        if (Math.hypot(en.x - x, en.y - y) < 80) {
          en.hp -= 150;
          if (en.hp <= 0) {
            setKills(k => k + 1);
            setTimeout(() => entitiesRef.current.enemies.push({ id: Math.random(), x: Math.random() * 800, y: Math.random() * 600, hp: 60, maxHp: 60, type: 'militant' }), 2000);
          }
        }
      });
    } else {
      entitiesRef.current.effects.push({ id: Math.random(), x, y, type: 'recon', life: 40, maxLife: 40 });
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-['Cairo',sans-serif] select-none text-right rtl">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-none z-0" />

      {/* Targetting Overlay */}
      <AnimatePresence>
        {targetingMode && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center border-[20px] border-amber-500/20"
          >
            <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-amber-500 text-amber-500 font-black text-xl animate-pulse">
              {targetingMode === 'airstrike' ? 'حدد إحداثيات الغارة الجوية' : 'حدد منطقة الاستطلاع'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-10 pointer-events-none p-4 sm:p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start w-full">
          <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-3 pointer-events-auto">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-64 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1 h-full bg-amber-500" />
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span className="text-white font-black text-lg">منطقة العمليات</span>
              </div>
              <div className="text-stone-300 text-sm font-bold">{currentProvince}</div>
            </div>
            {activeQuest && (
              <div className="bg-black/30 backdrop-blur-md border border-white/5 rounded-xl p-3 w-64 shadow-xl">
                <div className="flex items-center gap-2 mb-1 text-blue-400">
                  <TargetIcon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase">مهمة البقاء</span>
                </div>
                <div className="text-white text-xs font-bold leading-tight">{activeQuest.titleAr}</div>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-end gap-3 pointer-events-auto">
            <div className="bg-gradient-to-l from-amber-600/20 to-transparent backdrop-blur-sm border-r-4 border-amber-500 px-6 py-2 text-right">
              <h1 className="text-white text-3xl font-black tracking-tighter drop-shadow-2xl">صقور اليمن</h1>
              <p className="text-amber-500 text-[10px] font-bold tracking-widest uppercase">Hawks of Yemen</p>
            </div>
            <div className="flex gap-2">
              <div className="bg-black/60 backdrop-blur-md rounded-xl border border-amber-500/30 px-4 py-2 flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[8px] text-stone-400 font-bold uppercase">نقاط تكتيكية</p>
                  <p className="text-amber-500 font-black text-lg tabular-nums">{tacticalPoints}</p>
                </div>
                <Radio className="w-5 h-5 text-amber-500 animate-pulse" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-between items-center w-full grow px-2">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4 pointer-events-auto">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 w-72 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-blue-400" />
                <span className="text-white font-black text-sm uppercase">حالة المقاتل</span>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-stone-400"><span>الصحة</span><span className="text-blue-400">100/100</span></div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div animate={{ width: `${playerHp}%` }} className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-stone-400"><span>الدرع التكتيكي</span><span className="text-amber-500">{playerArmor}%</span></div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div animate={{ width: `${playerArmor}%` }} className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setActiveWeapon('akm'); sound.playSelect(); }} className={`flex-1 h-14 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 relative overflow-hidden ${activeWeapon === 'akm' ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10'}`}>
                  {activeWeapon === 'akm' && <motion.div layoutId="activeWeaponGlow" className="absolute inset-0 bg-amber-500/10 animate-pulse" />}
                  <Zap className={`w-5 h-5 relative z-10 ${activeWeapon === 'akm' ? 'animate-bounce' : ''}`} />
                  <span className="text-[8px] font-black uppercase relative z-10">AKM</span>
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setActiveWeapon('rpg'); sound.playSelect(); }} className={`flex-1 h-14 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 relative overflow-hidden ${activeWeapon === 'rpg' ? 'bg-orange-500/20 border-orange-500 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10'}`}>
                  {activeWeapon === 'rpg' && <motion.div layoutId="activeWeaponGlow" className="absolute inset-0 bg-orange-500/10 animate-pulse" />}
                  <Swords className={`w-5 h-5 relative z-10 ${activeWeapon === 'rpg' ? 'animate-bounce' : ''}`} />
                  <span className="text-[8px] font-black uppercase relative z-10">RPG-7</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Air Support System */}
          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4 pointer-events-auto">
            <div className="text-[10px] font-black text-amber-500 text-center mb-1 uppercase bg-black/40 py-1 rounded-lg backdrop-blur-sm border border-white/5">الدعم الجوي</div>
            
            <button 
              onClick={() => handleCallSupport('recon')}
              disabled={tacticalPoints < 100}
              className={`w-16 h-16 rounded-3xl border flex flex-col items-center justify-center transition-all active:scale-90 ${tacticalPoints >= 100 ? 'bg-black/40 hover:bg-green-600/40 border-green-500/30 text-green-500 backdrop-blur-md cursor-pointer' : 'bg-stone-900/40 border-white/5 text-stone-600 cursor-not-allowed opacity-50'}`}
            >
              <Scan className="w-7 h-7" />
              <span className="text-[8px] font-black mt-1 uppercase">استطلاع</span>
              <span className="text-[7px] opacity-80 mt-0.5">100 PT</span>
            </button>

            <button 
              onClick={() => handleCallSupport('airstrike')}
              disabled={tacticalPoints < 250}
              className={`w-16 h-16 rounded-3xl border flex flex-col items-center justify-center transition-all active:scale-90 ${tacticalPoints >= 250 ? 'bg-black/40 hover:bg-red-600/40 border-red-500/30 text-red-500 backdrop-blur-md cursor-pointer' : 'bg-stone-900/40 border-white/5 text-stone-600 cursor-not-allowed opacity-50'}`}
            >
              <Plane className="w-7 h-7" />
              <span className="text-[8px] font-black mt-1 uppercase">غارة</span>
              <span className="text-[7px] opacity-80 mt-0.5">250 PT</span>
            </button>
            
            <button onClick={() => handleMilitarySkillCall('tank_support')} className="w-16 h-16 rounded-3xl bg-black/40 hover:bg-amber-600/40 border border-white/10 flex flex-col items-center justify-center text-amber-500 backdrop-blur-md transition-all active:scale-90 shadow-xl">
              <Shield className="w-7 h-7" />
              <span className="text-[8px] font-black mt-1 uppercase">دفاع</span>
            </button>
          </motion.div>
        </div>

        <div className="flex justify-between items-end w-full">
          <div className="flex gap-3 pointer-events-auto">
            <button onClick={onOpenInventory} className="flex items-center gap-3 px-6 py-4 bg-black/40 hover:bg-black/60 rounded-2xl border border-white/10 text-white backdrop-blur-xl shadow-2xl transition-all">
              <Backpack className="w-5 h-5 text-amber-500" /><span className="text-xs font-black">العتاد</span>
            </button>
            <button onClick={onOpenQuestLog} className="flex items-center gap-3 px-6 py-4 bg-black/40 hover:bg-black/60 rounded-2xl border border-white/10 text-white backdrop-blur-xl shadow-2xl transition-all">
              <Scroll className="w-5 h-5 text-blue-400" /><span className="text-xs font-black">المهام</span>
            </button>
            <button onClick={onOpenDailyChallenges} className="flex items-center gap-3 px-6 py-4 bg-black/40 hover:bg-black/60 rounded-2xl border border-amber-500/20 text-white backdrop-blur-xl shadow-2xl transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1 h-full bg-amber-500" /><Trophy className="w-5 h-5 text-amber-500" /><span className="text-xs font-black">التحديات</span>
            </button>
          </div>

          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl px-8 py-5 flex items-center gap-10 shadow-2xl pointer-events-auto">
            <div className="text-right">
              <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">الأعداء المقضي عليهم</div>
              <div className="flex items-baseline gap-2"><span className="text-3xl font-black text-amber-500 tabular-nums leading-none">{kills}</span><span className="text-stone-600 text-[10px] font-bold">هدف</span></div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-right flex flex-col items-end">
              <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">الذخيرة</div>
              <div className="flex items-center gap-2"><Shell className={`w-4 h-4 ${ammo < 10 ? 'text-red-500 animate-pulse' : 'text-stone-400'}`} /><span className={`text-xl font-black tabular-nums ${ammo < 10 ? 'text-red-500' : 'text-white'}`}>{ammo}/30</span></div>
            </div>
          </motion.div>
        </div>
      </div>

      {isTouch && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <VirtualControls 
            onMove={(x, z) => {
              if (!targetingMode) setPlayerPos(prev => ({ x: Math.max(60, Math.min(window.innerWidth - 60, prev.x + x * 5)), y: Math.max(60, Math.min(window.innerHeight - 60, prev.y + z * 5)) }));
            }}
            onAction={() => targetingMode ? confirmAirstrike(entitiesRef.current.mouse.x, entitiesRef.current.mouse.y) : fireWeapon()}
            onStopBlock={() => {}}
          />
        </div>
      )}
    </div>
  );
};
