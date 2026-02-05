const Game = require('..');

describe('Game Isolation', () => {
  test('boards are independent between games', () => {
    const game1 = new Game();
    const game2 = new Game();

    const result = game1.makeMove('E2', 'E4');
    expect(result.success).toBe(true);

    const board1 = game1.getBoard();
    expect(board1.E2).toEqual({ color: 'none', piece: 'none' });
    expect(board1.E4).toEqual({ color: 'white', piece: 'pawn' });

    const board2 = game2.getBoard();
    expect(board2.E2).toEqual({ color: 'white', piece: 'pawn' });
    expect(board2.E4).toEqual({ color: 'none', piece: 'none' });
  });

  test.skip('turn tracking should be independent between games', () => {
    const game1 = new Game();
    const game2 = new Game();

    const move1 = game1.makeMove('E2', 'E4');
    expect(move1.success).toBe(true);
    expect(game1.getStatus().nextPlayer).toBe('black');

    const move2 = game2.makeMove('D2', 'D4');
    expect(move2.success).toBe(true);
    expect(game2.getStatus().nextPlayer).toBe('black');
  });
});
