/**
 * Internal types for chess engine
 */

import type { Side } from './public.types';

export type BitBoard = bigint;

export interface GameState {
  turn: Side;
  whitePawns: BitBoard;
  whiteRooks: BitBoard;
  whiteKnights: BitBoard;
  whiteBishops: BitBoard;
  whiteQueens: BitBoard;
  whiteKing: BitBoard;
  allWhitePieces: BitBoard;
  blackPawns: BitBoard;
  blackRooks: BitBoard;
  blackKnights: BitBoard;
  blackBishops: BitBoard;
  blackQueens: BitBoard;
  blackKing: BitBoard;
  allBlackPieces: BitBoard;
}
