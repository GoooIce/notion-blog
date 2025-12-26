# Code Structure

## Directory Layout

```
src/
├── components/           # React components
│   ├── svgs/            # SVG icon components
│   └── *.tsx            # Various UI components
├── lib/
│   ├── notion/          # Notion API client and utilities
│   ├── build-rss.ts     # RSS feed generation
│   ├── qiniu.ts         # Qiniu cloud storage integration
│   └── blog-helpers.ts  # Blog utility functions
├── pages/
│   ├── api/             # API routes (asset proxy, RSS, etc.)
│   ├── blog/            # Blog pages (listing and dynamic posts)
│   └── *.tsx            # Main pages (index, contact)
├── styles/              # CSS modules
└── test/                # Test files and setup
```

## Key Files and Their Purpose

### Core Notion Integration

- `src/lib/notion/client.ts`: Main Notion API client with `getPostsInfos()` and `getPageData()` functions
- `src/lib/notion/renderers.ts`: Text rendering utilities for Notion rich text content
- `src/lib/notion/utils.ts`: Shared utilities for API handling and error management
- `src/lib/notion/server-constants.js`: Environment variable handling and ID normalization

### Content Rendering

- `src/pages/blog/[slug].tsx`: Dynamic blog post pages with SSG
- `src/components/*.tsx`: Components for different Notion block types
- `src/pages/api/asset.ts`: Asset proxy for Notion images/files

### Build and Deployment

- `next.config.js`: Next.js configuration with Notion validation and RSS build setup
- `src/lib/build-rss.ts`: RSS feed generation during build process

## Content Flow

1. Blog posts stored as pages in Notion database
2. `getPostsInfos()` fetches metadata for all published posts
3. `getPageData()` retrieves full content for individual posts
4. Content rendered using custom components for different Notion block types
5. Images and assets proxied through `/api/asset` endpoint

## Notion Database Structure

Posts in Notion should have these properties:

- `Published`: Checkbox for publication status
- `Slug`: Multi-select for URL slug generation
- `Date`: Date for post publication
- `Authors`: People property for author attribution
- `Page`: Title property for post title
