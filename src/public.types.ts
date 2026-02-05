export type Side = 'white' | 'black';
type Piece = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
type Promotion = 'knight' | 'bishop' | 'rook' | 'queen';
type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
type BoardFile = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
type Position = `${BoardFile}${Rank}`;
type BoardPiece = { color: Side; piece: Piece };
type Board = Partial<Record<Position, BoardPiece>>;
type FenString = string;

type CastlingRights = {
  whiteKingSide: boolean;
  whiteQueenSide: boolean;
  blackKingSide: boolean;
  blackQueenSide: boolean;
};

type GameOptions = {
  turn: Side;
  castlingRights: CastlingRights;
  enPassantTarget: Position | null;
  halfMoveClock: number;
  fullMoveNumber: number;
};

type GameStatus = GameOptions & {
  state: 'in_progress' | 'check' | 'checkmate' | 'stalemate' | 'draw';
  drawReason?: 'insufficient_material' | 'repetition' | '50_move';
  isGameOver: boolean;
  isDrawByInsufficientMaterial: boolean;
  canClaimDrawByRepetition: boolean;
  canClaimDrawBy50Move: boolean;
};

type Move = {
  from: Position;
  to: Position;
  promotion?: Promotion;
};

type Result<T> =
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

type MoveResult = Result<'invalid_move'>;

type LoadFenResult = Result<'invalid_fen'>;

type LoadBoardResult = Result<'invalid_board' | 'invalid_options'>;

type ResetGameResult = Result<'could_not_reset'>;

type UndoResult = Result<'no_history'>;

interface SimpleChessEngine {
  getStatus(): GameStatus;
  getLegalMoves(from?: Position): Move[];
  makeMove(move: Move): MoveResult;
  undo(): UndoResult;
  getFen(): FenString;
  loadFen(fen: FenString): LoadFenResult;
  getBoard(): Board;
  loadBoard(board: Board, options?: Partial<GameOptions>): LoadBoardResult;
  resetGame(): ResetGameResult;
}
