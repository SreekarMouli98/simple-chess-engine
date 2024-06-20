const _ = require('lodash')
const mapper = require('./map')
const moves = require('./moves')
const utils = require('./utils')

class Game {
    constructor() {
        this.resetGame()
    }
    resetGame(opts) {
        if (_.has(opts, 'custom') && opts.custom && this.customBoardMeta.loaded) {
            this.board = _.cloneDeep(this.customBoard);
            moves.currentColor = utils.getColorValByName(this.customBoardMeta.firstPlayer);
        }
        else {
            this.board = [
                [-2, -3, -4, -5, -6, -4, -3, -2],
                [-1, -1, -1, -1, -1, -1, -1, -1],
                [ 0,  0,  0,  0,  0,  0,  0,  0],
                [ 0,  0,  0,  0,  0,  0,  0,  0],
                [ 0,  0,  0,  0,  0,  0,  0,  0],
                [ 0,  0,  0,  0,  0,  0,  0,  0],
                [+1, +1, +1, +1, +1, +1, +1, +1],
                [+2, +3, +4, +5, +6, +4, +3, +2]
            ];
            this.customBoard = [];
            this.customBoardMeta = {
                loaded: false,
                firstPlayer: ''
            };
        }
        moves.reset();
    }
    makeMove(_from, _to) {
        const from = mapper.getNumericPosition(_from)
        const to = mapper.getNumericPosition(_to)
        let moveStatus = {
            success: false,
            status: this.getStatus(this.board)
        };

        if (from.length !== 2 && to.length !== 2) {
            return moveStatus;
        }
        _.map([from[0], from[1], to[0], to[1]], (ele) => {
            if (isNaN(ele) || ele < 0 || ele > 7) {
                return moveStatus;
            }
        })

        moveStatus.success = moves.makeMove(this.board, from, to);

        if (moveStatus.success) {
            moveStatus.status = this.getStatus(this.board);
        }

        return moveStatus;
    }
    getBoard(options) {
        let format = _.has(options, 'format') ? options.format.toUpperCase() : 'JSON';
        let resp;
        switch (format) {
            case 'JSON':
                resp = {}
                for (let i = 0; i < this.board.length; i++) {
                    for (let j = 0; j < this.board[i].length; j++) {
                        let alphaPos = mapper.getAlphaPosition([i, j]);
                        resp[alphaPos] = {
                            color: utils.getColorName(this.board[i][j]),
                            piece: utils.getPieceName(this.board[i][j])
                        };
                    }
                }
                break;
            /*
            case 'ARRAY':
                let board = [];
                for (let i = 0; i < this.board.length; i++) {
                    for (let j = 0; j < this.board.length; j++) {
                        board.push({
                            position: mapper.getAlphaPosition([i, j]),
                            color: utils.getColorName(this.board[i][j]),
                            piece: utils.getPieceName(this.board[i][j])
                        })
                    }
                }
                resp = board;
                break;
            */
            default:
                resp = 'unsupported format provided';
                break;
        }
        return resp;
    }
    getPossibleMoves(_pos) {
        const pos = mapper.getNumericPosition(_pos);
        let possibleMoves = moves.getPossibleMoves(this.board, pos, { removeInvalidMoves: true, validPlayerCheck: true});
        possibleMoves = _.map(possibleMoves, move => mapper.getAlphaPosition(move));
        return possibleMoves;
    }
    getStatus() {
        return {
            nextPlayer: utils.getColorName(moves.currentColor),
            isCheck: moves.isCheck,
            isCheckmate: moves.isCheckmate,
            isStalemate: moves.isStalemate
        };
    }
    undo() {
        moves.undo(this.board);
        return this.getStatus();
    }
    validateCustomBoard(board, options) {
        let failures = [];
        let firstPlayer = utils.getColorValByName(_.get(options, 'firstPlayer', 'white'));
        let blackKing = utils.getPositions(board, -6);
        if (blackKing.length <= 0) {
            failures.push(`Black King position not specified`);
            blackKing = blackKing[0];
        }
        else {
            let blackInCheck = moves.isUnderCheck(board, -1);
            if (blackInCheck && firstPlayer >= 0) {
                failures.push(`Black King is under check`);
            }
        }
        let whiteKing = utils.getPositions(board, +6);
        if (whiteKing.length <= 0) {
            failures.push(`White King position not specified`);
            whiteKing = whiteKing[0];
        }
        else {
            let whiteInCheck = moves.isUnderCheck(board, 1);
            if (whiteInCheck && firstPlayer <= 0) {
                failures.push(`White King is under check`);
            }
        }
        return failures;
    }
    loadBoard(content, options) {
        let format = _.get(options, 'format', 'JSON').toUpperCase();
        let firstPlayer = _.get(options, 'firstPlayer', 'white').toLowerCase();
        let resp = { success: true };
        try {
            content = JSON.parse(content);
        }
        catch (err) {
            resp.success = false;
            resp.reasons = ['Invalid Data'];
            return resp;
        }
        let customBoard = [
            [ 0,  0,  0,  0,  0,  0,  0,  0],
            [ 0,  0,  0,  0,  0,  0,  0,  0],
            [ 0,  0,  0,  0,  0,  0,  0,  0],
            [ 0,  0,  0,  0,  0,  0,  0,  0],
            [ 0,  0,  0,  0,  0,  0,  0,  0],
            [ 0,  0,  0,  0,  0,  0,  0,  0],
            [ 0,  0,  0,  0,  0,  0,  0,  0],
            [ 0,  0,  0,  0,  0,  0,  0,  0]
        ];
        let failedReasons = [];
        if (firstPlayer !== 'white' && firstPlayer !== 'black') {
                failedReasons.push('\'firstPlayer\' can either be \'black\' or \'white\'');
        }
        let validPieceCount = 0;
        switch (format) {
            case 'JSON':
                _.map(_.keys(content), _pos => {
                    const pos = mapper.getNumericPosition(_pos);
                    let invalidPos = false;
                    _.map(pos, ele => (isNaN(ele) || ele < 0 || ele > 7) ? invalidPos = true : null);
                    if (!invalidPos) {
                        let pieceInfo = content[_pos];
                        if (pieceInfo) {
                            let color = 0, pieceVal = 0;
                            if (!_.has(pieceInfo, 'color')) {
                                failedReasons.push(`Missing field 'color' at '${_pos}'`);
                            }
                            else {
                                color = utils.getColorValByName(pieceInfo.color);
                                if (color === 0) {
                                    failedReasons.push(`Invalid color '${pieceInfo.color}' provided at '${_pos}'`);
                                }
                            }
                            if (!_.has(pieceInfo, 'piece')) {
                                failedReasons.push(`Missing field 'piece' at '${_pos}'`);
                            }
                            else {
                                pieceVal = utils.getPieceValByName(pieceInfo.piece);
                                if (pieceVal === 0) {
                                    failedReasons.push(`Invalid piece '${pieceInfo.piece}' provided at '${_pos}'`);
                                }
                            }
                            if (color !== 0 && pieceVal !== 0) {
                                customBoard[pos[0]][pos[1]] = color * pieceVal;
                                validPieceCount += 1;
                            }
                        }
                    }
                    else {
                        failedReasons.push(`Invalid Position '${_pos}'`);
                    }
                });
                break;
            default:
                resp.success = false;
                resp.reasons = ['Unsupported Format Provided'];
                return resp;
        }
        if (validPieceCount < 3) {
            failedReasons.push(`Minimum 3 pieces required`);
        }
        failedReasons = failedReasons.concat(this.validateCustomBoard(customBoard, options));
        if (failedReasons.length > 0) {
            resp.success = false;
            resp.reasons = failedReasons;
        }
        if (resp.success) { 
            this.customBoardMeta.loaded = true;
            this.customBoardMeta.firstPlayer = firstPlayer;
            this.customBoard = customBoard;
            this.resetGame({ custom: true });
            moves.setGameStatus(this.board);
            resp.status = this.getStatus();
        }
        return resp;
    }
}

module.exports = Game;