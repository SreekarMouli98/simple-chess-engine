const mapper = require('./map')

const startGame = () => {
    mapper.resetBoard()
}

const makeMove = (from, to) => {
    mapper.makeMove(from, to)
}

makeMove('B1', 'A3')

module.exports = {
    startGame: startGame,
    makeMove: makeMove
}