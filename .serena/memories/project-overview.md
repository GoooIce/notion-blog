# Project Overview: Notion Blog

## Purpose

This is a Next.js-based blog platform that uses Notion as a headless CMS. It's a fork of [ijjk/notion-blog](https://github.com/ijjk/notion-blog) that has been modified to use the official Notion API instead of the internal API. The blog is written in Chinese and supports static generation with incremental revalidation.

## Tech Stack

- **Framework**: Next.js 15.5.4 with React 19.2.0
- **Notion Integration**: @notionhq/client v5.1.0
- **TypeScript**: Partial TypeScript adoption (strict mode disabled)
- **Styling**: CSS Modules
- **Testing**: Vitest with React Testing Library
- **Code Quality**: ESLint + Prettier + Husky pre-commit hooks
- **Build**: SSG (Static Site Generation) with ISR (Incremental Static Revalidation)

## Key Features

- Fetches blog posts from Notion database
- Custom renderers for different Notion block types
- RSS feed generation during build
- Asset proxying for Notion images/files
- Math equation rendering with KaTeX
- Code syntax highlighting with Prism.js
- Live script execution via react-jsx-parser
- Parallax scrolling effects with GSAP and Lenis

## Environment Variables

- `NOTION_TOKEN`: Notion API integration token
- `BLOG_INDEX_ID`: Notion database ID (32-character string)

## Development Workflow

The project follows a typical Next.js development pattern with pre-commit hooks for code quality.
