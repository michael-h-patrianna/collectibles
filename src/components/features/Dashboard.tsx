import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, ArrowRight } from 'lucide-react';
import type { Album } from '../../types';

interface DashboardProps {
  albums: Album[];
  onSelectAlbum: (albumId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ albums, onSelectAlbum }) => {
  return (
    <div data-testid="dashboard-view" className="w-full">
       <div className="mb-8">
         <h2 data-testid="dashboard-title" className="text-3xl font-bold text-white mb-2">My Collections</h2>
         <p className="text-slate-400">Track your progress across all active seasons.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              whileHover={{ y: -5 }}
              onClick={() => onSelectAlbum(album.id)}
              className="bg-surface border border-white/10 rounded-2xl overflow-hidden cursor-pointer group shadow-xl hover:shadow-2xl transition-shadow"
            >
              {/* Cover Image Area */}
              <div className="h-48 bg-slate-900 relative overflow-hidden">
                 <img 
                   src={album.coverImageUrl} 
                   alt={album.name}
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                 
                 {/* Theme Badge */}
                 <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold uppercase tracking-wider text-white">
                    Season 2025
                 </div>
              </div>

              <div className="p-6 relative">
                 <h3 data-testid={`album-card-title-${album.id}`} className="text-xl font-bold !text-white mb-1 group-hover:text-blue-300">
                    {album.name}
                 </h3>
                 <p className="text-sm !text-slate-200 mb-6 line-clamp-2">
                    {album.description}
                 </p>

                 {/* Mini Progress Preview */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                       <span className="!text-slate-200">Progress</span>
                       <span className="!text-blue-200">62%</span>
                    </div>
                    <div data-testid={`album-card-progress-${album.id}`} className="h-2 bg-slate-700 rounded-full overflow-hidden">
                       <div className="h-full w-[62%] bg-primary rounded-full" />
                    </div>
                 </div>

                 <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex -space-x-2">
                        {/* Reward Previews */}
                        <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-surface flex items-center justify-center text-amber-500">
                            <Trophy size={14} />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-surface flex items-center justify-center text-slate-500">
                            <Lock size={14} />
                        </div>
                    </div>
                    <span className="text-sm font-semibold !text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Album <ArrowRight size={16} />
                    </span>
                 </div>
              </div>
            </motion.div>
          ))}
       </div>
    </div>
  );
};
