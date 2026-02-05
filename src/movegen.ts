/**
 * Move generation for chess engine
 */

import type { BitBoard } from './internal.types';
import type { Side } from './public.types';
import { FILE_A, FILE_B, FILE_G, FILE_H, FULL_BOARD } from './position';

export const getPawnMoves = (pawn: BitBoard, turn: Side): BitBoard => {
  const allowedMoves =
    turn === 'white'
      ? (pawn << 8n) & FULL_BOARD // white pawn forward
      : (pawn >> 8n) & FULL_BOARD; // black pawn forward
  return allowedMoves;
};

export const getRookMoves = (rook: BitBoard): BitBoard => {
  let allowedMoves = 0n;
  let leftMask = FILE_H;
  let rightMask = FILE_A;
  for (let i = 1n; i <= 7n; i++) {
    allowedMoves |= (rook << (8n * i)) & FULL_BOARD; // forward moves
    allowedMoves |= rook >> (8n * i); // backward moves
    allowedMoves |= (rook << i) & ~leftMask & FULL_BOARD; // left moves
    allowedMoves |= (rook >> i) & ~rightMask; // right moves
    leftMask |= leftMask << 1n;
    rightMask |= rightMask >> 1n;
  }
  return allowedMoves;
};

export const getKnightMoves = (knight: BitBoard): BitBoard => {
  const allowedMoves =
    (((knight << 16n) >> 1n) & ~FILE_A & FULL_BOARD) | // 2 squares forward and 1 square right
    (((knight >> 2n) << 8n) & ~FILE_A & ~FILE_B & FULL_BOARD) | // 2 squares right and 1 square forward
    (((knight >> 2n) >> 8n) & ~FILE_A & ~FILE_B) | // 2 squares right and 1 square backward
    (((knight >> 16n) >> 1n) & ~FILE_A) | // 2 squares backward and 1 square right
    (((knight >> 16n) << 1n) & ~FILE_H) | // 2 squares backward and 1 square left
    (((knight << 2n) >> 8n) & ~FILE_H & ~FILE_G & FULL_BOARD) | // 2 squares left and 1 square backward
    (((knight << 2n) << 8n) & ~FILE_H & ~FILE_G & FULL_BOARD) | // 2 squares left and 1 square forward
    (((knight << 16n) << 1n) & ~FILE_H & FULL_BOARD); // 2 squares forward and 1 square left
  return allowedMoves;
};

export const getBishopMoves = (bishop: BitBoard): BitBoard => {
  let allowedMoves = 0n;
  let leftMask = FILE_H;
  let rightMask = FILE_A;
  for (let i = 1n; i <= 7n; i++) {
    allowedMoves |= (bishop << (9n * i)) & ~leftMask & FULL_BOARD; // forward-left moves
    allowedMoves |= (bishop << (7n * i)) & ~rightMask & FULL_BOARD; // forward-right moves
    allowedMoves |= (bishop >> (7n * i)) & ~leftMask; // backward-left moves
    allowedMoves |= (bishop >> (9n * i)) & ~rightMask; // backward-right moves
    leftMask |= leftMask << 1n;
    rightMask |= rightMask >> 1n;
  }
  return allowedMoves;
};

export const getQueenMoves = (queen: BitBoard): BitBoard => {
  const allowedMoves = getRookMoves(queen) | getBishopMoves(queen);
  return allowedMoves;
};

export const getKingMoves = (king: BitBoard): BitBoard => {
  const allowedMoves =
    ((king << 9n) & ~FILE_H & FULL_BOARD) | // forward-left
    ((king << 8n) & FULL_BOARD) | // forward
    ((king << 7n) & ~FILE_A & FULL_BOARD) | // forward-right
    ((king << 1n) & ~FILE_H & FULL_BOARD) | // left
    ((king >> 1n) & ~FILE_A) | // right
    ((king >> 7n) & ~FILE_H) | // backward-left
    (king >> 8n) | // backward
    ((king >> 9n) & ~FILE_A); // backward-right
  return allowedMoves;
};
