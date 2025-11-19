import { useState, useMemo } from 'react';
import { ArrowLeft, LayoutGrid, Sparkles } from 'lucide-react';
import { Dashboard } from './components/features/Dashboard';
import { AlbumHeader } from './components/features/AlbumHeader';
import { AlbumGrid } from './components/features/AlbumGrid';
import { CollectibleModal } from './components/features/CollectibleModal';
import { PackOpener } from './components/features/PackOpener';
import { MOCK_ALBUM, MOCK_COLLECTIBLES, INITIAL_PLAYER_PROGRESS } from './data/mockData';
import type { Collectible, PlayerProgress } from './types';

type View = 'dashboard' | 'album';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(INITIAL_PLAYER_PROGRESS);
  const [selectedCollectible, setSelectedCollectible] = useState<Collectible | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pack Opener State
  const [isPackOpenerOpen, setIsPackOpenerOpen] = useState(false);

  // Filter State
  const [activeFilter, setActiveFilter] = useState('All');

  // Transform collectibles array to map for O(1) lookup
  const collectiblesMap = useMemo(() => {
    return MOCK_COLLECTIBLES.reduce((acc, c) => ({ ...acc, [c.id]: c }), {} as Record<string, Collectible>);
  }, []);

  // Calculate progress helper
  const calculateProgress = (ownedIds: string[]): PlayerProgress => {
    const slotsFilled = ownedIds.length;
    const completionPercentage = slotsFilled / MOCK_ALBUM.totalSlots;
    return {
      ...playerProgress,
      slotsFilled,
      ownedCollectibles: ownedIds,
      completionPercentage,
    };
  };

  // Filter Logic
  const filteredSlots = useMemo(() => {
    if (activeFilter === 'All') return MOCK_ALBUM.slots;

    return MOCK_ALBUM.slots.filter(slot => {
      const collectible = collectiblesMap[slot.collectibleId];
      const isOwned = playerProgress.ownedCollectibles.includes(slot.collectibleId);

      if (activeFilter === 'Collected') return isOwned;
      if (activeFilter === 'Missing') return !isOwned;
      
      // Rarity filters
      if (['Legendary', 'Epic', 'Rare', 'Common'].includes(activeFilter)) {
        return collectible.rarity.toLowerCase() === activeFilter.toLowerCase();
      }
      
      return true;
    });
  }, [activeFilter, playerProgress.ownedCollectibles, collectiblesMap]);

  // Handle Opening a Pack
  const handleOpenPack = (): Collectible[] => {
    const ownedSet = new Set(playerProgress.ownedCollectibles);
    const missingCollectibles = MOCK_COLLECTIBLES.filter(c => !ownedSet.has(c.id));
    
    if (missingCollectibles.length === 0) {
      // Fallback if completed (give a random dupe or nothing)
      return [];
    }

    // For testing purposes, always pick the first missing card
    const collectibleToGrant = missingCollectibles[0]; 
    
    // Update Progress
    const newOwned = [...playerProgress.ownedCollectibles, collectibleToGrant.id];
    setPlayerProgress(calculateProgress(newOwned));

    return [collectibleToGrant]; // Returns one specific collectible
  };

  const handleCardClick = (collectible: Collectible) => {
    setSelectedCollectible(collectible);
    setIsModalOpen(true);
  };

  const handleSelectAlbum = () => {
    setView('album');
  };

  const goBack = () => {
    setView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-amber-500/30 pb-20 relative">
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {view === 'album' && (
               <button 
                 data-testid="back-to-dashboard-button" 
                 onClick={goBack} 
                 aria-label="Back to Dashboard"
                 className="p-2 hover:bg-white/5 rounded-lg transition-colors"
               >
                 <ArrowLeft size={20} className="text-slate-400 hover:text-white" />
               </button>
            )}
            <h1 data-testid="navbar-title" className="text-xl font-bold tracking-tight flex items-center gap-2">
               <span className="text-primary">GEMINI</span>
               <span>COLLECTIBLES</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
             {/* Pack Button */}
             <button 
               data-testid="open-pack-button"
               onClick={() => setIsPackOpenerOpen(true)}
               disabled={playerProgress.completionPercentage === 1}
               aria-label="Open Pack"
               className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 border border-amber-300/50"
             >
               <Sparkles size={16} className="animate-pulse" />
               <span>OPEN PACK</span>
             </button>
             
             <div className="h-8 w-[1px] bg-white/10 mx-2" />

             <button 
               data-testid="dashboard-view-button" 
               onClick={goBack}
               aria-label="Dashboard View"
               className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
             >
               <LayoutGrid size={20} />
             </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {view === 'dashboard' ? (
            <Dashboard 
               albums={[MOCK_ALBUM, {...MOCK_ALBUM, id: '2', name: 'World Cup 2026', coverImageUrl: 'https://picsum.photos/seed/worldcup/600/400'}]} 
               onSelectAlbum={handleSelectAlbum} 
            />
        ) : (
            <div data-testid="album-view" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Album Header */}
                <AlbumHeader album={MOCK_ALBUM} progress={playerProgress} />

                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                    {['All', 'Collected', 'Missing', 'Legendary', 'Epic', 'Rare'].map((filter) => (
                        <button 
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            data-testid={`filter-button-${filter.toLowerCase()}`}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                activeFilter === filter 
                                ? 'bg-white text-black border-white shadow-lg shadow-white/10' 
                                : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <AlbumGrid 
                    slots={filteredSlots}
                    ownedCollectibles={playerProgress.ownedCollectibles}
                    collectiblesMap={collectiblesMap}
                    onCardClick={handleCardClick}
                />
            </div>
        )}

      </main>

      {/* Modals */}
      <CollectibleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        collectible={selectedCollectible}
        isOwned={selectedCollectible ? playerProgress.ownedCollectibles.includes(selectedCollectible.id) : false}
      />

      <PackOpener 
        isOpen={isPackOpenerOpen}
        onClose={() => setIsPackOpenerOpen(false)}
        onOpenPack={handleOpenPack}
      />
    </div>
  );
}

export default App;