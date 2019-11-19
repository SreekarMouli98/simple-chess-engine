const _ = require('lodash')
const mapper = require('./map')
const moves = require('./moves')
const utils = require('./utils')
const Table = require('cli-table');

class Game {
    constructor() {
        this.resetGame()
    }
    resetGame() {
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
        moves.reset();
    }
    displayBoard() {
        const table = new Table({ head: ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] });
        _.map(this.board, (row, index) => {
            row = _.map(row, piece => {
                let color = utils.getColorName(piece).toUpperCase();
                let pieceName = utils.getPieceName(piece).toUpperCase();
                if (color === 'NONE' || pieceName === 'NONE') {
                    return '';
                }
                else {
                    return `${color} ${pieceName}`
                }
            });
            table.push({ [8 - index]: row });
        });
        console.log(table.toString());
    }
    makeMove(_from, _to) {
        const from = mapper.getNumericPosition(_from)
        const to = mapper.getNumericPosition(_to)
        let moveStatus = {
            success: false,
            status: moves.getBoardStatus(this.board)
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
            moveStatus.status = moves.getBoardStatus(this.board);
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
        return moves.getBoardStatus(this.board);
    }
}

module.exports = Game;