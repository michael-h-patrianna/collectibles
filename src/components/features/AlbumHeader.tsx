import React from 'react';
import { Trophy, Gift } from 'lucide-react';
import type { Album, PlayerProgress } from '../../types';
import { motion } from 'framer-motion';

interface AlbumHeaderProps {
  album: Album;
  progress: PlayerProgress;
}

export const AlbumHeader: React.FC<AlbumHeaderProps> = ({ album, progress }) => {
  const percentage = Math.round(progress.completionPercentage * 100);

  return (
    <div data-testid="album-header" className="w-full bg-surface rounded-2xl p-6 mb-8 shadow-xl border border-white/5">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Album Cover */}
        <div className="w-32 h-32 rounded-lg overflow-hidden shadow-2xl flex-shrink-0 border-2 border-white/10">
            <div 
                data-testid="album-header-cover"
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${album.coverImageUrl})` }}
            />
        </div>

        {/* Album Info */}
        <div className="flex-grow text-center md:text-left">
          <h1 data-testid="album-header-title" className="text-3xl font-bold text-white mb-2">{album.name}</h1>
          <p data-testid="album-header-description" className="text-slate-400 mb-4 max-w-2xl">{album.description}</p>
          
          {/* Progress Bar */}
          <div className="w-full max-w-xl">
            <div className="flex justify-between text-sm mb-1 font-medium">
                <span data-testid="album-header-collected-count" className="text-slate-200">{progress.slotsFilled} / {album.totalSlots} Collected</span>
                <span data-testid="album-header-completion-percentage" className="text-blue-400">{percentage}% Complete</span>
            </div>
            <div data-testid="album-header-progress-bar" className="h-4 w-full bg-slate-700 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 relative"
              >
                 <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Milestone Reward Teaser (Simple) */}
        <div data-testid="album-header-reward-teaser" className="flex-shrink-0 flex flex-col items-center p-4 bg-slate-900/50 rounded-xl border border-white/5">
            {percentage === 100 ? (
                 <div className="flex flex-col items-center text-amber-400">
                    <Trophy className="w-8 h-8 mb-1 animate-bounce" />
                    <span className="text-xs font-bold uppercase">Completed!</span>
                 </div>
            ) : (
                <div className="flex flex-col items-center text-slate-400">
                    <Gift className="w-8 h-8 mb-1" />
                    <span className="text-xs font-bold uppercase">Next Reward</span>
                    <span className="text-xs">at {(album.rewards.find(r => !r.claimed)?.milestonePercentage ?? 0) * 100}%</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
