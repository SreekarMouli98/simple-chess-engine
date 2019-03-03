const mapper = require('./map')
const moves = require('./moves')

class Game {
    constructor() {
        this.resetBoard()
    }
    resetBoard() {
        this.board = [
            [+2, +3, +4, +5, +6, +4, +3, +2],
            [+1, +1, +1, +1, +1, +1, +1, +1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [-1, -1, -1, -1, -1, -1, -1, -1],
            [-2, -3, -4, -5, -6, -4, -3, -2]
        ]
    }
    startGame() {

    }
    displayBoard() {
        console.table(this.board)
    }
    makeMove(_from, _to) {
        const from  = mapper.getNumericPosition(_from)
        const to = mapper.getNumericPosition(_to)
        moves.makeMove(this.board, from, to)
        this.displayBoard()
    }
}

const game = new Game()

game.makeMove('A2', 'A3')