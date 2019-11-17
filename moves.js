const _ = require('lodash')
const utils = require('./utils')

class Moves {
    constructor() {
        this.currentColor = 1;
        this.isCheck = false;
        this.isCheckmate = false;
        this.isStalemate = false;
        this.castlingInfo = [/*{ pos: [], rookFrom: [], rookTo: [] }*/];
    }
    getKingMoves(board, pos) {
        const king = utils.getElement(board, pos)
        let allOffsets = [
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
        // Support for Castling
        if (!this.isCheck) {
            let kingPos = pos;
            if (this.currentColor > 0 && utils.checkIfSamePosition(kingPos, [7, 4])) {
                if (utils.getElement(board, [7, 0]) === 2) {
                    let queenSideCastling = true;
                    for (let j = 1; j < kingPos[1]; j++) {
                        if (utils.getElement(board, [7, j]) !== 0) {
                            queenSideCastling = false;
                            break;
                        }
                    }
                    for (let j = kingPos[1] - 2; j < kingPos[1] && queenSideCastling; j++) {
                        if (this.movePieceAndCheck(board, kingPos, [7, j], this.currentColor)) {
                            queenSideCastling = false;
                            break;
                        }
                    }
                    if (queenSideCastling) {
                        this.castlingInfo.push({
                            pos: utils.getOffsetPos(pos, [-2, 0]),
                            rookFrom: [7, 0],
                            rookTo: [7, 3]
                        });
                        allOffsets.push([-2, 0])
                    }
                }
                if (utils.getElement(board, [7, 7]) === 2) {
                    let kingSideCastling = true;
                    for (let j = 6; j > kingPos[1] + 1; j--) {
                        if (utils.getElement(board, [7, j]) !== 0) {
                            kingSideCastling = false;
                            break;
                        }
                    }
                    for (let j = kingPos[1] + 1; j <= kingPos[1] + 2 && kingSideCastling; j++) {
                        if (this.movePieceAndCheck(board, kingPos, [7, j], this.currentColor)) {
                            kingSideCastling = false;
                            break;
                        }
                    }
                    if (kingSideCastling) {
                        this.castlingInfo.push({
                            pos: utils.getOffsetPos(pos, [2, 0]),
                            rookFrom: [7, 7],
                            rookTo: [7, 5]
                        })
                        allOffsets.push([2, 0]);
                    }
                }
            }
            else if (this.currentColor < 0 && utils.checkIfSamePosition(kingPos, [0, 4])) {
                if (utils.getElement(board, [0, 0]) === -2) {
                    let queenSideCastling = true;
                    for (let j = 1; j < kingPos[1]; j++) {
                        if (utils.getElement(board, [0, j]) !== 0) {
                            queenSideCastling = false;
                            break;
                        }
                    }
                    for (let j = kingPos[1] - 2; j < kingPos[1] && queenSideCastling; j++) {
                        if (this.movePieceAndCheck(board, kingPos, [0, j], this.currentColor)) {
                            queenSideCastling = false;
                            break;
                        }
                    }
                    if (queenSideCastling) {
                        this.castlingInfo.push({
                            pos: utils.getOffsetPos(pos, [-2, 0]),
                            rookFrom: [0, 0],
                            rookTo: [0, 3]
                        });
                        allOffsets.push([-2, 0])
                    }
                }
                if (utils.getElement(board, [0, 7]) === -2) {
                    let kingSideCastling = true;
                    for (let j = kingPos[1] + 1; j < 7; j++) {
                        if (utils.getElement(board, [0, j]) !== 0) {
                            kingSideCastling = false;
                            break;
                        }
                    }
                    for (let j = kingPos[1] + 1; j <= kingPos[1] + 2 && kingSideCastling; j++) {
                        if (this.movePieceAndCheck(board, kingPos, [0, j], this.currentColor)) {
                            kingSideCastling = false;
                            break;
                        }
                    }
                    if (kingSideCastling) {
                        this.castlingInfo.push({
                            pos: utils.getOffsetPos(pos, [2, 0]),
                            rookFrom: [0, 7],
                            rookTo: [0, 5]
                        })
                        allOffsets.push([2, 0]);
                    }
                }
            }
        }
        let moves = []
        allOffsets.forEach(offset => {
            let offsetPos = utils.getOffsetPos(pos, offset)
            let ele = utils.getElement(board, offsetPos)
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
            [-2, 1], [-1, 2],
            [2, 1], [1, 2],
            [2, -1], [1, -2],
            [-2, -1], [-1, -2]
        ]
        let moves = []
        allOffsets.forEach(offset => {
            let offsetPos = utils.getOffsetPos(pos, offset)
            let ele = utils.getElement(board, offsetPos)
            let sameColor = utils.areSameColor(knight, ele)
            if (ele !== undefined && !sameColor) {
                moves.push(offsetPos)
            }
        })
        return moves
    }
    getRookMoves(board, pos) {
        const rook = utils.getElement(board, pos)
        let moves = []
        //horizontal
        // going left
        for (let j = pos[1] - 1; j >= 0; j--) {
            const offsetPos = [pos[0], j]
            const ele = utils.getElement(board, offsetPos)
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
            const ele = utils.getElement(board, offsetPos)
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
            const ele = utils.getElement(board, offsetPos)
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
            const ele = utils.getElement(board, offsetPos)
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
        let moves = []
        // top-left
        for (let i = pos[0] - 1, j = pos[1] - 1; i >= 0 && j >= 0; i-- , j--) {
            const offsetPos = [i, j]
            const ele = utils.getElement(board, offsetPos)
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
        for (let i = pos[0] - 1, j = pos[1] + 1; i >= 0 && j <= 7; i-- , j++) {
            const offsetPos = [i, j]
            const ele = utils.getElement(board, offsetPos)
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
        for (let i = pos[0] + 1, j = pos[1] + 1; i <= 7 && j <= 7; i++ , j++) {
            const offsetPos = [i, j]
            const ele = utils.getElement(board, offsetPos)
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
        for (let i = pos[0] + 1, j = pos[1] - 1; i <= 7 && j >= 0; i++ , j--) {
            const offsetPos = [i, j]
            const ele = utils.getElement(board, offsetPos)
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
        let moves = []
        if (pawn < 0) {
            let offsets = [
                // bottom
                [0, -1]
            ];
            if (pos[0] == 1) {
                offsets.push([0, -2]);
            }
            offsets.forEach(offset => {
                const bottomPos = utils.getOffsetPos(pos, offset);
                const bottomEle = utils.getElement(board, bottomPos);
                if (bottomEle !== undefined) {
                    if (bottomEle === 0) {
                        moves.push(bottomPos);
                    }
                }
            })
            const possibleOffsets = [
                // bottom-left
                [-1, -1],
                // bottom-right
                [1, -1]
            ]
            possibleOffsets.forEach(offset => {
                const offsetPos = utils.getOffsetPos(pos, offset)
                const ele = utils.getElement(board, offsetPos)
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
            let offsets = [
                // top
                [0, 1]
            ];
            if (pos[0] == 6) {
                offsets.push([0, 2]);
            }
            offsets.forEach(offset => {
                const topPos = utils.getOffsetPos(pos, offset);
                const topEle = utils.getElement(board, topPos);
                if (topEle !== undefined) {
                    if (topEle === 0) {
                        moves.push(topPos);
                    }
                }
            })
            const possibleOffsets = [
                // top-left
                [-1, 1],
                // top-right
                [1, 1]
            ]
            possibleOffsets.forEach(offset => {
                const offsetPos = utils.getOffsetPos(pos, offset)
                const ele = utils.getElement(board, offsetPos)
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
    getPossibleMoves(board, pos, options) {
        const piece = utils.getElement(board, pos)
        let moves = []
        if (_.has(options, 'validPlayerCheck') && options.validPlayerCheck) {
            if (!utils.areSameColor(this.currentColor, piece)) {
                return moves;
            }
        }
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
            /**
             * Removes the moves which shouldn't be made when under check. These are the moves that won't remove the check.
             * Removes the moves that shouldn't be made as they would put the current player's king under check.
             */
            moves = _.filter(moves, possiblePos => {
                let isCheck = this.movePieceAndCheck(board, pos, possiblePos, utils.getColorByPos(board, pos))
                return !isCheck
            })
        }
        return moves
    }
    isUnderCheck(board, color) {
        let kingPos = utils.getPositions(board, color * 6)[0]
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let ele = utils.getElement(board, [i, j])
                if (ele !== undefined && !utils.areSameColor(color, ele)) {
                    let possibleMoves = this.getPossibleMoves(board, [i, j])
                    if (utils.includesPosition(possibleMoves, kingPos)) {
                        return true
                    }
                }
            }
        }
        return false
    }
    getAllPossibleMoves(board, color) {
        const kingPos = utils.getPositions(board, color * 6)[0];
        let allPossibleMoves = {};
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (utils.areSameColor(color, utils.getElement(board, [i, j]))) {
                    let possibleMoves = this.getPossibleMoves(board, [i, j], { removeInvalidMoves: true });
                    allPossibleMoves[JSON.stringify([i, j])] = possibleMoves;
                }
            }
        }
        return allPossibleMoves;
    }
    getBoardStatus(board) {
        let isCheck = this.isUnderCheck(board, this.currentColor);
        let allPossibleMoves = this.getAllPossibleMoves(board, this.currentColor);
        let allMoves = _.flatten(_.values(allPossibleMoves));
        let isCheckmate = isCheck && allMoves.length === 0;
        let isStalemate = !isCheck && allMoves.length === 0;
        return {
            nextPlayer: utils.getColorName(this.currentColor),
            isCheck,
            isCheckmate,
            isStalemate
        };
    }
    movePieceAndCheck(board, from, to, color) {
        let isUnderCheck = true
        let _toElement = _.cloneDeep(utils.getElement(board, to))
        this.movePiece(board, from, to)
        isUnderCheck = this.isUnderCheck(board, color)
        this.movePiece(board, to, from)
        utils.setElement(board, to, _toElement)
        return isUnderCheck
    }
    isValidMove(board, from, to) {
        let validPiece = true
        let isWithinPossibleMoves = true

        validPiece = utils.areSameColor(this.currentColor, utils.getElement(board, from))
        if (validPiece) {
            const possibleMoves = this.getPossibleMoves(board, from, { removeInvalidMoves: true })
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
            let castlingInfo = _.find(this.castlingInfo, ['pos', to]);
            if (castlingInfo) {
                let { rookFrom, rookTo } = castlingInfo;
                this.movePiece(board, rookFrom, rookTo);
            }
            this.castlingInfo = [];
            this.currentColor *= -1
            return true;
        }
        return false;
    }
}

module.exports = new Moves()