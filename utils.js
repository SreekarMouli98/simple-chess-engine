areSameColor = (piece1, piece2) => {
    return (piece1 > 0 && piece2 > 0) || (piece1 < 0 && piece2 < 0)
}

isValidPosition = (pos) => {
    return !(pos[0] < 0 || pos[0] > 7 || pos[1] < 0 || pos[1] > 7)
}

getElement = (board, pos) => {
    if (!isValidPosition(pos)) {
        return
    }
    return board[pos[0]][pos[1]]
}

setElement = (board, pos, ele) => {
    if (!isValidPosition(pos)) {
        return
    }
    board[pos[0]][pos[1]] = ele   
}

getOffsetPos = (pos, offset) => {
    return [
        pos[0] - offset[1],
        pos[1] + offset[0]
    ]
}

getColorByPos = (board, piecePos) => {
    const piece = getElement(board, piecePos)
    if (piece > 0) return 1
    else if (piece < 0) return -1
    else return 0
}

getPositions = (board, piece) => {
    let positions = []
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === piece) {
                positions.push([i, j])
            }
        }
    }
    return positions
}

module.exports = {
    areSameColor,
    getElement,
    setElement,
    getOffsetPos,
    getColorByPos,
    getPositions,
}