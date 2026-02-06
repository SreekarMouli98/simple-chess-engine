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
} from '@src/types';
import { Engine } from '@src/internal/engine';
import {
  positionToSquare,
  decodeMove,
  encodeMove,
  squareToPosition,
} from '@src/internal/codec';

export default class Game implements GameInterface {
  private engine: Engine = new Engine();

  getStatus(): GameStatus {
    return {
      turn: this.engine.state.turn,
      castlingRights: {
        whiteKingSide: !!(this.engine.state.castlingRights & 0b0001),
        whiteQueenSide: !!(this.engine.state.castlingRights & 0b0010),
        blackKingSide: !!(this.engine.state.castlingRights & 0b0100),
        blackQueenSide: !!(this.engine.state.castlingRights & 0b1000),
      },
      enPassantTarget: this.engine.state.enPassantTarget
        ? squareToPosition(this.engine.state.enPassantTarget)
        : null,
      halfMoveClock: this.engine.state.halfMoveClock,
      fullMoveNumber: this.engine.state.fullMoveNumber,
      state: 'in_progress',
      drawReason: undefined,
      isGameOver: false,
      canClaimDrawByRepetition: false,
      canClaimDrawBy50Move: false,
    };
  }

  getLegalMoves(from?: Position): Move[] {
    const encodedFrom = from ? positionToSquare(from) : undefined;
    const encodedMoves = this.engine.getLegalMoves(encodedFrom);
    return encodedMoves.map((encodedMove) => decodeMove(encodedMove));
  }

  makeMove(move: Move): MoveResult {
    try {
      const encodedMove = encodeMove(move);
      const success = this.engine.makeMove(encodedMove);
      return {
        success,
        status: this.getStatus(),
      } as MoveResult;
    } catch (error) {
      return {
        success: false,
        status: this.getStatus(),
        error: { code: 'invalid_move' },
      };
    }
  }

  getFen(): FenString {
    return this.engine.getFen();
  }

  // undo(): UndoResult { }

  // getFen(): FenString { }

  // loadFen(fen: FenString): LoadFenResult { }

  // getBoard(): Board { }

  // loadBoard(board: Board, options?: Partial<GameOptions>): LoadBoardResult { }

  // resetGame(): ResetGameResult { }
}
