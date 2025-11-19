import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Lock, Sword, Shield, Sparkles, Skull, Flame, Snowflake, Leaf, Sun, Ghost, Anchor } from 'lucide-react';
import type { Collectible, Rarity } from '../../types';
import { clsx } from 'clsx';

interface CollectibleCardProps {
  collectible: Collectible;
  isOwned: boolean;
  onClick: () => void;
  enableTilt?: boolean;
}

const rarityColors: Record<Rarity, string> = {
  common: 'border-slate-500 shadow-slate-500/20 bg-slate-800',
  rare: 'border-blue-400 shadow-blue-500/30 bg-slate-800',
  epic: 'border-purple-500 shadow-purple-500/40 bg-slate-900',
  legendary: 'border-amber-400 shadow-amber-500/50 bg-slate-900',
};

const rarityTextColors: Record<Rarity, string> = {
  common: 'text-slate-400',
  rare: 'text-blue-300',
  epic: 'text-purple-300',
  legendary: 'text-amber-300',
};

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'Hero': return <Sword size={80} strokeWidth={1} className="text-white/90 drop-shadow-lg" />;
    case 'Beast': return <Skull size={80} strokeWidth={1} className="text-white/90 drop-shadow-lg" />;
    case 'Relic': return <Shield size={80} strokeWidth={1} className="text-white/90 drop-shadow-lg" />;
    case 'Spell': return <Sparkles size={80} strokeWidth={1} className="text-white/90 drop-shadow-lg" />;
    default: return <Sword size={80} />;
  }
};

const ElementIcon = ({ element }: { element: string }) => {
  switch (element) {
    case 'Fire': return <Flame size={14} className="text-orange-400" />;
    case 'Ice': return <Snowflake size={14} className="text-cyan-300" />;
    case 'Nature': return <Leaf size={14} className="text-green-400" />;
    case 'Light': return <Sun size={14} className="text-yellow-300" />;
    case 'Void': return <Ghost size={14} className="text-purple-400" />;
    case 'Steel': return <Anchor size={14} className="text-slate-300" />; // Anchor as Steel/Heavy placeholder
    default: return <div className="w-3 h-3 rounded-full bg-white" />;
  }
};

export const CollectibleCard: React.FC<CollectibleCardProps> = ({
  collectible,
  isOwned,
  onClick,
  enableTilt = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x);
  const mouseY = useSpring(y);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const holoOpacity = useTransform(mouseX, [-0.5, 0.5], [0, 0.6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !isOwned || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;

    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    if (!enableTilt) return;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      data-testid={`collectible-card-${collectible.id}`}
      style={{
        rotateX: enableTilt && isOwned ? rotateX : 0,
        rotateY: enableTilt && isOwned ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative aspect-[3/4] cursor-pointer perspective-1000"
      onClick={onClick}
    >
      <div
        className={clsx(
          'w-full h-full rounded-xl border-[3px] transition-all duration-300 overflow-hidden relative group',
          isOwned ? rarityColors[collectible.rarity] : 'border-slate-800 bg-slate-900/80 opacity-60',
          isOwned ? 'shadow-xl' : 'shadow-none'
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card Content */}
        <div className="relative w-full h-full flex flex-col" style={{ transform: "translateZ(20px)" }}>
          {isOwned ? (
            <>
              {/* Dynamic Background with Texture */}
              <div className={clsx(
                "absolute inset-0 bg-gradient-to-b opacity-40",
                collectible.factionColor
              )} />
              {/* Noise Texture Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              
              {/* Card Top Stats */}
              <div className="relative p-3 flex justify-between items-start z-10">
                 <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg border border-white/10 backdrop-blur-sm">
                    <div className="text-amber-400 font-serif font-bold text-lg leading-none">{collectible.power}</div>
                    <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">PWR</span>
                 </div>
                 <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg border border-white/10 backdrop-blur-sm">
                    <ElementIcon element={collectible.element} />
                    <span className="text-[10px] text-white uppercase font-bold tracking-wider">{collectible.element}</span>
                 </div>
              </div>

              {/* Central Icon / Art */}
              <div className="relative flex-grow flex items-center justify-center z-10 pb-6">
                 <div className="relative">
                    <div className={clsx(
                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10 blur-xl",
                        collectible.rarity === 'legendary' ? 'animate-pulse' : ''
                    )} />
                    <CategoryIcon category={collectible.category} />
                 </div>
              </div>
              
              {/* Holographic Overlay (Tilt dependent) */}
              {enableTilt && (
                 <motion.div 
                    style={{ 
                        opacity: holoOpacity,
                        background: `linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 40%, rgba(255,215,0,0.3) 45%, transparent 60%)`
                    }}
                    className="absolute inset-0 pointer-events-none mix-blend-overlay bg-no-repeat bg-[length:200%_200%] z-20"
                 />
              )}

              {/* Bottom Info Plate */}
              <div className="absolute bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md p-3 border-t-2 border-white/10 z-20">
                 <p 
                   data-testid="collectible-card-rarity"
                   className={clsx(
                   "text-[10px] font-bold uppercase tracking-[0.2em] text-center mb-1",
                   rarityTextColors[collectible.rarity]
                 )}>
                    {collectible.rarity}
                 </p>
                 <p data-testid="collectible-card-name" className="text-sm text-white font-serif font-bold text-center truncate leading-tight tracking-wide">
                    {collectible.name}
                 </p>
              </div>
            </>
          ) : (
            <div data-testid="collectible-card-locked" className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-600 border-4 border-dashed border-slate-800 m-[-2px]">
              <Lock className="w-10 h-10 mb-2 opacity-40" />
              <span className="text-xs font-serif uppercase tracking-widest text-slate-400">Unknown</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
