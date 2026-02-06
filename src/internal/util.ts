import type { BitBoard } from './types';

export function* iterBits(bb: BitBoard): Generator<BitBoard> {
  while (bb !== 0n) {
    const lsb: BitBoard = bb & -bb;
    yield lsb;
    bb &= ~lsb;
  }
}
