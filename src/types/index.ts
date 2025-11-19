export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Collectible {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  imageUrl?: string;
  category: 'Hero' | 'Beast' | 'Relic' | 'Spell';
  power: number; // e.g. 10
  element: 'Fire' | 'Ice' | 'Nature' | 'Void' | 'Light' | 'Steel';
  factionColor: string; // gradient classes
}

export interface AlbumSlot {
  id: string;
  position: number; // Index in the grid/layout
  collectibleId: string;
  required: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  milestonePercentage: number; // 0.25, 0.5, 0.75, 1.0
  imageUrl?: string;
  claimed: boolean;
}

export interface Album {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string;
  themeColor: string;
  totalSlots: number;
  slots: AlbumSlot[];
  rewards: Reward[];
}

export interface PlayerProgress {
  playerId: string;
  albumId: string;
  slotsFilled: number; // Count of owned items in this album
  ownedCollectibles: string[]; // IDs of collectibles the player owns
  completionPercentage: number;
}
