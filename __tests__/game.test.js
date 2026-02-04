const Game = require('..')

describe('Game API', () => {
    test('initial status and board layout', () => {
        const game = new Game()
        const status = game.getStatus()

        expect(status).toEqual({
            nextPlayer: 'white',
            isCheck: false,
            isCheckmate: false,
            isStalemate: false
        })

        const board = game.getBoard()
        expect(board.A1).toEqual({ color: 'white', piece: 'rook' })
        expect(board.E1).toEqual({ color: 'white', piece: 'king' })
        expect(board.E8).toEqual({ color: 'black', piece: 'king' })
        expect(board.A8).toEqual({ color: 'black', piece: 'rook' })
    })

    test('possible moves for initial knight', () => {
        const game = new Game()
        const moves = game.getPossibleMoves('B1').sort()
        expect(moves).toEqual(['A3', 'C3'])
    })

    test('knight moves ignore blockers', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            E8: { color: 'black', piece: 'king' },
            D4: { color: 'white', piece: 'knight' },
            D5: { color: 'white', piece: 'pawn' },
            D3: { color: 'white', piece: 'pawn' },
            C4: { color: 'white', piece: 'pawn' },
            E4: { color: 'white', piece: 'pawn' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('D4')
        expect(moves).toContain('B5')
        expect(moves).toContain('B3')
        expect(moves).toContain('C6')
        expect(moves).toContain('E6')
        expect(moves).toContain('F5')
        expect(moves).toContain('F3')
        expect(moves).toContain('C2')
        expect(moves).toContain('E2')
    })

    test('returns empty moves for invalid positions', () => {
        const game = new Game()
        expect(game.getPossibleMoves('Z9')).toEqual([])
        expect(game.getPossibleMoves('A0')).toEqual([])
    })

    test('returns empty moves for opponent piece', () => {
        const game = new Game()
        expect(game.getPossibleMoves('E7')).toEqual([])
    })

    test('makeMove updates status and undo restores turn', () => {
        const game = new Game()
        const result = game.makeMove('E2', 'E4')

        expect(result.success).toBe(true)
        expect(result.status.nextPlayer).toBe('black')

        const undoStatus = game.undo()
        expect(undoStatus.nextPlayer).toBe('white')

        const board = game.getBoard()
        expect(board.E2).toEqual({ color: 'white', piece: 'pawn' })
        expect(board.E4).toEqual({ color: 'none', piece: 'none' })
    })

    test('undo after multiple moves restores initial state', () => {
        const game = new Game()
        const move1 = game.makeMove('E2', 'E4')
        expect(move1.success).toBe(true)

        const move2 = game.makeMove('E7', 'E5')
        expect(move2.success).toBe(true)

        game.undo()
        game.undo()

        const status = game.getStatus()
        expect(status.nextPlayer).toBe('white')

        const board = game.getBoard()
        expect(board.E2).toEqual({ color: 'white', piece: 'pawn' })
        expect(board.E4).toEqual({ color: 'none', piece: 'none' })
        expect(board.E7).toEqual({ color: 'black', piece: 'pawn' })
        expect(board.E5).toEqual({ color: 'none', piece: 'none' })
    })

    test('undo restores captured pieces', () => {
        const game = new Game()
        const content = JSON.stringify({
            H1: { color: 'white', piece: 'king' },
            H8: { color: 'black', piece: 'king' },
            A1: { color: 'white', piece: 'rook' },
            A3: { color: 'black', piece: 'pawn' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const move = game.makeMove('A1', 'A3')
        expect(move.success).toBe(true)

        let board = game.getBoard()
        expect(board.A3).toEqual({ color: 'white', piece: 'rook' })

        game.undo()
        board = game.getBoard()
        expect(board.A1).toEqual({ color: 'white', piece: 'rook' })
        expect(board.A3).toEqual({ color: 'black', piece: 'pawn' })
    })

    test('undo after invalid move does not affect history', () => {
        const game = new Game()
        const move = game.makeMove('E2', 'E4')
        expect(move.success).toBe(true)

        const invalid = game.makeMove('A2', 'A3')
        expect(invalid.success).toBe(false)

        game.undo()
        const board = game.getBoard()
        expect(board.E2).toEqual({ color: 'white', piece: 'pawn' })
        expect(board.E4).toEqual({ color: 'none', piece: 'none' })
    })

    test('rejects invalid move inputs', () => {
        const game = new Game()
        const badSource = game.makeMove('Z9', 'A1')
        const badTarget = game.makeMove('A2', 'Z9')

        expect(badSource.success).toBe(false)
        expect(badTarget.success).toBe(false)

        const board = game.getBoard()
        expect(board.A2).toEqual({ color: 'white', piece: 'pawn' })
        expect(board.A1).toEqual({ color: 'white', piece: 'rook' })
    })

    test('rejects moving from an empty square', () => {
        const game = new Game()
        const result = game.makeMove('E3', 'E4')

        expect(result.success).toBe(false)
        expect(result.status.nextPlayer).toBe('white')

        const board = game.getBoard()
        expect(board.E3).toEqual({ color: 'none', piece: 'none' })
        expect(board.E4).toEqual({ color: 'none', piece: 'none' })
    })

    test('rejects no-op moves to the same square', () => {
        const game = new Game()
        const result = game.makeMove('E2', 'E2')

        expect(result.success).toBe(false)
        expect(result.status.nextPlayer).toBe('white')

        const board = game.getBoard()
        expect(board.E2).toEqual({ color: 'white', piece: 'pawn' })
    })

    test('rejects malformed algebraic inputs', () => {
        const game = new Game()

        expect(() => game.makeMove('', '')).toThrow()
        expect(() => game.makeMove('E', 'E4')).toThrow()

        const badRank = game.makeMove('E9', 'E4')
        const badFile = game.makeMove('11', 'E4')

        expect(badRank.success).toBe(false)
        expect(badFile.success).toBe(false)

        const board = game.getBoard()
        expect(board.E2).toEqual({ color: 'white', piece: 'pawn' })
        expect(board.E4).toEqual({ color: 'none', piece: 'none' })
    })

    test('rejects moving opponent piece on current turn', () => {
        const game = new Game()
        const result = game.makeMove('E7', 'E6')

        expect(result.success).toBe(false)
        expect(result.status.nextPlayer).toBe('white')

        const board = game.getBoard()
        expect(board.E7).toEqual({ color: 'black', piece: 'pawn' })
        expect(board.E6).toEqual({ color: 'none', piece: 'none' })
    })

    test('captures update board state', () => {
        const game = new Game()
        const content = JSON.stringify({
            H1: { color: 'white', piece: 'king' },
            H8: { color: 'black', piece: 'king' },
            A1: { color: 'white', piece: 'rook' },
            A3: { color: 'black', piece: 'pawn' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const result = game.makeMove('A1', 'A3')
        expect(result.success).toBe(true)

        const board = game.getBoard()
        expect(board.A1).toEqual({ color: 'none', piece: 'none' })
        expect(board.A3).toEqual({ color: 'white', piece: 'rook' })
    })

    test('rook moves stop at blockers and include captures', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            H8: { color: 'black', piece: 'king' },
            D4: { color: 'white', piece: 'rook' },
            D6: { color: 'white', piece: 'pawn' },
            B4: { color: 'black', piece: 'pawn' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('D4')
        expect(moves).toContain('D5')
        expect(moves).toContain('D3')
        expect(moves).toContain('C4')
        expect(moves).toContain('B4')
        expect(moves).toContain('E4')
        expect(moves).not.toContain('D6')
        expect(moves).not.toContain('A4')
    })

    test('bishop moves stop at friendly pieces and include captures', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            H8: { color: 'black', piece: 'king' },
            C1: { color: 'white', piece: 'bishop' },
            B2: { color: 'white', piece: 'pawn' },
            F4: { color: 'black', piece: 'pawn' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('C1')
        expect(moves).toContain('D2')
        expect(moves).toContain('E3')
        expect(moves).toContain('F4')
        expect(moves).not.toContain('B2')
        expect(moves).not.toContain('A3')
        expect(moves).not.toContain('G5')
    })

    test('queen combines rook and bishop movement', () => {
        const game = new Game()
        const content = JSON.stringify({
            H1: { color: 'white', piece: 'king' },
            A8: { color: 'black', piece: 'king' },
            D4: { color: 'white', piece: 'queen' },
            D6: { color: 'white', piece: 'pawn' },
            F4: { color: 'black', piece: 'pawn' },
            B6: { color: 'black', piece: 'pawn' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('D4')
        expect(moves).toContain('D5')
        expect(moves).toContain('D3')
        expect(moves).toContain('E4')
        expect(moves).toContain('F4')
        expect(moves).toContain('E5')
        expect(moves).toContain('B6')
        expect(moves).not.toContain('D6')
        expect(moves).not.toContain('A7')
    })

    test('pawn moves include forward steps and captures', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            H8: { color: 'black', piece: 'king' },
            D2: { color: 'white', piece: 'pawn' },
            E3: { color: 'black', piece: 'pawn' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('D2')
        expect(moves).toContain('D3')
        expect(moves).toContain('D4')
        expect(moves).toContain('E3')
        expect(moves).not.toContain('C3')
    })

    test('black pawn moves include forward steps and captures', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            H8: { color: 'black', piece: 'king' },
            A2: { color: 'white', piece: 'pawn' },
            D7: { color: 'black', piece: 'pawn' },
            C6: { color: 'white', piece: 'pawn' },
            E6: { color: 'white', piece: 'pawn' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const whiteMove = game.makeMove('A2', 'A3')
        expect(whiteMove.success).toBe(true)

        const moves = game.getPossibleMoves('D7')
        expect(moves).toContain('D6')
        expect(moves).toContain('D5')
        expect(moves).toContain('C6')
        expect(moves).toContain('E6')
        expect(moves).not.toContain('D8')
    })

    test.todo('pawn double-step is blocked by occupied intermediate square')

    test('king moves to adjacent squares', () => {
        const game = new Game()
        const content = JSON.stringify({
            E4: { color: 'white', piece: 'king' },
            H8: { color: 'black', piece: 'king' },
            A1: { color: 'white', piece: 'rook' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('E4')
        expect(moves.length).toBe(8)
        expect(moves).toContain('D5')
        expect(moves).toContain('F3')
    })

    test('loadBoard rejects invalid JSON', () => {
        const game = new Game()
        const resp = game.loadBoard('not-json', {})

        expect(resp.success).toBe(false)
        expect(resp.reasons).toContain('Invalid Data')
    })

    test.todo('loadBoard accepts a valid custom board')

    test('loadBoard reports detailed validation errors', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { piece: 'king' },
            B2: { color: 'white', piece: 'invalid' },
            Z9: { color: 'black', piece: 'king' },
            C1: { color: 'white', piece: 'king' },
            H8: { color: 'black', piece: 'king' },
            H1: { color: 'white', piece: 'rook' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })

        expect(resp.success).toBe(false)
        expect(resp.reasons).toContain("Missing field 'color' at 'A1'")
        expect(resp.reasons).toContain("Invalid piece 'invalid' provided at 'B2'")
        expect(resp.reasons).toContain("Invalid Position 'Z9'")
    })

    test('loadBoard rejects boards with fewer than 3 pieces', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            H8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })

        expect(resp.success).toBe(false)
        expect(resp.reasons).toContain('Minimum 3 pieces required')
    })

    test('loadBoard rejects invalid piece names case-insensitively', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'QuEeNn' },
            E1: { color: 'white', piece: 'king' },
            E8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })

        expect(resp.success).toBe(false)
        expect(resp.reasons).toContain("Invalid piece 'QuEeNn' provided at 'A1'")
    })

    test('loadBoard rejects non-object squares and invalid keys', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: 'king',
            '12': { color: 'white', piece: 'king' },
            E1: { color: 'white', piece: 'king' },
            E8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })

        expect(resp.success).toBe(false)
        expect(resp.reasons).toContain("Missing field 'color' at 'A1'")
        expect(resp.reasons).toContain("Missing field 'piece' at 'A1'")
        expect(resp.reasons).toContain("Invalid Position '12'")
    })

    test.todo('loadBoard rejects duplicate kings')

    test('loadBoard rejects positions missing a king', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            H1: { color: 'white', piece: 'rook' },
            H8: { color: 'black', piece: 'rook' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })

        expect(resp.success).toBe(false)
        expect(resp.reasons).toContain('Black King position not specified')
    })

    test('loadBoard rejects boards where a king starts in check', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            E1: { color: 'white', piece: 'rook' },
            E8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })

        expect(resp.success).toBe(false)
        expect(resp.reasons).toContain('Black King is under check')
    })

    test('loadBoard rejects invalid firstPlayer values', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            C3: { color: 'black', piece: 'king' },
            H1: { color: 'white', piece: 'rook' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'green' })

        expect(resp.success).toBe(false)
        expect(resp.reasons).toContain("'firstPlayer' can either be 'black' or 'white'")
    })

    test.todo('getStatus reflects current player and check state after loadBoard')

    test('resetGame with custom=true restores custom board', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            C3: { color: 'black', piece: 'king' },
            H1: { color: 'white', piece: 'rook' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        game.makeMove('H1', 'H2')
        let board = game.getBoard()
        expect(board.H2).toEqual({ color: 'white', piece: 'rook' })

        game.resetGame({ custom: true })
        board = game.getBoard()
        expect(board.H1).toEqual({ color: 'white', piece: 'rook' })
        expect(board.H2).toEqual({ color: 'none', piece: 'none' })
    })

    test('resetGame restores default board after custom board session', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            C3: { color: 'black', piece: 'king' },
            H1: { color: 'white', piece: 'rook' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        game.resetGame()
        const board = game.getBoard()
        expect(board.E2).toEqual({ color: 'white', piece: 'pawn' })
        expect(board.E7).toEqual({ color: 'black', piece: 'pawn' })
        expect(board.A1).toEqual({ color: 'white', piece: 'rook' })
        expect(board.E1).toEqual({ color: 'white', piece: 'king' })
        expect(board.E8).toEqual({ color: 'black', piece: 'king' })
    })

    test('getBoard rejects unsupported formats', () => {
        const game = new Game()
        expect(game.getBoard({ format: 'ARRAY' })).toBe('unsupported format provided')
    })

    test('getBoard respects format casing for JSON', () => {
        const game = new Game()
        const board = game.getBoard({ format: 'json' })
        expect(board.E1).toEqual({ color: 'white', piece: 'king' })
    })

    test('loadBoard rejects unsupported format', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            C3: { color: 'black', piece: 'king' },
            H1: { color: 'white', piece: 'rook' }
        })
        const resp = game.loadBoard(content, { format: 'FEN', firstPlayer: 'white' })

        expect(resp.success).toBe(false)
        expect(resp.reasons).toContain('Unsupported Format Provided')
    })

    test('castling is available when path is clear', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            H1: { color: 'white', piece: 'rook' },
            E8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('E1')
        expect(moves).toContain('G1')
        expect(moves).not.toContain('C1')
    })

    test('castling queen-side moves rook to correct square', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            A1: { color: 'white', piece: 'rook' },
            E8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('E1')
        expect(moves).toContain('C1')

        const move = game.makeMove('E1', 'C1')
        expect(move.success).toBe(true)

        const board = game.getBoard()
        expect(board.C1).toEqual({ color: 'white', piece: 'king' })
        expect(board.D1).toEqual({ color: 'white', piece: 'rook' })
        expect(board.A1).toEqual({ color: 'none', piece: 'none' })
        expect(board.E1).toEqual({ color: 'none', piece: 'none' })
    })

    test('castling is illegal when rook is missing', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            A2: { color: 'white', piece: 'pawn' },
            E8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('E1')
        expect(moves).not.toContain('G1')
        expect(moves).not.toContain('C1')
    })

    test('castling is unavailable through check', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            H1: { color: 'white', piece: 'rook' },
            A8: { color: 'black', piece: 'king' },
            F8: { color: 'black', piece: 'rook' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('E1')
        expect(moves).not.toContain('G1')
    })

    test('castling is blocked by pieces between king and rook', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            A1: { color: 'white', piece: 'rook' },
            D1: { color: 'white', piece: 'bishop' },
            E8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('E1')
        expect(moves).not.toContain('C1')
    })

    test('castling is unavailable while in check', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            H1: { color: 'white', piece: 'rook' },
            E8: { color: 'black', piece: 'rook' },
            A8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('E1')
        expect(moves).not.toContain('G1')
    })

    test('castling is unavailable after rook has moved', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            H1: { color: 'white', piece: 'rook' },
            E8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const rookMove = game.makeMove('H1', 'H2')
        expect(rookMove.success).toBe(true)
        game.undo()

        const moves = game.getPossibleMoves('E1')
        expect(moves).not.toContain('G1')
    })

    test('castling is unavailable after king has moved', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            H1: { color: 'white', piece: 'rook' },
            E8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const kingMove = game.makeMove('E1', 'E2')
        expect(kingMove.success).toBe(true)
        const blackMove = game.makeMove('E8', 'E7')
        expect(blackMove.success).toBe(true)
        const kingReturn = game.makeMove('E2', 'E1')
        expect(kingReturn.success).toBe(true)

        const moves = game.getPossibleMoves('E1')
        expect(moves).not.toContain('G1')
    })

    test('castling move is undone correctly', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            H1: { color: 'white', piece: 'rook' },
            E8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const move = game.makeMove('E1', 'G1')
        expect(move.success).toBe(true)

        let board = game.getBoard()
        expect(board.G1).toEqual({ color: 'white', piece: 'king' })
        expect(board.F1).toEqual({ color: 'white', piece: 'rook' })
        expect(board.E1).toEqual({ color: 'none', piece: 'none' })
        expect(board.H1).toEqual({ color: 'none', piece: 'none' })

        game.undo()
        board = game.getBoard()
        expect(board.E1).toEqual({ color: 'white', piece: 'king' })
        expect(board.H1).toEqual({ color: 'white', piece: 'rook' })
        expect(board.F1).toEqual({ color: 'none', piece: 'none' })
        expect(board.G1).toEqual({ color: 'none', piece: 'none' })
    })

    test('undo after castling restores castling rights', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            H1: { color: 'white', piece: 'rook' },
            E8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const move = game.makeMove('E1', 'G1')
        expect(move.success).toBe(true)

        game.undo()
        const moves = game.getPossibleMoves('E1')
        expect(moves).toContain('G1')
    })

    test.todo('castling through an attacked square is illegal (knight attack)')
    test.todo('castling is illegal when rook is not on original square')
    test.todo('castling rights after undo edge cases are preserved correctly')

    test('status reports check for current player', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            A8: { color: 'black', piece: 'king' },
            E8: { color: 'black', piece: 'rook' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const status = game.getStatus()
        expect(status.isCheck).toBe(true)
    })

    test('pinned piece cannot expose king', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            E2: { color: 'white', piece: 'rook' },
            E8: { color: 'black', piece: 'rook' },
            A8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('E2')
        expect(moves).not.toContain('D2')
        expect(moves).not.toContain('F2')
        expect(moves).toContain('E3')
        expect(moves).toContain('E8')
    })

    test('king cannot move into check from a rook', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            A2: { color: 'white', piece: 'pawn' },
            E8: { color: 'black', piece: 'rook' },
            A8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('E1')
        expect(moves).not.toContain('E2')
    })

    test('king cannot move adjacent to enemy king', () => {
        const game = new Game()
        const content = JSON.stringify({
            E2: { color: 'white', piece: 'king' },
            A1: { color: 'white', piece: 'rook' },
            E4: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('E2')
        expect(moves).not.toContain('E3')
    })

    test('capturing a pinned piece that exposes own king is illegal', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            D2: { color: 'white', piece: 'bishop' },
            C3: { color: 'black', piece: 'knight' },
            E8: { color: 'black', piece: 'rook' },
            A8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('D2')
        expect(moves).not.toContain('C3')
    })

    test('can block a check by interposing a piece', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            F1: { color: 'white', piece: 'bishop' },
            A2: { color: 'white', piece: 'pawn' },
            E8: { color: 'black', piece: 'rook' },
            A8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const moves = game.getPossibleMoves('F1')
        expect(moves).toContain('E2')
    })

    test('pinned piece may capture attacker to resolve check', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            E2: { color: 'white', piece: 'rook' },
            E8: { color: 'black', piece: 'rook' },
            A8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const result = game.makeMove('E2', 'E8')
        expect(result.success).toBe(true)
        expect(result.status.nextPlayer).toBe('black')

        const board = game.getBoard()
        expect(board.E8).toEqual({ color: 'white', piece: 'rook' })
        expect(board.E2).toEqual({ color: 'none', piece: 'none' })
    })

    test('rejects moves that leave king in check', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            E2: { color: 'white', piece: 'rook' },
            E8: { color: 'black', piece: 'rook' },
            A8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const result = game.makeMove('E2', 'D2')
        expect(result.success).toBe(false)
        expect(result.status.nextPlayer).toBe('white')

        const board = game.getBoard()
        expect(board.E2).toEqual({ color: 'white', piece: 'rook' })
        expect(board.D2).toEqual({ color: 'none', piece: 'none' })
    })
    test('in-check positions only allow resolving moves', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            A1: { color: 'white', piece: 'rook' },
            E8: { color: 'black', piece: 'rook' },
            H8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const rookMoves = game.getPossibleMoves('A1')
        expect(rookMoves).toEqual([])
    })

    test('double check allows only king moves', () => {
        const game = new Game()
        const content = JSON.stringify({
            E1: { color: 'white', piece: 'king' },
            A1: { color: 'white', piece: 'rook' },
            E8: { color: 'black', piece: 'rook' },
            B4: { color: 'black', piece: 'bishop' },
            H8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const rookMoves = game.getPossibleMoves('A1')
        expect(rookMoves).toEqual([])
    })

    test('check updates after a move delivers check', () => {
        const game = new Game()
        const content = JSON.stringify({
            H1: { color: 'white', piece: 'king' },
            A8: { color: 'black', piece: 'king' },
            D2: { color: 'white', piece: 'queen' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const result = game.makeMove('D2', 'A5')
        expect(result.success).toBe(true)
        expect(result.status.isCheck).toBe(true)
    })

    test('checkmate is detected when current player has no escapes', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            C3: { color: 'black', piece: 'king' },
            B2: { color: 'black', piece: 'queen' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const status = game.getStatus()
        expect(status.isCheck).toBe(true)
        expect(status.isCheckmate).toBe(true)
        expect(status.isStalemate).toBe(false)
    })

    test('discovered checkmate is detected after a move', () => {
        const game = new Game()
        const content = JSON.stringify({
            H1: { color: 'white', piece: 'king' },
            A1: { color: 'white', piece: 'rook' },
            A2: { color: 'white', piece: 'bishop' },
            C7: { color: 'white', piece: 'bishop' },
            D6: { color: 'white', piece: 'knight' },
            A8: { color: 'black', piece: 'king' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const move = game.makeMove('A2', 'B1')
        expect(move.success).toBe(true)
        expect(move.status.isCheck).toBe(true)
        expect(move.status.isCheckmate).toBe(true)
    })

    test('stalemate is detected when current player has no legal moves', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            C3: { color: 'black', piece: 'king' },
            C2: { color: 'black', piece: 'queen' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const status = game.getStatus()
        expect(status.isCheck).toBe(false)
        expect(status.isCheckmate).toBe(false)
        expect(status.isStalemate).toBe(true)
    })

    test('not stalemate when a blocking piece can capture', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            C1: { color: 'white', piece: 'rook' },
            C3: { color: 'black', piece: 'king' },
            C2: { color: 'black', piece: 'queen' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const status = game.getStatus()
        expect(status.isCheck).toBe(false)
        expect(status.isStalemate).toBe(false)

        const moves = game.getPossibleMoves('C1')
        expect(moves).toContain('C2')
    })

    test('not stalemate when a legal move exists', () => {
        const game = new Game()
        const content = JSON.stringify({
            A1: { color: 'white', piece: 'king' },
            H1: { color: 'white', piece: 'rook' },
            C3: { color: 'black', piece: 'king' },
            C2: { color: 'black', piece: 'queen' }
        })
        const resp = game.loadBoard(content, { firstPlayer: 'white' })
        expect(resp.success).toBe(true)

        const status = game.getStatus()
        expect(status.isCheck).toBe(false)
        expect(status.isStalemate).toBe(false)
    })

    test.todo('undo restores check and mate status flags')
    test.todo('undo after castling with capture restores both pieces')
    test.todo('multiple undos return to initial position')

    test.todo('undo on empty history does not throw')
})
