const mapper = require('./map')

const startGame = () => {
    mapper.resetBoard()
}

const makeMove = (from, to) => {
    mapper.makeMove(from, to)
}