import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, Zap, Swords, Compass, MapPin, Clock, Backpack, Scroll,
  Settings, ChevronRight, Crosshair, Flame, Target, Trophy, AlertTriangle, RefreshCw,
  Activity, User, Target as TargetIcon, Shell, Star, Sparkles, Navigation, Radio, Plane, Scan
} from 'lucide-react';
import { RPGItem, RPGQuest, DailyChallenge } from '../types/game';
import { VirtualControls } from './VirtualControls';
import { sound } from '../game/audio';

interface TacticalSurvivalBattleViewProps {
  currentProvince: string;
  quests: RPGQuest[];
  inventory: RPGItem[];
  dailyChallenges: DailyChallenge[];
  stats: { unitsKilled: number; buildingsDestroyed: number; terrainDeformedCount: number; trenchesDug: number; resourcesHarvested: number; combosMax: number; knockouts: number; };
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

type WeaponType = 'akm' | 'rpg' | 'sniper';
type TargetingMode = 'airstrike' | 'recon' | null;

interface BattleSnapshot {
  playerPos: { x: number; y: number };
  playerHp: number;
  playerArmor: number;
  ammo: number;
  activeWeapon: WeaponType;
  kills: number;
  tacticalPoints: number;
  aimAngle: number;
  targetingMode: TargetingMode;
  isReloading: boolean;
}

const initialSnapshot = (): BattleSnapshot => ({
  playerPos: { x: 500, y: 450 },
  playerHp: 100,
  playerArmor: 90,
  ammo: 30,
  activeWeapon: 'akm',
  kills: 0,
  tacticalPoints: 0,
  aimAngle: 0,
  targetingMode: null,
  isReloading: false,
});

const initialEnemies: Enemy[] = [
  { id: 1, x: 250, y: 220, hp: 60, maxHp: 60, type: 'militant' },
  { id: 2, x: 780, y: 380, hp: 100, maxHp: 100, type: 'armored_car' },
  { id: 3, x: 620, y: 180, hp: 45, maxHp: 45, type: 'sniper' },
];

export const TacticalSurvivalBattleView: React.FC<TacticalSurvivalBattleViewProps> = ({
  currentProvince,
  quests,
  inventory,
  dailyChallenges,
  stats,
  onOpenQuestLog,
  onOpenInventory,
  onOpenDailyChallenges,
  onOpenSettingsStore,
  onOpenTechModal,
  onReturnToTitle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const activeQuest = useMemo(() => quests.find((q) => !q.isCompleted) || quests[0], [quests]);

  const snapshotRef = useRef<BattleSnapshot>(initialSnapshot());
  const [ui, setUi] = useState<BattleSnapshot>(snapshotRef.current);
  const animationFrameRef = useRef<number | null>(null);
  const reloadTimeoutRef = useRef<number | null>(null);
  const lastUiSyncRef = useRef(0);

  const entitiesRef = useRef<{
    enemies: Enemy[];
    bullets: Bullet[];
    effects: Effect[];
    keys: Record<string, boolean>;
    mouse: { x: number; y: number };
    playerPos: { x: number; y: number };
  }>({
    enemies: initialEnemies,
    bullets: [],
    effects: [],
    keys: {},
    mouse: { x: 500, y: 450 },
    playerPos: { x: 500, y: 450 },
  });

  const syncUi = useCallback(() => {
    setUi({ ...snapshotRef.current });
  }, []);

  const resetBattle = useCallback(() => {
    snapshotRef.current = initialSnapshot();
    entitiesRef.current = {
      enemies: initialEnemies,
      bullets: [],
      effects: [],
      keys: {},
      mouse: { x: 500, y: 450 },
      playerPos: { x: 500, y: 450 },
    };
    syncUi();
  }, [syncUi]);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    sound.startMountainAmbience();

    const handleKeyDown = (e: KeyboardEvent) => {
      entitiesRef.current.keys[e.key.toLowerCase()] = true;
      if (e.key === 'r' || e.key === 'R') handleReload();
      if (e.key === '1') {
        snapshotRef.current.activeWeapon = 'akm';
        syncUi();
      }
      if (e.key === '2') {
        snapshotRef.current.activeWeapon = 'rpg';
        syncUi();
      }
      if (e.key === 'Escape') {
        snapshotRef.current.targetingMode = null;
        syncUi();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      entitiesRef.current.keys[e.key.toLowerCase()] = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      entitiesRef.current.mouse = { x: mouseX, y: mouseY };
      const dx = mouseX - snapshotRef.current.playerPos.x;
      const dy = mouseY - snapshotRef.current.playerPos.y;
      snapshotRef.current.aimAngle = Math.atan2(dy, dx);
      if (performance.now() - lastUiSyncRef.current > 33) {
        syncUi();
        lastUiSyncRef.current = performance.now();
      }
    };

    const handleMouseDown = () => {
      if (snapshotRef.current.targetingMode) {
        confirmAirstrike(entitiesRef.current.mouse.x, entitiesRef.current.mouse.y);
      } else {
        fireWeapon();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) {
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        if (reloadTimeoutRef.current) window.clearTimeout(reloadTimeoutRef.current);
        sound.stopMountainAmbience();
      };
    }

    const tick = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const keys = entitiesRef.current.keys;
      const speed = 4.5;
      let dx = 0;
      let dy = 0;

      if (!snapshotRef.current.targetingMode) {
        if (keys.w || keys.arrowup) dy -= speed;
        if (keys.s || keys.arrowdown) dy += speed;
        if (keys.a || keys.arrowleft) dx -= speed;
        if (keys.d || keys.arrowright) dx += speed;
      }

      const nextPlayerPos = {
        x: Math.max(60, Math.min(width - 60, entitiesRef.current.playerPos.x + dx)),
        y: Math.max(60, Math.min(height - 60, entitiesRef.current.playerPos.y + dy)),
      };
      entitiesRef.current.playerPos = nextPlayerPos;
      snapshotRef.current.playerPos = nextPlayerPos;

      const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.5);
      skyGradient.addColorStop(0, '#7dd3fc');
      skyGradient.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height * 0.5);

      ctx.fillStyle = '#57534e';
      ctx.fillRect(0, height * 0.5, width, height * 0.5);

      ctx.fillStyle = '#8b5e3c';
      [100, 300, 550, 800].forEach((bx) => {
        ctx.fillRect(bx, 150, 120, height * 0.4);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(bx, 170, 120, 5);
        ctx.fillStyle = '#8b5e3c';
      });

      for (let i = entitiesRef.current.bullets.length - 1; i >= 0; i--) {
        const bullet = entitiesRef.current.bullets[i];
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        ctx.fillStyle = bullet.isRpg ? '#ef4444' : '#fbbf24';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.isRpg ? 7 : 3.5, 0, Math.PI * 2);
        ctx.fill();

        if (bullet.x < 0 || bullet.x > width || bullet.y < 0 || bullet.y > height) {
          entitiesRef.current.bullets.splice(i, 1);
          continue;
        }

        for (let j = entitiesRef.current.enemies.length - 1; j >= 0; j--) {
          const enemy = entitiesRef.current.enemies[j];
          if (Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < 35) {
            enemy.hp -= bullet.isRpg ? 80 : 30;
            entitiesRef.current.bullets.splice(i, 1);
            entitiesRef.current.effects.push({
              id: Math.random(),
              x: enemy.x,
              y: enemy.y,
              type: bullet.isRpg ? 'explosion' : 'muzzle',
              life: 18,
              maxLife: 18,
            });

            if (enemy.hp <= 0) {
              entitiesRef.current.enemies.splice(j, 1);
              snapshotRef.current.kills += 1;
              snapshotRef.current.tacticalPoints += 25;
              sound.playDigOrBuild(false);
              window.setTimeout(() => {
                if (entitiesRef.current.enemies.length < 8) {
                  entitiesRef.current.enemies.push({
                    id: Math.random(),
                    x: Math.random() * (width - 120) + 60,
                    y: Math.random() * (height - 120) + 60,
                    hp: 60,
                    maxHp: 60,
                    type: 'militant',
                  });
                }
              }, 200);
            }
            break;
          }
        }
      }

      const enemies = entitiesRef.current.enemies;
      for (const enemy of enemies) {
        const angle = Math.atan2(snapshotRef.current.playerPos.y - enemy.y, snapshotRef.current.playerPos.x - enemy.x);
        enemy.x += Math.cos(angle) * 0.7;
        enemy.y += Math.sin(angle) * 0.7;

        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(-22, -30, 44, 6);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(-22, -30, (enemy.hp / enemy.maxHp) * 44, 6);
        ctx.restore();
      }

      const effects = entitiesRef.current.effects;
      for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];
        effect.life -= 1;
        const maxLife = effect.maxLife || 18;

        ctx.save();
        ctx.translate(effect.x, effect.y);
        if (effect.type === 'recon') {
          ctx.strokeStyle = `rgba(34, 197, 94, ${effect.life / maxLife})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, (maxLife - effect.life) * 15, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = effect.type === 'explosion' || effect.type === 'airstrike'
            ? `rgba(239, 68, 68, ${effect.life / maxLife})`
            : `rgba(251, 191, 36, ${effect.life / maxLife})`;
          ctx.beginPath();
          ctx.arc(0, 0, (maxLife - effect.life) * (effect.type === 'airstrike' ? 10 : 3.5), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        if (effect.life <= 0) effects.splice(i, 1);
      }

      ctx.save();
      ctx.translate(snapshotRef.current.playerPos.x, snapshotRef.current.playerPos.y);
      ctx.rotate(snapshotRef.current.aimAngle);
      ctx.fillStyle = '#444';
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(10, -6, 40, 12);
      ctx.restore();

      const mouse = entitiesRef.current.mouse;
      if (snapshotRef.current.targetingMode) {
        ctx.strokeStyle = snapshotRef.current.targetingMode === 'airstrike' ? '#ef4444' : '#22c55e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 40, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = snapshotRef.current.targetingMode === 'airstrike' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)';
        ctx.fillRect(mouse.x - 60, mouse.y - 60, 120, 120);
      } else {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      const now = performance.now();
      if (now - lastUiSyncRef.current > 50) {
        setUi({ ...snapshotRef.current });
        lastUiSyncRef.current = now;
      }

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      if (animationFrameRef.current) window.cancelAnimationFrame(animationFrameRef.current);
      if (reloadTimeoutRef.current) window.clearTimeout(reloadTimeoutRef.current);
      sound.stopMountainAmbience();
    };
  }, [syncUi]);

  const fireWeapon = useCallback(() => {
    const state = snapshotRef.current;
    if (state.ammo <= 0 || state.isReloading) {
      sound.playClick();
      return;
    }

    const playerPos = entitiesRef.current.playerPos;
    const speed = state.activeWeapon === 'rpg' ? 9 : 16;
    state.ammo -= 1;
    sound.playGunfire(state.activeWeapon === 'rpg');

    entitiesRef.current.bullets.push({
      id: Math.random(),
      x: playerPos.x + Math.cos(state.aimAngle) * 35,
      y: playerPos.y + Math.sin(state.aimAngle) * 35,
      vx: Math.cos(state.aimAngle) * speed,
      vy: Math.sin(state.aimAngle) * speed,
      isRpg: state.activeWeapon === 'rpg',
    });

    syncUi();
  }, [syncUi]);

  const handleReload = useCallback(() => {
    if (snapshotRef.current.isReloading) return;
    snapshotRef.current.isReloading = true;
    sound.playClick();
    syncUi();

    if (reloadTimeoutRef.current) window.clearTimeout(reloadTimeoutRef.current);
    reloadTimeoutRef.current = window.setTimeout(() => {
      snapshotRef.current.isReloading = false;
      snapshotRef.current.ammo = 30;
      syncUi();
    }, 1200);
  }, [syncUi]);

  const handleMilitarySkillCall = useCallback((skillType: 'light_weapon' | 'heavy_weapon' | 'tank_support' | 'airstrike') => {
    sound.playExplosion();
    if (skillType === 'tank_support') {
      entitiesRef.current.effects.push({
        id: Math.random(),
        x: snapshotRef.current.playerPos.x + 90,
        y: snapshotRef.current.playerPos.y + 50,
        type: 'explosion',
        life: 25,
        maxLife: 25,
      });
    }
  }, []);

  const handleCallSupport = useCallback((type: 'airstrike' | 'recon') => {
    const cost = type === 'airstrike' ? 250 : 100;
    if (ui.tacticalPoints < cost) {
      sound.playClick();
      return;
    }
    snapshotRef.current.targetingMode = type;
    syncUi();
    sound.playSelect();
  }, [syncUi, ui.tacticalPoints]);

  const confirmAirstrike = useCallback((x: number, y: number) => {
    const currentMode = snapshotRef.current.targetingMode;
    if (!currentMode) return;
    const cost = currentMode === 'airstrike' ? 250 : 100;

    snapshotRef.current.tacticalPoints = Math.max(0, snapshotRef.current.tacticalPoints - cost);
    snapshotRef.current.targetingMode = null;
    sound.playExplosion();

    if (currentMode === 'airstrike') {
      entitiesRef.current.effects.push({ id: Math.random(), x, y, type: 'airstrike', life: 60, maxLife: 60 });
      entitiesRef.current.enemies.forEach((enemy) => {
        if (Math.hypot(enemy.x - x, enemy.y - y) < 80) {
          enemy.hp -= 150;
          if (enemy.hp <= 0) {
            snapshotRef.current.kills += 1;
            snapshotRef.current.tacticalPoints += 25;
            window.setTimeout(() => {
              if (entitiesRef.current.enemies.length < 8) {
                entitiesRef.current.enemies.push({
                  id: Math.random(),
                  x: Math.random() * 800,
                  y: Math.random() * 600,
                  hp: 60,
                  maxHp: 60,
                  type: 'militant',
                });
              }
            }, 2000);
          }
        }
      });
    } else {
      entitiesRef.current.effects.push({ id: Math.random(), x, y, type: 'recon', life: 40, maxLife: 40 });
    }

    syncUi();
  }, [syncUi]);

  const weaponButtons = [
    { key: 'akm', label: 'AKM', icon: Zap },
    { key: 'rpg', label: 'RPG-7', icon: Swords },
  ] as const;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-['Cairo',sans-serif] select-none text-right rtl">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-none z-0" />

      <AnimatePresence>
        {ui.targetingMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center border-[20px] border-amber-500/20"
          >
            <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-amber-500 text-amber-500 font-black text-xl animate-pulse">
              {ui.targetingMode === 'airstrike' ? 'حدد إحداثيات الغارة الجوية' : 'حدد منطقة الاستطلاع'}
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
                  <p className="text-amber-500 font-black text-lg tabular-nums">{ui.tacticalPoints}</p>
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
                  <div className="flex justify-between text-[10px] font-bold text-stone-400"><span>الصحة</span><span className="text-blue-400">{ui.playerHp}/100</span></div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div animate={{ width: `${ui.playerHp}%` }} className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-stone-400"><span>الدرع التكتيكي</span><span className="text-amber-500">{ui.playerArmor}%</span></div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div animate={{ width: `${ui.playerArmor}%` }} className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                {weaponButtons.map(({ key, label, icon: Icon }) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      snapshotRef.current.activeWeapon = key;
                      sound.playSelect();
                      syncUi();
                    }}
                    className={`relative flex-1 h-14 rounded-2xl border text-white ${ui.activeWeapon === key ? 'border-amber-500/60 bg-amber-500/10' : 'border-white/10 bg-black/20'} overflow-hidden`}
                  >
                    {ui.activeWeapon === key && (<motion.div layoutId="activeWeaponGlow" className="absolute inset-0 bg-amber-500/10 animate-pulse" />)}
                    <Icon className={`w-5 h-5 relative z-10 ${ui.activeWeapon === key ? 'animate-bounce' : ''}`} />
                    <span className="text-[8px] font-black uppercase relative z-10">{label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4 pointer-events-auto">
            <div className="text-[10px] font-black text-amber-500 text-center mb-1 uppercase bg-black/40 py-1 rounded-lg backdrop-blur-sm border border-white/5">الدعم الجوي</div>

            <button
              onClick={() => handleCallSupport('recon')}
              disabled={ui.tacticalPoints < 100}
              className={`w-16 h-16 rounded-3xl border flex flex-col items-center justify-center transition-all active:scale-90 ${ui.tacticalPoints >= 100 ? 'bg-black/40 hover:bg-green-600/40 border-green-500/60' : 'bg-black/20 border-white/10 opacity-50'}`}
            >
              <Scan className="w-7 h-7" />
              <span className="text-[8px] font-black mt-1 uppercase">استطلاع</span>
              <span className="text-[7px] opacity-80 mt-0.5">100 PT</span>
            </button>

            <button
              onClick={() => handleCallSupport('airstrike')}
              disabled={ui.tacticalPoints < 250}
              className={`w-16 h-16 rounded-3xl border flex flex-col items-center justify-center transition-all active:scale-90 ${ui.tacticalPoints >= 250 ? 'bg-black/40 hover:bg-red-600/40 border-red-500/60' : 'bg-black/20 border-white/10 opacity-50'}`}
            >
              <Plane className="w-7 h-7" />
              <span className="text-[8px] font-black mt-1 uppercase">غارة</span>
              <span className="text-[7px] opacity-80 mt-0.5">250 PT</span>
            </button>

            <button onClick={() => handleMilitarySkillCall('tank_support')} className="w-16 h-16 rounded-3xl bg-black/40 hover:bg-amber-600/40 border border-white/10 flex flex-col items-center justify-center transition-all active:scale-90">
              <Shield className="w-7 h-7" />
              <span className="text-[8px] font-black mt-1 uppercase">دفاع</span>
            </button>
          </motion.div>
        </div>

        <div className="flex justify-between items-end w-full">
          <div className="flex gap-3 pointer-events-auto">
            <button onClick={onOpenInventory} className="flex items-center gap-3 px-6 py-4 bg-black/40 hover:bg-black/60 rounded-2xl border border-white/10 text-white backdrop-blur-xl shadow-2xl transition-all active:scale-95">
              <Backpack className="w-5 h-5 text-amber-500" /><span className="text-xs font-black">العتاد</span>
            </button>
            <button onClick={onOpenQuestLog} className="flex items-center gap-3 px-6 py-4 bg-black/40 hover:bg-black/60 rounded-2xl border border-white/10 text-white backdrop-blur-xl shadow-2xl transition-all active:scale-95">
              <Scroll className="w-5 h-5 text-blue-400" /><span className="text-xs font-black">المهام</span>
            </button>
            <button onClick={onOpenDailyChallenges} className="flex items-center gap-3 px-6 py-4 bg-black/40 hover:bg-black/60 rounded-2xl border border-amber-500/20 text-white backdrop-blur-xl shadow-2xl transition-all active:scale-95 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1 h-full bg-amber-500" /><Trophy className="w-5 h-5 text-amber-500" /><span className="text-xs font-black">التحديات</span>
            </button>
          </div>

          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl px-8 py-5 flex items-center gap-10 shadow-2xl pointer-events-auto">
            <div className="text-right">
              <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">الأعداء المقضي عليهم</div>
              <div className="flex items-baseline gap-2"><span className="text-3xl font-black text-amber-500 tabular-nums leading-none">{ui.kills}</span><span className="text-stone-600 text-[10px] font-bold uppercase">kills</span></div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-right flex flex-col items-end">
              <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">الذخيرة</div>
              <div className="flex items-center gap-2"><Shell className={`w-4 h-4 ${ui.ammo < 10 ? 'text-red-500 animate-pulse' : 'text-stone-400'}`} /><span className={`text-xl font-black tabular-nums ${ui.ammo < 10 ? 'text-red-400' : 'text-white'}`}>{ui.ammo}</span></div>
            </div>
          </motion.div>
        </div>
      </div>

      {isTouch && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <VirtualControls
            onMove={(x, z) => {
              if (snapshotRef.current.targetingMode) return;
              const next = {
                x: Math.max(60, Math.min(window.innerWidth - 60, snapshotRef.current.playerPos.x + x * 5)),
                y: Math.max(60, Math.min(window.innerHeight - 60, snapshotRef.current.playerPos.y + z * 5)),
              };
              snapshotRef.current.playerPos = next;
              entitiesRef.current.playerPos = next;
              syncUi();
            }}
            onAction={() => {
              if (snapshotRef.current.targetingMode) {
                confirmAirstrike(entitiesRef.current.mouse.x, entitiesRef.current.mouse.y);
              } else {
                fireWeapon();
              }
            }}
            onStopBlock={() => {}}
          />
        </div>
      )}
    </div>
  );
};





















































































































































































































































































