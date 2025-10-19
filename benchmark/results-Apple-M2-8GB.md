# jsrand Performance Benchmarks

## System Information

- **Date**: 10/19/2025, 3:10:22 PM
- **Platform**: darwin (arm64)
- **CPU**: Apple M2 (8 cores)
- **Memory**: 8.00 GB
- **Node.js**: v23.11.0

## Basic Operations

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| random() | 1,000,000 | 3.04 ms | 366,947,415 |
| inRange(0, 100) | 1,000,000 | 6.00 ms | 168,353,060 |
| intInRange(0, 100) | 1,000,000 | 4.74 ms | 212,569,537 |

## Array Operations

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| choice(100 items) | 1,000,000 | 5.47 ms | 183,022,843 |
| choices(100 items, k=10) | 100,000 | 3.48 ms | 29,222,259 |
| sample(100 items, k=10) | 100,000 | 36.65 ms | 2,728,837 |
| shuffle(100 items) | 100,000 | 40.57 ms | 2,468,216 |

## Weighted Choice

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| weightedChoice(100 items) | 1,000,000 | 160.49 ms | 6,231,248 |

## Statistical Distributions

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| gaussian() | 1,000,000 | 32.24 ms | 31,020,212 |
| gaussian(100, 15) | 1,000,000 | 32.52 ms | 30,751,928 |
| exponential(1) | 1,000,000 | 15.19 ms | 65,855,724 |
| poisson(5) | 100,000 | 3.44 ms | 29,164,808 |

## State Operations

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| getState() | 1,000,000 | 6.57 ms | 152,204,081 |
| setState() | 1,000,000 | 3.37 ms | 296,747,863 |

## Comparison with Math.random()

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| Srand.random() | 1,000,000 | 5.37 ms | 186,335,533 |
| Math.random() | 1,000,000 | 7.38 ms | 135,511,236 |

**Performance Ratio**: Srand.random() is 137.5% the speed of Math.random()

