# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based blog platform that uses Notion as a headless CMS. It's a fork of [ijjk/notion-blog](https://github.com/ijjk/notion-blog) that has been modified to use the official Notion API instead of the internal API. The blog is written in Chinese and supports static generation with incremental revalidation.

**Important**: This project uses **Next.js App Router** (not Pages Router). All pages are located in `src/app/` directory, not `src/pages/`. The old Pages Router implementation has been moved to `src/pages_backup/`.

## Architecture

### Core Components

- **Next.js 15.5.4**: Uses App Router with Server Components and RSC (React Server Components)
- **Notion Integration**: Uses `@notionhq/client` v5.1.0 to fetch content from a Notion database
- **Content Rendering**: Custom renderers for different Notion block types (text, headings, code, images, etc.)
- **TypeScript**: Partial TypeScript adoption (strict mode disabled)
- **Animation Libraries**: Framer Motion, GSAP, Lenis for smooth scrolling and animations
- **Creative Graphics**: p5.js for particle effects and dynamic visualizations

### Key Directories

- `src/app/`: Next.js App Router pages and API routes (server components)
- `src/components/`: React components for rendering Notion content and UI
  - `src/components/decorations/`: Decorative background components (particles, waves, blobs, etc.)
- `src/lib/notion/`: Notion API client and utilities
- `src/styles/`: CSS modules for styling
- `src/test/`: Vitest test files
- `src/pages_backup/`: Legacy Pages Router implementation (for reference only)

### Content Flow

1. Blog posts are stored as pages in a Notion database
2. `getPostsInfos()` fetches metadata for all published posts
3. `getPageData()` retrieves full content for individual posts
4. Content is rendered using custom components that handle different Notion block types
5. Images and assets are optionally proxied through Qiniu cloud storage (configured via `QINIU_AK` and `QINIU_SK`)

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
- `NEXT_PUBLIC_SITE_URL`: Site URL for metadata and OpenGraph (defaults to localhost:3000)
- `QINIU_AK`: Qiniu cloud storage access key (optional, for image proxy)
- `QINIU_SK`: Qiniu cloud storage secret key (optional, for image proxy)

## Key Files and Their Purpose

### Core Configuration

- `next.config.js`: Next.js configuration with Notion validation, cache cleanup, and Node.js polyfills for client-side builds
- `tsconfig.json`: TypeScript configuration with path aliases (`@/*` → `./src/*`)
- `vitest.config.ts`: Vitest configuration with jsdom environment and React setup
- `eslint.config.js`: ESLint v9 flat config (NOT the legacy .eslintrc.json)
- `.prettierrc.json`: Prettier configuration (semi: true, singleQuote: true, printWidth: 80)
- `lint-staged.config.js`: Pre-commit formatting configuration

### Notion Integration (`src/lib/notion/`)

**Core Architecture:**

- `client.ts`: Main Notion API client with `getPostsInfos()` and `getPageData()` functions. Uses `@notionhq/client` v5.1.0 with search API for fetching published pages
- `server-constants.js`: Environment variable handling and 32-char to UUID ID normalization
- `renderers.ts`: Text rendering utilities for Notion rich text content with formatting
- `utils.ts`: Shared utilities for API handling and error management

**API Flow:**

1. `getPostsInfos()` uses the Notion search API to find all pages with `Published` property set to true
2. `getPageData()` retrieves full content including blocks for individual posts
3. Rich text is processed through renderers to handle formatting, links, and mentions
4. Blocks are mapped to React components for rendering

**Qiniu Integration (`src/lib/qiniu.ts`):**

- Optional cloud storage integration for image assets
- `fetchToS3()`: Fetches and uploads images to Qiniu storage
- `getUrl()`: Generates public URLs for stored assets

### App Router Pages

- `src/app/layout.tsx`: Root layout with metadata, fonts, and global styles
- `src/app/page.tsx`: Homepage with recent posts (server component, revalidates hourly)
- `src/app/blog/[slug]/page.tsx`: Dynamic blog post pages with SSG (only first 3 posts pre-generated, rest uses ISR)
- `src/app/blog/page.tsx`: Blog listing page
- `src/app/contact/page.tsx`: Contact page

### Components

- Components handle different Notion block types (heading, code, images, etc.)
- Located in `src/components/` with subdirectories for SVG icons
- `src/components/decorations/`: Visual decoration components using p5.js, Framer Motion, GSAP
  - `ParticleField.tsx`: Interactive particle field with p5.js
  - `MorphingBlob.tsx`: Animated blob shapes with Framer Motion
  - `WaveBackground.tsx`: Animated wave patterns
  - `FloatingShapes.tsx`: Floating geometric shapes
  - `GeometricPattern.tsx`: Geometric pattern backgrounds

## Development Notes

### Build Process

- Uses Next.js App Router with ISR (Incremental Static Revalidation)
- Blog post pages use `generateStaticParams()` but limit to first 3 posts to avoid build timeouts
- All pages use `export const revalidate = 3600` for hourly revalidation
- Cache files (`.blog_index_data`, `.blog_index_data_previews`) are cleaned on each build
- **Note**: RSS generation is temporarily disabled due to Node.js polyfill issues with Next.js 15.5.4

### Content Rendering Architecture

- **Notion Block Rendering**: Client-side component `BlogPostClient` handles different Notion block types
- **Code Highlighting**: Prism.js with custom language support
- **Math Equations**: KaTeX for mathematical expressions
- **Dynamic Code**: LiveScript evaluation via `react-jsx-parser`
- **Smooth Scrolling**: Lenis library for smooth scroll behavior
- **Asset Proxying**: Optional Qiniu cloud storage integration (configured via environment variables)

## Testing and Deployment

### Testing Setup

The project uses **Vitest v3** for testing with React Testing Library:

- Test configuration in `vitest.config.ts`
- Test setup file: `src/test/setup.ts` (includes mocks for Next.js router, image, and environment variables)
- Tests should be placed in `src/test/` directory
- Uses jsdom environment for DOM testing
- Run tests in watch mode: `npm run test`
- Run tests once: `npm run test:run`
- Run tests with UI: `npm run test:ui`

### Code Quality

- **ESLint v9** with flat config (eslint.config.js, not legacy .eslintrc.json)
- **Prettier** for code formatting with pre-commit hooks via Husky
- **lint-staged** for running linters on staged files
- Configuration enforces Prettier rules via ESLint plugin

### Deployment

- Designed for deployment to Vercel or similar platforms
- Uses Next.js App Router with ISR (Incremental Static Revalidation)
- Environment variables must be configured in production
- Node.js polyfills are required for client-side builds (crypto, stream, buffer, etc.)

## Blog Structure

Posts in Notion should have these properties:

- `Published`: Checkbox for publication status
- `Slug`: Multi-select for URL slug generation
- `Date`: Date for post publication
- `Authors`: People property for author attribution
- `Page`: Title property for post title

## Known Issues and Limitations

- RSS generation is temporarily disabled due to Node.js polyfill issues with Next.js 15.5.4
- Only first 3 blog posts are pre-generated at build time to avoid timeouts
- TypeScript strict mode is disabled (`strict: false` in tsconfig.json)
- Some Notion block types may not be fully implemented
- SSR (Server-Side Rendering) issues with p5.js require dynamic imports and client-side checks
