const _ = require('lodash')
const mapper = require('./map')
const moves = require('./moves')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})


function getPieceName(piece) {
    let name, color
    switch(Math.abs(piece)) {
        case 0:
            name = ''
            break;
        case 1:
            name = 'PAWN'
            break;
        case 2:
            name = 'ROOK'
            break;
        case 3:
            name = 'KNIGHT'
            break;
        case 4:
            name = 'BISHOP'
            break;
        case 5:
            name = 'QUEEN'
            break;
        case 6:
            name = 'KING'
            break;
    }
    if (piece === 0) {
        color = ''
    }
    else {
        color = piece > 0 ? 'WHITE' : 'BLACK'
    }
    return `${color}:${name}`
}

class Game {
    constructor() {
        this.resetBoard()
    }
    resetBoard() {
        this.board = [
            [-2, -3, -4, -5, -6, -4, -3, -2],
            [-1, -1, -1, -1, -1, -1, -1, -1],
            [ 0,  0, +1,  0,  0,  0,  0,  0],
            [ 0,  0,  0,  0,  0,  0,  0,  0],
            [ 0,  0,  0,  0,  0,  0,  0,  0],
            [ 0,  0, -1,  0,  0,  0,  0,  0],
            [+1, +1, +1, +1, +1, +1, +1, +1],
            [+2, +3, +4, +5, +6, +4, +3, +2]
        ]
    }
    startGame() {
        this.displayBoard()
        readline.question('Enter Positions:', positions => {
            positions = positions.split(' ')
            this.makeMove(positions[0], positions[1])
            this.startGame()
        })
    }
    displayBoard() {
        let board = this.board.map(row => row.map(piece => getPieceName(piece)))
        console.table(board)
    }
    makeMove(_from, _to) {
        const from = mapper.getNumericPosition(_from)
        const to = mapper.getNumericPosition(_to)

        if (from.length !== 2 && to.length !== 2) {
            throw new Error('INCORRECT POSITIONS PROVIDED')
        }
        _.map([from[0], from[1], to[0], to[1]], (ele) => {
            if (isNaN(ele) || ele < 0 || ele > 7) {
                throw new Error('INCORRECT POSITIONS PROVIDED')
            }
        })

        moves.makeMove(this.board, from, to)
    }
}

const game = new Game()
game.startGame()