/**
 * Core logic for chess engine
 */

import type { InternalState, BitBoard } from './types';

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

export class Engine {
  private state: InternalState;

  constructor() {
    this.state = this.initialState;
  }

  get initialState(): InternalState {
    return {
      turn: 'white',
      castlingRights: {
        whiteKingSide: true,
        whiteQueenSide: true,
        blackKingSide: true,
        blackQueenSide: true,
      },
      enPassantTarget: null,
      halfMoveClock: 0,
      fullMoveNumber: 0,
      state: 'in_progress',
      drawReason: undefined,
      isGameOver: false,
      canClaimDrawByRepetition: false,
      canClaimDrawBy50Move: false,
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
}
