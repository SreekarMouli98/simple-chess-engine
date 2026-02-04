const Game = require('..')

describe('Missing Chess Rules', () => {
    
    describe('Pawn Promotion', () => {
        test.todo('pawn promotes to queen upon reaching last rank')
        test.todo('promotion defaults to queen when no piece is specified')
        test.todo('promotion allows choosing a piece (queen, rook, bishop, knight)')
        test.todo('promotion with capture on the last rank')
        test.todo('promotion to knight can give check')
        test.todo('promotion can deliver checkmate')
        test.todo('promotion with capture on the last rank for black')
    })

    describe('En Passant', () => {
        test.todo('allows en passant capture')
        test.todo('en passant is only available immediately after a double-step')
        test.todo('en passant is illegal when capturing pawn is pinned')
        test.todo('en passant capture removes pawn and can give check')
    })

    describe('Draw Conditions', () => {
        test.todo('detects insufficient material (K vs K)')
        test.todo('detects three-fold repetition')
        test.todo('detects 50-move rule draw')
        test.todo('detects insufficient material (K+B vs K)')
        test.todo('detects insufficient material (K+N vs K)')
        test.todo('detects insufficient material (K+B vs K+B same color)')
        test.todo('detects three-fold repetition with same side to move')
        test.todo('50-move rule resets on pawn move and capture')
    })

    describe('Pin Constraints', () => {
        test('piece pinned diagonally cannot move', () => {
            const game = new Game()
            const content = JSON.stringify({
                E1: { color: 'white', piece: 'king' },
                D2: { color: 'white', piece: 'pawn' },
                A5: { color: 'black', piece: 'bishop' }, 
                H8: { color: 'black', piece: 'king' }
            })
            const loadParams = game.loadBoard(content, { firstPlayer: 'white' })
            expect(loadParams.success).toBe(true)

            const moves = game.getPossibleMoves('D2')
            expect(moves).not.toContain('D3')
            expect(moves).not.toContain('D4')
            expect(moves).toEqual([])
        })
    })
})
