export type Side = 'white' | 'black';
export type Piece = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type Promotion = 'knight' | 'bishop' | 'rook' | 'queen';
export type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type BoardFile = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type Position = `${BoardFile}${Rank}`;
export type BoardPiece = { color: Side; piece: Piece };
export type Board = Partial<Record<Position, BoardPiece>>;
export type FenString = string;

export type CastlingRights = {
  whiteKingSide: boolean;
  whiteQueenSide: boolean;
  blackKingSide: boolean;
  blackQueenSide: boolean;
};

export type GameOptions = {
  turn: Side;
  castlingRights: CastlingRights;
  enPassantTarget: Position | null;
  halfMoveClock: number;
  fullMoveNumber: number;
};

export type GameStatus = GameOptions & {
  state: 'in_progress' | 'check' | 'checkmate' | 'stalemate' | 'draw';
  drawReason?: 'insufficient_material';
  isGameOver: boolean;
  canClaimDrawByRepetition: boolean;
  canClaimDrawBy50Move: boolean;
};

export type Move = {
  from: Position;
  to: Position;
  promotion?: Promotion;
};

export type Result<T> =
  | {
      success: true;
      status: GameStatus;
    }
  | {
      success: false;
      status: GameStatus;
      error: {
        code: T;
        message?: string;
      };
    };

export type MoveResult = Result<'invalid_move'>;

export type LoadFenResult = Result<'invalid_fen'>;

export type LoadBoardResult = Result<'invalid_board' | 'invalid_options'>;

export type ResetGameResult = Result<'could_not_reset'>;

export type UndoResult = Result<'no_history'>;

export interface GameInterface {
  getStatus(): GameStatus;
  getLegalMoves(from?: Position): Move[];
  makeMove(move: Move): MoveResult;
  // undo(): UndoResult;
  getFen(): FenString;
  // loadFen(fen: FenString): LoadFenResult;
  // getBoard(): Board;
  // loadBoard(board: Board, options?: Partial<GameOptions>): LoadBoardResult;
  // resetGame(): ResetGameResult;
}
