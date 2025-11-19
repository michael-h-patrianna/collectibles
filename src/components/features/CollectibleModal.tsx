import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Sword, Skull, Shield, Sparkles, Flame, Snowflake, Leaf, Sun, Ghost, Anchor } from 'lucide-react';
import type { Collectible } from '../../types';
import { clsx } from 'clsx';

interface CollectibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectible: Collectible | null;
  isOwned: boolean;
}

const CategoryIcon = ({ category, size = 120 }: { category: string, size?: number }) => {
  switch (category) {
    case 'Hero': return <Sword size={size} strokeWidth={1} className="text-white/90 drop-shadow-lg" />;
    case 'Beast': return <Skull size={size} strokeWidth={1} className="text-white/90 drop-shadow-lg" />;
    case 'Relic': return <Shield size={size} strokeWidth={1} className="text-white/90 drop-shadow-lg" />;
    case 'Spell': return <Sparkles size={size} strokeWidth={1} className="text-white/90 drop-shadow-lg" />;
    default: return <Sword size={size} />;
  }
};

export const CollectibleModal: React.FC<CollectibleModalProps> = ({
  isOpen,
  onClose,
  collectible,
  isOwned,
}) => {
  if (!collectible) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div data-testid="collectible-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            data-testid="collectible-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            data-testid="collectible-modal-content"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-3xl bg-slate-900 rounded-xl shadow-2xl overflow-hidden border-2 border-amber-500/30 flex flex-col md:flex-row"
          >
            <button
              data-testid="collectible-modal-close-button"
              onClick={onClose}
              aria-label="Close Modal"
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-white/20 transition-colors z-10 text-white"
            >
              <X size={20} />
            </button>

            {/* Image Side (Stylized Card View) */}
            <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto relative bg-slate-950 border-r border-white/5 flex flex-col overflow-hidden">
               {isOwned ? (
                   <>
                      {/* Dynamic Background */}
                      <div className={clsx(
                        "absolute inset-0 bg-gradient-to-br opacity-30",
                        collectible.factionColor
                      )} />
                      
                      {/* Card Header */}
                      <div className="relative p-8 flex justify-between items-start z-10">
                         <div className="flex flex-col items-center">
                            <span className="text-5xl font-serif font-bold text-amber-400 leading-none drop-shadow-md">{collectible.power}</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Power</span>
                         </div>
                         <div className="flex flex-col items-center">
                            <span className="text-lg text-white font-bold uppercase drop-shadow-sm tracking-widest">{collectible.element}</span>
                         </div>
                      </div>

                      {/* Big Icon */}
                      <div className="relative flex-grow flex items-center justify-center pb-12 z-10">
                         <CategoryIcon category={collectible.category} size={180} />
                      </div>
                   </>
               ) : (
                   <div data-testid="modal-collectible-locked" className="w-full h-full flex items-center justify-center text-slate-400">
                       <span className="text-xl font-serif uppercase tracking-widest">Unknown Entity</span>
                   </div>
               )}
            </div>

            {/* Info Side */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-slate-900">
               <div className="mb-8">
                   <div className="flex items-center gap-3 mb-4">
                       <span 
                           data-testid="modal-collectible-rarity"
                           className={clsx(
                           "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                           collectible.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' :
                           collectible.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                           collectible.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                           'bg-slate-700 text-slate-300 border border-slate-600'
                       )}>
                           {collectible.rarity}
                       </span>
                       <span className="text-slate-500 text-xs uppercase tracking-widest">
                           {collectible.category}
                       </span>
                   </div>
                   
                   <h2 data-testid="modal-collectible-name" className="text-4xl font-serif font-bold text-white mb-4 leading-tight">{collectible.name}</h2>
                   <p data-testid="modal-collectible-description" className="text-slate-300 text-lg leading-relaxed italic font-serif opacity-90">"{collectible.description}"</p>
               </div>

               {isOwned && (
                   <div className="mt-auto pt-8 border-t border-white/5">
                       <div className="grid grid-cols-2 gap-4 mb-6">
                           <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                               <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Faction</p>
                               <p data-testid="modal-collectible-category" className="text-sm text-white font-bold">The Old Kingdom</p>
                           </div>
                           <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                               <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Discovered</p>
                               <p data-testid="modal-collectible-acquired-date" className="text-sm text-white font-bold">Nov 18, 2025</p>
                           </div>
                       </div>
                       <button data-testid="modal-share-button" className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold uppercase tracking-widest transition-colors shadow-lg shadow-amber-900/20">
                           <Share2 size={18} />
                           Proclaim Discovery
                       </button>
                   </div>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
