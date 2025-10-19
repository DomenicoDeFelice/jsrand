# jsrand Performance Benchmarks

## System Information

- **Date**: 10/19/2025, 3:55:23 PM
- **Platform**: darwin (arm64)
- **CPU**: Apple M2 (8 cores)
- **Memory**: 8.00 GB
- **Node.js**: v23.11.0

## Basic Operations

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| random() | 1,000,000 | 3.06 ms | 362,856,510 |
| inRange(0, 100) | 1,000,000 | 6.21 ms | 162,979,910 |
| intInRange(0, 100) | 1,000,000 | 4.71 ms | 214,058,302 |

## Array Operations

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| choice(100 items) | 1,000,000 | 5.52 ms | 181,446,367 |
| choices(100 items, k=10) | 100,000 | 3.43 ms | 29,440,743 |
| sample(100 items, k=10) | 100,000 | 36.88 ms | 2,711,907 |
| shuffle(100 items) | 100,000 | 40.81 ms | 2,453,472 |

## Weighted Choice

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| weightedChoice(100 items) | 1,000,000 | 162.31 ms | 6,161,809 |

## Statistical Distributions

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| gaussian() | 1,000,000 | 32.53 ms | 30,747,568 |
| gaussian(100, 15) | 1,000,000 | 32.28 ms | 30,978,115 |
| exponential(1) | 1,000,000 | 15.22 ms | 65,704,015 |
| poisson(5) | 100,000 | 3.42 ms | 29,362,589 |

## State Operations

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| getState() | 1,000,000 | 6.52 ms | 153,473,925 |
| setState() | 1,000,000 | 3.45 ms | 290,144,668 |

## Comparison with Math.random()

| Operation | Iterations | Duration | Ops/sec |
|-----------|------------|----------|---------|
| Srand.random() | 1,000,000 | 5.29 ms | 189,045,454 |
| Math.random() | 1,000,000 | 7.39 ms | 135,459,673 |

**Performance Ratio**: Srand.random() is 139.6% the speed of Math.random()

