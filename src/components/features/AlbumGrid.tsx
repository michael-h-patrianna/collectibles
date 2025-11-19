import React from 'react';
import type { AlbumSlot, Collectible } from '../../types';
import { CollectibleCard } from './CollectibleCard';

interface AlbumGridProps {
  slots: AlbumSlot[];
  ownedCollectibles: string[];
  collectiblesMap: Record<string, Collectible>;
  onCardClick: (collectible: Collectible, isOwned: boolean) => void;
}

export const AlbumGrid: React.FC<AlbumGridProps> = ({
  slots,
  ownedCollectibles,
  collectiblesMap,
  onCardClick,
}) => {
  return (
    <div data-testid="album-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {slots.map((slot) => {
        const collectible = collectiblesMap[slot.collectibleId];
        const isOwned = ownedCollectibles.includes(slot.collectibleId);

        if (!collectible) return null;

        return (
          <div key={slot.id} className="w-full">
            <CollectibleCard
              collectible={collectible}
              isOwned={isOwned}
              onClick={() => onCardClick(collectible, isOwned)}
            />
          </div>
        );
      })}
    </div>
  );
};
