/**
 * Move generation for chess engine
 */

import { BitBoard, Side } from './internal.types';
import {
  FILE_A,
  FILE_B,
  FILE_C,
  FILE_D,
  FILE_E,
  FILE_F,
  FILE_G,
  FILE_H,
  FULL_BOARD,
} from './position';

export const getPawnMoves = (pawn: BitBoard, sideToMove: Side): BitBoard => {
  const allowedMoves =
    sideToMove === 'white'
      ? (pawn << 8n) & FULL_BOARD // white pawn forward
      : (pawn >> 8n) & FULL_BOARD; // black pawn forward
  return allowedMoves;
};

export const getRookMoves = (rook: BitBoard): BitBoard => {
  const allowedMoves =
    ((rook << (8n * 7n)) & FULL_BOARD) | // 7 squares forward
    ((rook << (8n * 6n)) & FULL_BOARD) | // 6 squares forward
    ((rook << (8n * 5n)) & FULL_BOARD) | // 5 squares forward
    ((rook << (8n * 4n)) & FULL_BOARD) | // 4 squares forward
    ((rook << (8n * 3n)) & FULL_BOARD) | // 3 squares forward
    ((rook << (8n * 2n)) & FULL_BOARD) | // 2 squares forward
    ((rook << (8n * 1n)) & FULL_BOARD) | // 1 square forward
    ((rook >> (8n * 1n)) & FULL_BOARD) | // 1 square backward
    ((rook >> (8n * 2n)) & FULL_BOARD) | // 2 squares backward
    ((rook >> (8n * 3n)) & FULL_BOARD) | // 3 squares backward
    ((rook >> (8n * 4n)) & FULL_BOARD) | // 4 squares backward
    ((rook >> (8n * 5n)) & FULL_BOARD) | // 5 squares backward
    ((rook >> (8n * 6n)) & FULL_BOARD) | // 6 squares backward
    ((rook >> (8n * 7n)) & FULL_BOARD) | // 7 squares backward
    ((rook << 1n) & ~FILE_H & FULL_BOARD) | // 1 square left
    ((rook << 2n) & ~FILE_H & ~FILE_G & FULL_BOARD) | // 2 squares left
    ((rook << 3n) & ~FILE_H & ~FILE_G & ~FILE_F & FULL_BOARD) | // 3 squares left
    ((rook << 4n) & ~FILE_H & ~FILE_G & ~FILE_F & ~FILE_E & FULL_BOARD) | // 4 squares left
    ((rook << 5n) &
      ~FILE_H &
      ~FILE_G &
      ~FILE_F &
      ~FILE_E &
      ~FILE_D &
      FULL_BOARD) | // 5 squares left
    ((rook << 6n) &
      ~FILE_H &
      ~FILE_G &
      ~FILE_F &
      ~FILE_E &
      ~FILE_D &
      ~FILE_C &
      FULL_BOARD) | // 6 squares left
    ((rook << 7n) &
      ~FILE_H &
      ~FILE_G &
      ~FILE_F &
      ~FILE_E &
      ~FILE_D &
      ~FILE_C &
      ~FILE_B &
      FULL_BOARD) | // 7 squares left
    ((rook >> 1n) & ~FILE_A & FULL_BOARD) | // 1 square right
    ((rook >> 2n) & ~FILE_A & ~FILE_B & FULL_BOARD) | // 2 squares right
    ((rook >> 3n) & ~FILE_A & ~FILE_B & ~FILE_C & FULL_BOARD) | // 3 squares right
    ((rook >> 4n) & ~FILE_A & ~FILE_B & ~FILE_C & ~FILE_D & FULL_BOARD) | // 4 squares right
    ((rook >> 5n) &
      ~FILE_A &
      ~FILE_B &
      ~FILE_C &
      ~FILE_D &
      ~FILE_E &
      FULL_BOARD) | // 5 squares right
    ((rook >> 6n) &
      ~FILE_A &
      ~FILE_B &
      ~FILE_C &
      ~FILE_D &
      ~FILE_E &
      ~FILE_F &
      FULL_BOARD) | // 6 squares right
    ((rook >> 7n) &
      ~FILE_A &
      ~FILE_B &
      ~FILE_C &
      ~FILE_D &
      ~FILE_E &
      ~FILE_F &
      ~FILE_G &
      FULL_BOARD); // 7 squares right
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
