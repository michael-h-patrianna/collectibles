import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Collectible } from '../../types';
import { CollectibleCard } from './CollectibleCard';

interface PackOpenerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPack: () => Collectible[]; // Function that returns the new cards
}

export const PackOpener: React.FC<PackOpenerProps> = ({ isOpen, onClose, onOpenPack }) => {
  const [packState, setPackState] = useState<'idle' | 'opening' | 'revealed'>('idle');
  const [newCards, setNewCards] = useState<Collectible[]>([]);

  const handleOpen = () => {
    if (packState !== 'idle') return;
    
    setPackState('opening');
    
    // Trigger sequence
    setTimeout(() => {
      const cards = onOpenPack();
      setNewCards(cards);
      setPackState('revealed');
      
      // Confetti blast
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#3b82f6', '#a855f7']
      });
    }, 1500); // 1.5s animation
  };

  const reset = () => {
    setPackState('idle');
    setNewCards([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        data-testid="pack-opener-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md"
      >
        <div className="relative w-full max-w-4xl p-4 flex flex-col items-center justify-center min-h-[60vh]">
          
          {/* Close Button (only when revealed) */}
          {packState === 'revealed' && (
             <motion.button
                data-testid="pack-opener-close-button"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={reset}
                aria-label="Close Pack Opener"
                className="absolute top-0 right-4 text-slate-400 hover:text-white uppercase tracking-widest text-xs font-bold"
             >
               Close
             </motion.button>
          )}

          {/* PACK STATE: IDLE & OPENING */}
          {packState !== 'revealed' && (
            <motion.div
              data-testid="pack-visual-container"
              onClick={handleOpen}
              className="cursor-pointer group relative"
              animate={packState === 'opening' ? {
                 scale: [1, 1.1, 0.9, 1.2, 0],
                 rotate: [0, -5, 5, -10, 10, 0],
                 opacity: [1, 1, 1, 1, 0]
              } : {}}
              transition={{ duration: 1.5, times: [0, 0.2, 0.4, 0.6, 1] }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Pack Visual */}
              <div data-testid="pack-visual" className="w-64 h-96 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 shadow-[0_0_50px_rgba(245,158,11,0.3)] flex flex-col items-center justify-center relative overflow-hidden border-4 border-amber-300/50">
                {/* Sheen effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                
                <Sparkles className="w-16 h-16 text-white mb-4 animate-pulse" />
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic transform -rotate-6">Legendary<br/>Pack</h2>
                <p className="text-amber-100 font-bold mt-2 uppercase tracking-widest text-xs">Tap to Open</p>
              </div>
            </motion.div>
          )}

          {/* PACK STATE: REVEALED */}
          {packState === 'revealed' && (
            <div data-testid="revealed-cards-container" className="flex flex-col items-center">
               <motion.h2 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-3xl font-bold text-white mb-8 text-center"
               >
                 New Acquisitions!
               </motion.h2>
               
               <div className="flex flex-wrap justify-center gap-6 perspective-1000">
                  {newCards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 50, rotateY: 90 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ delay: index * 0.2, type: "spring", damping: 12 }}
                      className="w-48"
                    >
                       <CollectibleCard 
                          collectible={card} 
                          isOwned={true} 
                          onClick={() => {}} 
                          enableTilt={true}
                       />
                    </motion.div>
                  ))}
               </div>

               <motion.button
                 data-testid="pack-opener-collect-button"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 1.5 }}
                 onClick={reset}
                 className="mt-12 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
               >
                 Collect & Continue
               </motion.button>
            </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
