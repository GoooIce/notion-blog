# Suggested Commands

## Development Commands
```bash
# Start development server
npm run dev

# Build for production (includes RSS generation)
npm run build

# Start production server
npm start
```

## Code Quality Commands
```bash
# Format code with Prettier
npm run format

# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Run lint-staged (used by pre-commit hook)
npm run lint-staged
```

## Testing Commands
```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI interface
npm run test:ui
```

## Backup and Restore Commands
```bash
# Create backup using scripts/backup.sh
npm run backup

# Restore from backup using scripts/restore.sh
npm run restore
```

## System Commands (Darwin/macOS)
```bash
# List files with details
ls -la

# Find files by name pattern
find . -name "*.tsx" -type f

# Search for patterns in files
grep -r "pattern" src/

# Git status
git status

# Git diff
git diff

# Git log with details
git log --oneline -10

# Change to specific directory
cd src/lib/notion

# Remove files/directories
rm -rf node_modules

# Create directories
mkdir -p new/directory/path
```

## Useful Project-Specific Commands
```bash
# Clean cache files
rm -f .blog_index_data .blog_index_data_previews

# Check TypeScript compilation
npx tsc --noEmit

# Update dependencies
npm update

# Install specific package
npm install package-name

# Run Node.js script with ts-node
npx ts-node script.ts
```