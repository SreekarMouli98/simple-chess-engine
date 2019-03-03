const _ = require('lodash')

class Moves {
    constructor() {

    }
    areSameColor(piece1, piece2) {
        return (piece1 > 0 && piece2 > 0) || (piece1 < 0 && piece2 < 0)
    }
    getElement(board, pos) {
        if (pos[0] < 0 || pos[0] > 7 || pos[1] < 0 || pos[1] > 7) {
            return
        }
        return board[pos[0]][pos[1]]
    }
    getOffsetPos(pos, offset) {
        return [
            pos[0] - offset[1],
            pos[1] + offset[0]
        ]
    }
    getKingMoves(board, pos) {
        const king       = this.getElement(board, pos) * -1
        const allOffsets = [
            //top
            [0, 1],
            //top-right
            [1, 1],
            //right
            [1, 0],
            //bottom-right
            [1, -1],
            //bottom
            [0, -1],
            //bottom-left
            [-1, -1],
            //left
            [-1, 0],
            //top-left
            [-1, 1],
        ]
        let moves = []
        allOffsets.forEach(offset => {
            let offsetPos = this.getOffsetPos(pos, offset)
            let ele       = this.getElement(board, offsetPos)
            let sameColor = this.areSameColor(king, ele)
            if (ele !== undefined && !sameColor) {
                moves.push(offsetPos)
            }
        })
        return moves
    }
    getKnightMoves(board, pos) {
        const knight = this.getElement(board, pos)
        const allOffsets = [
            [-2,  1], [-1,  2],
            [ 2,  1], [ 1,  2],
            [ 2, -1], [ 1, -2],
            [-2, -1], [-1, -2]
        ]
        let moves = []
        allOffsets.forEach(offset => {
            let offsetPos = this.getOffsetPos(pos, offset)
            let ele       = this.getElement(board, offsetPos)
            let sameColor = this.areSameColor(knight, ele)
            if (ele !== undefined && !sameColor) {
                moves.push(offsetPos)
            }
        })
        return moves
    }
    getRookMoves(board, pos) {
        const rook = this.getElement(board, pos)
        let moves  = []
        //horizontal
        // going left
        for (let j = pos[1] - 1; j >= 0; j--) {
            const offsetPos = [pos[0], j]
            const ele       = this.getElement(board, offsetPos)
            const sameColor = this.areSameColor(rook, ele)
            if (ele !== undefined) {
                if (ele === 0) {
                    moves.push(offsetPos)
                }
                else if (!sameColor) {
                    moves.push(offsetPos)
                    break
                }
                else {
                    break
                }
            }
        }
        // going right
        for (let j = pos[1] + 1; j <= 7; j++) {
            const offsetPos = [pos[0], j]
            const ele       = this.getElement(board, offsetPos)
            const sameColor = this.areSameColor(rook, ele)
            if (ele !== undefined) {
                if (ele === 0) {
                    moves.push(offsetPos)
                }
                else if (!sameColor) {
                    moves.push(offsetPos)
                    break
                }
                else {
                    break
                }
            }
        }

        //vertical
        // going top
        for (let i = pos[0] - 1; i >= 0; i--) {
            const offsetPos = [i, pos[1]]
            const ele       = this.getElement(board, offsetPos)
            const sameColor = this.areSameColor(rook, ele)
            if (ele !== undefined) {
                if (ele === 0) {
                    moves.push(offsetPos)
                }
                else if (!sameColor) {
                    moves.push(offsetPos)
                    break
                }
                else {
                    break
                }
            }
        }
        // going bottom
        for (let i = pos[0] + 1; i <= 7; i++) {
            const offsetPos = [i, pos[1]]
            const ele       = this.getElement(board, offsetPos)
            const sameColor = this.areSameColor(rook, ele)
            if (ele !== undefined) {
                if (ele === 0) {
                    moves.push(offsetPos)
                }
                else if (!sameColor) {
                    moves.push(offsetPos)
                    break
                }
                else {
                    break
                }
            }
        }
        return moves
    }
    getBishopMoves(board, pos) {
        const bishop = this.getElement(board, pos)
        let moves    = []
        // top-left
        for (let i = pos[0] - 1, j = pos[1] - 1; i >= 0 && j >= 0; i--, j--) {
            const offsetPos = [i, j]
            const ele       = this.getElement(board, offsetPos)
            const sameColor = this.areSameColor(bishop, ele)
            if (ele !== undefined) {
                if (ele === 0) {
                    moves.push(offsetPos)
                }
                else if (!sameColor) {
                    moves.push(offsetPos)
                    break
                }
                else {
                    break
                }
            }
        }
        // top-right
        for (let i = pos[0] - 1, j = pos[1] + 1; i >= 0 && j <= 7; i--, j++) {
            const offsetPos = [i, j]
            const ele       = this.getElement(board, offsetPos)
            const sameColor = this.areSameColor(bishop, ele)
            if (ele !== undefined) {
                if (ele === 0) {
                    moves.push(offsetPos)
                }
                else if (!sameColor) {
                    moves.push(offsetPos)
                    break
                }
                else {
                    break
                }
            }
        }
        // bottom-right
        for (let i = pos[0] + 1, j = pos[1] + 1; i <= 7 && j <= 7; i++, j++) {
            const offsetPos = [i, j]
            const ele       = this.getElement(board, offsetPos)
            const sameColor = this.areSameColor(bishop, ele)
            if (ele !== undefined) {
                if (ele === 0) {
                    moves.push(offsetPos)
                }
                else if (!sameColor) {
                    moves.push(offsetPos)
                    break
                }
                else {
                    break
                }
            }
        }
        // bottom-left
        for (let i = pos[0] + 1, j = pos[1] - 1; i <= 7 && j >= 0; i++, j--) {
            const offsetPos = [i, j]
            const ele       = this.getElement(board, offsetPos)
            const sameColor = this.areSameColor(bishop, ele)
            if (ele !== undefined) {
                if (ele === 0) {
                    moves.push(offsetPos)
                }
                else if (!sameColor) {
                    moves.push(offsetPos)
                    break
                }
                else {
                    break
                }
            }
        }
        return moves
    }
    getQueenMoves(board, pos) {
        let moves = []
        moves.push(...this.getRookMoves(board, pos))
        moves.push(...this.getBishopMoves(board, pos))
        return moves
    }
    getPawnMoves(board, pos) {
        const pawn = this.getElement(board, pos)
        let moves  = []
        if (pawn > 0) {
            // bottom
            const bottomPos = this.getOffsetPos(pos, [0, -1])
            const bottomEle = this.getElement(board, bottomPos)
            if (bottomEle !== undefined) {
                if (bottomEle === 0) {
                    moves.push(bottomPos)
                }
            }
            const possibleOffsets = [
                // bottom-left
                [-1, -1],
                // bottom-right
                [1, -1]
            ]
            possibleOffsets.forEach(offset => {
                const offsetPos = this.getOffsetPos(pos, offset)
                const ele       = this.getElement(board, offsetPos)
                const sameColor = this.areSameColor(pos, offsetPos)
                if (ele !== undefined) {
                    if (ele !== 0 && !sameColor) {
                        moves.push(offsetPos)
                    }
                }
            })
            return moves
        }
        else if (pawn < 0) {
            // top
            const topPos = this.getOffsetPos(pos, [0, 1])
            const topEle = this.getElement(board, topPos)
            if (topEle !== undefined) {
                if (topEle === 0) {
                    moves.push(topPos)
                }
            }
            const possibleOffsets = [
                // top-left
                [-1, 1],
                // top-right
                [1, 1]
            ]
            possibleOffsets.forEach(offset => {
                const offsetPos = this.getOffsetPos(pos, offset)
                const ele       = this.getElement(board, offsetPos)
                const sameColor = this.areSameColor(pos, offsetPos)
                if (ele !== undefined) {
                    if (ele !== 0 && !sameColor) {
                        moves.push(offsetPos)
                    }
                }
            })
            return moves
        }
    }
    getAllPossibleMoves(board, pos) {
        const piece = this.getElement(board, pos)
        switch (piece) {
            case -6:
            case +6:
                return this.getKingMoves(board, pos)
            case -5:
            case +5:
                return this.getQueenMoves(board, pos)
            case -4:
            case +4:
                return this.getBishopMoves(board, pos)
            case -3:
            case +3:
                return this.getKnightMoves(board, pos)
            case -2:
            case +2:
                return this.getRookMoves(board, pos)
            case -1:
            case +1:
                return this.getPawnMoves(board, pos)
            case 0:
                return []
        }
    }
    isValidMove(board, from, to) {
        const possibleMoves = this.getAllPossibleMoves(board, from)
        
        const checkIfSamePosition = (pos1, pos2) => {
            return pos1[0] === pos2[0] && pos1[1] === pos2[1]
        }

        let isWithinPossibleMoves = _.find(possibleMoves, (move) => checkIfSamePosition(move, to))

        return isWithinPossibleMoves
    }
}

module.exports = new Moves()