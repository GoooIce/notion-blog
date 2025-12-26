# Code Style and Conventions

## ESLint Configuration

- Uses Next.js core web vitals preset with Prettier integration
- Prettier rules enforced as ESLint errors
- Configuration: `.eslintrc.json`

## Prettier Configuration

- Semi-colons: Required
- Quotes: Single quotes
- Trailing commas: ES5 style
- Print width: 80 characters
- Tab width: 2 spaces (no tabs)
- Configuration: `.prettierrc.json`

## TypeScript Configuration

- Strict mode: **DISABLED** (`"strict": false`)
- Target: ES2022
- Module resolution: Bundler
- JSX: Preserve (Next.js handles transformation)
- Path aliases: `@/*` maps to `./src/*`
- Configuration: `tsconfig.json`

## Naming Conventions

- Files: kebab-case for files, PascalCase for React components
- Components: PascalCase (React components)
- Functions: camelCase
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE for global constants

## Code Patterns

- Functional React components with hooks
- TypeScript interfaces for type definitions
- CSS Modules for styling with `.module.css` extension
- Next.js page structure with `getStaticProps` and `getStaticPaths`
- API routes in `pages/api/` directory

## Import Patterns

- Absolute imports using `@/` alias for src directory
- Explicit file extensions for TypeScript files in some cases
- Named exports preferred over default exports for utilities

## Testing Patterns

- Vitest with jsdom environment
- React Testing Library for component testing
- Test setup file: `src/test/setup.ts`
- Tests placed in `src/test/` directory

## Git Workflow

- Pre-commit hooks via Husky
- Lint-staged runs on staged files
- Branch naming: `backup/notion-sdk-vX.X.X_YYYYMMDD_HHMMSS` for backups
