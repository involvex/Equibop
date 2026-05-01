# Equibop

Electron-based Discord desktop app fork of Vesktop.

## Package Manager

Use **Bun** (required: `>=1.3.0`). Do not use npm/yarn/pnpm.

## Key Commands

| Command | Description |
|---------|-------------|
| `bun install` | Install dependencies |
| `bun start` | Build and run (development) |
| `bun build` | Production build |
| `bun build:dev` | Development build |
| `bun lint` | ESLint |
| `bun lint:fix` | ESLint with auto-fix |
| `bun test` | Lint + typecheck |
| `bun testTypes` | `tsc --noEmit` |
| `bun package` | Build and package for distribution |
| `bun buildLibVesktop` | Build native libvesktop (Linux only) |

## CI Verification

```bash
bun run test        # lint + typecheck
bun run build       # production build
bun run build --dev # development build
```

## Monorepo

- `packages/libvesktop/` - Native C++ addon for Linux D-Bus events
  - Requires: `build-essential python3 libglib2.0-dev` (Debian/Ubuntu)
  - Build: `bun buildLibVesktop` (Linux only; Windows/macOS use prebuilt binaries)
  - Note: `binding.gyp` is renamed to `binding.gyp.bak` to prevent auto-build on non-Linux

## Code Style

- Prettier: 4 spaces, semi, printWidth 120, LF
- ESLint: React 19, `importSort/imports`, `prettier/prettier`
- Source files require header format (enforced via `simpleHeader` rule)

## Build Output

- `bun build` → `dist/js/`
- `bun package` → `dist/` (platform packages)