import '@testing-library/jest-dom';
import { vi, beforeAll } from 'vitest';

// Mock Next.js router (Pages Router)
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock Next.js navigation (App Router)
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock Next.js image
vi.mock('next/legacy/image', () => ({
  __esModule: true,
  default: (props: any) => ({
    type: 'img',
    props: props,
  }),
}));

// Mock environment variables
process.env.NOTION_TOKEN = 'test-token';
process.env.BLOG_INDEX_ID = 'test-database-id';

// Global test setup
beforeAll(() => {
  console.log('Test environment setup complete');
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});
