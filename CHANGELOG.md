# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-16

### Added

- Vite-based build pipeline with UMD (`dist/index.js`) and ESM (`dist/index.mjs`) outputs.
- Vitest test suite with happy-dom.
- `exports` map and `dist/` publish layout.
- Local example server via `npm run examples`.

### Changed

- Modernized codebase for evergreen browsers only.
- TypeScript types renamed from `configureOptions` to `ConfigureOptions`.
- Published artifacts moved from package root to `dist/`.

### Removed

- IE9–11 and legacy vendor-prefix fallbacks.
- `positionUsing` configuration option.
- Rollup build toolchain.

[1.0.0]: https://github.com/AkatQuas/nprogresse/compare/v0.2.6...v1.0.0
