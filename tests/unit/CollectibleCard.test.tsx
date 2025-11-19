import { render, screen, fireEvent } from '@testing-library/react';
import { CollectibleCard } from '../../src/components/features/CollectibleCard';
import type { Collectible } from '../../src/types';

const mockCollectible: Collectible = {
  id: 'test_1',
  name: 'Test Card',
  description: 'A test card',
  rarity: 'legendary',
  category: 'Hero',
  power: 99,
  element: 'Fire',
  factionColor: 'from-red-500 to-orange-500'
};

describe('CollectibleCard', () => {
  it('renders locked state correctly', () => {
    render(
      <CollectibleCard 
        collectible={mockCollectible} 
        isOwned={false} 
        onClick={() => {}} 
      />
    );
    expect(screen.getByText('Locked')).toBeInTheDocument();
    expect(screen.queryByText('Test Card')).not.toBeInTheDocument();
  });

  it('renders owned state correctly', () => {
    render(
      <CollectibleCard 
        collectible={mockCollectible} 
        isOwned={true} 
        onClick={() => {}} 
      />
    );
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('legendary')).toBeInTheDocument();
  });

  it('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(
      <CollectibleCard 
        collectible={mockCollectible} 
        isOwned={true} 
        onClick={handleClick} 
      />
    );
    fireEvent.click(screen.getByText('Test Card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
