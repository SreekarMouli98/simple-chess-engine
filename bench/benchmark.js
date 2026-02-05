'use strict';

const Game = require('../index');

const args = process.argv.slice(2);
const config = {
  iterations: getArgNumber(args, '--iterations', 20000),
  warmup: getArgNumber(args, '--warmup', 2000),
  sampleEvery: getArgNumber(args, '--sample-every', 1),
};

if (config.sampleEvery <= 0) {
  throw new Error('--sample-every must be >= 1');
}

if (!Number.isInteger(config.iterations) || config.iterations <= 0) {
  throw new Error('--iterations must be a positive integer');
}

if (!Number.isInteger(config.warmup) || config.warmup < 0) {
  throw new Error('--warmup must be a non-negative integer');
}

const formatNs = createNumberFormatter();

const shared = {
  game: new Game(),
};

const benchmarks = [
  makeBenchmark('resetGame()', config, () => {
    shared.game.resetGame();
  }),
  makeBenchmark('getPossibleMoves(B1) [initial]', config, () => {
    shared.game.getPossibleMoves('B1');
  }),
  makeBenchmark('getPossibleMoves(E2) [initial]', config, () => {
    shared.game.getPossibleMoves('E2');
  }),
  makeBenchmark('getBoard()', config, () => {
    shared.game.getBoard();
  }),
  makeBenchmark('makeMove() x8 plies', config, () => {
    shared.game.resetGame();
    runOpeningLine(shared.game);
  }),
];

runAll(benchmarks);

function makeBenchmark(label, cfg, fn) {
  return { label, fn, cfg };
}

function runAll(items) {
  printHeader(items);
  for (const item of items) {
    const result = runBenchmark(item);
    printResult(result);
  }
}

function runBenchmark({ label, fn, cfg }) {
  warmup(fn, cfg.warmup);
  if (global.gc) {
    global.gc();
  }

  const samples = [];
  const iterations = cfg.iterations;
  const sampleEvery = cfg.sampleEvery;

  for (let i = 0; i < iterations; i++) {
    const start = process.hrtime.bigint();
    fn();
    const end = process.hrtime.bigint();
    if (i % sampleEvery === 0) {
      samples.push(Number(end - start));
    }
  }

  samples.sort((a, b) => a - b);

  const total = samples.reduce((acc, value) => acc + value, 0);
  const avg = total / samples.length;
  const min = samples[0];
  const max = samples[samples.length - 1];
  const p50 = percentile(samples, 0.5);
  const p95 = percentile(samples, 0.95);

  return {
    label,
    iterations,
    sampleEvery,
    samples: samples.length,
    min,
    max,
    avg,
    p50,
    p95,
  };
}

function warmup(fn, count) {
  for (let i = 0; i < count; i++) {
    fn();
  }
}

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)));
  return sorted[idx];
}

function printHeader(items) {
  const names = items.map((item) => item.label);
  const title = 'Simple-Chess-Engine Benchmark (nanoseconds)';
  console.log(title);
  console.log('='.repeat(title.length));
  console.log(`Benchmarks: ${names.length}`);
  console.log(
    `Iterations: ${items[0].cfg.iterations} (sample every ${items[0].cfg.sampleEvery})`
  );
  console.log(`Warmup: ${items[0].cfg.warmup}`);
  console.log('Note: run with --expose-gc for more stable numbers.');
  console.log('');
}

function printResult(result) {
  console.log(result.label);
  console.log(`  samples: ${result.samples}`);
  console.log(`  min: ${formatNs(result.min)} ns`);
  console.log(`  p50: ${formatNs(result.p50)} ns`);
  console.log(`  p95: ${formatNs(result.p95)} ns`);
  console.log(`  avg: ${formatNs(Math.round(result.avg))} ns`);
  console.log(`  max: ${formatNs(result.max)} ns`);
  console.log('');
}

function runOpeningLine(game) {
  const moves = [
    ['E2', 'E4'],
    ['E7', 'E5'],
    ['G1', 'F3'],
    ['B8', 'C6'],
    ['F1', 'C4'],
    ['G8', 'F6'],
    ['D2', 'D3'],
    ['F8', 'C5'],
  ];

  for (const [from, to] of moves) {
    const result = game.makeMove(from, to);
    if (!result.success) {
      throw new Error(`Illegal move in benchmark line: ${from}-${to}`);
    }
  }
}

function getArgNumber(list, name, fallback) {
  const index = list.indexOf(name);
  if (index === -1) return fallback;
  const value = Number(list[index + 1]);
  if (!Number.isFinite(value)) {
    throw new Error(`Expected number after ${name}`);
  }
  return value;
}

function createNumberFormatter() {
  const formatter = new Intl.NumberFormat('en-US');
  return (value) => formatter.format(Math.round(value));
}
