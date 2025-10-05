#!/bin/bash

# Restore Script for Notion Blog
# Restores from a previous backup

set -e

if [ $# -eq 0 ]; then
    echo "❌ Error: Backup timestamp required"
    echo "Usage: $0 <backup_timestamp>"
    echo "Example: $0 20241005_143022"
    echo ""
    echo "Available backups:"
    ls -1 backup/ | grep "backup_" | sed 's/backup_//' | sort -r
    exit 1
fi

BACKUP_TIMESTAMP=$1
BACKUP_DIR="backup/backup_$BACKUP_TIMESTAMP"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Error: Backup directory not found: $BACKUP_DIR"
    echo "Available backups:"
    ls -1 backup/ | grep "backup_" | sed 's/backup_//' | sort -r
    exit 1
fi

echo "🔄 Restoring Notion Blog from backup..."
echo "📂 From: $BACKUP_DIR"
echo "⚠️  Warning: This will overwrite current configuration files!"
echo ""
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restore cancelled by user"
    exit 1
fi

# Restore environment variables
if [ -f "$BACKUP_DIR/environment/.env.backup" ]; then
    echo "📋 Restoring environment variables..."
    cp "$BACKUP_DIR/environment/.env.backup" .env
else
    echo "⚠️  Warning: Environment backup not found"
fi

# Restore configuration files
echo "⚙️  Restoring configuration files..."
[ -f "$BACKUP_DIR/config/client.ts" ] && cp "$BACKUP_DIR/config/client.ts" src/lib/notion/
[ -f "$BACKUP_DIR/config/server-constants.js" ] && cp "$BACKUP_DIR/config/server-constants.js" src/lib/notion/
[ -f "$BACKUP_DIR/config/next.config.js" ] && cp "$BACKUP_DIR/config/next.config.js" .
[ -f "$BACKUP_DIR/config/tsconfig.json" ] && cp "$BACKUP_DIR/config/tsconfig.json" .
[ -f "$BACKUP_DIR/config/package.json" ] && cp "$BACKUP_DIR/config/package.json" .

# Restore cache files
echo "💾 Restoring cache files..."
[ -f "$BACKUP_DIR/cache/.blog_index_data" ] && cp "$BACKUP_DIR/cache/.blog_index_data" .
[ -f "$BACKUP_DIR/cache/.blog_index_data_previews" ] && cp "$BACKUP_DIR/cache/.blog_index_data_previews" .

# Switch to backup git branch if it exists
BACKUP_BRANCH="backup/notion-sdk-v0.4.4_$BACKUP_TIMESTAMP"
if git show-ref --verify --quiet "refs/heads/$BACKUP_BRANCH"; then
    echo "🌿 Switching to backup git branch: $BACKUP_BRANCH"
    git checkout "$BACKUP_BRANCH"
else
    echo "ℹ️  Backup branch not found, staying on current branch"
fi

# Reinstall dependencies if package.json was restored
if [ -f "$BACKUP_DIR/config/package.json" ]; then
    echo "📦 Reinstalling dependencies..."
    npm install
fi

echo "✅ Restore completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Test the restore: npm run build && npm start"
echo "2. Verify all functionality works as expected"
echo "3. Check the backup report: $BACKUP_DIR/backup_report.txt"