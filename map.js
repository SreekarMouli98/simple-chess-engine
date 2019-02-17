class Map {
    constructor() {
        this.board = [
            [+2, +3, +4, +5, +6, +4, +3, +2],
            [+1, +1, +1, +1, +1, +1, +1, +1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [-1, -1, -1, -1, -1, -1, -1, -1],
            [-2, -3, -4, -5, -6, -4, -3, -2]
        ]
    }
    resetBoard() {
        this.board = [
            [+2, +3, +4, +5, +6, +4, +3, +2],
            [+1, +1, +1, +1, +1, +1, +1, +1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [-1, -1, -1, -1, -1, -1, -1, -1],
            [-2, -3, -4, -5, -6, -4, -3, -2]
        ]
    }
    getElement(pos) {
        return this.board[pos[1]][pos[0]]
    }
    setElement(pos, val) {
        this.board[pos[1]][pos[0]] = val
    }
    getNumericPosition(pos) {
        return [
            'abcdefg'.indexOf(pos[0].toLowerCase()),
            parseInt(pos[1]) - 1
        ]
    }
    getAlphaPosition(pos) {
        return 'ABCDEFG'[pos[0]] + (pos[1] + 1).toString()
    }
    makeMove(from, to) {
        from = this.getNumericPosition(from)
        to   = this.getNumericPosition(to)
        this.setElement(to, this.getElement(from))
        this.setElement(from, 0)
        console.table(this.board)
    }

}

module.exports = new Map();