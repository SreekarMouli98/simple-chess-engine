/**
 * Internal types for chess engine
 */

import type { GameStatus } from '../types';

export { Side } from '../types';

export type BitBoard = bigint;

export interface InternalState extends GameStatus {
  whitePawns: BitBoard;
  whiteRooks: BitBoard;
  whiteKnights: BitBoard;
  whiteBishops: BitBoard;
  whiteQueens: BitBoard;
  whiteKing: BitBoard;
  blackPawns: BitBoard;
  blackRooks: BitBoard;
  blackKnights: BitBoard;
  blackBishops: BitBoard;
  blackQueens: BitBoard;
  blackKing: BitBoard;
}
