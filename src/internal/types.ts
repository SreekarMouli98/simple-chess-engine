/**
 * Internal types for chess engine
 */

import type { Side } from '../types';

export { Side } from '../types';

export type BitBoard = bigint;

/**
 * 4-bit number
 * - bit 0: white king side
 * - bit 1: white queen side
 * - bit 2: black king side
 * - bit 3: black queen side
 */
export type InternalCastlingRights = number;

/**
 * 6-bit number: 0-63
 *
 * -       a  b  c  d  e  f  g  h
 * -  8   56 57 58 59 60 61 62 63   ← first line (rank 8, Black's back rank)
 * -  7   48 49 50 51 52 53 54 55
 * -  6   40 41 43 44 45 46 47 48
 * -  5   32 33 34 35 36 37 38 39
 * -  4   24 25 26 27 28 29 30 31
 * -  3   16 17 18 19 20 21 22 23
 * -  2   08 09 10 11 12 13 14 15
 * -  1   00 01 02 03 04 05 06 07   ← last line (rank 1, White's back rank)
 *
 */
export type Square = number;

/**
 * Packed move layout
 * - bits 0..5   : to square   (@type Square)
 * - bits 6..11  : from square (@type Square)
 */
export type EncodedMove = number;

export interface InternalState {
  turn: Side;
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
  castlingRights: InternalCastlingRights;
  enPassantTarget: Square | null;
  halfMoveClock: number;
  fullMoveNumber: number;
}
