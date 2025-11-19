import type { Album, Collectible, PlayerProgress } from '../types';

export const MOCK_COLLECTIBLES: Collectible[] = [
  {
    id: 'card_dragon',
    name: 'Ignis, the World Burner',
    description: 'An ancient red dragon who sleeps within the volcanic core of Mount Doom.',
    rarity: 'legendary',
    category: 'Beast',
    power: 99,
    element: 'Fire',
    factionColor: 'from-orange-600 to-red-900',
  },
  {
    id: 'card_king',
    name: 'High King Alaric',
    description: 'The last ruler of the Golden Age, wielder of the Sunblade.',
    rarity: 'legendary',
    category: 'Hero',
    power: 95,
    element: 'Light',
    factionColor: 'from-yellow-200 to-amber-600',
  },
  {
    id: 'card_lich',
    name: 'Malakor the Cursed',
    description: 'A necromancer who traded his soul for eternal power.',
    rarity: 'epic',
    category: 'Hero',
    power: 88,
    element: 'Void',
    factionColor: 'from-purple-900 to-slate-900',
  },
  {
    id: 'card_sword',
    name: 'Blade of Aether',
    description: 'A sword forged from fallen stars, humming with cosmic energy.',
    rarity: 'epic',
    category: 'Relic',
    power: 85,
    element: 'Void',
    factionColor: 'from-indigo-500 to-purple-700',
  },
  {
    id: 'card_golem',
    name: 'Frostbound Golem',
    description: 'A construct of living ice that guards the Northern Citadel.',
    rarity: 'rare',
    category: 'Beast',
    power: 75,
    element: 'Ice',
    factionColor: 'from-cyan-300 to-blue-700',
  },
  {
    id: 'card_ranger',
    name: 'Sylvan Ranger',
    description: 'Expert marksman of the Deepwood, friend to all beasts.',
    rarity: 'rare',
    category: 'Hero',
    power: 72,
    element: 'Nature',
    factionColor: 'from-green-400 to-emerald-800',
  },
  {
    id: 'card_shield',
    name: 'Ironclad Shield',
    description: 'Standard issue protection for the Royal Guard.',
    rarity: 'common',
    category: 'Relic',
    power: 40,
    element: 'Steel',
    factionColor: 'from-slate-300 to-slate-500',
  },
  {
    id: 'card_scroll',
    name: 'Scroll of Fireball',
    description: 'A basic spell for aspiring pyromancers.',
    rarity: 'common',
    category: 'Spell',
    power: 35,
    element: 'Fire',
    factionColor: 'from-orange-300 to-orange-500',
  },
];

const slots = MOCK_COLLECTIBLES.map((c, index) => ({
  id: `slot_${index}`,
  position: index,
  collectibleId: c.id,
  required: true,
}));

export const MOCK_ALBUM: Album = {
  id: 'album_fantasy_core',
  name: 'Realm of Aethelgard',
  description: 'Discover the heroes, beasts, and relics of the shattered kingdom.',
  coverImageUrl: 'https://picsum.photos/seed/fantasy/600/400',
  themeColor: '#d97706', // Amber-600
  totalSlots: 8,
  slots: slots,
  rewards: [
    {
      id: 'reward_50',
      name: 'Silver Ball Pack',
      description: 'Contains 3 Rare players.',
      milestonePercentage: 0.5,
      claimed: true,
    },
    {
      id: 'reward_100',
      name: 'Golden Boot Trophy',
      description: 'Exclusive profile badge.',
      milestonePercentage: 1.0,
      claimed: false,
    },
  ],
};

export const INITIAL_PLAYER_PROGRESS: PlayerProgress = {
  playerId: 'user_123',
  albumId: 'album_fantasy_core',
  slotsFilled: 5,
  ownedCollectibles: ['card_dragon', 'card_sword', 'card_golem', 'card_shield', 'card_scroll'],
  completionPercentage: 0.625,
};
