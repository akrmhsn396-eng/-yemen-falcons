import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trophy, Swords, Zap, RefreshCw } from 'lucide-react';
import { sound } from '../game/audio';

interface PongGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrainingMiniGameModal: React.FC<PongGameModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 800;
    const H = 500;
    canvas.width = W;
    canvas.height = H;

    // Game objects (Logic from the provided bundle)
    const paddle = {
      w: 12,
      h: 100,
      x: 20,
      y: (H - 100) / 2,
      speed: 450,
    };

    const ai = {
      w: 12,
      h: 100,
      x: W - 20 - 12,
      y: (H - 100) / 2,
      speed: 380,
      reaction: 0.15,
    };

    const ball = {
      r: 8,
      x: W / 2,
      y: H / 2,
      speed: 450,
      vx: 250,
      vy: 120,
      speedIncrease: 1.06,
      maxSpeed: 1200,
    };

    let localScore = { player: 0, ai: 0 };
    const maxScore = 7;
    let upPressed = false;
    let downPressed = false;
    let mouseY: number | null = null;
    let lastTime = 0;
    let paused = false;
    let serving = false;

    const resetBall = (direction = 0) => {
      ball.x = W / 2;
      ball.y = H / 2;
      ball.speed = 450;
      const angle = (Math.random() * Math.PI / 3) - (Math.PI / 6);
      const dir = direction === 0 ? (Math.random() < 0.5 ? -1 : 1) : direction;
      ball.vx = dir * ball.speed * Math.cos(angle);
      ball.vy = ball.speed * Math.sin(angle);
      serving = true;
      setTimeout(() => { serving = false; }, 600);
    };

    const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Net
      ctx.strokeStyle = 'rgba(79, 209, 197, 0.1)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 15]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Paddles
      ctx.fillStyle = '#e6eef8';
      roundRect(ctx, paddle.x, paddle.y, paddle.w, paddle.h, 6);
      roundRect(ctx, ai.x, ai.y, ai.w, ai.h, 6);

      // Ball
      ctx.fillStyle = '#4fd1c5';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#4fd1c5';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // HUD Text
      ctx.fillStyle = 'rgba(79, 209, 197, 0.8)';
      ctx.font = 'bold 14px Cairo';
      ctx.textAlign = 'center';
      if (serving) ctx.fillText('التحضير...', W / 2, H - 30);
    };

    const update = (dt: number) => {
      if (paused || serving || isGameOver) return;

      // Input
      if (upPressed) paddle.y -= paddle.speed * dt;
      if (downPressed) paddle.y += paddle.speed * dt;
      if (mouseY !== null) paddle.y = mouseY - paddle.h / 2;

      paddle.y = Math.max(0, Math.min(H - paddle.h, paddle.y));

      // AI
      const aiCenter = ai.y + ai.h / 2;
      const diff = ball.y - aiCenter;
      ai.y += Math.max(-ai.speed * dt, Math.min(ai.speed * dt, diff * ai.reaction * 10));
      ai.y = Math.max(0, Math.min(H - ai.h, ai.y));

      // Ball Physics
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      if (ball.y - ball.r < 0 || ball.y + ball.r > H) {
        ball.vy = -ball.vy;
        ball.y = ball.y < 0 ? ball.r : H - ball.r;
        sound.playClick();
      }

      // Collisions
      if (ball.vx < 0 && ball.x - ball.r <= paddle.x + paddle.w && ball.y >= paddle.y && ball.y <= paddle.y + paddle.h) {
        const norm = (ball.y - (paddle.y + paddle.h / 2)) / (paddle.h / 2);
        const angle = norm * Math.PI / 3;
        ball.speed = Math.min(ball.maxSpeed, ball.speed * ball.speedIncrease);
        ball.vx = ball.speed * Math.cos(angle);
        ball.vy = ball.speed * Math.sin(angle);
        ball.x = paddle.x + paddle.w + ball.r;
        sound.playSelect();
      }

      if (ball.vx > 0 && ball.x + ball.r >= ai.x && ball.y >= ai.y && ball.y <= ai.y + ai.h) {
        const norm = (ball.y - (ai.y + ai.h / 2)) / (ai.h / 2);
        const angle = norm * Math.PI / 3;
        ball.speed = Math.min(ball.maxSpeed, ball.speed * ball.speedIncrease);
        ball.vx = -ball.speed * Math.cos(angle);
        ball.vy = ball.speed * Math.sin(angle);
        ball.x = ai.x - ball.r;
        sound.playSelect();
      }

      // Scoring
      if (ball.x < 0) {
        localScore.ai++;
        setScore({ ...localScore });
        if (localScore.ai >= maxScore) {
          setIsGameOver(true);
          setWinner('ai');
        } else {
          resetBall(1);
        }
      } else if (ball.x > W) {
        localScore.player++;
        setScore({ ...localScore });
        if (localScore.player >= maxScore) {
          setIsGameOver(true);
          setWinner('player');
        } else {
          resetBall(-1);
        }
      }
    };

    const loop = (time: number) => {
      const dt = Math.min(0.033, (time - lastTime) / 1000);
      lastTime = time;
      update(dt);
      draw();
      requestAnimationFrame(loop);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') upPressed = true;
      if (e.key === 'ArrowDown') downPressed = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') upPressed = false;
      if (e.key === 'ArrowDown') downPressed = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseY = (e.clientY - rect.top) * (H / rect.height);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    resetBall( Math.random() < 0.5 ? -1 : 1 );
    requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen, isGameOver]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1220]/90 backdrop-blur-2xl font-['Cairo',sans-serif] dir-rtl select-none">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-4xl bg-[#0b1220] border border-[#4fd1c5]/20 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#4fd1c5]/10 flex items-center justify-center border border-[#4fd1c5]/30">
              <Swords className="w-6 h-6 text-[#4fd1c5]" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">تدريب الصقور: رد الفعل</h3>
              <p className="text-xs text-[#9fb3c9] font-bold">طور مهاراتك في التصدي والمناورة</p>
            </div>
          </div>

          <div className="flex items-center gap-8 bg-black/40 px-8 py-3 rounded-2xl border border-white/5 shadow-inner">
            <div className="text-center">
              <p className="text-[10px] text-stone-500 font-bold uppercase">أنت</p>
              <p className="text-2xl font-black text-[#4fd1c5] tabular-nums leading-none">{score.player}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <p className="text-[10px] text-stone-500 font-bold uppercase">المدرب</p>
              <p className="text-2xl font-black text-[#e6eef8] tabular-nums leading-none">{score.ai}</p>
            </div>
          </div>

          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-[16/10] bg-black/20 flex items-center justify-center">
          <canvas ref={canvasRef} className="w-full h-full cursor-none" />
          
          <AnimatePresence>
            {isGameOver && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-10"
              >
                <Trophy className={`w-20 h-20 mb-6 ${winner === 'player' ? 'text-[#4fd1c5]' : 'text-stone-600'} drop-shadow-[0_0_30px_rgba(79,209,197,0.3)]`} />
                <h4 className="text-4xl font-black text-white mb-2">
                  {winner === 'player' ? 'أحسنت يا صقر!' : 'تدريب مكثف مطلوب'}
                </h4>
                <p className="text-[#9fb3c9] mb-10 max-w-md">
                  {winner === 'player' ? 'لقد أثبتت مهاراتك في رد الفعل السريع. أنت جاهز للانتشار الميداني.' : 'العدو يتفوق عليك في السرعة. حاول مجدداً لتحسين مهاراتك التكتيكية.'}
                </p>
                <div className="flex gap-4">
                  <button onClick={() => { setIsGameOver(false); setScore({ player: 0, ai: 0 }); }} className="px-10 py-4 rounded-2xl bg-[#4fd1c5] text-[#0b1220] font-black hover:bg-[#7ee7d0] transition-all flex items-center gap-3">
                    <RefreshCw className="w-5 h-5" />
                    محاولة أخرى
                  </button>
                  <button onClick={onClose} className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all">
                    العودة للقاعدة
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] text-stone-500 font-bold uppercase tracking-widest pointer-events-none">
            <span>استخدم الماوس أو الأسهم للتحرك</span>
            <div className="w-1 h-1 rounded-full bg-stone-700" />
            <span>أول من يصل لـ 7 نقاط يفوز</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
