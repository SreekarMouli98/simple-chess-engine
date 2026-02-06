import type {
  GameStatus,
  Position,
  Move,
  MoveResult,
  UndoResult,
  FenString,
  LoadFenResult,
  LoadBoardResult,
  ResetGameResult,
  Board,
  GameOptions,
  GameInterface,
} from './types';
import { Engine } from './internal/engine';
import { positionToSquare, decodeMove } from './internal/codec';

export default class Game implements GameInterface {
  private engine: Engine = new Engine();

  // getStatus(): GameStatus { }

  getLegalMoves(from?: Position): Move[] {
    const encodedFrom = from ? positionToSquare(from) : undefined;
    const encodedMoves = this.engine.getLegalMoves(encodedFrom);
    return encodedMoves.map((encodedMove) => decodeMove(encodedMove));
  }

  // makeMove(move: Move): MoveResult { }

  // undo(): UndoResult { }

  // getFen(): FenString { }

  // loadFen(fen: FenString): LoadFenResult { }

  // getBoard(): Board { }

  // loadBoard(board: Board, options?: Partial<GameOptions>): LoadBoardResult { }

  // resetGame(): ResetGameResult { }
}
