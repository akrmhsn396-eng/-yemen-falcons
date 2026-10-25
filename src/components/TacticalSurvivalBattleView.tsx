import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Zap, Swords, Compass, MapPin, Clock, Backpack, Scroll, 
  Settings, ChevronRight, Crosshair, Flame, Target, Trophy, AlertTriangle, RefreshCw,
  Activity, User, Target as TargetIcon, Shell, Star, Sparkles, Navigation, Radio, Plane, Scan,
  Eye, ZapOff, Loader2, Send, MessageSquare, Crown, Package, AlertCircle, Volume2
} from 'lucide-react';
import { FighterInstance, GameStats, RPGItem, RPGQuest, DailyChallenge } from '../types/game';
import { VirtualControls } from './VirtualControls';
import { sound } from '../game/audio';
import { useGameStore, ALL_ATTACHMENTS } from '../store/gameStore';
import { PostBattleSummary } from './PostBattleSummary';

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
  state: 'advancing' | 'defending' | 'attacking';
  lastFireTime: number;
}

interface Effect {
  id: number;
  x: number;
  y: number;
  type: 'explosion' | 'muzzle' | 'airstrike' | 'recon' | 'hit' | 'build';
  life: number;
  maxLife: number;
}

interface Structure {
  id: number;
  x: number;
  y: number;
  type: 'watchtower' | 'trench';
  hp: number;
  maxHp: number;
}

interface DestructibleObject {
  id: number;
  x: number;
  y: number;
  type: 'barrel' | 'fence' | 'crate';
  hp: number;
  maxHp: number;
  width: number;
  height: number;
}

interface Vegetation {
  id: number;
  x: number;
  y: number;
  type: 'sidr' | 'qat' | 'shrub';
  size: number;
}

interface DamageIndicator {
  id: number;
  angle: number;
  timestamp: number;
}

interface JetFlyer {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  progress: number;
  bombsDropped: boolean;
}

interface SupplyPackage {
  id: number;
  x: number;
  y: number;
  targetY: number;
  progress: number;
  isLanded: boolean;
  collected: boolean;
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
  const lastPassiveTick = useRef(Date.now());
  const [isTouch, setIsTouch] = useState(false);
  const activeQuest = quests.find(q => !q.isCompleted) || quests[0];

  const {
    tacticalPoints,
    addTacticalPoints,
    openWeaponCustomization,
    weaponUpgrades,
    leaderSkills,
    openLeaderSkills,
  } = useGameStore();

  // Player State
  const maxArmorBase = 90 + ((leaderSkills?.squadFortification || 1) * 20);
  const [playerPos, setPlayerPos] = useState({ x: 500, y: 450 });
  const [playerHp, setPlayerHp] = useState(100);
  const [playerArmor, setPlayerArmor] = useState(maxArmorBase);
  const [ammo, setAmmo] = useState(30);
  const [activeWeapon, setActiveWeapon] = useState<'akm' | 'rpg' | 'sniper'>('akm');
  const [kills, setKills] = useState(0);
  const [isReloading, setIsReloading] = useState(false);
  const [aimAngle, setAimAngle] = useState(0);

  // Strategic Air Support Gauge & Resource Meter (0 - 100%)
  const [airSupportMeter, setAirSupportMeter] = useState(55);
  const [targetingMode, setTargetingMode] = useState<'airstrike' | 'recon' | 'supply_drop' | null>(null);
  const [isReconActive, setIsReconActive] = useState(false);
  const [reconTimer, setReconTimer] = useState(0);

  // Tactical Systems
  const [buildMode, setBuildMode] = useState<'watchtower' | 'trench' | null>(null);

  // Tactical Stealth
  const [isCamouflaged, setIsCamouflaged] = useState(false);

  // Damage Direction Indicators & Mountain Contrast
  const [damageIndicators, setDamageIndicators] = useState<DamageIndicator[]>([]);
  const [lastDamageTime, setLastDamageTime] = useState(0);
  const [isHighContrastMode, setIsHighContrastMode] = useState(true);

  // Game Stats Tracking
  const [shotsFired, setShotsFired] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [startTime] = useState(Date.now());
  const [earnedPT, setEarnedPT] = useState(0);

  // Chat System
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ id: number; sender: string; text: string; type: 'system' | 'player' }[]>([
    { id: 1, sender: 'القيادة العامة', text: 'تم تأمين القطاع العملياتي. جاهزية الدعم الجوي ومؤشرات الرصد نشطة.', type: 'system' },
    { id: 2, sender: 'الرادار', text: 'اضغط Enter للدردشة التكتيكية • راقب مقياس الدعم الجوي في الأعلى.', type: 'system' },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const addMessage = (text: string, sender: string = 'لاعب', type: 'system' | 'player' = 'player') => {
    setMessages(prev => [...prev, { id: Date.now(), sender, text, type }]);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const entitiesRef = useRef<{
    enemies: Enemy[];
    bullets: Bullet[];
    effects: Effect[];
    structures: Structure[];
    destructibles: DestructibleObject[];
    vegetation: Vegetation[];
    jets: JetFlyer[];
    supplies: SupplyPackage[];
    keys: { [key: string]: boolean };
    mouse: { x: number; y: number };
  }>({
    enemies: [
      { id: 1, x: 200, y: 200, hp: 60, maxHp: 60, type: 'militant', state: 'advancing', lastFireTime: 0 },
      { id: 2, x: 800, y: 300, hp: 100, maxHp: 100, type: 'armored_car', state: 'advancing', lastFireTime: 0 },
      { id: 3, x: 500, y: 150, hp: 45, maxHp: 45, type: 'sniper', state: 'advancing', lastFireTime: 0 },
      { id: 4, x: 150, y: 450, hp: 60, maxHp: 60, type: 'militant', state: 'advancing', lastFireTime: 0 },
    ],
    bullets: [],
    effects: [],
    structures: [],
    destructibles: [
      { id: 101, x: 300, y: 700, type: 'barrel', hp: 40, maxHp: 40, width: 30, height: 40 },
      { id: 102, x: 340, y: 700, type: 'barrel', hp: 40, maxHp: 40, width: 30, height: 40 },
      { id: 103, x: 600, y: 650, type: 'fence', hp: 30, maxHp: 30, width: 80, height: 20 },
      { id: 104, x: 700, y: 800, type: 'crate', hp: 50, maxHp: 50, width: 40, height: 40 },
      { id: 105, x: 200, y: 850, type: 'fence', hp: 30, maxHp: 30, width: 80, height: 20 },
    ],
    vegetation: [
      { id: 201, x: 150, y: 150, type: 'sidr', size: 60 },
      { id: 202, x: 800, y: 150, type: 'sidr', size: 70 },
      { id: 203, x: 450, y: 750, type: 'qat', size: 50 },
      { id: 204, x: 100, y: 600, type: 'shrub', size: 45 },
      { id: 205, x: 900, y: 550, type: 'qat', size: 55 },
    ],
    jets: [],
    supplies: [],
    keys: {},
    mouse: { x: 500, y: 450 },
  });

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    sound.startMountainAmbience();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (isChatOpen) {
          if (chatInput.trim()) {
            addMessage(chatInput);
            setChatInput('');
          }
          setIsChatOpen(false);
        } else {
          setIsChatOpen(true);
        }
        return;
      }

      if (isChatOpen) return;

      entitiesRef.current.keys[e.key.toLowerCase()] = true;
      if (e.key === 'r' || e.key === 'R') handleReload();
      if (e.key === '1') setActiveWeapon('akm');
      if (e.key === '2') setActiveWeapon('rpg');
      if (e.key === 'Escape') { setTargetingMode(null); setBuildMode(null); }
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
      if (e.target !== canvasRef.current) return;
      
      if (targetingMode) {
        confirmAirSupport(entitiesRef.current.mouse.x, entitiesRef.current.mouse.y);
      } else if (buildMode) {
        confirmBuild(entitiesRef.current.mouse.x, entitiesRef.current.mouse.y);
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
        const speed = 4.8;
        let dx = 0;
        let dy = 0;

        if (!targetingMode && !buildMode && !isChatOpen) {
          if (keys['w'] || keys['arrowup']) dy -= speed;
          if (keys['s'] || keys['arrowdown']) dy += speed;
          if (keys['a'] || keys['arrowleft']) dx -= speed;
          if (keys['d'] || keys['arrowright']) dx += speed;
        }

        setPlayerPos(prev => ({
          x: Math.max(60, Math.min(canvas.width - 60, prev.x + dx)),
          y: Math.max(60, Math.min(canvas.height - 60, prev.y + dy)),
        }));

        // Update Camouflage Status
        let inCover = false;
        const veg = (entitiesRef.current as any).vegetation as Vegetation[];
        veg.forEach(v => {
          if (Math.hypot(playerPos.x - v.x, playerPos.y - v.y) < v.size * 0.7) {
            inCover = true;
          }
        });
        if (inCover !== isCamouflaged) {
          setIsCamouflaged(inCover);
          if (inCover) addMessage('تم تفعيل التمويه التكتيكي. الرؤية محدودة للأعداء.', 'الاستخبارات', 'system');
        }

        // --- HIGH FIDELITY BACKGROUND RENDER ---
        
        // Atmospheric Sky
        const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
        skyGradient.addColorStop(0, '#07101a');
        skyGradient.addColorStop(0.3, '#0b1220');
        skyGradient.addColorStop(0.7, '#0c1724');
        skyGradient.addColorStop(1, '#1a365d');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);

        // Ground (Tactical Pavement)
        const groundGradient = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height);
        groundGradient.addColorStop(0, '#1c1917');
        groundGradient.addColorStop(1, '#0c0a09');
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

        // Grid & Distance markers
        ctx.strokeStyle = 'rgba(79, 209, 197, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 100) {
          ctx.beginPath(); ctx.moveTo(i, canvas.height * 0.6); ctx.lineTo(i, canvas.height); ctx.stroke();
        }
        for (let j = canvas.height * 0.6; j < canvas.height; j += 40) {
          ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
        }

        const drawAdvancedBuilding = (x: number, y: number, w: number, h: number, baseColor: string) => {
          ctx.save();
          ctx.fillStyle = baseColor;
          ctx.fillRect(x, y, w, h);
          ctx.fillStyle = 'rgba(0,0,0,0.2)';
          ctx.fillRect(x + w * 0.7, y, w * 0.3, h);
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(x - 5, y + 15, w + 10, 12);
          ctx.fillRect(x - 2, y + h * 0.4, w + 4, 8);
          ctx.fillRect(x - 2, y + h * 0.8, w + 4, 8);
          const rLimit = Math.floor(h / 60);
          for (let r = 1; r < rLimit; r++) {
            const wy = y + r * 50;
            [0.25, 0.5, 0.75].forEach(pct => {
              const wx = x + w * pct - 12;
              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.beginPath(); ctx.arc(wx + 12, wy, 10, Math.PI, 0); ctx.fill();
              ctx.fillStyle = '#1c1917'; ctx.fillRect(wx, wy, 24, 20);
              ctx.fillStyle = 'rgba(79, 209, 197, 0.2)'; ctx.fillRect(wx + 2, wy + 2, 20, 16);
            });
          }
          ctx.restore();
        };

        drawAdvancedBuilding(50, 100, 150, canvas.height * 0.5, '#78350f');
        drawAdvancedBuilding(280, 60, 180, canvas.height * 0.6, '#92400e');
        drawAdvancedBuilding(550, 120, 140, canvas.height * 0.45, '#78350f');
        drawAdvancedBuilding(780, 40, 200, canvas.height * 0.65, '#92400e');
        
        // --- DRAW STRUCTURES ---
        entitiesRef.current.structures.forEach((st: Structure) => {
          ctx.save();
          ctx.translate(st.x, st.y);
          if (st.type === 'watchtower') {
            // Watchtower shadow
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.beginPath(); ctx.ellipse(0, 10, 40, 20, 0, 0, Math.PI*2); ctx.fill();
            // Main structure
            ctx.fillStyle = '#4a5568';
            ctx.fillRect(-20, -60, 40, 60);
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(-25, -70, 50, 15);
            // Light
            ctx.fillStyle = 'rgba(79, 209, 197, 0.4)';
            ctx.beginPath(); ctx.arc(0, -62, 8, 0, Math.PI*2); ctx.fill();
          } else {
            // Trench
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.beginPath();
            ctx.roundRect(-40, -15, 80, 30, 8);
            ctx.fill();
            ctx.strokeStyle = '#2d3748';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          // HP Bar
          ctx.fillStyle = 'rgba(0,0,0,0.8)';
          ctx.fillRect(-20, 15, 40, 3);
          ctx.fillStyle = '#4fd1c5';
          ctx.fillRect(-20, 15, (st.hp / st.maxHp) * 40, 3);
          ctx.restore();
        });

        const bullets = entitiesRef.current.bullets;
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.x += b.vx; b.y += b.vy;
          ctx.fillStyle = b.isRpg ? '#ef4444' : '#4fd1c5';
          ctx.shadowBlur = b.isRpg ? 15 : 5;
          ctx.shadowColor = b.isRpg ? '#ef4444' : '#4fd1c5';
          ctx.beginPath(); ctx.arc(b.x, b.y, b.isRpg ? 8 : 4, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;

          if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
            bullets.splice(i, 1); continue;
          }

          // Check hit against player
          if (Math.hypot(b.x - playerPos.x, b.y - playerPos.y) < 30) {
            // Directional damage indicator calculation
            const hitAngle = Math.atan2(b.y - playerPos.y, b.x - playerPos.x);
            setDamageIndicators(prev => [...prev.slice(-3), { id: Math.random(), angle: hitAngle, timestamp: Date.now() }]);
            setLastDamageTime(Date.now());
            sound.playDamageHit();

            const fortLevel = leaderSkills?.squadFortification || 1;
            const fortDmgRed = Math.max(0.60, 1 - (fortLevel * 0.07));
            const rawDmg = (b.isRpg ? 24 : 7) * fortDmgRed;

            setPlayerArmor(a => Math.max(0, a - rawDmg * 0.7));
            setPlayerHp(h => {
              const hpDmg = playerArmor > 0 ? rawDmg * 0.35 : rawDmg;
              const newHp = Math.max(0, Math.round(h - hpDmg));
              if (newHp === 0 && !isGameOver) setIsGameOver(true);
              return newHp;
            });
            bullets.splice(i, 1);
            entitiesRef.current.effects.push({ id: Math.random(), x: playerPos.x, y: playerPos.y, type: 'hit', life: 10, maxLife: 10 });
            continue;
          }

          const enemies = entitiesRef.current.enemies;
          let bulletHit = false;

          for (let j = enemies.length - 1; j >= 0; j--) {
            const en = enemies[j];
            if (Math.hypot(b.x - en.x, b.y - en.y) < 35) {
              const sniperLvl = leaderSkills?.sniperPrecision || 1;
              const isCrit = Math.random() < (0.15 + sniperLvl * 0.08);
              let dmg = (b.isRpg ? 90 : 32) * (isReconActive ? 1.35 : 1);
              if (isCrit) dmg *= 1.5;

              en.hp -= Math.round(dmg);
              entitiesRef.current.effects.push({ 
                id: Math.random(), 
                x: en.x, 
                y: en.y, 
                type: 'hit', 
                life: 10, 
                maxLife: 10 
              });
              bulletHit = true;
              break;
            }
          }

          if (!bulletHit) {
            const destructibles = entitiesRef.current.destructibles;
            for (let j = destructibles.length - 1; j >= 0; j--) {
              const d = destructibles[j];
              if (b.x > d.x - d.width/2 && b.x < d.x + d.width/2 && b.y > d.y - d.height/2 && b.y < d.y + d.height/2) {
                d.hp -= b.isRpg ? 100 : 25;
                entitiesRef.current.effects.push({ id: Math.random(), x: b.x, y: b.y, type: 'hit', life: 8, maxLife: 8 });
                bulletHit = true;
                if (d.hp <= 0) {
                  destructibles.splice(j, 1);
                  sound.playExplosion();
                  setAirSupportMeter(m => Math.min(100, m + 4));
                  entitiesRef.current.effects.push({ id: Math.random(), x: d.x, y: d.y, type: 'explosion', life: 15, maxLife: 15 });
                  addMessage(`تم تدمير ${d.type === 'barrel' ? 'برميل' : d.type === 'crate' ? 'صندوق' : 'سياج'} ميداني. (+4% دعم جوي)`, 'النظام', 'system');
                }
                break;
              }
            }
          }

          if (bulletHit) {
            bullets.splice(i, 1);
          }
        }

        const enemies = entitiesRef.current.enemies;
        const structures = entitiesRef.current.structures;
        const destructibles = entitiesRef.current.destructibles;
        const currentTime = Date.now();

        for (let j = enemies.length - 1; j >= 0; j--) {
          const en = enemies[j];
          if (en.hp <= 0) {
            enemies.splice(j, 1);
            setKills(k => k + 1); 
            addTacticalPoints(25);
            setEarnedPT(p => p + 25);
            setAirSupportMeter(m => Math.min(100, m + 8));
            sound.playExplosion();
            entitiesRef.current.effects.push({ id: Math.random(), x: en.x, y: en.y, type: 'explosion', life: 25, maxLife: 25 });
            setTimeout(() => {
              entitiesRef.current.enemies.push({ 
                id: Math.random(), 
                x: Math.random() * (canvas.width - 200) + 100, 
                y: Math.random() * (canvas.height - 200) + 100, 
                hp: 60, 
                maxHp: 60, 
                type: 'militant',
                state: 'advancing',
                lastFireTime: 0
              });
            }, 2500);
            continue;
          }

          // --- TACTICAL AI ALGORITHM ---
          const distToPlayer = Math.hypot(playerPos.x - en.x, playerPos.y - en.y);
          
          // 1. Determine State
          if (en.hp < en.maxHp * 0.4) {
            en.state = 'defending';
          } else if (distToPlayer < 300) {
            en.state = 'attacking';
          } else {
            en.state = 'advancing';
          }

          // 2. Movement Logic
          let targetX = playerPos.x;
          let targetY = playerPos.y;
          let moveSpeed = 0.8;

          if (en.state === 'defending' && structures.length > 0) {
            // Seek nearest cover
            let nearestStructure = structures[0];
            let minDist = Math.hypot(en.x - structures[0].x, en.y - structures[0].y);
            structures.forEach(s => {
              const d = Math.hypot(en.x - s.x, en.y - s.y);
              if (d < minDist) { minDist = d; nearestStructure = s; }
            });
            targetX = nearestStructure.x;
            targetY = nearestStructure.y;
            moveSpeed = 1.2; // Move faster to cover
            if (minDist < 20) moveSpeed = 0; // Stay in cover
          } else if (en.state === 'attacking') {
            // Keep distance and try to flank (coordinated)
            const angleToPlayer = Math.atan2(playerPos.y - en.y, playerPos.x - en.x);
            // Flanking offset based on enemy ID to spread them out
            const flankAngle = angleToPlayer + (en.id % 2 === 0 ? 0.5 : -0.5);
            targetX = playerPos.x - Math.cos(flankAngle) * 200;
            targetY = playerPos.y - Math.sin(flankAngle) * 200;
            moveSpeed = 1.0;
          }

          const angleToTarget = Math.atan2(targetY - en.y, targetX - en.x);
          en.x += Math.cos(angleToTarget) * moveSpeed;
          en.y += Math.sin(angleToTarget) * moveSpeed;

          // 3. Coordinated Attack (Firing) - Modified for Camouflage
          const camoSkill = leaderSkills?.mountainSurvival || 1;
          const detectionRange = isCamouflaged ? Math.max(50, 110 - camoSkill * 12) : 400;
          if (distToPlayer < detectionRange && currentTime - en.lastFireTime > 2000) {
            en.lastFireTime = currentTime;
            const bulletSpeed = 6;
            entitiesRef.current.bullets.push({
              id: Math.random(),
              x: en.x,
              y: en.y,
              vx: Math.cos(angleToTarget) * bulletSpeed,
              vy: Math.sin(angleToTarget) * bulletSpeed,
              isRpg: en.type === 'armored_car' && Math.random() > 0.7
            });
          }

          // 4. Rendering Enemy
          ctx.save(); ctx.translate(en.x, en.y);
          
          // AI State Indicator
          ctx.fillStyle = en.state === 'defending' ? '#3b82f6' : (en.state === 'attacking' ? '#ef4444' : '#fbbf24');
          ctx.font = 'bold 9px Cairo';
          ctx.textAlign = 'center';
          ctx.fillText(en.state.toUpperCase(), 0, -45);

          ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0, 20, 20, 10, 0, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = en.type === 'armored_car' ? '#4a5568' : '#ef4444'; 
          ctx.beginPath(); ctx.arc(0, 0, en.type === 'armored_car' ? 25 : 18, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = isHighContrastMode ? '#ffffff' : 'rgba(255,255,255,0.7)'; 
          ctx.lineWidth = isHighContrastMode ? 4 : 2; 
          ctx.stroke();

          // Recon Target Locks Brackets
          if (isReconActive) {
            ctx.save();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            const b = 32;
            ctx.beginPath();
            // Top-left
            ctx.moveTo(-b, -b + 10); ctx.lineTo(-b, -b); ctx.lineTo(-b + 10, -b);
            // Top-right
            ctx.moveTo(b - 10, -b); ctx.lineTo(b, -b); ctx.lineTo(b, -b + 10);
            // Bottom-left
            ctx.moveTo(-b, b - 10); ctx.lineTo(-b, b); ctx.lineTo(-b + 10, b);
            // Bottom-right
            ctx.moveTo(b - 10, b); ctx.lineTo(b, b); ctx.lineTo(b, b - 10);
            ctx.stroke();

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 8px Cairo';
            ctx.fillText(`LOCK [${Math.round(distToPlayer)}m]`, 0, b + 12);
            ctx.restore();
          }
          
          // HP Bar
          ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(-22, -32, 44, 6);
          ctx.fillStyle = '#22c55e'; ctx.fillRect(-22, -32, (en.hp / en.maxHp) * 44, 6);
          if (isHighContrastMode) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.strokeRect(-22, -32, 44, 6);
          }
          ctx.restore();
        }

        // --- DRAW VEGETATION ---
        const vegList = (entitiesRef.current as any).vegetation as Vegetation[];
        vegList.forEach(v => {
          ctx.save();
          ctx.translate(v.x, v.y);
          
          const drawLeaf = (ox: number, oy: number, s: number, color: string) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(ox, oy, s, s*0.6, Math.random() * Math.PI, 0, Math.PI*2);
            ctx.fill();
          };

          if (v.type === 'sidr') {
            // Sidr tree (Yemeni Jujube)
            ctx.fillStyle = '#451a03';
            ctx.fillRect(-5, -10, 10, 30);
            for (let i = 0; i < 15; i++) {
              drawLeaf((Math.random()-0.5)*v.size, (Math.random()-0.5)*v.size, 15 + Math.random()*10, '#065f46');
              drawLeaf((Math.random()-0.5)*v.size, (Math.random()-0.5)*v.size, 10 + Math.random()*5, '#064e3b');
            }
          } else if (v.type === 'qat') {
            // Qat shrub
            for (let i = 0; i < 12; i++) {
              drawLeaf((Math.random()-0.5)*v.size, (Math.random()-0.5)*v.size, 12, '#059669');
              drawLeaf((Math.random()-0.5)*v.size, (Math.random()-0.5)*v.size, 8, '#34d399');
            }
          } else {
            // Mountain shrub
            for (let i = 0; i < 10; i++) {
              drawLeaf((Math.random()-0.5)*v.size, (Math.random()-0.5)*v.size, 10, '#166534');
            }
          }
          ctx.restore();
        });

        // --- DRAW DESTRUCTIBLES ---
        destructibles.forEach(d => {
          ctx.save();
          ctx.translate(d.x, d.y);
          
          if (d.type === 'barrel') {
            ctx.fillStyle = '#78350f'; // Dark wood/oil color
            ctx.beginPath();
            ctx.roundRect(-d.width/2, -d.height/2, d.width, d.height, 5);
            ctx.fill();
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Metal bands
            ctx.fillStyle = '#4b5563';
            ctx.fillRect(-d.width/2, -d.height/4, d.width, 4);
            ctx.fillRect(-d.width/2, d.height/4 - 4, d.width, 4);
          } else if (d.type === 'crate') {
            ctx.fillStyle = '#92400e';
            ctx.fillRect(-d.width/2, -d.height/2, d.width, d.height);
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 2;
            ctx.strokeRect(-d.width/2, -d.height/2, d.width, d.height);
            // Diagonal cross
            ctx.beginPath();
            ctx.moveTo(-d.width/2, -d.height/2); ctx.lineTo(d.width/2, d.height/2);
            ctx.moveTo(d.width/2, -d.height/2); ctx.lineTo(-d.width/2, d.height/2);
            ctx.stroke();
          } else if (d.type === 'fence') {
            ctx.fillStyle = '#78350f';
            for (let i = 0; i < 4; i++) {
              ctx.fillRect(-d.width/2 + i * 20, -d.height/2, 12, d.height);
            }
            ctx.fillRect(-d.width/2, -5, d.width, 10);
          }

          // HP Bar for destructibles (only if damaged)
          if (d.hp < d.maxHp) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(-15, d.height/2 + 5, 30, 3);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(-15, d.height/2 + 5, (d.hp / d.maxHp) * 30, 3);
          }
          
          ctx.restore();
        });

        // --- PASSIVE TICK (HP REGEN & AIR GAUGE RECHARGE) ---
        const nowTime = Date.now();
        if (nowTime - lastPassiveTick.current > 2000) {
          lastPassiveTick.current = nowTime;

          // Air Support gauge recharge
          const logisticsLvl = leaderSkills?.airSupportLogistics || 1;
          setAirSupportMeter(m => Math.min(100, +(m + 1.2 * (1 + logisticsLvl * 0.25)).toFixed(1)));

          // Leader skill rapid healing
          const healingLvl = leaderSkills?.rapidHealing || 1;
          const healAmount = inCover ? (2.5 + healingLvl * 1.5) : (1 + healingLvl * 0.8);
          setPlayerHp(hp => Math.min(100, Math.round(hp + healAmount)));

          // Recon timer decrement
          if (isReconActive) {
            setReconTimer(t => {
              if (t <= 2) {
                setIsReconActive(false);
                addMessage('انتهت مدة استطلاع درون الاستكشاف UAV.', 'الاستخبارات', 'system');
                return 0;
              }
              return t - 2;
            });
          }
        }

        // --- UPDATE & DRAW JETS (AIR SUPPORT) ---
        const jets = entitiesRef.current.jets;
        for (let j = jets.length - 1; j >= 0; j--) {
          const jet = jets[j];
          jet.progress += 0.024;
          jet.currentX = jet.startX + (jet.endX - jet.startX) * jet.progress;
          jet.currentY = jet.startY + (jet.endY - jet.startY) * jet.progress;

          if (jet.progress >= 0.45 && !jet.bombsDropped) {
            jet.bombsDropped = true;
            for (let b = 0; b < 4; b++) {
              setTimeout(() => {
                const ox = (Math.random() - 0.5) * 140;
                const oy = (Math.random() - 0.5) * 140;
                sound.playExplosion();
                entitiesRef.current.effects.push({
                  id: Math.random(),
                  x: jet.targetX + ox,
                  y: jet.targetY + oy,
                  type: 'airstrike',
                  life: 45,
                  maxLife: 45,
                });
                entitiesRef.current.enemies.forEach(en => {
                  if (Math.hypot(en.x - (jet.targetX + ox), en.y - (jet.targetY + oy)) < 130) {
                    en.hp -= 180;
                  }
                });
                entitiesRef.current.destructibles.forEach(d => {
                  if (Math.hypot(d.x - (jet.targetX + ox), d.y - (jet.targetY + oy)) < 130) {
                    d.hp -= 150;
                  }
                });
              }, b * 120);
            }
          }

          // Draw Supersonic Jet
          ctx.save();
          ctx.translate(jet.currentX, jet.currentY);
          const jetAngle = Math.atan2(jet.endY - jet.startY, jet.endX - jet.startX);
          ctx.rotate(jetAngle);

          // Sonic shockwave cone
          ctx.strokeStyle = 'rgba(79, 209, 197, 0.4)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(-20, 0, 50, Math.PI * 0.7, Math.PI * 1.3);
          ctx.stroke();

          // Afterburner flames
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(-35, -5);
          ctx.lineTo(-65 - Math.random() * 25, 0);
          ctx.lineTo(-35, 5);
          ctx.fill();

          // Jet fuselage
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.moveTo(40, 0);
          ctx.lineTo(-25, -28);
          ctx.lineTo(-15, -8);
          ctx.lineTo(-35, -8);
          ctx.lineTo(-30, 0);
          ctx.lineTo(-35, 8);
          ctx.lineTo(-15, 8);
          ctx.lineTo(-25, 28);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = '#4fd1c5';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Cockpit canopy
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.ellipse(10, 0, 10, 3, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (jet.progress >= 1.1) {
            jets.splice(j, 1);
          }
        }

        // --- UPDATE & DRAW SUPPLY PACKAGES ---
        const supplies = entitiesRef.current.supplies;
        for (let s = supplies.length - 1; s >= 0; s--) {
          const sup = supplies[s];
          if (!sup.isLanded) {
            sup.progress += 0.015;
            sup.y = sup.y + (sup.targetY - sup.y) * 0.05;
            if (Math.abs(sup.y - sup.targetY) < 6 || sup.progress >= 1) {
              sup.y = sup.targetY;
              sup.isLanded = true;
              sound.playDigOrBuild();
            }
          }

          ctx.save();
          ctx.translate(sup.x, sup.y);

          if (!sup.isLanded) {
            // Parachute
            ctx.fillStyle = '#059669';
            ctx.beginPath();
            ctx.arc(0, -50, 35, Math.PI, 0);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#34d399';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Ropes
            ctx.strokeStyle = 'rgba(255,255,255,0.6)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-30, -50); ctx.lineTo(-10, -15);
            ctx.moveTo(30, -50); ctx.lineTo(10, -15);
            ctx.moveTo(0, -50); ctx.lineTo(0, -15);
            ctx.stroke();
          } else {
            // Pulsing beacon ring
            const pulse = (Date.now() % 1000) / 1000;
            ctx.strokeStyle = `rgba(79, 209, 197, ${1 - pulse})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 25 + pulse * 20, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Crate Body
          ctx.fillStyle = '#065f46';
          ctx.fillRect(-16, -16, 32, 32);
          ctx.strokeStyle = '#4fd1c5';
          ctx.lineWidth = 2;
          ctx.strokeRect(-16, -16, 32, 32);
          // Medical cross
          ctx.fillStyle = '#4fd1c5';
          ctx.fillRect(-9, -3, 18, 6);
          ctx.fillRect(-3, -9, 6, 18);
          ctx.restore();

          // Check player collection
          if (sup.isLanded && !sup.collected) {
            if (Math.hypot(playerPos.x - sup.x, playerPos.y - sup.y) < 45) {
              sup.collected = true;
              setPlayerHp(hp => Math.min(100, hp + 50));
              setPlayerArmor(ar => Math.min(maxArmorBase, ar + 50));
              setAmmo(30);
              addTacticalPoints(75);
              sound.playSectorCapture();
              addMessage('تم استلام الإنزال الجوي! (+50 HP، +50 درع، ذخيرة كاملة، +75 PT)', 'الإمداد الجوي', 'system');
              supplies.splice(s, 1);
            }
          }
        }

        const effects = entitiesRef.current.effects;
        for (let i = effects.length - 1; i >= 0; i--) {
          const ef = effects[i]; ef.life--;
          const maxL = ef.maxLife || 18;
          const ratio = ef.life / maxL;
          ctx.save(); ctx.translate(ef.x, ef.y);
          if (ef.type === 'recon') {
            ctx.strokeStyle = `rgba(56, 189, 248, ${ratio})`;
            ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, (1 - ratio) * 220, 0, Math.PI * 2); ctx.stroke();
          } else if (ef.type === 'hit') {
            ctx.fillStyle = `rgba(255, 255, 255, ${ratio})`;
            ctx.beginPath(); ctx.arc(0, 0, (1 - ratio) * 30, 0, Math.PI * 2); ctx.fill();
          } else {
            const grad = ctx.createRadialGradient(0,0,0,0,0,(1 - ratio) * 60);
            grad.addColorStop(0, `rgba(249, 115, 22, ${ratio})`);
            grad.addColorStop(1, `rgba(239, 68, 68, 0)`);
            ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(0, 0, (1 - ratio) * 60, 0, Math.PI * 2); ctx.fill();
          }
          ctx.restore();
          if (ef.life <= 0) effects.splice(i, 1);
        }

        ctx.save(); ctx.translate(playerPos.x, playerPos.y); ctx.rotate(aimAngle);
        if (isCamouflaged) ctx.globalAlpha = 0.4;
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0, 24, 24, 12, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#27272a'; ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#4fd1c5'; ctx.lineWidth = 4; ctx.stroke();
        ctx.fillStyle = '#444'; ctx.fillRect(-20, -10, 10, 20);
        ctx.fillStyle = '#09090b'; ctx.fillRect(10, -7, 45, 14);
        ctx.restore();

        const m = entitiesRef.current.mouse;
        const isActionActive = targetingMode || buildMode;
        const actionColor = targetingMode 
          ? (targetingMode === 'airstrike' ? '#ef4444' : targetingMode === 'supply_drop' ? '#38bdf8' : '#22c55e') 
          : '#4fd1c5';
        
        ctx.strokeStyle = isActionActive ? actionColor : 'rgba(79, 209, 197, 0.8)';
        ctx.lineWidth = 2; ctx.setLineDash(isActionActive ? [5, 5] : []);
        ctx.beginPath(); ctx.arc(m.x, m.y, isActionActive ? 80 : 16, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        
        if (!isActionActive) {
          ctx.beginPath(); ctx.moveTo(m.x - 25, m.y); ctx.lineTo(m.x - 10, m.y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(m.x + 25, m.y); ctx.lineTo(m.x + 10, m.y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(m.x, m.y - 25); ctx.lineTo(m.x, m.y - 10); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(m.x, m.y + 25); ctx.lineTo(m.x, m.y + 10); ctx.stroke();
        } else {
          ctx.fillStyle = targetingMode === 'airstrike' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(79, 209, 197, 0.12)';
          ctx.fill();
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
  }, [currentProvince, playerPos.x, playerPos.y, targetingMode, isChatOpen, chatInput]);

  const fireWeapon = () => {
    if (ammo <= 0 || isReloading) { sound.playClick(); return; }
    setAmmo(a => a - 1); 
    setShotsFired(s => s + 1);
    sound.playGunfire(activeWeapon === 'rpg');
    
    // Apply Accuracy Bonus from Upgrades/Attachments
    const weaponId = activeWeapon === 'akm' ? 'i1' : 'i2';
    const upgrade = weaponUpgrades[weaponId];
    let accuracyBonus = 1;
    if (upgrade) {
      accuracyBonus *= (1 + (upgrade.levels.accuracy - 1) * 0.1);
      Object.values(upgrade.activeAttachments).forEach(attId => {
        const att = ALL_ATTACHMENTS.find(a => a.id === attId);
        if (att?.bonus.accuracy) accuracyBonus *= att.bonus.accuracy;
      });
    }

    const speed = activeWeapon === 'rpg' ? 10 : 18;
    const spread = (1 / accuracyBonus) * 0.1; // Reduced spread with better accuracy
    const randomAngle = aimAngle + (Math.random() - 0.5) * spread;

    entitiesRef.current.bullets.push({ 
      id: Math.random(), 
      x: playerPos.x + Math.cos(aimAngle) * 40, 
      y: playerPos.y + Math.sin(aimAngle) * 40, 
      vx: Math.cos(randomAngle) * speed, 
      vy: Math.sin(randomAngle) * speed, 
      isRpg: activeWeapon === 'rpg' 
    });
  };

  const handleReload = () => {
    if (isReloading) return;
    setIsReloading(true); 
    sound.playClick();

    // Apply Reload Speed Bonus
    const weaponId = activeWeapon === 'akm' ? 'i1' : 'i2';
    const upgrade = weaponUpgrades[weaponId];
    let reloadMultiplier = 1;
    if (upgrade) {
      reloadMultiplier /= (1 + (upgrade.levels.reloadSpeed - 1) * 0.15);
      Object.values(upgrade.activeAttachments).forEach(attId => {
        const att = ALL_ATTACHMENTS.find(a => a.id === attId);
        if (att?.bonus.reloadSpeed) reloadMultiplier /= att.bonus.reloadSpeed;
      });
    }

    const baseReloadTime = 1500;
    setTimeout(() => { 
      setAmmo(30); 
      setIsReloading(false); 
    }, baseReloadTime * reloadMultiplier);
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

  const handleCallSupport = (type: 'airstrike' | 'recon' | 'supply_drop') => {
    const logisticsLvl = leaderSkills?.airSupportLogistics || 1;
    const costDiscount = Math.max(0.65, 1 - (logisticsLvl - 1) * 0.08);
    const baseCost = type === 'airstrike' ? 70 : type === 'supply_drop' ? 40 : 25;
    const finalCost = Math.round(baseCost * costDiscount);

    if (airSupportMeter < finalCost) {
      sound.playClick();
      addMessage(`مقياس الدعم الجوي غير كافٍ (المطلوب: ${finalCost}%، المتوفر: ${Math.round(airSupportMeter)}%).`, 'العمليات الجوية', 'system');
      return;
    }
    setTargetingMode(type);
    sound.playSelect();
  };

  const confirmAirSupport = (x: number, y: number) => {
    if (!targetingMode) return;
    const type = targetingMode;
    const logisticsLvl = leaderSkills?.airSupportLogistics || 1;
    const costDiscount = Math.max(0.65, 1 - (logisticsLvl - 1) * 0.08);
    const baseCost = type === 'airstrike' ? 70 : type === 'supply_drop' ? 40 : 25;
    const finalCost = Math.round(baseCost * costDiscount);

    setAirSupportMeter(m => Math.max(0, m - finalCost));
    setTargetingMode(null);

    if (type === 'airstrike') {
      sound.playJetFlyover();
      sound.playAirSiren();
      addMessage('تم إطلاق مقاتلة نفاثة لتنفيذ غارة جوية على الإحداثيات المحددة!', 'العمليات الجوية', 'system');
      
      const angle = -0.4;
      const dist = 900;
      entitiesRef.current.jets.push({
        id: Math.random(),
        startX: x - Math.cos(angle) * dist,
        startY: y - Math.sin(angle) * dist,
        endX: x + Math.cos(angle) * dist,
        endY: y + Math.sin(angle) * dist,
        currentX: x - Math.cos(angle) * dist,
        currentY: y - Math.sin(angle) * dist,
        targetX: x,
        targetY: y,
        progress: 0,
        bombsDropped: false,
      });
    } else if (type === 'recon') {
      sound.playArtilleryLaunch();
      setIsReconActive(true);
      setReconTimer(14);
      addMessage('تم تفعيل استطلاع درون UAV: كشف وتحديد جميع مواقع الأعداء ونقاط ضعفهم!', 'الاستخبارات', 'system');
      entitiesRef.current.effects.push({ id: Math.random(), x, y, type: 'recon', life: 90, maxLife: 90 });
    } else if (type === 'supply_drop') {
      sound.playArtilleryLaunch();
      addMessage('جارٍ إنزال حزمة إمدادات جوية تكتيكية بالمظلة في الموقع المحدد...', 'الإمداد الجوي', 'system');
      entitiesRef.current.supplies.push({
        id: Math.random(),
        x,
        y: 0,
        targetY: y,
        progress: 0,
        isLanded: false,
        collected: false,
      });
    }
  };

  const handleCallBuild = (type: 'watchtower' | 'trench') => {
    const cost = type === 'watchtower' ? 150 : 50;
    if (tacticalPoints < cost) { sound.playClick(); return; }
    setBuildMode(type); setTargetingMode(null); sound.playSelect();
  };

  const confirmBuild = (x: number, y: number) => {
    if (!buildMode) return;
    const type = buildMode;
    const cost = type === 'watchtower' ? 150 : 50;
    addTacticalPoints(-cost);
    setBuildMode(null);
    sound.playSelect();
    
    const newStructure: Structure = {
      id: Math.random(),
      x,
      y,
      type,
      hp: type === 'watchtower' ? 300 : 500,
      maxHp: type === 'watchtower' ? 300 : 500,
    };
    
    (entitiesRef.current as any).structures.push(newStructure);
    entitiesRef.current.effects.push({ id: Math.random(), x, y, type: 'build', life: 30, maxLife: 30 });
    addMessage(`تم إنشاء ${type === 'watchtower' ? 'برج مراقبة' : 'خندق دفاعي'} في الموقع.`, 'الهندسة', 'system');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b1220] font-['Cairo',sans-serif] select-none text-right rtl">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-none z-0" />
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Directional Damage Hit Indicators & Blood Vignette */}
      {Date.now() - lastDamageTime < 650 && (
        <div className="absolute inset-0 pointer-events-none z-40 border-[8px] border-red-600/70 shadow-[inset_0_0_120px_rgba(239,68,68,0.55)] animate-pulse" />
      )}

      {/* Directional Chevrons */}
      <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center overflow-hidden">
        {damageIndicators.map(ind => {
          const age = Date.now() - ind.timestamp;
          if (age > 1200) return null;
          const opacity = Math.max(0, 1 - age / 1200);
          const deg = (ind.angle * 180) / Math.PI + 90;
          return (
            <div
              key={ind.id}
              className="absolute flex flex-col items-center justify-center pointer-events-none transition-opacity"
              style={{
                transform: `rotate(${deg}deg) translateY(-150px)`,
                opacity,
              }}
            >
              <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[26px] border-b-red-600 drop-shadow-[0_0_14px_rgba(239,68,68,1)] animate-bounce" />
              <div className="w-10 h-1.5 bg-red-500 rounded-full mt-1 shadow-[0_0_10px_rgba(239,68,68,1)]" />
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {targetingMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center bg-[#4fd1c5]/5 backdrop-blur-[2px]"
          >
            <div className="bg-[#0b1220]/90 px-10 py-6 rounded-[2.5rem] border border-[#4fd1c5]/50 shadow-[0_0_50px_rgba(79,209,197,0.2)] text-center space-y-4">
              <div className="flex justify-center"><Loader2 className="w-10 h-10 text-[#4fd1c5] animate-spin" /></div>
              <h3 className="text-3xl font-black text-[#4fd1c5] uppercase tracking-tighter">
                {targetingMode === 'airstrike' 
                  ? 'تأكيد إحداثيات الغارة النفاثة' 
                  : targetingMode === 'supply_drop' 
                  ? 'تأكيد موقع إنزال المظلة' 
                  : 'تأكيد منطقة استطلاع درون UAV'}
              </h3>
              <p className="text-stone-400 font-bold text-sm">اضغط على الخريطة لتوجيه الدعم • ESC للإلغاء</p>
            </div>
          </motion.div>
        )}

        {buildMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center bg-[#4fd1c5]/5 backdrop-blur-[2px]"
          >
            <div className="bg-[#0b1220]/90 px-10 py-6 rounded-[2.5rem] border border-[#4fd1c5]/50 shadow-[0_0_50px_rgba(79,209,197,0.2)] text-center space-y-4">
              <div className="flex justify-center"><RefreshCw className="w-10 h-10 text-[#4fd1c5] animate-spin" /></div>
              <h3 className="text-3xl font-black text-[#4fd1c5] uppercase tracking-tighter">
                {buildMode === 'watchtower' ? 'بناء برج مراقبة' : 'حفر خندق دفاعي'}
              </h3>
              <p className="text-stone-400 font-bold text-sm">اختر موقع البناء على الخريطة • ESC للإلغاء</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-10 pointer-events-none p-6 sm:p-10 flex flex-col justify-between">
        <div className="flex justify-between items-start w-full gap-4">
          <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4 pointer-events-auto">
            <div className="bg-[#0b1220]/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-5 w-72 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-[#4fd1c5] shadow-[0_0_15px_rgba(79,209,197,0.5)]" />
              {isCamouflaged && (
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#4fd1c5]/20 px-2 py-0.5 rounded-full border border-[#4fd1c5]/40 animate-pulse">
                  <Eye className="w-3 h-3 text-[#4fd1c5]" />
                  <span className="text-[8px] font-black text-[#4fd1c5] uppercase">Camouflaged</span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#4fd1c5]/20 rounded-lg"><Navigation className="w-5 h-5 text-[#4fd1c5]" /></div>
                <span className="text-white font-black text-xl tracking-tighter">القطاع العملياتي</span>
              </div>
              <div className="text-stone-300 text-base font-black px-1">{currentProvince}</div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-green-500 font-black uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>اتصال لاسلكي نشط</span>
              </div>
            </div>
            {activeQuest && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-black/40 backdrop-blur-lg border border-blue-500/20 rounded-2xl p-4 w-72 shadow-xl">
                <div className="flex items-center gap-3 mb-1.5 text-blue-400">
                  <TargetIcon className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-right flex-1">المهمة الحالية</span>
                </div>
                <div className="text-white text-sm font-black leading-snug">{activeQuest.titleAr}</div>
              </motion.div>
            )}
          </motion.div>

          {/* Strategic Air Support Gauge & Controls */}
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center pointer-events-auto bg-[#0b1220]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl space-y-2">
            <div className="flex items-center justify-between w-full gap-4">
              <div className="flex items-center gap-2 text-xs font-black text-[#4fd1c5]">
                <Plane className="w-4 h-4 text-[#4fd1c5]" />
                <span>الدعم الجوي التكتيكي</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-stone-200">{Math.round(airSupportMeter)}%</span>
                <button
                  onClick={() => setIsHighContrastMode(v => !v)}
                  title="تبديل فلتر التباين الجبلي"
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all ${
                    isHighContrastMode ? 'bg-[#4fd1c5]/20 text-[#4fd1c5] border-[#4fd1c5]/50' : 'bg-white/5 text-stone-400 border-white/10'
                  }`}
                >
                  {isHighContrastMode ? 'تباين جبلي: نشط' : 'تباين عادي'}
                </button>
              </div>
            </div>

            <div className="w-72 h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
              <motion.div 
                animate={{ width: `${Math.min(100, Math.max(0, airSupportMeter))}%` }} 
                className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(79,209,197,0.8)]" 
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleCallSupport('recon')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[10px] font-black transition-all ${
                  airSupportMeter >= 25 
                    ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/40 active:scale-95' 
                    : 'bg-stone-900/40 text-stone-600 border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                <Scan className="w-3.5 h-3.5" />
                <span>درون UAV</span>
              </button>

              <button
                onClick={() => handleCallSupport('airstrike')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[10px] font-black transition-all ${
                  airSupportMeter >= 70 
                    ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/40 active:scale-95' 
                    : 'bg-stone-900/40 text-stone-600 border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>قصف نفاث</span>
              </button>

              <button
                onClick={() => handleCallSupport('supply_drop')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[10px] font-black transition-all ${
                  airSupportMeter >= 40 
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/40 active:scale-95' 
                    : 'bg-stone-900/40 text-stone-600 border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>إنزال إمداد</span>
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-end gap-5 pointer-events-auto">
            <div className="bg-gradient-to-l from-[#4fd1c5]/30 to-transparent backdrop-blur-md border-r-4 border-[#4fd1c5] px-8 py-3 text-right">
              <h1 className="text-white text-4xl font-black tracking-tighter drop-shadow-2xl">صقور اليمن</h1>
              <p className="text-[#4fd1c5] text-[11px] font-black tracking-[0.3em] uppercase opacity-80">Hawks of Yemen</p>
            </div>
            <div className="bg-[#0b1220]/80 backdrop-blur-xl rounded-2xl border border-[#4fd1c5]/40 p-4 flex items-center gap-5 shadow-2xl group relative overflow-hidden">
              <div className="text-right">
                <p className="text-[9px] text-stone-500 font-black uppercase tracking-widest">المجموع التكتيكي</p>
                <p className="text-[#4fd1c5] font-black text-2xl tabular-nums tracking-tighter">{tacticalPoints} <span className="text-xs">PT</span></p>
              </div>
              <button 
                onClick={openWeaponCustomization}
                className="w-12 h-12 rounded-xl bg-[#4fd1c5]/10 border border-[#4fd1c5]/30 flex items-center justify-center text-[#4fd1c5] hover:bg-[#4fd1c5] hover:text-black transition-all active:scale-90"
              >
                <Settings className="w-6 h-6 animate-pulse" />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-between items-center w-full grow">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="pointer-events-auto space-y-6">
            <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-7 w-80 shadow-2xl relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><User className="w-6 h-6" /></div>
                  <span className="text-white font-black text-base uppercase">الحالة القتالية</span>
                </div>
                <div className="text-[10px] bg-white/5 px-3 py-1 rounded-full border border-white/10 text-stone-400 font-bold uppercase tracking-widest">Expert</div>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black text-stone-400 uppercase tracking-wider"><span>الحيوية (HP)</span><span className="text-blue-400 font-mono text-xs">{playerHp}/100</span></div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div animate={{ width: `${playerHp}%` }} className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black text-stone-400 uppercase tracking-wider"><span>الدرع (Armor)</span><span className="text-[#4fd1c5] font-mono text-xs">{playerArmor}%</span></div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div animate={{ width: `${playerArmor}%` }} className="h-full bg-gradient-to-r from-[#4fd1c5] to-[#7ee7d0] rounded-full shadow-[0_0_10px_rgba(79,209,197,0.5)]" />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <WeaponButton active={activeWeapon === 'akm'} onClick={() => { setActiveWeapon('akm'); sound.playSelect(); }} icon={<Zap className="w-6 h-6" />} label="AKM" color="teal" />
                <WeaponButton active={activeWeapon === 'rpg'} onClick={() => { setActiveWeapon('rpg'); sound.playSelect(); }} icon={<Swords className="w-6 h-6" />} label="RPG-7" color="cyan" />
              </div>
              <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${ammo < 10 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 text-stone-400'}`}><Shell className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[9px] text-stone-500 font-black uppercase">الذخيرة</p>
                    <p className={`text-xl font-black tabular-nums tracking-tighter ${ammo < 10 ? 'text-red-500' : 'text-white'}`}>{ammo}/30</p>
                  </div>
                </div>
                <button onClick={handleReload} disabled={isReloading} className="bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 text-white font-black text-xs transition-all active:scale-95">
                  {isReloading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'تعبئة'}
                </button>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4 pointer-events-auto items-end">
            <div className="bg-[#0b1220]/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-3 flex flex-col gap-4 shadow-2xl">
              <p className="text-[9px] font-black text-[#4fd1c5] text-center uppercase tracking-widest mb-1">دعم تكتيكي</p>
              <SupportButton icon={<Scan className="w-7 h-7" />} label="استطلاع" cost={100} current={tacticalPoints} onClick={() => handleCallSupport('recon')} color="green" />
              <SupportButton icon={<Plane className="w-7 h-7" />} label="غارة" cost={250} current={tacticalPoints} onClick={() => handleCallSupport('airstrike')} color="red" />
              <div className="w-full h-px bg-white/5 my-1" />
              <SupportButton icon={<Activity className="w-7 h-7" />} label="برج" cost={150} current={tacticalPoints} onClick={() => handleCallBuild('watchtower')} color="teal" />
              <SupportButton icon={<Shield className="w-7 h-7" />} label="خندق" cost={50} current={tacticalPoints} onClick={() => handleCallBuild('trench')} color="teal" />
              <SupportButton icon={<RefreshCw className="w-7 h-7" />} label="دفاع" cost={0} current={tacticalPoints} onClick={() => handleMilitarySkillCall('tank_support')} color="teal" isFree />
            </div>
          </motion.div>
        </div>

        <div className="flex justify-between items-end w-full">
          <div className="flex flex-col gap-6 pointer-events-auto">
            {/* Tactical Chat System */}
            <div className="w-80 h-64 bg-[#0b1220]/40 backdrop-blur-md rounded-[1.5rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl transition-all group hover:bg-[#0b1220]/60">
              <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#4fd1c5]" />
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">الاتصال الميداني</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={msg.id} 
                    className="flex flex-col items-start text-right"
                  >
                    <span className={`text-[9px] font-black uppercase tracking-tighter mb-0.5 ${msg.type === 'system' ? 'text-[#4fd1c5]' : 'text-blue-400'}`}>
                      {msg.sender}
                    </span>
                    <div className={`px-3 py-1.5 rounded-2xl text-xs font-medium max-w-[90%] ${
                      msg.type === 'system' 
                        ? 'bg-white/5 text-stone-300 border border-white/5' 
                        : 'bg-blue-500/10 text-white border border-blue-500/20'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {isChatOpen && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }}
                  className="p-3 bg-black/40 border-t border-white/10 flex items-center gap-2"
                >
                  <input 
                    autoFocus
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="اكتب رسالة تكتيكية..."
                    className="flex-1 bg-transparent border-none text-white text-xs font-bold focus:outline-none placeholder:text-stone-600"
                  />
                  <button 
                    onClick={() => {
                      if (chatInput.trim()) {
                        addMessage(chatInput);
                        setChatInput('');
                        setIsChatOpen(false);
                      }
                    }}
                    className="p-1.5 bg-[#4fd1c5]/20 rounded-lg text-[#4fd1c5] hover:bg-[#4fd1c5]/30 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>

            <div className="flex gap-4">
              <MenuButton onClick={onOpenInventory} icon={<Backpack className="w-6 h-6" />} label="العتاد" color="teal" />
              <MenuButton onClick={onOpenQuestLog} icon={<Scroll className="w-6 h-6" />} label="المهام" color="blue" />
              <MenuButton onClick={onOpenDailyChallenges} icon={<Trophy className="w-6 h-6" />} label="التحديات" color="purple" isAlert />
              <MenuButton onClick={openLeaderSkills} icon={<Crown className="w-6 h-6" />} label="مهارات القائد" color="teal" />
            </div>
          </div>
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] px-10 py-6 flex items-center gap-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
            <div className="text-right">
              <div className="text-[11px] font-black text-stone-500 uppercase tracking-[0.2em] mb-1">العمليات الناجحة</div>
              <div className="flex items-baseline gap-3"><span className="text-5xl font-black text-[#4fd1c5] tabular-nums leading-none drop-shadow-lg">{kills}</span><span className="text-stone-600 text-xs font-black uppercase tracking-widest">Kills</span></div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-right">
              <div className="text-[11px] font-black text-stone-500 uppercase tracking-[0.2em] mb-1">نظام القتال</div>
              <div className="text-lg font-black text-white leading-none uppercase tracking-tighter">Tactical Survivor</div>
            </div>
          </motion.div>
        </div>
      </div>

      {isTouch && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <VirtualControls 
            onMove={(x, z) => {
              if (!targetingMode && !isGameOver) setPlayerPos(prev => ({ x: Math.max(60, Math.min(window.innerWidth - 60, prev.x + x * 5.5)), y: Math.max(60, Math.min(window.innerHeight - 60, prev.y + z * 5.5)) }));
            }}
            onAction={() => {
              if (isGameOver) return;
              targetingMode ? confirmAirSupport(entitiesRef.current.mouse.x, entitiesRef.current.mouse.y) : fireWeapon();
            }}
            onStopBlock={() => {}}
          />
        </div>
      )}

      <PostBattleSummary 
        isOpen={isGameOver}
        onClose={onReturnToTitle}
        provinceName={currentProvince}
        stats={{
          kills: kills,
          accuracy: shotsFired > 0 ? Math.round((kills / (shotsFired * 0.5 + kills)) * 100) : 0,
          pointsEarned: earnedPT,
          survivalTime: Math.floor((Date.now() - startTime) / 1000)
        }}
      />
    </div>
  );
};

const WeaponButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }> = ({ active, onClick, icon, label, color }) => {
  const colors: Record<string, string> = { teal: 'bg-[#4fd1c5]/20 border-[#4fd1c5] text-[#4fd1c5]', cyan: 'bg-cyan-500/20 border-cyan-500 text-cyan-500' };
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClick} className={`flex-1 h-16 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 relative overflow-hidden ${active ? colors[color] : 'bg-white/5 border-white/10 text-stone-500'}`}>
      {active && <motion.div layoutId="wepGlow" className="absolute inset-0 bg-current opacity-10 animate-pulse" />}
      <div className={`relative z-10 transition-transform ${active ? 'scale-110' : ''}`}>{icon}</div>
      <span className="text-[9px] font-black uppercase relative z-10 tracking-widest">{label}</span>
    </motion.button>
  );
};

const SupportButton: React.FC<{ icon: React.ReactNode, label: string, cost: number, current: number, onClick: () => void, color: string, isFree?: boolean }> = ({ icon, label, cost, current, onClick, color, isFree }) => {
  const canAfford = current >= cost || isFree;
  const colorMap: Record<string, string> = { green: 'bg-green-500/10 border-green-500/40 text-green-500', red: 'bg-red-500/10 border-red-500/40 text-red-500', teal: 'bg-[#4fd1c5]/10 border-[#4fd1c5]/40 text-[#4fd1c5]' };
  return (
    <motion.button disabled={!canAfford} whileHover={canAfford ? { scale: 1.1, x: -5 } : {}} whileTap={canAfford ? { scale: 0.9 } : {}} onClick={onClick} className={`w-16 h-16 rounded-[1.25rem] border flex flex-col items-center justify-center transition-all ${canAfford ? `${colorMap[color]} backdrop-blur-md cursor-pointer shadow-lg` : 'bg-stone-900/40 border-white/5 text-stone-700 opacity-50'}`}>
      {icon}
      <span className="text-[8px] font-black mt-1 uppercase tracking-tighter">{label}</span>
      {!isFree && <span className="text-[7px] font-bold opacity-70 mt-0.5">{cost} PT</span>}
    </motion.button>
  );
};

const MenuButton: React.FC<{ onClick: () => void, icon: React.ReactNode, label: string, color: string, isAlert?: boolean }> = ({ onClick, icon, label, color, isAlert }) => {
  const colorMap: Record<string, string> = { teal: 'border-[#4fd1c5]/30 text-[#4fd1c5]', blue: 'border-blue-500/30 text-blue-500', purple: 'border-purple-500/30 text-purple-500' };
  return (
    <motion.button whileHover={{ y: -8, backgroundColor: 'rgba(255,255,255,0.08)' }} whileTap={{ scale: 0.95 }} onClick={onClick} className={`flex items-center gap-4 px-8 py-5 bg-black/60 hover:bg-black/80 rounded-3xl border ${colorMap[color]} text-white backdrop-blur-xl shadow-2xl transition-all cursor-pointer relative overflow-hidden group`}>
      {isAlert && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-ping" />}
      <div className="transition-transform group-hover:scale-110 duration-300">{icon}</div>
      <span className="text-sm font-black tracking-tight">{label}</span>
    </motion.button>
  );
};
