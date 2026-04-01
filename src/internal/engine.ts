/**
 * Core logic for chess engine
 */

import type {
  InternalState,
  BitBoard,
  EncodedMove,
  Square,
  TurnMetadata,
  FullEncodedMove,
  EncodedPromotionPiece,
  EncodedCapturePiece,
  InternalCastlingRights,
  HalfMoveClock,
  EncodedIsEnPassantCapture,
  EncodedHasEnPassantTarget,
  MoveMetadata,
  Piece,
} from '@src/internal/types';
import {
  WHITE_PAWNS,
  WHITE_ROOKS,
  WHITE_KNIGHTS,
  WHITE_BISHOPS,
  WHITE_QUEEN,
  WHITE_KING,
  BLACK_PAWNS,
  BLACK_ROOKS,
  BLACK_KNIGHTS,
  BLACK_BISHOPS,
  BLACK_QUEEN,
  BLACK_KING,
} from '@src/internal/position';
import {
  getPawnMoves,
  getRookMoves,
  getKnightMoves,
  getBishopMoves,
  getQueenMoves,
  getKingMoves,
} from '@src/internal/movegen';
import {
  bitBoardsToEncodedMove,
  bitBoardToSquare,
  encodedMoveToBitBoards,
  getEncodedFromViaEncodedMove,
  squareToBitBoard,
} from '@src/internal/codec';
import { iterBits } from '@src/internal/util';
import { FenString } from '@src/types';

export class Engine {
  state: InternalState;
  moveHistory: FullEncodedMove[];

  constructor() {
    this.state = this.initialState;
    this.moveHistory = [];
  }

  get initialState(): InternalState {
    return {
      turn: 'white',
      whitePawns: WHITE_PAWNS,
      whiteRooks: WHITE_ROOKS,
      whiteKnights: WHITE_KNIGHTS,
      whiteBishops: WHITE_BISHOPS,
      whiteQueens: WHITE_QUEEN,
      whiteKing: WHITE_KING,
      blackPawns: BLACK_PAWNS,
      blackRooks: BLACK_ROOKS,
      blackKnights: BLACK_KNIGHTS,
      blackBishops: BLACK_BISHOPS,
      blackQueens: BLACK_QUEEN,
      blackKing: BLACK_KING,
      castlingRights: 0b1111,
      enPassantTarget: undefined,
      halfMoveClock: 0,
      fullMoveNumber: 1,
    };
  }

  get allWhitePieces(): BitBoard {
    return (
      this.state.whitePawns |
      this.state.whiteRooks |
      this.state.whiteKnights |
      this.state.whiteBishops |
      this.state.whiteQueens |
      this.state.whiteKing
    );
  }

  get allBlackPieces(): BitBoard {
    return (
      this.state.blackPawns |
      this.state.blackRooks |
      this.state.blackKnights |
      this.state.blackBishops |
      this.state.blackQueens |
      this.state.blackKing
    );
  }

  getTurnMetadata(): TurnMetadata {
    if (this.state.turn === 'white') {
      return {
        friendlyBb: this.allWhitePieces,
        enemyBb: this.allBlackPieces,
        friendlyPawns: this.state.whitePawns,
        friendlyRooks: this.state.whiteRooks,
        friendlyKnights: this.state.whiteKnights,
        friendlyBishops: this.state.whiteBishops,
        friendlyQueens: this.state.whiteQueens,
        friendlyKing: this.state.whiteKing,
        enemyPawns: this.state.blackPawns,
        enemyRooks: this.state.blackRooks,
        enemyKnights: this.state.blackKnights,
        enemyBishops: this.state.blackBishops,
        enemyQueens: this.state.blackQueens,
        enemyKing: this.state.blackKing,
      };
    } else {
      return {
        friendlyBb: this.allBlackPieces,
        enemyBb: this.allWhitePieces,
        friendlyPawns: this.state.blackPawns,
        friendlyRooks: this.state.blackRooks,
        friendlyKnights: this.state.blackKnights,
        friendlyBishops: this.state.blackBishops,
        friendlyQueens: this.state.blackQueens,
        friendlyKing: this.state.blackKing,
        enemyPawns: this.state.whitePawns,
        enemyRooks: this.state.whiteRooks,
        enemyKnights: this.state.whiteKnights,
        enemyBishops: this.state.whiteBishops,
        enemyQueens: this.state.whiteQueens,
        enemyKing: this.state.whiteKing,
      };
    }
  }

  getLegalMoves(from?: Square): EncodedMove[] {
    const t = this.getTurnMetadata();
    const fromBb: BitBoard | undefined =
      from !== undefined ? squareToBitBoard(from) : undefined;
    let movesBb: [BitBoard, BitBoard][] = [];
    if (fromBb !== undefined) {
      if ((t.friendlyPawns & fromBb) !== 0n) {
        const to = getPawnMoves(
          fromBb,
          this.state.turn,
          t.friendlyBb,
          t.enemyBb
        );
        movesBb.push([fromBb, to]);
      } else if ((t.friendlyRooks & fromBb) !== 0n) {
        const to = getRookMoves(fromBb, t.friendlyBb, t.enemyBb);
        movesBb.push([fromBb, to]);
      } else if ((t.friendlyKnights & fromBb) !== 0n) {
        const to = getKnightMoves(fromBb, t.friendlyBb);
        movesBb.push([fromBb, to]);
      } else if ((t.friendlyBishops & fromBb) !== 0n) {
        const to = getBishopMoves(fromBb, t.friendlyBb, t.enemyBb);
        movesBb.push([fromBb, to]);
      } else if ((t.friendlyQueens & fromBb) !== 0n) {
        const to = getQueenMoves(fromBb, t.friendlyBb, t.enemyBb);
        movesBb.push([fromBb, to]);
      } else if ((t.friendlyKing & fromBb) !== 0n) {
        const to = getKingMoves(
          fromBb,
          this.state.turn,
          t.friendlyBb,
          this.state.castlingRights
        );
        movesBb.push([fromBb, to]);
      }
    } else {
      for (const from of iterBits(t.friendlyPawns)) {
        const to = getPawnMoves(from, this.state.turn, t.friendlyBb, t.enemyBb);
        movesBb.push([from, to]);
      }
      for (const from of iterBits(t.friendlyRooks)) {
        const to = getRookMoves(from, t.friendlyBb, t.enemyBb);
        movesBb.push([from, to]);
      }
      for (const from of iterBits(t.friendlyKnights)) {
        const to = getKnightMoves(from, t.friendlyBb);
        movesBb.push([from, to]);
      }
      for (const from of iterBits(t.friendlyBishops)) {
        const to = getBishopMoves(from, t.friendlyBb, t.enemyBb);
        movesBb.push([from, to]);
      }
      for (const from of iterBits(t.friendlyQueens)) {
        const to = getQueenMoves(from, t.friendlyBb, t.enemyBb);
        movesBb.push([from, to]);
      }
      for (const from of iterBits(t.friendlyKing)) {
        const to = getKingMoves(
          from,
          this.state.turn,
          t.friendlyBb,
          this.state.castlingRights
        );
        movesBb.push([from, to]);
      }
    }
    const moves = movesBb.flatMap(([from, to]) =>
      bitBoardsToEncodedMove(from, to)
    );
    return moves;
  }

  getMoveMetadata(from: BitBoard, to: BitBoard, t: TurnMetadata): MoveMetadata {
    if (from === 0n) {
      throw new Error('No piece selected');
    }
    if ((from & t.friendlyBb) === 0n) {
      throw new Error('Invalid piece selected');
    }
    if ((to & t.friendlyBb) !== 0n) {
      throw new Error('Invalid move');
    }
    if (to === 0n) {
      throw new Error('Invalid move');
    }
    let isCapture: boolean = false;
    let capturePiece: Piece = 'pawn';
    let capturePieceBb: BitBoard = 0n;
    if ((t.enemyBb & to) !== 0n) {
      isCapture = true;
      if ((t.enemyPawns & to) !== 0n) {
        capturePiece = 'pawn';
        capturePieceBb = t.enemyPawns & to;
      } else if ((t.enemyRooks & to) !== 0n) {
        capturePiece = 'rook';
        capturePieceBb = t.enemyRooks & to;
      } else if ((t.enemyKnights & to) !== 0n) {
        capturePiece = 'knight';
        capturePieceBb = t.enemyKnights & to;
      } else if ((t.enemyBishops & to) !== 0n) {
        capturePiece = 'bishop';
        capturePieceBb = t.enemyBishops & to;
      } else if ((t.enemyQueens & to) !== 0n) {
        capturePiece = 'queen';
        capturePieceBb = t.enemyQueens & to;
      } else if ((t.enemyKing & to) !== 0n) {
        capturePiece = 'king';
        capturePieceBb = t.enemyKing & to;
      } else {
        throw new Error('Invalid piece captured');
      }
    }
    return {
      isCapture,
      capturePiece,
      capturePieceBb,
    };
  }

  movePiece(t: TurnMetadata, from: BitBoard, to: BitBoard): TurnMetadata {
    if ((t.friendlyPawns & from) !== 0n) {
      t.friendlyPawns = (t.friendlyPawns & ~from) | to;
    } else if ((t.friendlyRooks & from) !== 0n) {
      t.friendlyRooks = (t.friendlyRooks & ~from) | to;
    } else if ((t.friendlyKnights & from) !== 0n) {
      t.friendlyKnights = (t.friendlyKnights & ~from) | to;
    } else if ((t.friendlyBishops & from) !== 0n) {
      t.friendlyBishops = (t.friendlyBishops & ~from) | to;
    } else if ((t.friendlyQueens & from) !== 0n) {
      t.friendlyQueens = (t.friendlyQueens & ~from) | to;
    } else if ((t.friendlyKing & from) !== 0n) {
      t.friendlyKing = (t.friendlyKing & ~from) | to;
    } else {
      throw new Error('Invalid piece selected');
    }
    return t;
  }

  capturePiece(t: TurnMetadata, to: BitBoard, m: MoveMetadata): TurnMetadata {
    if (!m.isCapture) {
      return t;
    }
    if (m.capturePiece === 'pawn') {
      t.enemyPawns = t.enemyPawns & ~m.capturePieceBb;
    } else if (m.capturePiece === 'rook') {
      t.enemyRooks = t.enemyRooks & ~m.capturePieceBb;
    } else if (m.capturePiece === 'knight') {
      t.enemyKnights = t.enemyKnights & ~m.capturePieceBb;
    } else if (m.capturePiece === 'bishop') {
      t.enemyBishops = t.enemyBishops & ~m.capturePieceBb;
    } else if (m.capturePiece === 'queen') {
      t.enemyQueens = t.enemyQueens & ~m.capturePieceBb;
    } else if (m.capturePiece === 'king') {
      t.enemyKing = t.enemyKing & ~m.capturePieceBb;
    } else {
      throw new Error('Invalid piece captured');
    }
    return t;
  }

  updatePosition(t: TurnMetadata): void {
    if (this.state.turn === 'white') {
      this.state.whitePawns = t.friendlyPawns;
      this.state.whiteRooks = t.friendlyRooks;
      this.state.whiteKnights = t.friendlyKnights;
      this.state.whiteBishops = t.friendlyBishops;
      this.state.whiteQueens = t.friendlyQueens;
      this.state.whiteKing = t.friendlyKing;
      this.state.blackPawns = t.enemyPawns;
      this.state.blackRooks = t.enemyRooks;
      this.state.blackKnights = t.enemyKnights;
      this.state.blackBishops = t.enemyBishops;
      this.state.blackQueens = t.enemyQueens;
      this.state.blackKing = t.enemyKing;
    } else {
      this.state.blackPawns = t.friendlyPawns;
      this.state.blackRooks = t.friendlyRooks;
      this.state.blackKnights = t.friendlyKnights;
      this.state.blackBishops = t.friendlyBishops;
      this.state.blackQueens = t.friendlyQueens;
      this.state.blackKing = t.friendlyKing;
      this.state.whitePawns = t.enemyPawns;
      this.state.whiteRooks = t.enemyRooks;
      this.state.whiteKnights = t.enemyKnights;
      this.state.whiteBishops = t.enemyBishops;
      this.state.whiteQueens = t.enemyQueens;
      this.state.whiteKing = t.enemyKing;
    }
  }

  updateCastlingRights(from: BitBoard): void {
    if (this.state.turn === 'white') {
      if ((from & this.state.whiteKing) !== 0n) {
        this.state.castlingRights = this.state.castlingRights & 0b0011;
      } else if ((from & 0b00000001n) !== 0n) {
        this.state.castlingRights = this.state.castlingRights & 0b0111;
      } else if ((from & 0b10000000n) !== 0n) {
        this.state.castlingRights = this.state.castlingRights & 0b1011;
      }
    } else {
      if ((from & this.state.blackKing) !== 0n) {
        this.state.castlingRights = this.state.castlingRights & 0b1100;
      } else if ((from & (0b00000001n << 7n)) !== 0n) {
        this.state.castlingRights = this.state.castlingRights & 0b1101;
      } else if ((from & (0b10000000n << 7n)) !== 0n) {
        this.state.castlingRights = this.state.castlingRights & 0b1110;
      }
    }
  }

  updateEnPassantTarget(): void {
    if (this.state.enPassantTarget !== undefined) {
      this.state.enPassantTarget = undefined;
    }
  }

  updateHalfMoveClock(from: BitBoard, m: MoveMetadata): void {
    if (
      (this.state.turn === 'white'
        ? this.state.whitePawns & from
        : this.state.blackPawns & from) !== 0n ||
      m.isCapture
    ) {
      this.state.halfMoveClock = 0;
    } else {
      this.state.halfMoveClock++;
    }
  }

  updateFullMoveNumber(): void {
    if (this.state.turn === 'black') {
      this.state.fullMoveNumber++;
    }
  }

  toggleTurn(): void {
    this.state.turn = this.state.turn === 'white' ? 'black' : 'white';
  }

  addToMoveHistory(move: EncodedMove): void {
    const encodedFrom: Square = (move >>> 6) & 0b111111;
    const encodedTo: Square = move & 0b111111;
    const promotionPiece: EncodedPromotionPiece = 0b00;
    const capturePiece: EncodedCapturePiece = 0b000;
    const isEnPassantCapture: EncodedIsEnPassantCapture = 0b0;
    const previousCastlingRights: InternalCastlingRights =
      this.state.castlingRights;
    const hasEnPassantTarget: EncodedHasEnPassantTarget =
      this.state.enPassantTarget !== undefined ? 0b1 : 0b0;
    const previousEnPassantTarget: Square =
      this.state.enPassantTarget !== undefined
        ? bitBoardToSquare(this.state.enPassantTarget)
        : 0b000000;
    const previousHalfMoveClock: HalfMoveClock = this.state.halfMoveClock;
    const fullMoveEncoded: FullEncodedMove =
      0n |
      BigInt(encodedTo) |
      (BigInt(encodedFrom) << 6n) |
      (BigInt(promotionPiece) << 12n) |
      (BigInt(capturePiece) << 14n) |
      (BigInt(isEnPassantCapture) << 17n) |
      (BigInt(previousCastlingRights) << 18n) |
      (BigInt(hasEnPassantTarget) << 22n) |
      (BigInt(previousEnPassantTarget) << 23n) |
      (BigInt(previousHalfMoveClock) << 29n);
    this.moveHistory.push(fullMoveEncoded);
  }

  makeMove(move: EncodedMove): void {
    const encodedFrom: Square = getEncodedFromViaEncodedMove(move);
    const [from, to] = encodedMoveToBitBoards(move);
    let t = this.getTurnMetadata();
    const m = this.getMoveMetadata(from, to, t);
    const legalMoves = this.getLegalMoves(encodedFrom);
    if (!legalMoves.includes(move)) {
      throw new Error('Invalid move');
    }
    try {
      this.addToMoveHistory(move);
      t = this.movePiece(t, from, to);
      t = this.capturePiece(t, to, m);
      this.updateCastlingRights(from);
      this.updateEnPassantTarget();
      this.updateHalfMoveClock(from, m);
      this.updateFullMoveNumber();
      this.updatePosition(t);
      this.toggleTurn();
    } catch (err) {
      this.moveHistory.pop();
      throw err;
    }
  }

  undo(): void {
    if (this.moveHistory.length === 0) {
      throw new Error('No history');
    }
    const prevState: FullEncodedMove | undefined = this.moveHistory.pop();
    if (prevState === undefined) {
      throw new Error('No history');
    }
    const encodedTo: Square = Number(prevState & 0b111111n);
    const toBb: BitBoard = squareToBitBoard(encodedTo);
    const encodedFrom: Square = Number((prevState >> 6n) & 0b111111n);
    const fromBb: BitBoard = squareToBitBoard(encodedFrom);
    const encodedPromotionPiece: EncodedPromotionPiece = Number(
      (prevState >> 12n) & 0b11n
    );
    const encodedCapturePiece: EncodedCapturePiece = Number(
      (prevState >> 14n) & 0b111n
    );
    const encodedIsEnPassantCapture: EncodedIsEnPassantCapture = Number(
      (prevState >> 17n) & 0b1n
    );
    const previousCastlingRights: InternalCastlingRights = Number(
      (prevState >> 18n) & 0b1111n
    );
    const encodedHasEnPassantTarget: EncodedHasEnPassantTarget = Number(
      (prevState >> 22n) & 0b1n
    );
    const encodedEnPassantTarget: Square = Number(
      (prevState >> 23n) & 0b111111n
    );
    const previousHalfMoveClock: HalfMoveClock = Number(
      (prevState >> 29n) & 0b11111111n
    );
    let isCapture: boolean = false;
    if (this.state.turn === 'white') {
      if ((this.state.blackPawns & toBb) !== 0n) {
        this.state.blackPawns = (this.state.blackPawns & ~toBb) | fromBb;
      } else if ((this.state.blackRooks & toBb) !== 0n) {
        this.state.blackRooks = (this.state.blackRooks & ~toBb) | fromBb;
      } else if ((this.state.blackKnights & toBb) !== 0n) {
        this.state.blackKnights = (this.state.blackKnights & ~toBb) | fromBb;
      } else if ((this.state.blackBishops & toBb) !== 0n) {
        this.state.blackBishops = (this.state.blackBishops & ~toBb) | fromBb;
      } else if ((this.state.blackQueens & toBb) !== 0n) {
        this.state.blackQueens = (this.state.blackQueens & ~toBb) | fromBb;
      } else if ((this.state.blackKing & toBb) !== 0n) {
        this.state.blackKing = (this.state.blackKing & ~toBb) | fromBb;
      } else {
        throw new Error('Could not identify the moved piece 1');
      }
      if (encodedCapturePiece !== 0b000) {
        if (encodedCapturePiece === 0b001) {
          this.state.whitePawns = this.state.whitePawns | toBb;
        } else if (encodedCapturePiece === 0b010) {
          this.state.whiteRooks = this.state.whiteRooks | toBb;
        } else if (encodedCapturePiece === 0b011) {
          this.state.whiteKnights = this.state.whiteKnights | toBb;
        } else if (encodedCapturePiece === 0b100) {
          this.state.whiteBishops = this.state.whiteBishops | toBb;
        } else if (encodedCapturePiece === 0b101) {
          this.state.whiteQueens = this.state.whiteQueens | toBb;
        } else if (encodedCapturePiece === 0b110) {
          this.state.whiteKing = this.state.whiteKing | toBb;
        } else {
          throw new Error('Invalid piece captured');
        }
      }
    } else {
      if ((this.state.whitePawns & toBb) !== 0n) {
        this.state.whitePawns = (this.state.whitePawns & ~toBb) | fromBb;
      } else if ((this.state.whiteRooks & toBb) !== 0n) {
        this.state.whiteRooks = (this.state.whiteRooks & ~toBb) | fromBb;
      } else if ((this.state.whiteKnights & toBb) !== 0n) {
        this.state.whiteKnights = (this.state.whiteKnights & ~toBb) | fromBb;
      } else if ((this.state.whiteBishops & toBb) !== 0n) {
        this.state.whiteBishops = (this.state.whiteBishops & ~toBb) | fromBb;
      } else if ((this.state.whiteQueens & toBb) !== 0n) {
        this.state.whiteQueens = (this.state.whiteQueens & ~toBb) | fromBb;
      } else if ((this.state.whiteKing & toBb) !== 0n) {
        this.state.whiteKing = (this.state.whiteKing & ~toBb) | fromBb;
      } else {
        throw new Error('Could not identify the moved piece 2');
      }
      if (encodedCapturePiece !== 0b000) {
        if (encodedCapturePiece === 0b001) {
          this.state.blackPawns = this.state.blackPawns | toBb;
        } else if (encodedCapturePiece === 0b010) {
          this.state.blackRooks = this.state.blackRooks | toBb;
        } else if (encodedCapturePiece === 0b011) {
          this.state.blackKnights = this.state.blackKnights | toBb;
        } else if (encodedCapturePiece === 0b100) {
          this.state.blackBishops = this.state.blackBishops | toBb;
        } else if (encodedCapturePiece === 0b101) {
          this.state.blackQueens = this.state.blackQueens | toBb;
        } else if (encodedCapturePiece === 0b110) {
          this.state.blackKing = this.state.blackKing | toBb;
        } else {
          throw new Error('Invalid piece captured');
        }
      }
    }
    this.state.castlingRights = previousCastlingRights;
    if (encodedHasEnPassantTarget === 0b1) {
      this.state.enPassantTarget = squareToBitBoard(encodedEnPassantTarget);
    }
    this.state.halfMoveClock = previousHalfMoveClock;
    if (this.state.turn === 'white') {
      this.state.fullMoveNumber--;
    }
    this.toggleTurn();
  }

  getFen(): FenString {
    let fen = '';
    for (let rank = 7; rank >= 0; rank--) {
      let emptyCount = 0;
      for (let file = 7; file >= 0; file--) {
        let currPiece = '';
        let mask = 1n << BigInt(rank * 8 + file);
        if ((this.state.whitePawns & mask) !== 0n) {
          currPiece = 'P';
        } else if ((this.state.whiteRooks & mask) !== 0n) {
          currPiece = 'R';
        } else if ((this.state.whiteKnights & mask) !== 0n) {
          currPiece = 'N';
        } else if ((this.state.whiteBishops & mask) !== 0n) {
          currPiece = 'B';
        } else if ((this.state.whiteQueens & mask) !== 0n) {
          currPiece = 'Q';
        } else if ((this.state.whiteKing & mask) !== 0n) {
          currPiece = 'K';
        } else if ((this.state.blackPawns & mask) !== 0n) {
          currPiece = 'p';
        } else if ((this.state.blackRooks & mask) !== 0n) {
          currPiece = 'r';
        } else if ((this.state.blackKnights & mask) !== 0n) {
          currPiece = 'n';
        } else if ((this.state.blackBishops & mask) !== 0n) {
          currPiece = 'b';
        } else if ((this.state.blackQueens & mask) !== 0n) {
          currPiece = 'q';
        } else if ((this.state.blackKing & mask) !== 0n) {
          currPiece = 'k';
        }
        if (currPiece === '') {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            fen += `${emptyCount}`;
          }
          fen += currPiece;
          emptyCount = 0;
        }
      }
      if (emptyCount > 0) {
        fen += `${emptyCount}`;
      }
      fen += '/';
    }
    return fen.slice(0, -1);
  }
}
