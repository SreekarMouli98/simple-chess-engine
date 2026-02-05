/**
 * Position utilities for chess engine.
 *
 * Grid convention (bbFromGrid and the literals below): 8 lines = 8 ranks, 8 chars = a→h.
 * First line = rank 8, last line = rank 1. 1 = bit set, 0 = empty.
 *
 *      a b c d e f g h
 *  8   0 0 0 0 0 0 0 0   ← first line (rank 8, Black's back rank)
 *  7   0 0 0 0 0 0 0 0
 *  6   0 0 0 0 0 0 0 0
 *  5   0 0 0 0 0 0 0 0
 *  4   0 0 0 0 0 0 0 0
 *  3   0 0 0 0 0 0 0 0
 *  2   0 0 0 0 0 0 0 0
 *  1   0 0 0 0 0 0 0 0   ← last line (rank 1, White's back rank)
 */

import type { BitBoard } from './internal.types';

const bbFromGrid = (grid: string): BitBoard =>
  BigInt('0b' + grid.replace(/\s/g, ''));

export const WHITE_PAWNS: BitBoard = bbFromGrid(`
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    11111111
    00000000
`);

export const WHITE_ROOKS: BitBoard = bbFromGrid(`
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    10000001
`);

export const WHITE_KNIGHTS: BitBoard = bbFromGrid(`
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    01000010
`);

export const WHITE_BISHOPS: BitBoard = bbFromGrid(`
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    00100100
`);

export const WHITE_QUEEN: BitBoard = bbFromGrid(`
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    00001000
`);

export const WHITE_KING: BitBoard = bbFromGrid(`
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    00010000
`);

export const BLACK_PAWNS: BitBoard = bbFromGrid(`
    00000000
    11111111
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
`);

export const BLACK_ROOKS: BitBoard = bbFromGrid(`
    10000001
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
`);

export const BLACK_KNIGHTS: BitBoard = bbFromGrid(`
    01000010
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
`);

export const BLACK_BISHOPS: BitBoard = bbFromGrid(`
    00100100
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
`);

export const BLACK_QUEEN: BitBoard = bbFromGrid(`
    00001000
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
`);

export const BLACK_KING: BitBoard = bbFromGrid(`
    00010000
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
    00000000
`);

export const FULL_BOARD: BitBoard = bbFromGrid(`
    11111111
    11111111
    11111111
    11111111
    11111111
    11111111
    11111111
    11111111
`);

export const FILE_A: BitBoard = bbFromGrid(`
    10000000
    10000000
    10000000
    10000000
    10000000
    10000000
    10000000
    10000000
`);

export const FILE_B: BitBoard = bbFromGrid(`
    01000000
    01000000
    01000000
    01000000
    01000000
    01000000
    01000000
    01000000
`);

export const FILE_C: BitBoard = bbFromGrid(`
    00100000
    00100000
    00100000
    00100000
    00100000
    00100000
    00100000
    00100000
`);

export const FILE_D: BitBoard = bbFromGrid(`
    00010000
    00010000
    00010000
    00010000
    00010000
    00010000
    00010000
    00010000
`);

export const FILE_E: BitBoard = bbFromGrid(`
    00001000
    00001000
    00001000
    00001000
    00001000
    00001000
    00001000
    00001000
`);

export const FILE_F: BitBoard = bbFromGrid(`
    00000100
    00000100
    00000100
    00000100
    00000100
    00000100
    00000100
    00000100
`);

export const FILE_G: BitBoard = bbFromGrid(`
    00000010
    00000010
    00000010
    00000010
    00000010
    00000010
    00000010
    00000010
`);

export const FILE_H: BitBoard = bbFromGrid(`
    00000001
    00000001
    00000001
    00000001
    00000001
    00000001
    00000001
    00000001
`);
