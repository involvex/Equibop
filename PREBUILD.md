# Pre-Build Verification

Equibop includes automatic pre-build verification to ensure code quality before building.

## What Gets Checked

The pre-build process runs three verification steps:

1. **Format Check** - Verifies code formatting with Prettier
2. **Linting** - Runs ESLint to check code quality and style
3. **Type Checking** - Runs TypeScript compiler to verify type safety

## Available Scripts

### Build Scripts
- `bun run build` - Runs pre-build checks then builds the project
- `bun run build:dev` - Builds in development mode
- `bun run prebuild` - Runs only the pre-build verification checks

### Quality Scripts
- `bun run test` - Runs all quality checks (format + lint + types)
- `bun run format` - Formats code with Prettier
- `bun run format:check` - Checks formatting without fixing
- `bun run lint` - Runs ESLint
- `bun run lint:fix` - Runs ESLint with auto-fix
- `bun run testTypes` - Runs TypeScript type checking

## How It Works

When you run `bun run build`, the following happens automatically:

1. Pre-build checks run (`prebuild` script)
2. If all checks pass, the build proceeds
3. If any check fails, the build is aborted

This ensures that only properly formatted, linted, and type-safe code gets built.

## Fixing Issues

If pre-build checks fail:

1. **Format issues**: Run `bun run format` to fix automatically
2. **Lint issues**: Run `bun run lint:fix` to auto-fix, or fix manually
3. **Type errors**: Fix TypeScript errors manually based on the output

## Skipping Checks (Not Recommended)

If you need to skip pre-build checks (not recommended for production builds):

```bash
# Build directly without pre-build checks
bun run scripts/build/build.mts
```

## CI/CD Integration

The pre-build checks are designed to work seamlessly with CI/CD pipelines:

```bash
# In CI/CD, just run the test script
bun run test
```

This ensures all code quality checks pass before merging or deploying.