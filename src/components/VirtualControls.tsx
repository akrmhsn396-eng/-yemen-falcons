import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Shield, Zap, Swords } from 'lucide-react';

interface VirtualControlsProps {
  onMove: (x: number, y: number) => void;
  onAction: (type: 'attack_light' | 'attack_heavy' | 'block') => void;
  onStopBlock: () => void;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onMove,
  onAction,
  onStopBlock,
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsActive(true);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isActive && e.buttons !== 1) return;
    if (!joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = rect.width / 2;
    
    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }
    
    x.set(dx);
    y.set(dy);
    
    // Normalize for engine
    onMove(dx / maxRadius, dy / maxRadius);
  };

  const handlePointerUp = () => {
    setIsActive(false);
    x.set(0);
    y.set(0);
    onMove(0, 0);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-12 flex justify-between items-end pointer-events-none select-none">
      
      {/* Movement Joystick */}
      <div 
        ref={joystickRef}
        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/5 border border-white/10 backdrop-blur-md relative pointer-events-auto touch-none shadow-2xl"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <motion.div 
          style={{ x: springX, y: springY }}
          className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shadow-lg"
        >
          <div className="w-2 h-2 rounded-full bg-white" />
        </motion.div>
        
        {/* Subtle Grid Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white" />
          <div className="absolute left-1/2 top-0 h-full w-px bg-white" />
        </div>
      </div>

      {/* Combat Buttons Area */}
      <div className="flex flex-col gap-6 items-end pointer-events-auto">
        <div className="flex gap-4">
           {/* Block Button */}
           <button 
            onPointerDown={() => onAction('block')}
            onPointerUp={onStopBlock}
            onPointerLeave={onStopBlock}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white/60 active:scale-90 active:bg-amber-500/20 active:text-amber-400 active:border-amber-500/40 transition-all shadow-xl"
          >
            <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>

          {/* Light Attack */}
          <button 
            onPointerDown={() => onAction('attack_light')}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white/60 active:scale-90 active:bg-blue-500/20 active:text-blue-400 active:border-blue-500/40 transition-all shadow-xl"
          >
            <Zap className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        </div>

        {/* Heavy Attack */}
        <button 
          onPointerDown={() => onAction('attack_heavy')}
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 active:bg-red-600/40 active:border-red-500/60 transition-all shadow-2xl"
        >
          <Swords className="w-12 h-12 sm:w-14 sm:h-14" />
        </button>
      </div>
    </div>
  );
};
