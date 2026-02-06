import { BoardFile, Position, Rank, Move } from '../types';
import { iterBits } from './util';
import { Square, EncodedMove, BitBoard } from './types';

const BIT_MASK = 0b111111;

export const positionToSquare = (algebraic: Position): Square => {
  const boardFile = algebraic.charAt(0) as BoardFile;
  const rank = algebraic.charAt(1) as Rank;
  return 'abcdefgh'.indexOf(boardFile) + 8 * (parseInt(rank) - 1);
};

export const squareToPosition = (index: Square): Position => {
  const boardFile = 'abcdefgh'[index % 8] as BoardFile;
  const rank = '12345678'[Math.floor(index / 8)] as Rank;
  const position = `${boardFile}${rank}` as Position;
  return position;
};

export const decodeMove = (encodedMove: EncodedMove): Move => {
  const encodedFrom: Square = (encodedMove >>> 6) & BIT_MASK;
  const encodedTo: Square = encodedMove & BIT_MASK;
  const from: Position = squareToPosition(encodedFrom);
  const to: Position = squareToPosition(encodedTo);
  const move: Move = { from, to };
  return move;
};

export const bitBoardToSquare = (bb: BitBoard): Square => {
  if (bb === 0n) {
    throw new Error('Bit board is empty');
  }
  if ((bb & (bb - 1n)) !== 0n) {
    throw new Error('Bit board must contain only one bit');
  }
  const index = bb.toString(2).padStart(64, '0').indexOf('1');
  const row = Math.floor(index / 8);
  const col = index % 8;
  const flippedRow = 7 - row;
  const newIndex = (flippedRow * 8 + col) as Square;
  return newIndex;
};

export const encodeMove = (from: BitBoard, to: BitBoard): EncodedMove[] => {
  const encodedFrom = bitBoardToSquare(from);
  let moves: EncodedMove[] = [];
  for (let eachTo of iterBits(to)) {
    const encodedTo = bitBoardToSquare(eachTo);
    const encodedMove = (encodedFrom << 6) | encodedTo;
    moves.push(encodedMove);
  }
  return moves;
};
