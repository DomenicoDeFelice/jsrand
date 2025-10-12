# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2025-10-12

### ⚠️ BREAKING CHANGES
- **`sample()` behavior change**: `sample(arr, k)` now returns shuffled results when `k === arr.length`
  - **Previous behavior**: Returned elements in original array order
  - **New behavior**: Returns elements in random order (properly shuffled)
  - **Migration**: If you need the old behavior, use `[...arr]` instead of `sample(arr, arr.length)`
  - **Why**: The previous behavior was a bug. Sampling should always return random order
  - **Thanks**: Bug reported by [@xanatos](https://github.com/xanatos) (Massimiliano Alberti)

### Added
- **Weighted random choice**: New `weightedChoice(arr, weights)` method for probability-weighted selection
  - Useful for loot drops, procedural generation, and Monte Carlo simulations
  - Weights are automatically normalized
- **Statistical distributions**: New distribution methods for advanced use cases:
  - `gaussian(mean, stddev)` - Normal/Gaussian distribution using Box-Muller transform
  - `exponential(lambda)` - Exponential distribution for modeling time between events
  - `poisson(lambda)` - Poisson distribution for modeling event counts
- **Performance benchmarks**: Added benchmark script (`npm run benchmark`)

### Changed
- Updated TypeScript definitions to include new methods
- Updated `README.md` documentation with new methods
- Removed code duplication with a better setup for Babel

### Tests
- Added tests for all new methods, verifying both correctness and statistical properties

## [2.1.0] - 2025-10-11

### Added
- **TypeScript support**: Added TypeScript definitions (`dist/jsrand.d.ts`)
- **ES Module support**: Added ESM build (`dist/jsrand.esm.js`)
- **Coverage reporting**: Added c8 for test coverage reporting (script `test:coverage`)
- **GitHub Actions CI**: Migrated from Travis CI to GitHub Actions
- **Coverage integration**: Integrated Codecov for automated coverage reporting

