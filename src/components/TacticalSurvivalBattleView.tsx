import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Zap, Swords, Compass, MapPin, Clock, Backpack, Scroll, 
  Settings, ChevronRight, Crosshair, Flame, Target, Trophy, AlertTriangle, RefreshCw,
  Activity, User, Target as TargetIcon, Shell, Star
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
  type: 'explosion' | 'muzzle' | 'airstrike';
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

  // Player State (Third-Person Over-the-Shoulder)
  const [playerPos, setPlayerPos] = useState({ x: 500, y: 450 });
  const [playerHp, setPlayerHp] = useState(100);
  const [playerArmor, setPlayerArmor] = useState(90);
  const [ammo, setAmmo] = useState(30);
  const [activeWeapon, setActiveWeapon] = useState<'akm' | 'rpg' | 'sniper'>('akm');
  const [kills, setKills] = useState(0);
  const [isReloading, setIsReloading] = useState(false);
  const [aimAngle, setAimAngle] = useState(0);

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
      if (e.key === 'r' || e.key === 'R') {
        handleReload();
      }
      if (e.key === '1') setActiveWeapon('akm');
      if (e.key === '2') setActiveWeapon('rpg');
      if (e.key === '3') setActiveWeapon('sniper');
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

    const handleMouseDown = () => {
      fireWeapon();
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

        if (keys['w'] || keys['arrowup']) dy -= speed;
        if (keys['s'] || keys['arrowdown']) dy += speed;
        if (keys['a'] || keys['arrowleft']) dx -= speed;
        if (keys['d'] || keys['arrowright']) dx += speed;

        setPlayerPos(prev => ({
          x: Math.max(60, Math.min(canvas.width - 60, prev.x + dx)),
          y: Math.max(60, Math.min(canvas.height - 60, prev.y + dy)),
        }));

        // Realistic Daytime Sana'a Sky
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.5);
        skyGradient.addColorStop(0, '#7dd3fc'); // Sky blue
        skyGradient.addColorStop(1, '#e0f2fe'); // Light sky blue
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5);

        // Ground / Streets (Realistic stone paving / Arid ground)
        const groundGradient = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height);
        groundGradient.addColorStop(0, '#78716c'); // Warm stone gray
        groundGradient.addColorStop(1, '#57534e'); // Darker stone gray
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, canvas.height * 0.5, canvas.width, canvas.height * 0.5);

        // Sana'a Old City Architecture (More Detailed Daytime Render)
        const drawSanaaBuilding = (x: number, y: number, w: number, h: number) => {
          // Main Body
          ctx.fillStyle = '#8b5e3c'; // Earthy mud brick brown
          ctx.fillRect(x, y, w, h);
          
          // White Gypsum Frieze / Trim
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(x, y + 20, w, 10);
          ctx.fillRect(x, y + h * 0.4, w, 8);
          ctx.fillRect(x, y + h * 0.7, w, 8);
          
          // Decorative Qamariya Windows
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          const windowRows = 4;
          const windowCols = 3;
          for (let r = 0; r < windowRows; r++) {
            for (let c = 0; c < windowCols; c++) {
              const wx = x + (w / (windowCols + 1)) * (c + 1) - 10;
              const wy = y + (h / (windowRows + 1)) * (r + 1) - 15;
              
              // Arched Window (Qamariya)
              ctx.beginPath();
              ctx.moveTo(wx, wy + 20);
              ctx.lineTo(wx + 20, wy + 20);
              ctx.lineTo(wx + 20, wy + 10);
              ctx.quadraticCurveTo(wx + 10, wy - 5, wx, wy + 10);
              ctx.closePath();
              ctx.fill();
              
              // Dark wood frame / glass detail
              ctx.fillStyle = '#1e293b';
              ctx.fillRect(wx + 4, wy + 8, 12, 10);
              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            }
          }
        };

        // Draw Buildings with Parallax-ish layers
        drawSanaaBuilding(50, 150, 140, canvas.height * 0.4);
        drawSanaaBuilding(240, 100, 160, canvas.height * 0.5);
        drawSanaaBuilding(480, 130, 150, canvas.height * 0.45);
        drawSanaaBuilding(700, 90, 180, canvas.height * 0.55);
        drawSanaaBuilding(920, 140, 130, canvas.height * 0.42);

        // Tactical Street Grid (Faded)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 80) {
          ctx.beginPath();
          ctx.moveTo(i, canvas.height * 0.5);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }

        // Bullets
        const bullets = entitiesRef.current.bullets;
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.x += b.vx;
          b.y += b.vy;

          ctx.fillStyle = b.isRpg ? '#ef4444' : '#fbbf24';
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.isRpg ? 7 : 3.5, 0, Math.PI * 2);
          ctx.fill();

          if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
            bullets.splice(i, 1);
            continue;
          }

          const enemies = entitiesRef.current.enemies;
          for (let j = enemies.length - 1; j >= 0; j--) {
            const en = enemies[j];
            const dist = Math.hypot(b.x - en.x, b.y - en.y);
            if (dist < 35) {
              en.hp -= b.isRpg ? 80 : 30;
              bullets.splice(i, 1);

              entitiesRef.current.effects.push({
                id: Math.random(),
                x: en.x,
                y: en.y,
                type: b.isRpg ? 'explosion' : 'muzzle',
                life: 18,
                maxLife: 18,
              });

              if (en.hp <= 0) {
                enemies.splice(j, 1);
                setKills(k => k + 1);
                sound.playDigOrBuild(false);

                setTimeout(() => {
                  entitiesRef.current.enemies.push({
                    id: Math.random(),
                    x: Math.random() * (canvas.width - 120) + 60,
                    y: Math.random() * (canvas.height - 120) + 60,
                    hp: 60,
                    maxHp: 60,
                    type: Math.random() > 0.5 ? 'militant' : 'sniper',
                  });
                }, 2000);
              }
              break;
            }
          }
        }

        // Enemies
        const enemies = entitiesRef.current.enemies;
        enemies.forEach(en => {
          const angle = Math.atan2(playerPos.y - en.y, playerPos.x - en.x);
          en.x += Math.cos(angle) * 0.7;
          en.y += Math.sin(angle) * 0.7;

          ctx.save();
          ctx.translate(en.x, en.y);
          
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // HP Bar
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.fillRect(-22, -30, 44, 6);
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(-22, -30, (en.hp / en.maxHp) * 44, 6);

          ctx.restore();
        });

        // Effects
        const effects = entitiesRef.current.effects;
        for (let i = effects.length - 1; i >= 0; i--) {
          const ef = effects[i];
          ef.life--;

          const maxL = ef.maxLife || 18;
          const radius = Math.max(0, (maxL - ef.life) * 3.5);

          ctx.save();
          ctx.translate(ef.x, ef.y);
          ctx.fillStyle = ef.type === 'explosion' ? `rgba(239, 68, 68, ${Math.max(0, ef.life / maxL)})` : `rgba(251, 191, 36, ${Math.max(0, ef.life / maxL)})`;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (ef.life <= 0) {
            effects.splice(i, 1);
          }
        }

        // Player (Third-Person Over-the-Shoulder View)
        ctx.save();
        ctx.translate(playerPos.x, playerPos.y);
        ctx.rotate(aimAngle);

        // Character body
        ctx.fillStyle = '#444'; // Tactical gray
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b'; // Amber outline
        ctx.lineWidth = 3;
        ctx.stroke();

        // Weapon barrel
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(10, -6, 40, 12);

        ctx.restore();

        // Professional Crosshair
        const mouse = entitiesRef.current.mouse;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y - 18);
        ctx.lineTo(mouse.x, mouse.y - 10);
        ctx.moveTo(mouse.x, mouse.y + 18);
        ctx.lineTo(mouse.x, mouse.y + 10);
        ctx.moveTo(mouse.x - 18, mouse.y);
        ctx.lineTo(mouse.x - 10, mouse.y);
        ctx.moveTo(mouse.x + 18, mouse.y);
        ctx.lineTo(mouse.x + 10, mouse.y);
        ctx.stroke();

        animationId = requestAnimationFrame(updateGame);
      };

      animationId = requestAnimationFrame(updateGame);

      return () => {
        cancelAnimationFrame(animationId);
      };
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      sound.stopMountainAmbience();
    };
  }, [currentProvince, playerPos.x, playerPos.y]);

  const fireWeapon = () => {
    if (ammo <= 0 || isReloading) {
      sound.playClick();
      return;
    }
    setAmmo(a => a - 1);
    sound.playGunfire(activeWeapon === 'rpg');

    const speed = activeWeapon === 'rpg' ? 9 : 16;
    const isRpg = activeWeapon === 'rpg';

    entitiesRef.current.bullets.push({
      id: Math.random(),
      x: playerPos.x + Math.cos(aimAngle) * 35,
      y: playerPos.y + Math.sin(aimAngle) * 35,
      vx: Math.cos(aimAngle) * speed,
      vy: Math.sin(aimAngle) * speed,
      isRpg,
    });
  };

  const handleReload = () => {
    if (isReloading) return;
    setIsReloading(true);
    sound.playClick();
    setTimeout(() => {
      setAmmo(30);
      setIsReloading(false);
    }, 1200);
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
    } else if (skillType === 'airstrike') {
      entitiesRef.current.effects.push({
        id: Math.random(),
        x: canvasRef.current ? canvasRef.current.width / 2 : 500,
        y: canvasRef.current ? canvasRef.current.height / 2 : 400,
        type: 'explosion',
        life: 30,
        maxLife: 30,
      });
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-['Cairo',sans-serif] select-none text-right rtl">
      
      {/* Game Scene Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-none z-0" />

      {/* Modern Semi-Transparent Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none p-4 sm:p-6 flex flex-col justify-between">
        
        {/* TOP SECTION: Operations & Missions */}
        <div className="flex justify-between items-start w-full">
          
          {/* Left Side: Operations Region Panel */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-3 pointer-events-auto"
          >
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-64 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1 h-full bg-amber-500" />
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span className="text-white font-black text-lg">منطقة العمليات</span>
              </div>
              <div className="text-stone-300 text-sm font-bold">{currentProvince}</div>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-amber-500/80 uppercase tracking-tighter">
                <Activity className="w-3 h-3" />
                <span>حالة القطاع: نشط</span>
              </div>
            </div>

            {/* Survival Mission Box */}
            <AnimatePresence>
              {activeQuest && (
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-black/30 backdrop-blur-md border border-white/5 rounded-xl p-3 w-64 shadow-xl"
                >
                  <div className="flex items-center gap-2 mb-1 text-blue-400">
                    <TargetIcon className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase">مهمة البقاء</span>
                  </div>
                  <div className="text-white text-xs font-bold leading-tight">{activeQuest.titleAr}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Side: Branding & Settings */}
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col items-end gap-3 pointer-events-auto"
          >
            <div className="bg-gradient-to-l from-amber-600/20 to-transparent backdrop-blur-sm border-r-4 border-amber-500 px-6 py-2">
              <h1 className="text-white text-3xl font-black tracking-tighter drop-shadow-2xl">صقور اليمن</h1>
              <p className="text-amber-500 text-[10px] font-bold text-left tracking-widest uppercase">Hawks of Yemen</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={onOpenSettingsStore}
                className="p-3 bg-black/40 hover:bg-black/60 rounded-xl border border-white/10 text-white backdrop-blur-md shadow-xl transition-all cursor-pointer active:scale-90"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={onReturnToTitle}
                className="p-3 bg-red-600/40 hover:bg-red-600/60 rounded-xl border border-red-500/20 text-white backdrop-blur-md shadow-xl transition-all cursor-pointer active:scale-90"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* MIDDLE SECTION: Side Loadout Panel */}
        <div className="flex justify-between items-center w-full grow px-2">
          
          {/* Left Side: Loadout & Stats */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-4 pointer-events-auto"
          >
            {/* Health & Armor */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 w-72 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-blue-400" />
                <span className="text-white font-black text-sm uppercase">حالة المقاتل</span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-stone-400">
                    <span>الصحة</span>
                    <span className="text-blue-400">100/100</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div 
                      animate={{ width: `${playerHp}%` }}
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-stone-400">
                    <span>الدرع التكتيكي</span>
                    <span className="text-amber-500">{playerArmor}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div 
                      animate={{ width: `${playerArmor}%` }}
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" 
                    />
                  </div>
                </div>
              </div>

              {/* Weapon Switcher Icons */}
              <div className="mt-6 flex gap-2">
                <button 
                  onClick={() => { setActiveWeapon('akm'); sound.playSelect(); }}
                  className={`flex-1 h-14 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${activeWeapon === 'akm' ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10'}`}
                >
                  <Zap className="w-5 h-5" />
                  <span className="text-[8px] font-black uppercase">AKM</span>
                </button>
                <button 
                  onClick={() => { setActiveWeapon('rpg'); sound.playSelect(); }}
                  className={`flex-1 h-14 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${activeWeapon === 'rpg' ? 'bg-orange-500/20 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-white/5 border-white/10 text-stone-400 hover:bg-white/10'}`}
                >
                  <Swords className="w-5 h-5" />
                  <span className="text-[8px] font-black uppercase">RPG-7</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Tactical Actions */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-4 pointer-events-auto"
          >
            <button 
              onClick={() => handleMilitarySkillCall('tank_support')}
              className="w-16 h-16 rounded-3xl bg-black/40 hover:bg-red-600/40 border border-white/10 flex flex-col items-center justify-center text-red-500 backdrop-blur-md transition-all active:scale-90"
            >
              <Shield className="w-7 h-7" />
              <span className="text-[8px] font-black mt-1 uppercase">دفاع</span>
            </button>
            <button 
              onClick={() => handleMilitarySkillCall('airstrike')}
              className="w-16 h-16 rounded-3xl bg-black/40 hover:bg-cyan-600/40 border border-white/10 flex flex-col items-center justify-center text-cyan-400 backdrop-blur-md transition-all active:scale-90"
            >
              <Compass className="w-7 h-7" />
              <span className="text-[8px] font-black mt-1 uppercase">غارة</span>
            </button>
          </motion.div>
        </div>

        {/* BOTTOM SECTION: Stats & Mobile Controls */}
        <div className="flex justify-between items-end w-full">
          
          {/* Left Side: Inventory & Quests Access */}
          <div className="flex gap-3 pointer-events-auto">
            <button 
              onClick={onOpenInventory}
              className="flex items-center gap-3 px-6 py-4 bg-black/40 hover:bg-black/60 rounded-2xl border border-white/10 text-white backdrop-blur-xl shadow-2xl transition-all"
            >
              <Backpack className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-black">العتاد</span>
            </button>
            <button 
              onClick={onOpenQuestLog}
              className="flex items-center gap-3 px-6 py-4 bg-black/40 hover:bg-black/60 rounded-2xl border border-white/10 text-white backdrop-blur-xl shadow-2xl transition-all"
            >
              <Scroll className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-black">المهام</span>
            </button>
            <button 
              onClick={onOpenDailyChallenges}
              className="flex items-center gap-3 px-6 py-4 bg-black/40 hover:bg-black/60 rounded-2xl border border-amber-500/20 text-white backdrop-blur-xl shadow-2xl transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1 h-full bg-amber-500" />
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-black">التحديات</span>
            </button>
          </div>

          {/* Right Side: HUD Info Panel */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl px-8 py-5 flex items-center gap-10 shadow-2xl pointer-events-auto"
          >
            <div className="text-right">
              <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">الأعداء المقضي عليهم</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-500 tabular-nums leading-none">{kills}</span>
                <span className="text-stone-600 text-[10px] font-bold">هدف</span>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-right">
              <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">نمط اللعبة</div>
              <div className="text-sm font-black text-white leading-none">قتال تكتيكي معاصر</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-right flex flex-col items-end">
              <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">الذخيرة</div>
              <div className="flex items-center gap-2">
                <Shell className={`w-4 h-4 ${ammo < 10 ? 'text-red-500 animate-pulse' : 'text-stone-400'}`} />
                <span className={`text-xl font-black tabular-nums ${ammo < 10 ? 'text-red-500' : 'text-white'}`}>{ammo}/30</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Mobile Virtual Controls */}
      {isTouch && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <VirtualControls 
            onMove={(x, z) => {
              setPlayerPos(prev => ({
                x: Math.max(60, Math.min(window.innerWidth - 60, prev.x + x * 5)),
                y: Math.max(60, Math.min(window.innerHeight - 60, prev.y + z * 5)),
              }));
            }}
            onAction={() => fireWeapon()}
            onStopBlock={() => {}}
          />
        </div>
      )}

    </div>
  );
};
