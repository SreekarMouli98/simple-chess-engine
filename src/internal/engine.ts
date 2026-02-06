/**
 * Core logic for chess engine
 */

import type {
  InternalState,
  BitBoard,
  EncodedMove,
  Square,
} from '@src/internal/types';
import {
  WHITE_PAWNS,
  WHITE_ROOKS,
  WHITE_KNIGHTS,
  WHITE_BISHOPS,
  WHITE_QUEEN,
  WHITE_KING,
  BLACK_PAWNS,
  BLACK_ROOKS,
  BLACK_KNIGHTS,
  BLACK_BISHOPS,
  BLACK_QUEEN,
  BLACK_KING,
} from '@src/internal/position';
import {
  getPawnMoves,
  getRookMoves,
  getKnightMoves,
  getBishopMoves,
  getQueenMoves,
  getKingMoves,
} from '@src/internal/movegen';
import {
  bitBoardsToEncodedMove,
  encodedMoveToBitBoards,
} from '@src/internal/codec';
import { iterBits } from '@src/internal/util';
import { FenString } from '@src/types';

export class Engine {
  state: InternalState;

  constructor() {
    this.state = this.initialState;
  }

  get initialState(): InternalState {
    return {
      turn: 'white',
      whitePawns: WHITE_PAWNS,
      whiteRooks: WHITE_ROOKS,
      whiteKnights: WHITE_KNIGHTS,
      whiteBishops: WHITE_BISHOPS,
      whiteQueens: WHITE_QUEEN,
      whiteKing: WHITE_KING,
      blackPawns: BLACK_PAWNS,
      blackRooks: BLACK_ROOKS,
      blackKnights: BLACK_KNIGHTS,
      blackBishops: BLACK_BISHOPS,
      blackQueens: BLACK_QUEEN,
      blackKing: BLACK_KING,
      castlingRights: 0b1111,
      enPassantTarget: null,
      halfMoveClock: 0,
      fullMoveNumber: 1,
    };
  }

  get allWhitePieces(): BitBoard {
    return (
      this.state.whitePawns |
      this.state.whiteRooks |
      this.state.whiteKnights |
      this.state.whiteBishops |
      this.state.whiteQueens |
      this.state.whiteKing
    );
  }

  get allBlackPieces(): BitBoard {
    return (
      this.state.blackPawns |
      this.state.blackRooks |
      this.state.blackKnights |
      this.state.blackBishops |
      this.state.blackQueens |
      this.state.blackKing
    );
  }

  getLegalMoves(from?: Square): EncodedMove[] {
    let pawnBb: BitBoard =
      this.state.turn === 'white'
        ? this.state.whitePawns
        : this.state.blackPawns;
    let rookBb: BitBoard =
      this.state.turn === 'white'
        ? this.state.whiteRooks
        : this.state.blackRooks;
    let knightBb: BitBoard =
      this.state.turn === 'white'
        ? this.state.whiteKnights
        : this.state.blackKnights;
    let bishopBb: BitBoard =
      this.state.turn === 'white'
        ? this.state.whiteBishops
        : this.state.blackBishops;
    let queenBb: BitBoard =
      this.state.turn === 'white'
        ? this.state.whiteQueens
        : this.state.blackQueens;
    let kingBb: BitBoard =
      this.state.turn === 'white' ? this.state.whiteKing : this.state.blackKing;
    let friendlyBb: BitBoard =
      this.state.turn === 'white' ? this.allWhitePieces : this.allBlackPieces;
    let enemyBb: BitBoard =
      this.state.turn === 'white' ? this.allBlackPieces : this.allWhitePieces;
    let moves: EncodedMove[] = [];
    for (const from of iterBits(pawnBb)) {
      const to = getPawnMoves(from, this.state.turn, friendlyBb, enemyBb);
      moves.push(...bitBoardsToEncodedMove(from, to));
    }
    for (const from of iterBits(rookBb)) {
      const to = getRookMoves(from, friendlyBb, enemyBb);
      moves.push(...bitBoardsToEncodedMove(from, to));
    }
    for (const from of iterBits(knightBb)) {
      const to = getKnightMoves(from, friendlyBb);
      moves.push(...bitBoardsToEncodedMove(from, to));
    }
    for (const from of iterBits(bishopBb)) {
      const to = getBishopMoves(from, friendlyBb, enemyBb);
      moves.push(...bitBoardsToEncodedMove(from, to));
    }
    for (const from of iterBits(queenBb)) {
      const to = getQueenMoves(from, friendlyBb, enemyBb);
      moves.push(...bitBoardsToEncodedMove(from, to));
    }
    for (const from of iterBits(kingBb)) {
      const to = getKingMoves(from, friendlyBb);
      moves.push(...bitBoardsToEncodedMove(from, to));
    }
    if (from !== undefined) {
      moves = moves.filter((move) => move >>> 6 === from);
    }
    return moves;
  }

  makeMove(move: EncodedMove): boolean {
    const [from, to] = encodedMoveToBitBoards(move);
    const friendlyBb =
      this.state.turn === 'white' ? this.allWhitePieces : this.allBlackPieces;
    if (from === 0n) {
      throw new Error('No piece selected');
    }
    if ((from & friendlyBb) === 0n) {
      throw new Error('Invalid piece selected');
    }
    if ((to & friendlyBb) !== 0n) {
      throw new Error('Invalid move');
    }
    if (to === 0n) {
      throw new Error('Invalid move');
    }
    const legalMoves = this.getLegalMoves(/* from */);
    if (!legalMoves.includes(move)) {
      throw new Error('Invalid move');
    }
    let pieceCaptured: boolean = false;
    if (this.state.turn === 'white') {
      pieceCaptured = (this.allBlackPieces & to) !== 0n;
      if ((this.state.whitePawns & from) !== 0n) {
        this.state.whitePawns = (this.state.whitePawns & ~from) | to;
      } else if ((this.state.whiteRooks & from) !== 0n) {
        this.state.whiteRooks = (this.state.whiteRooks & ~from) | to;
      } else if ((this.state.whiteKnights & from) !== 0n) {
        this.state.whiteKnights = (this.state.whiteKnights & ~from) | to;
      } else if ((this.state.whiteBishops & from) !== 0n) {
        this.state.whiteBishops = (this.state.whiteBishops & ~from) | to;
      } else if ((this.state.whiteQueens & from) !== 0n) {
        this.state.whiteQueens = (this.state.whiteQueens & ~from) | to;
      } else if ((this.state.whiteKing & from) !== 0n) {
        this.state.whiteKing = (this.state.whiteKing & ~from) | to;
      } else {
        throw new Error('Invalid piece selected');
      }
      if (pieceCaptured) {
        if ((this.state.blackPawns & to) !== 0n) {
          this.state.blackPawns = this.state.blackPawns & ~to;
        } else if ((this.state.blackRooks & to) !== 0n) {
          this.state.blackRooks = this.state.blackRooks & ~to;
        } else if ((this.state.blackKnights & to) !== 0n) {
          this.state.blackKnights = this.state.blackKnights & ~to;
        } else if ((this.state.blackBishops & to) !== 0n) {
          this.state.blackBishops = this.state.blackBishops & ~to;
        } else if ((this.state.blackQueens & to) !== 0n) {
          this.state.blackQueens = this.state.blackQueens & ~to;
        } else if ((this.state.blackKing & to) !== 0n) {
          this.state.blackKing = this.state.blackKing & ~to;
        } else {
          throw new Error('Invalid piece captured');
        }
      }
    } else {
      pieceCaptured = (this.allWhitePieces & to) !== 0n;
      if ((this.state.blackPawns & from) !== 0n) {
        this.state.blackPawns = (this.state.blackPawns & ~from) | to;
      } else if ((this.state.blackRooks & from) !== 0n) {
        this.state.blackRooks = (this.state.blackRooks & ~from) | to;
      } else if ((this.state.blackKnights & from) !== 0n) {
        this.state.blackKnights = (this.state.blackKnights & ~from) | to;
      } else if ((this.state.blackBishops & from) !== 0n) {
        this.state.blackBishops = (this.state.blackBishops & ~from) | to;
      } else if ((this.state.blackQueens & from) !== 0n) {
        this.state.blackQueens = (this.state.blackQueens & ~from) | to;
      } else if ((this.state.blackKing & from) !== 0n) {
        this.state.blackKing = (this.state.blackKing & ~from) | to;
      } else {
        throw new Error('Invalid piece selected');
      }
      if (pieceCaptured) {
        if ((this.state.whitePawns & to) !== 0n) {
          this.state.whitePawns = this.state.whitePawns & ~to;
        } else if ((this.state.whiteRooks & to) !== 0n) {
          this.state.whiteRooks = this.state.whiteRooks & ~to;
        } else if ((this.state.whiteKnights & to) !== 0n) {
          this.state.whiteKnights = this.state.whiteKnights & ~to;
        } else if ((this.state.whiteBishops & to) !== 0n) {
          this.state.whiteBishops = this.state.whiteBishops & ~to;
        } else if ((this.state.whiteQueens & to) !== 0n) {
          this.state.whiteQueens = this.state.whiteQueens & ~to;
        } else if ((this.state.whiteKing & to) !== 0n) {
          this.state.whiteKing = this.state.whiteKing & ~to;
        } else {
          throw new Error('Invalid piece captured');
        }
      }
    }
    this.state.turn = this.state.turn === 'white' ? 'black' : 'white';
    return true;
  }

  getFen(): FenString {
    let fen = '';
    for (let rank = 7; rank >= 0; rank--) {
      let emptyCount = 0;
      for (let file = 7; file >= 0; file--) {
        let currPiece = '';
        let mask = 1n << BigInt(rank * 8 + file);
        if ((this.state.whitePawns & mask) !== 0n) {
          currPiece = 'P';
        } else if ((this.state.whiteRooks & mask) !== 0n) {
          currPiece = 'R';
        } else if ((this.state.whiteKnights & mask) !== 0n) {
          currPiece = 'N';
        } else if ((this.state.whiteBishops & mask) !== 0n) {
          currPiece = 'B';
        } else if ((this.state.whiteQueens & mask) !== 0n) {
          currPiece = 'Q';
        } else if ((this.state.whiteKing & mask) !== 0n) {
          currPiece = 'K';
        } else if ((this.state.blackPawns & mask) !== 0n) {
          currPiece = 'p';
        } else if ((this.state.blackRooks & mask) !== 0n) {
          currPiece = 'r';
        } else if ((this.state.blackKnights & mask) !== 0n) {
          currPiece = 'n';
        } else if ((this.state.blackBishops & mask) !== 0n) {
          currPiece = 'b';
        } else if ((this.state.blackQueens & mask) !== 0n) {
          currPiece = 'q';
        } else if ((this.state.blackKing & mask) !== 0n) {
          currPiece = 'k';
        }
        if (currPiece === '') {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            fen += `${emptyCount}`;
          }
          fen += currPiece;
          emptyCount = 0;
        }
      }
      if (emptyCount > 0) {
        fen += `${emptyCount}`;
      }
      fen += '/';
    }
    return fen.slice(0, -1);
  }
}
