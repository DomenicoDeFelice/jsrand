/*!
 * jsrand - Performance Benchmarks
 *
 * Copyright (c) 2014-2025 Domenico De Felice
 * Released under the MIT License
 */

'use strict';

const Srand = require('../dist/jsrand.js');
const os = require('os');
const fs = require('fs');
const path = require('path');

function getMachineInfo() {
  const cpus = os.cpus();
  return {
    platform: os.platform(),
    arch: os.arch(),
    cpuModel: cpus[0]?.model || 'Unknown',
    cpuCores: cpus.length,
    nodeVersion: process.version,
    totalMemory: (os.totalmem() / (1024 ** 3)).toFixed(2) + ' GB',
    timestamp: new Date().toISOString()
  };
}

let markdownOutput = '';

function addToOutput(text) {
  console.log(text);
  markdownOutput += text + '\n';
}

// Benchmark runner - runs multiple times with different seeds and averages results
function benchmark(name, fn, iterations = 1000000, runs = 5, reseedFn = null) {
  const results = [];

  for (let run = 0; run < runs; run++) {
    // Reseed with a different seed for each run to avoid seed-dependent performance
    if (reseedFn) {
      const randomSeed = 12345 + run * 1000 + Math.floor(Math.random() * 1000);
      reseedFn(randomSeed);
    }

    // Warm up
    for (let i = 0; i < 1000; i++) fn();

    const start = process.hrtime.bigint();
    for (let i = 0; i < iterations; i++) {
      fn();
    }
    const end = process.hrtime.bigint();

    const durationMs = Number(end - start) / 1000000;
    const opsPerSec = (iterations / durationMs) * 1000;

    results.push({ durationMs, opsPerSec });
  }

  // Calculate averages
  const avgDurationMs = results.reduce((sum, r) => sum + r.durationMs, 0) / runs;
  const avgOpsPerSec = results.reduce((sum, r) => sum + r.opsPerSec, 0) / runs;

  return {
    name,
    iterations,
    durationMs: avgDurationMs,
    opsPerSec: avgOpsPerSec
  };
}

// Format benchmark results as Markdown table rows
function formatBenchmarkRow(result) {
  const opsPerSecFormatted = result.opsPerSec.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const iterationsFormatted = result.iterations.toLocaleString();
  const durationFormatted = result.durationMs.toFixed(2);
  return `| ${result.name} | ${iterationsFormatted} | ${durationFormatted} ms | ${opsPerSecFormatted} |`;
}

function runBenchmarks() {
  const machineInfo = getMachineInfo();

  addToOutput('# jsrand Performance Benchmarks\n');

  addToOutput('## System Information\n');
  addToOutput(`- **Date**: ${new Date(machineInfo.timestamp).toLocaleString()}`);
  addToOutput(`- **Platform**: ${machineInfo.platform} (${machineInfo.arch})`);
  addToOutput(`- **CPU**: ${machineInfo.cpuModel} (${machineInfo.cpuCores} cores)`);
  addToOutput(`- **Memory**: ${machineInfo.totalMemory}`);
  addToOutput(`- **Node.js**: ${machineInfo.nodeVersion}\n`);

  const rnd = new Srand(12345);
  const reseed = (seed) => rnd.seed(seed);
  const arr100 = Array.from({ length: 100 }, (_, i) => i);
  const weights100 = new Array(100).fill(1);

  addToOutput('## Basic Operations\n');
  addToOutput('| Operation | Iterations | Duration | Ops/sec |');
  addToOutput('|-----------|------------|----------|---------|');
  addToOutput(formatBenchmarkRow(benchmark('random()', () => rnd.random(), 1000000, 5, reseed)));
  addToOutput(formatBenchmarkRow(benchmark('inRange(0, 100)', () => rnd.inRange(0, 100), 1000000, 5, reseed)));
  addToOutput(formatBenchmarkRow(benchmark('intInRange(0, 100)', () => rnd.intInRange(0, 100), 1000000, 5, reseed)));
  addToOutput('');

  addToOutput('## Array Operations\n');
  addToOutput('| Operation | Iterations | Duration | Ops/sec |');
  addToOutput('|-----------|------------|----------|---------|');
  addToOutput(formatBenchmarkRow(benchmark('choice(100 items)', () => rnd.choice(arr100), 1000000, 5, reseed)));
  addToOutput(formatBenchmarkRow(benchmark('choices(100 items, k=10)', () => rnd.choices(arr100, 10), 100000, 5, reseed)));
  addToOutput(formatBenchmarkRow(benchmark('sample(100 items, k=10)', () => rnd.sample(arr100, 10), 100000, 5, reseed)));
  addToOutput(formatBenchmarkRow(benchmark('shuffle(100 items)', () => rnd.shuffle([...arr100]), 100000, 5, reseed)));
  addToOutput('');

  addToOutput('## Weighted Choice\n');
  addToOutput('| Operation | Iterations | Duration | Ops/sec |');
  addToOutput('|-----------|------------|----------|---------|');
  addToOutput(formatBenchmarkRow(benchmark('weightedChoice(100 items)', () => rnd.weightedChoice(arr100, weights100), 1000000, 5, reseed)));
  addToOutput('');

  addToOutput('## Statistical Distributions\n');
  addToOutput('| Operation | Iterations | Duration | Ops/sec |');
  addToOutput('|-----------|------------|----------|---------|');
  addToOutput(formatBenchmarkRow(benchmark('gaussian()', () => rnd.gaussian(), 1000000, 5, reseed)));
  addToOutput(formatBenchmarkRow(benchmark('gaussian(100, 15)', () => rnd.gaussian(100, 15), 1000000, 5, reseed)));
  addToOutput(formatBenchmarkRow(benchmark('exponential(1)', () => rnd.exponential(1), 1000000, 5, reseed)));
  addToOutput(formatBenchmarkRow(benchmark('poisson(5)', () => rnd.poisson(5), 100000, 5, reseed)));
  addToOutput('');

  addToOutput('## State Operations\n');
  addToOutput('| Operation | Iterations | Duration | Ops/sec |');
  addToOutput('|-----------|------------|----------|---------|');
  addToOutput(formatBenchmarkRow(benchmark('getState()', () => rnd.getState(), 1000000, 5, reseed)));
  const state = rnd.getState();
  addToOutput(formatBenchmarkRow(benchmark('setState()', () => rnd.setState(state), 1000000, 5, reseed)));
  addToOutput('');

  addToOutput('## Comparison with Math.random()\n');
  addToOutput('| Operation | Iterations | Duration | Ops/sec |');
  addToOutput('|-----------|------------|----------|---------|');
  const srandResult = benchmark('Srand.random()', () => rnd.random(), 1000000, 5, reseed);
  addToOutput(formatBenchmarkRow(srandResult));
  const mathResult = benchmark('Math.random()', () => Math.random(), 1000000, 5);
  addToOutput(formatBenchmarkRow(mathResult));
  addToOutput('');

  const ratio = (srandResult.opsPerSec / mathResult.opsPerSec * 100).toFixed(1);
  addToOutput(`**Performance Ratio**: Srand.random() is ${ratio}% the speed of Math.random()\n`);

  // Write results to file
  const outputPath = path.join(__dirname, 'results.md');
  fs.writeFileSync(outputPath, markdownOutput, 'utf8');
  console.log(`\nResults written to: ${outputPath}`);
}

runBenchmarks();
