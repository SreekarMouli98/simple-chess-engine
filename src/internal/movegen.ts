/**
 * Move generation for chess engine
 */

import type { BitBoard } from '@src/internal/types';
import type { Side } from '@src/internal/types';
import {
  FILE_A,
  FILE_B,
  FILE_G,
  FILE_H,
  FULL_BOARD,
  RANK_2,
  RANK_7,
} from '@src/internal/position';

export const getPawnMoves = (
  pawn: BitBoard,
  turn: Side,
  friendly: BitBoard,
  enemy: BitBoard
): BitBoard => {
  let allowedMoves =
    turn === 'white'
      ? (pawn << 8n) & ~(friendly | enemy) & FULL_BOARD // white pawn forward
      : (pawn >> 8n) & ~(friendly | enemy) & FULL_BOARD; // black pawn forward
  allowedMoves |=
    turn === 'white'
      ? (pawn & RANK_2) !== 0n
        ? (pawn << 16n) &
          (allowedMoves << 8n) &
          ~(friendly | enemy) &
          FULL_BOARD // white pawn double forward
        : 0n
      : (pawn & RANK_7) !== 0n
        ? (pawn >> 16n) &
          (allowedMoves >> 8n) &
          ~(friendly | enemy) &
          FULL_BOARD // black pawn double forward
        : 0n;
  allowedMoves |=
    turn === 'white'
      ? (pawn << 9n) & enemy & ~FILE_H & FULL_BOARD // white pawn capture forward-left
      : (pawn >> 9n) & enemy & ~FILE_A & FULL_BOARD; // black pawn capture forward-left
  allowedMoves |=
    turn === 'white'
      ? (pawn << 7n) & enemy & ~FILE_A & FULL_BOARD // white pawn capture forward-right
      : (pawn >> 7n) & enemy & ~FILE_H & FULL_BOARD; // black pawn capture forward-right
  return allowedMoves;
};

export const getRookMoves = (
  rook: BitBoard,
  friendly: BitBoard,
  enemy: BitBoard
): BitBoard => {
  let allowedMoves = 0n;
  let leftMask = FILE_H;
  let rightMask = FILE_A;
  let fwdPath = rook << 8n;
  let bkdPath = rook >> 8n;
  let leftPath = rook << 1n;
  let rightPath = rook >> 1n;
  for (let i = 1; i <= 7; i++) {
    allowedMoves |= fwdPath & ~friendly & FULL_BOARD; // forward moves
    allowedMoves |= bkdPath & ~friendly; // backward moves
    allowedMoves |= leftPath & ~friendly & ~leftMask & FULL_BOARD; // left moves
    allowedMoves |= rightPath & ~friendly & ~rightMask; // right moves
    fwdPath = (fwdPath & ~friendly & ~enemy) << 8n;
    bkdPath = (bkdPath & ~friendly & ~enemy) >> 8n;
    leftPath = (leftPath & ~friendly & ~enemy) << 1n;
    rightPath = (rightPath & ~friendly & ~enemy) >> 1n;
    leftMask |= leftMask << 1n;
    rightMask |= rightMask >> 1n;
  }
  return allowedMoves;
};

export const getKnightMoves = (
  knight: BitBoard,
  friendly: BitBoard
): BitBoard => {
  const allowedMoves =
    (((knight << 16n) >> 1n) & ~FILE_A & ~friendly & FULL_BOARD) | // 2 squares forward and 1 square right
    (((knight >> 2n) << 8n) & ~FILE_A & ~FILE_B & ~friendly & FULL_BOARD) | // 2 squares right and 1 square forward
    (((knight >> 2n) >> 8n) & ~FILE_A & ~FILE_B & ~friendly) | // 2 squares right and 1 square backward
    (((knight >> 16n) >> 1n) & ~FILE_A & ~friendly) | // 2 squares backward and 1 square right
    (((knight >> 16n) << 1n) & ~FILE_H & ~friendly) | // 2 squares backward and 1 square left
    (((knight << 2n) >> 8n) & ~FILE_H & ~FILE_G & ~friendly & FULL_BOARD) | // 2 squares left and 1 square backward
    (((knight << 2n) << 8n) & ~FILE_H & ~FILE_G & ~friendly & FULL_BOARD) | // 2 squares left and 1 square forward
    (((knight << 16n) << 1n) & ~FILE_H & ~friendly & FULL_BOARD); // 2 squares forward and 1 square left
  return allowedMoves;
};

export const getBishopMoves = (
  bishop: BitBoard,
  friendly: BitBoard,
  enemy: BitBoard
): BitBoard => {
  let allowedMoves = 0n;
  let leftMask = FILE_H;
  let rightMask = FILE_A;
  let fwdLeftPath = bishop << 9n;
  let fwdRightPath = bishop << 7n;
  let bkdLeftPath = bishop >> 7n;
  let bkdRightPath = bishop >> 9n;
  for (let i = 1; i <= 7; i++) {
    allowedMoves |= fwdLeftPath & ~friendly & ~leftMask & FULL_BOARD; // forward-left moves
    allowedMoves |= fwdRightPath & ~friendly & ~rightMask & FULL_BOARD; // forward-right moves
    allowedMoves |= bkdLeftPath & ~friendly & ~leftMask; // backward-left moves
    allowedMoves |= bkdRightPath & ~friendly & ~rightMask; // backward-right moves
    fwdLeftPath = (fwdLeftPath & ~friendly & ~enemy) << 9n;
    fwdRightPath = (fwdRightPath & ~friendly & ~enemy) << 7n;
    bkdLeftPath = (bkdLeftPath & ~friendly & ~enemy) >> 7n;
    bkdRightPath = (bkdRightPath & ~friendly & ~enemy) >> 9n;
    leftMask |= leftMask << 1n;
    rightMask |= rightMask >> 1n;
  }
  return allowedMoves;
};

export const getQueenMoves = (
  queen: BitBoard,
  friendly: BitBoard,
  enemy: BitBoard
): BitBoard => {
  const allowedMoves =
    getRookMoves(queen, friendly, enemy) |
    getBishopMoves(queen, friendly, enemy);
  return allowedMoves;
};

export const getKingMoves = (king: BitBoard, friendly: BitBoard): BitBoard => {
  const allowedMoves =
    ((king << 9n) & ~friendly & ~FILE_H & FULL_BOARD) | // forward-left
    ((king << 8n) & ~friendly & FULL_BOARD) | // forward
    ((king << 7n) & ~friendly & ~FILE_A & FULL_BOARD) | // forward-right
    ((king << 1n) & ~friendly & ~FILE_H & FULL_BOARD) | // left
    ((king >> 1n) & ~friendly & ~FILE_A) | // right
    ((king >> 7n) & ~friendly & ~FILE_H) | // backward-left
    ((king >> 8n) & ~friendly) | // backward
    ((king >> 9n) & ~friendly & ~FILE_A); // backward-right
  return allowedMoves;
};
