const moves = require('./moves')

class Map {
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
    getElement(pos) {
        if (pos[0] < 0 || pos[0] > 7 || pos[1] < 0 || pos[1] > 7) {
            return NaN
        }
        return this.board[pos[0]][pos[1]]
    }
    setElement(pos, val) {
        this.board[pos[0]][pos[1]] = val
    }
    getNumericPosition(pos) {
        return [
            7 - parseInt(pos[1]) + 1,
            'abcdefg'.indexOf(pos[0].toLowerCase())
        ]
    }
    getAlphaPosition(pos) {
        return 'ABCDEFG'[pos[1]]+ (8 - pos[0]).toString()
    }
    makeMove(from, to) {
        from = this.getNumericPosition(from)
        to   = this.getNumericPosition(to)
        if (moves.isValidMove(this.board, from , to)) {
            // this.setElement(to, this.getElement(from))
            this.setElement(from, '*')
        }
        console.table(this.board)
    }

}

module.exports = new Map()