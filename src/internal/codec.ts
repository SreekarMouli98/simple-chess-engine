import { BoardFile, Position, Rank, Move } from '@src/types';
import { iterBits } from '@src/internal/util';
import { Square, EncodedMove, BitBoard } from '@src/internal/types';

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

export const getEncodedFromViaEncodedMove = (
  encodedMove: EncodedMove
): Square => {
  return (encodedMove >>> 6) & BIT_MASK;
};

export const decodeMove = (encodedMove: EncodedMove): Move => {
  const encodedFrom: Square = getEncodedFromViaEncodedMove(encodedMove);
  const encodedTo: Square = encodedMove & BIT_MASK;
  const from: Position = squareToPosition(encodedFrom);
  const to: Position = squareToPosition(encodedTo);
  const move: Move = { from, to };
  return move;
};

export const encodeMove = (move: Move): EncodedMove => {
  const encodedFrom = positionToSquare(move.from);
  const encodedTo = positionToSquare(move.to);
  return (encodedFrom << 6) | encodedTo;
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

export const squareToBitBoard = (square: Square): BitBoard => {
  const col = square % 8;
  const row = Math.floor(square / 8);
  return 1n << BigInt(row * 8 + (7 - col));
};

export const bitBoardsToEncodedMove = (
  from: BitBoard,
  to: BitBoard
): EncodedMove[] => {
  const encodedFrom = bitBoardToSquare(from);
  let moves: EncodedMove[] = [];
  for (let eachTo of iterBits(to)) {
    const encodedTo = bitBoardToSquare(eachTo);
    const encodedMove = (encodedFrom << 6) | encodedTo;
    moves.push(encodedMove);
  }
  return moves;
};

export const encodedMoveToBitBoards = (
  encodedMove: EncodedMove
): [BitBoard, BitBoard] => {
  const encodedFrom: Square = getEncodedFromViaEncodedMove(encodedMove);
  const encodedTo: Square = encodedMove & BIT_MASK;
  const from = squareToBitBoard(encodedFrom);
  const to = squareToBitBoard(encodedTo);
  return [from, to];
};
