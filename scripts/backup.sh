#!/bin/bash

# Backup Script for Notion Blog
# Creates backups before major upgrades

set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backup/backup_$DATE"
CONFIG_DIR="$BACKUP_DIR/config"
ENV_DIR="$BACKUP_DIR/environment"
CACHE_DIR="$BACKUP_DIR/cache"

echo "🔄 Creating backup for Notion Blog..."
echo "📁 Backup directory: $BACKUP_DIR"

# Create backup directories
mkdir -p "$CONFIG_DIR" "$ENV_DIR" "$CACHE_DIR"

# Backup environment variables
if [ -f ".env" ]; then
    echo "📋 Backing up environment variables..."
    cp .env "$ENV_DIR/.env.backup"
else
    echo "⚠️  Warning: .env file not found"
fi

# Backup configuration files
echo "⚙️  Backing up configuration files..."
cp src/lib/notion/client.ts "$CONFIG_DIR/" 2>/dev/null || echo "⚠️  Warning: client.ts not found"
cp src/lib/notion/server-constants.js "$CONFIG_DIR/" 2>/dev/null || echo "⚠️  Warning: server-constants.js not found"
cp next.config.js "$CONFIG_DIR/" 2>/dev/null || echo "⚠️  Warning: next.config.js not found"
cp tsconfig.json "$CONFIG_DIR/" 2>/dev/null || echo "⚠️  Warning: tsconfig.json not found"
cp package.json "$CONFIG_DIR/" 2>/dev/null || echo "⚠️  Warning: package.json not found"

# Backup cache files if they exist
echo "💾 Backing up cache files..."
cp .blog_index_data "$CACHE_DIR/" 2>/dev/null || echo "ℹ️  No cache file to backup"
cp .blog_index_data_previews "$CACHE_DIR/" 2>/dev/null || echo "ℹ️  No preview cache file to backup"

# Create git backup branch
echo "🌿 Creating git backup branch..."
git checkout -b "backup/notion-sdk-v0.4.4_$DATE" 2>/dev/null || echo "ℹ️  Branch might already exist"

# Generate backup report
echo "📊 Generating backup report..."
cat > "$BACKUP_DIR/backup_report.txt" << EOF
Backup Report - Notion Blog
=============================
Date: $(date)
Backup Directory: $BACKUP_DIR
Git Branch: $(git branch --show-current)
Git Commit: $(git rev-parse HEAD)

Files Backed Up:
--------------
- Environment variables: $([ -f "$ENV_DIR/.env.backup" ] && echo "✅" || echo "❌")
- Notion client: $([ -f "$CONFIG_DIR/client.ts" ] && echo "✅" || echo "❌")
- Server constants: $([ -f "$CONFIG_DIR/server-constants.js" ] && echo "✅" || echo "❌")
- Next.js config: $([ -f "$CONFIG_DIR/next.config.js" ] && echo "✅" || echo "❌")
- TypeScript config: $([ -f "$CONFIG_DIR/tsconfig.json" ] && echo "✅" || echo "❌")
- Package.json: $([ -f "$CONFIG_DIR/package.json" ] && echo "✅" || echo "❌")
- Cache files: $([ -f "$CACHE_DIR/.blog_index_data" ] && echo "✅" || echo "❌")

Next Steps:
-----------
1. Test current functionality: npm run build && npm start
2. Review backed up files in $BACKUP_DIR
3. Proceed with upgrade according to BACKUP_STRATEGY.md
4. Use restore script if needed: ./scripts/restore.sh $DATE

EOF

echo "✅ Backup completed successfully!"
echo "📂 Backup location: $BACKUP_DIR"
echo "📄 View backup report: $BACKUP_DIR/backup_report.txt"
echo ""
echo "🔄 To restore this backup later, run:"
echo "   ./scripts/restore.sh $DATE"