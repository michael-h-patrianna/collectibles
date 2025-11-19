import { render, screen } from '@testing-library/react';
import { AlbumHeader } from '../../src/components/features/AlbumHeader';
import { MOCK_ALBUM } from '../../src/data/mockData';

describe('AlbumHeader', () => {
  const mockProgress = {
    playerId: 'test',
    albumId: 'test_album',
    slotsFilled: 5,
    ownedCollectibles: [],
    completionPercentage: 0.625,
  };

  it('renders album name correctly', () => {
    render(<AlbumHeader album={MOCK_ALBUM} progress={mockProgress} />);
    expect(screen.getByText(MOCK_ALBUM.name)).toBeInTheDocument();
  });

  it('displays correct progress percentage', () => {
    render(<AlbumHeader album={MOCK_ALBUM} progress={mockProgress} />);
    expect(screen.getByText('63% Complete')).toBeInTheDocument(); // 0.625 * 100 = 62.5 -> round to 63
  });

  it('shows collected count', () => {
    render(<AlbumHeader album={MOCK_ALBUM} progress={mockProgress} />);
    expect(screen.getByText(`5 / ${MOCK_ALBUM.totalSlots} Collected`)).toBeInTheDocument();
  });
});
