# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based blog platform that uses Notion as a headless CMS. It's a fork of [ijjk/notion-blog](https://github.com/ijjk/notion-blog) that has been modified to use the official Notion API instead of the internal API. The blog is written in Chinese and supports static generation with incremental revalidation.

## Architecture

### Core Components

- **Next.js Framework**: React-based framework with SSG (Static Site Generation) and ISR (Incremental Static Revalidation)
- **Notion Integration**: Uses `@notionhq/client` to fetch content from a Notion database
- **Content Rendering**: Custom renderers for different Notion block types (text, headings, code, images, etc.)
- **TypeScript**: Partial TypeScript adoption (some files remain .js)

### Key Directories

- `src/pages/`: Next.js pages and API routes
- `src/components/`: React components for rendering Notion content
- `src/lib/notion/`: Notion API client and utilities
- `src/styles/`: CSS modules for styling

### Content Flow

1. Blog posts are stored as pages in a Notion database
2. `getPostsInfos()` fetches metadata for all published posts
3. `getPageData()` retrieves full content for individual posts
4. Content is rendered using custom components that handle different Notion block types
5. Images and assets are proxied through `/api/asset` endpoint

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (includes RSS generation)
npm run build

# Start production server
npm start

# Testing
npm run test              # Run tests in watch mode
npm run test:run          # Run tests once
npm run test:ui           # Run tests with UI interface

# Code quality
npm run format            # Format code with Prettier
npm run lint              # Run ESLint
npm run lint:fix          # Fix ESLint issues automatically
npm run lint-staged       # Run lint-staged (used by pre-commit hook)

# Backup and restore (for Notion SDK upgrades)
npm run backup            # Create backup using scripts/backup.sh
npm run restore           # Restore from backup using scripts/restore.sh
```

## Environment Configuration

Required environment variables (create `.env` file):

- `NOTION_TOKEN`: Notion API integration token
- `BLOG_INDEX_ID`: Notion database ID (32-character string, auto-formatted to UUID format)

## Key Files and Their Purpose

### Core Configuration

- `next.config.js`: Next.js configuration with Notion validation and RSS build setup
- `tsconfig.json`: TypeScript configuration (strict mode disabled)
- `lint-staged.config.js`: Pre-commit formatting configuration

### Notion Integration (`src/lib/notion/`)

**Core Architecture:**
- `client.ts`: Main Notion API client with `getPostsInfos()` and `getPageData()` functions
- `server-constants.js`: Environment variable handling and 32-char to UUID ID normalization
- `renderers.ts`: Text rendering utilities for Notion rich text content with formatting
- `utils.ts`: Shared utilities for API handling and error management

**API Flow:**
1. `getPostsInfos()` fetches metadata for all published posts from the Notion database
2. `getPageData()` retrieves full content including blocks for individual posts
3. Rich text is processed through renderers to handle formatting, links, and mentions
4. Blocks are mapped to React components for rendering

### Pages

- `src/pages/index.tsx`: Homepage with blog introduction
- `src/pages/blog/[slug].tsx`: Dynamic blog post pages with SSG
- `src/pages/blog/index.tsx`: Blog listing page
- `src/pages/api/asset.ts`: Asset proxy for Notion images/files

### Components

- Components handle different Notion block types (heading, code, images, etc.)
- Located in `src/components/` with subdirectories for SVG icons

## Development Notes

### Build Process

- Uses Next.js SSG with `getStaticProps()` and `getStaticPaths()`
- RSS feed is generated during build via `build-rss.ts`
- Cache files (`.blog_index_data`, `.blog_index_data_previews`) are cleaned on each build

### Content Rendering Architecture

- **Notion Block Rendering**: Uses a large switch statement in `src/pages/blog/[slug].tsx` to handle different Notion block types
- **Code Highlighting**: Prism.js with custom language support
- **Math Equations**: KaTeX for mathematical expressions
- **Dynamic Code**: LiveScript evaluation via `react-jsx-parser`
- **Asset Proxying**: `/api/asset.ts` proxies Notion images and files to handle CORS and caching

### Critical Build Configuration

- **RSS Generation**: Automatically generated during build via `src/lib/build-rss.ts`
- **Cache Management**: Cache files (`.blog_index_data`, `.blog_index_data_previews`) are cleaned each build
- **Environment Validation**: `next.config.js` validates required environment variables before starting
- **Webpack Modifications**: Custom entry point for RSS generation in production builds

### Known Limitations

- Some Notion block types are commented out or not fully implemented
- TypeScript is not strictly enforced (strict mode disabled)
- Some legacy code from the original fork remains

## Testing and Deployment

### Testing Setup

The project uses **Vitest** for testing with React Testing Library:

- Test configuration in `vitest.config.ts`
- Test setup file: `src/test/setup.ts` (includes mocks for Next.js router, image, and environment variables)
- Tests should be placed in `src/test/` directory
- Uses jsdom environment for DOM testing

### Code Quality

- **ESLint** with Next.js and Prettier configurations
- **Prettier** for code formatting with pre-commit hooks via Husky
- **lint-staged** for running linters on staged files
- Configuration files: `.eslintrc.json`, `prettier.config.js`, `lint-staged.config.js`

### Deployment

- Designed for deployment to Vercel or similar platforms
- Uses Next.js SSG with ISR (Incremental Static Revalidation)
- Environment variables must be configured in production

## Blog Structure

Posts in Notion should have these properties:

- `Published`: Checkbox for publication status
- `Slug`: Multi-select for URL slug generation
- `Date`: Date for post publication
- `Authors`: People property for author attribution
- `Page`: Title property for post title

## Backup and Migration

The project includes a backup strategy for Notion SDK upgrades:

- **Backup scripts**: `scripts/backup.sh` and `scripts/restore.sh`
- **Documentation**: `BACKUP_STRATEGY.md` outlines upgrade procedures
- **Branch naming**: Uses timestamped backup branches (e.g., `backup/notion-sdk-v0.4.4_20251005_145342`)
- **Current SDK**: Using `@notionhq/client` v0.4.4 with planned upgrade to v5.1.0

## Development Notes

### Working with Notion API

- The project uses Notion's official API instead of internal endpoints
- Database queries are filtered by `Published` property for public posts
- Rich text content requires proper handling of formatting, links, and mentions
- Rate limiting is handled through `async-sema` for API calls

### Cache Strategy

- Production builds use caching (`process.env.USE_CACHE = 'true'`)
- Cache files store processed Notion data to avoid API rate limits
- Cache is invalidated on each build to ensure fresh content
