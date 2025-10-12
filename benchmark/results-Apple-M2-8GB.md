# jsrand Performance Benchmarks

## System Information

- **Date**: 10/12/2025, 2:15:31 PM
- **Platform**: darwin (arm64)
- **CPU**: Apple M2 (8 cores)
- **Memory**: 8.00 GB
- **Node.js**: v23.11.0

## Basic Operations

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| random() | 1,000,000 | 2.93 ms | 341,156,274 |
| inRange(0, 100) | 1,000,000 | 6.51 ms | 153,573,478 |
| intInRange(0, 100) | 1,000,000 | 4.91 ms | 203,653,876 |

## Array Operations

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| choice(100 items) | 1,000,000 | 5.57 ms | 179,417,800 |
| choices(100 items, k=10) | 100,000 | 4.13 ms | 24,239,727 |
| sample(100 items, k=10) | 100,000 | 39.06 ms | 2,560,404 |
| shuffle(100 items) | 100,000 | 43.38 ms | 2,305,097 |

## Weighted Choice

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| weightedChoice(100 items) | 1,000,000 | 158.38 ms | 6,313,733 |

## Statistical Distributions

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| gaussian() | 1,000,000 | 32.51 ms | 30,762,171 |
| gaussian(100, 15) | 1,000,000 | 32.44 ms | 30,822,815 |
| exponential(1) | 1,000,000 | 15.27 ms | 65,484,668 |
| poisson(5) | 100,000 | 3.68 ms | 27,156,387 |

## State Operations

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| getState() | 1,000,000 | 6.72 ms | 148,744,050 |
| setState() | 1,000,000 | 3.79 ms | 264,099,060 |

## Comparison with Math.random()

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| Srand.random() | 1,000,000 | 5.55 ms | 180,272,200 |
| Math.random() | 1,000,000 | 7.42 ms | 134,770,889 |

**Performance Ratio**: Srand.random() is 133.8% the speed of Math.random()

