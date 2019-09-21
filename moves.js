const _ = require('lodash')
const utils = require('./utils')

class Moves {
    constructor() {
        this.currentColor = 1
    }
    getKingMoves(board, pos) {
        const king       = utils.getElement(board, pos)
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
            let offsetPos = utils.getOffsetPos(pos, offset)
            let ele       = utils.getElement(board, offsetPos)
            let sameColor = utils.areSameColor(king, ele)
            if (ele !== undefined && !sameColor) {
                moves.push(offsetPos)
            }
        })
        return moves
    }
    getKnightMoves(board, pos) {
        const knight = utils.getElement(board, pos)
        const allOffsets = [
            [-2,  1], [-1,  2],
            [ 2,  1], [ 1,  2],
            [ 2, -1], [ 1, -2],
            [-2, -1], [-1, -2]
        ]
        let moves = []
        allOffsets.forEach(offset => {
            let offsetPos = utils.getOffsetPos(pos, offset)
            let ele       = utils.getElement(board, offsetPos)
            let sameColor = utils.areSameColor(knight, ele)
            if (ele !== undefined && !sameColor) {
                moves.push(offsetPos)
            }
        })
        return moves
    }
    getRookMoves(board, pos) {
        const rook = utils.getElement(board, pos)
        let moves  = []
        //horizontal
        // going left
        for (let j = pos[1] - 1; j >= 0; j--) {
            const offsetPos = [pos[0], j]
            const ele       = utils.getElement(board, offsetPos)
            const sameColor = utils.areSameColor(rook, ele)
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
            const ele       = utils.getElement(board, offsetPos)
            const sameColor = utils.areSameColor(rook, ele)
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
            const ele       = utils.getElement(board, offsetPos)
            const sameColor = utils.areSameColor(rook, ele)
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
            const ele       = utils.getElement(board, offsetPos)
            const sameColor = utils.areSameColor(rook, ele)
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
        const bishop = utils.getElement(board, pos)
        let moves    = []
        // top-left
        for (let i = pos[0] - 1, j = pos[1] - 1; i >= 0 && j >= 0; i--, j--) {
            const offsetPos = [i, j]
            const ele       = utils.getElement(board, offsetPos)
            const sameColor = utils.areSameColor(bishop, ele)
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
            const ele       = utils.getElement(board, offsetPos)
            const sameColor = utils.areSameColor(bishop, ele)
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
            const ele       = utils.getElement(board, offsetPos)
            const sameColor = utils.areSameColor(bishop, ele)
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
            const ele       = utils.getElement(board, offsetPos)
            const sameColor = utils.areSameColor(bishop, ele)
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
        const pawn = utils.getElement(board, pos)
        let moves  = []
        if (pawn < 0) {
            // bottom
            const bottomPos = utils.getOffsetPos(pos, [0, -1])
            const bottomEle = utils.getElement(board, bottomPos)
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
                const offsetPos = utils.getOffsetPos(pos, offset)
                const ele       = utils.getElement(board, offsetPos)
                const sameColor = utils.areSameColor(pawn, ele)
                if (ele !== undefined) {
                    if (ele !== 0 && !sameColor) {
                        moves.push(offsetPos)
                    }
                }
            })
            return moves
        }
        else if (pawn > 0) {
            // top
            const topPos = utils.getOffsetPos(pos, [0, 1])
            const topEle = utils.getElement(board, topPos)
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
                const offsetPos = utils.getOffsetPos(pos, offset)
                const ele       = utils.getElement(board, offsetPos)
                const sameColor = utils.areSameColor(pawn, ele)
                if (ele !== undefined) {
                    if (ele !== 0 && !sameColor) {
                        moves.push(offsetPos)
                    }
                }
            })
        }
        return moves
    }
    getAllPossibleMoves(board, pos, options) {
        const piece = utils.getElement(board, pos)
        let moves = []
        switch (piece) {
            case -6:
            case +6:
                moves = this.getKingMoves(board, pos)
                break;
            case -5:
            case +5:
                moves = this.getQueenMoves(board, pos)
                break;
            case -4:
            case +4:
                moves = this.getBishopMoves(board, pos)
                break;
            case -3:
            case +3:
                moves = this.getKnightMoves(board, pos)
                break;
            case -2:
            case +2:
                moves = this.getRookMoves(board, pos)
                break;
            case -1:
            case +1:
                moves = this.getPawnMoves(board, pos)
                break;
        }
        if (_.has(options, 'removeInvalidMoves') && options.removeInvalidMoves) {
            moves = _.filter(moves, possiblePos => {
                let canCauseSelfCheck = this.selfCheck(board, pos, possiblePos)
                return !canCauseSelfCheck
            })
        }
        return moves
    }
    selfCheck(board, from, to) {
        let color = utils.getColorByPos(board, from);
        let kingPos = Math.abs(utils.getElement(board, from)) === 6 ? _.cloneDeep(to) : utils.getPositions(board, color * 6)[0]
        let _toElement = _.cloneDeep(utils.getElement(board, to))
        let isWithinPossibleMoves = true
        this.movePiece(board, from, to)
        for (let i = 0; i < 8 && isWithinPossibleMoves; i++) {
            for (let j = 0; j < 8; j++) {
                if (color !== 0 && !utils.areSameColor(board[i][j], color)) {
                    const possibleMoves = this.getAllPossibleMoves(board, [i, j])
                    let isWithinPossibleMoves = utils.includesPosition(possibleMoves, kingPos)
                    if (isWithinPossibleMoves) break
                }
            }
        }
        this.movePiece(board, to, from)
        utils.setElement(board, to, _toElement)
        return isWithinPossibleMoves
    }
    isValidMove(board, from, to) {
        let validPiece = true
        let isWithinPossibleMoves = true

        validPiece = utils.areSameColor(this.currentColor, utils.getElement(board, from))
        if (validPiece) {
            const possibleMoves = this.getAllPossibleMoves(board, from, { removeInvalidMoves: true })
            isWithinPossibleMoves = utils.includesPosition(possibleMoves, to)
        }
        return validPiece && isWithinPossibleMoves
    }
    movePiece(board, from, to) {
        utils.setElement(board, to, utils.getElement(board, from))
        utils.setElement(board, from, 0)
    }
    makeMove(board, from, to) {
        let canMove = this.isValidMove(board, from, to)
        if (canMove) {
            this.movePiece(board, from, to)
            this.currentColor *= -1
        }
    }
}

module.exports = new Moves()