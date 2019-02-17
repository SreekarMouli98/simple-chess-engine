const mapper = require('./map')

const startGame = () => {
    mapper.resetBoard()
}

const makeMove = (from, to) => {
    mapper.makeMove(from, to)
}

makeMove('A1', 'A3')
makeMove('B1', 'B3')
makeMove('C1', 'C3')
