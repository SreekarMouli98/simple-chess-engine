/**
 * Core logic for chess engine
 */

import type { InternalState, BitBoard, EncodedMove, Square } from './types';
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
} from './position';
import {
  getPawnMoves,
  getRookMoves,
  getKnightMoves,
  getBishopMoves,
  getQueenMoves,
  getKingMoves,
} from './movegen';
import { encodeMove } from './codec';
import { iterBits } from './util';

export class Engine {
  private state: InternalState;

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
      moves.push(...encodeMove(from, to));
    }
    for (const from of iterBits(rookBb)) {
      const to = getRookMoves(from, friendlyBb, enemyBb);
      moves.push(...encodeMove(from, to));
    }
    for (const from of iterBits(knightBb)) {
      const to = getKnightMoves(from, friendlyBb);
      moves.push(...encodeMove(from, to));
    }
    for (const from of iterBits(bishopBb)) {
      const to = getBishopMoves(from, friendlyBb, enemyBb);
      moves.push(...encodeMove(from, to));
    }
    for (const from of iterBits(queenBb)) {
      const to = getQueenMoves(from, friendlyBb, enemyBb);
      moves.push(...encodeMove(from, to));
    }
    for (const from of iterBits(kingBb)) {
      const to = getKingMoves(from, friendlyBb);
      moves.push(...encodeMove(from, to));
    }
    return moves;
  }
}
