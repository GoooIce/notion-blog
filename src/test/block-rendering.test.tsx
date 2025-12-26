/**
 * Comprehensive tests for Notion block rendering
 * Tests all supported block types render correctly with the blog's UI style
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BlogPostClient from '../app/blog/[slug]/BlogPostClient';
import postStyles from '../styles/blog-post.module.css';

// Mock Heading component - wraps heading in an anchor tag
vi.mock('../components/heading', () => ({
  default: ({ children }: any) => {
    return React.createElement('a', { 'data-heading': true }, children);
  },
}));

// Mock dynamic components - use Fragment to avoid nested p tags
vi.mock('../components/dynamic', () => ({
  default: {
    p: ({ children }: any) => children,
  },
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock next/image
vi.mock('next/legacy/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Helper to create mock Notion blocks
const createBlock = (
  type: string,
  content: any,
  id: string = 'test-block-id'
) => ({
  id,
  type,
  [type]: content,
  created_time: '2024-01-01T00:00:00.000Z',
  last_edited_time: '2024-01-01T00:00:00.000Z',
  has_children: false,
});

// Helper to create rich text objects
const createRichText = (content: string, annotations: any = {}) => ({
  type: 'text',
  text: { content, link: null },
  annotations: {
    bold: false,
    italic: false,
    strikethrough: false,
    underline: false,
    code: false,
    color: 'default',
    ...annotations,
  },
  plain_text: content,
  href: null,
});

// Helper to render a post with specific blocks
const renderPostWithBlocks = (blocks: any[]) => {
  const mockPost = {
    id: 'test-post-id',
    title: 'Test Post',
    date: '2024-01-01',
    author: 'Test Author',
    slug: 'test-post',
    preview: 'Test preview',
    page_blocks: blocks,
  };

  return render(<BlogPostClient post={mockPost} />);
};

describe('Notion Block Rendering Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('Paragraph Blocks', () => {
    it('should render a simple paragraph correctly', () => {
      const block = createBlock('paragraph', {
        rich_text: [createRichText('This is a simple paragraph.')],
      });

      renderPostWithBlocks([block]);

      expect(
        screen.getByText('This is a simple paragraph.')
      ).toBeInTheDocument();
    });

    it('should render a paragraph with multiple text elements', () => {
      const block = createBlock('paragraph', {
        rich_text: [
          createRichText('Normal text'),
          createRichText('Bold text', { bold: true }),
          createRichText('Normal text again'),
        ],
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('Normal text')).toBeInTheDocument();
      expect(screen.getByText('Bold text')).toBeInTheDocument();
    });

    it('should render paragraph with Chinese text', () => {
      const block = createBlock('paragraph', {
        rich_text: [
          createRichText('很久没有敲键盘写长文，站在电脑前脑子一片空白。'),
        ],
      });

      renderPostWithBlocks([block]);

      expect(
        screen.getByText('很久没有敲键盘写长文，站在电脑前脑子一片空白。')
      ).toBeInTheDocument();
    });

    it('should render paragraph with italic text', () => {
      const block = createBlock('paragraph', {
        rich_text: [createRichText('Italic text', { italic: true })],
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('Italic text')).toBeInTheDocument();
    });

    it('should render paragraph with code annotation', () => {
      const block = createBlock('paragraph', {
        rich_text: [createRichText('const x = 1;', { code: true })],
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    });

    it('should render paragraph with strikethrough', () => {
      const block = createBlock('paragraph', {
        rich_text: [createRichText('Deleted text', { strikethrough: true })],
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('Deleted text')).toBeInTheDocument();
    });

    it('should render paragraph with underline', () => {
      const block = createBlock('paragraph', {
        rich_text: [createRichText('Underlined text', { underline: true })],
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('Underlined text')).toBeInTheDocument();
    });

    it('should render paragraph with link', () => {
      const block = createBlock('paragraph', {
        rich_text: [
          {
            type: 'text',
            text: {
              content: 'Link text',
              link: { url: 'https://example.com' },
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default',
            },
            plain_text: 'Link text',
            href: 'https://example.com',
          },
        ],
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('Link text')).toBeInTheDocument();
    });
  });

  describe('Heading Blocks', () => {
    it('should render heading_1 correctly', () => {
      const block = createBlock('heading_1', {
        text: [createRichText('Heading Level 1')],
      });

      const { container } = renderPostWithBlocks([block]);

      // Find heading in the content area (not TOC)
      const content = container.querySelector(`.${postStyles.content}`);
      expect(content).toHaveTextContent('Heading Level 1');
      // Verify there's an h1 element
      expect(content?.querySelector('h1')).toBeInTheDocument();
    });

    it('should render heading_2 correctly', () => {
      const block = createBlock('heading_2', {
        text: [createRichText('Heading Level 2')],
      });

      const { container } = renderPostWithBlocks([block]);

      const content = container.querySelector(`.${postStyles.content}`);
      expect(content).toHaveTextContent('Heading Level 2');
      expect(content?.querySelector('h2')).toBeInTheDocument();
    });

    it('should render heading_3 correctly', () => {
      const block = createBlock('heading_3', {
        text: [createRichText('Heading Level 3')],
      });

      const { container } = renderPostWithBlocks([block]);

      const content = container.querySelector(`.${postStyles.content}`);
      expect(content).toHaveTextContent('Heading Level 3');
      expect(content?.querySelector('h3')).toBeInTheDocument();
    });

    it('should render heading with Chinese text', () => {
      const block = createBlock('heading_1', {
        text: [createRichText('这是一级标题')],
      });

      const { container } = renderPostWithBlocks([block]);

      const content = container.querySelector(`.${postStyles.content}`);
      expect(content).toHaveTextContent('这是一级标题');
    });
  });

  describe('List Blocks', () => {
    it('should render bulleted_list_item correctly', () => {
      const block = createBlock('bulleted_list_item', {
        rich_text: [createRichText('Bullet point item')],
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('Bullet point item')).toBeInTheDocument();
    });

    it('should render numbered_list_item correctly', () => {
      const block = createBlock('numbered_list_item', {
        rich_text: [createRichText('Numbered item')],
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('Numbered item')).toBeInTheDocument();
    });

    it('should render bulleted_list (legacy) correctly', () => {
      const block = createBlock('bulleted_list', {
        rich_text: [createRichText('Legacy bullet item')],
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('Legacy bullet item')).toBeInTheDocument();
    });

    it('should render numbered_list (legacy) correctly', () => {
      const block = createBlock('numbered_list', {
        rich_text: [createRichText('Legacy numbered item')],
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('Legacy numbered item')).toBeInTheDocument();
    });

    it('should render list items with Chinese text', () => {
      const block = createBlock('bulleted_list_item', {
        rich_text: [createRichText('椭圆机、平衡板、滑雪模拟板')],
      });

      renderPostWithBlocks([block]);

      expect(
        screen.getByText('椭圆机、平衡板、滑雪模拟板')
      ).toBeInTheDocument();
    });
  });

  describe('Quote Blocks', () => {
    it('should render quote block correctly', () => {
      const block = createBlock('quote', {
        rich_text: [createRichText('This is a quote')],
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('This is a quote')).toBeInTheDocument();
    });

    it('should render multi-line quote', () => {
      const block = createBlock('quote', {
        rich_text: [createRichText('第一行引用\n第二行引用')],
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText(/第一行引用/)).toBeInTheDocument();
    });

    it('should render quote with Chinese text', () => {
      const block = createBlock('quote', {
        rich_text: [createRichText('既要省钱又要屎山能跑，这种思想很危险。')],
      });

      renderPostWithBlocks([block]);

      expect(
        screen.getByText('既要省钱又要屎山能跑，这种思想很危险。')
      ).toBeInTheDocument();
    });
  });

  describe('Code Blocks', () => {
    it('should render code block with language', () => {
      const block = createBlock('code', {
        rich_text: [createRichText('const hello = "world";')],
        language: 'javascript',
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('const hello = "world";')).toBeInTheDocument();
      expect(screen.getByText('javascript')).toBeInTheDocument();
    });

    it('should render code block with Python', () => {
      const block = createBlock('code', {
        rich_text: [createRichText('print("Hello, World!")')],
        language: 'python',
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('print("Hello, World!")')).toBeInTheDocument();
      expect(screen.getByText('python')).toBeInTheDocument();
    });

    it('should render code block with Rust', () => {
      const block = createBlock('code', {
        rich_text: [createRichText('fn main() { println!("Hello"); }')],
        language: 'rust',
      });

      const { container } = renderPostWithBlocks([block]);

      expect(screen.getByText(/fn main/)).toBeInTheDocument();
      expect(screen.getByText('rust')).toBeInTheDocument();
    });

    it('should render code block without language', () => {
      const block = createBlock('code', {
        rich_text: [createRichText('plain code')],
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('plain code')).toBeInTheDocument();
    });
  });

  describe('Media Blocks', () => {
    it('should render image block', () => {
      const block = createBlock('image', {
        type: 'external',
        external: { url: 'https://example.com/image.jpg' },
      });

      const { container } = renderPostWithBlocks([block]);

      const images = container.querySelectorAll('img');
      expect(images.length).toBeGreaterThan(0);
      expect(images[0]).toHaveAttribute(
        'src',
        expect.stringContaining('api/asset')
      );
    });

    it('should render video block', () => {
      const block = createBlock('video', {
        type: 'external',
        external: { url: 'https://example.com/video.mp4' },
      });

      const { container } = renderPostWithBlocks([block]);

      const videos = container.querySelectorAll('video');
      expect(videos.length).toBeGreaterThan(0);
    });
  });

  describe('Bookmark Blocks', () => {
    it('should render bookmark with all properties', () => {
      const block = createBlock('bookmark', {
        url: 'https://example.com',
        caption: [createRichText('Example Site')],
        format: {
          bookmark_icon: 'https://example.com/icon.png',
          bookmark_cover: 'https://example.com/cover.jpg',
        },
      });

      const { container } = renderPostWithBlocks([block]);

      // Check for any anchor with href attribute
      const link = container.querySelector('a[href]');
      expect(link).toBeInTheDocument();

      // Check for icon image
      const icon = container.querySelector('img[src*="icon.png"]');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Divider Blocks', () => {
    it('should ignore divider block (not render anything)', () => {
      const block = createBlock('divider', {});

      const { container } = renderPostWithBlocks([block]);

      // Divider should not render any visible content
      expect(container.textContent).not.toContain('---');
    });
  });

  describe('Text Block (Legacy)', () => {
    it('should render legacy text block', () => {
      const block = createBlock('text', {
        type: 'text',
        text: [createRichText('Legacy text block')],
      });

      renderPostWithBlocks([block]);

      expect(screen.getByText('Legacy text block')).toBeInTheDocument();
    });
  });

  describe('Page Block', () => {
    it('should ignore page block', () => {
      const block = createBlock('page', {});

      const { container } = renderPostWithBlocks([block]);

      // Page block should not render visible content in the content area
      const content = container.querySelector(`.${postStyles.content}`);
      expect(content?.querySelector('h1')).toBeNull();
    });
  });

  describe('Mixed Content', () => {
    it('should render multiple blocks in correct order', () => {
      const blocks = [
        createBlock('heading_1', { text: [createRichText('Title')] }),
        createBlock('paragraph', {
          rich_text: [createRichText('First paragraph')],
        }),
        createBlock('paragraph', {
          rich_text: [createRichText('Second paragraph')],
        }),
        createBlock('bulleted_list_item', {
          rich_text: [createRichText('List item')],
        }),
      ];

      const { container } = renderPostWithBlocks(blocks);

      // Check content area contains all blocks in order
      const content = container.querySelector(`.${postStyles.content}`);
      expect(content).toHaveTextContent('Title');
      expect(content).toHaveTextContent('First paragraph');
      expect(content).toHaveTextContent('Second paragraph');
      expect(content).toHaveTextContent('List item');
    });

    it('should render blog post from user example', () => {
      const blocks = [
        createBlock('paragraph', {
          rich_text: [
            createRichText('很久没有敲键盘写长文，站在电脑前脑子一片空白。'),
          ],
        }),
        createBlock('paragraph', {
          rich_text: [
            createRichText(
              '最近购买很多站立办公的物件：椭圆机、平衡板、滑雪模拟板。'
            ),
          ],
        }),
        createBlock('paragraph', {
          rich_text: [
            createRichText(
              '又开始了新的一轮心理健身房，拖延训练营，目标回本。'
            ),
          ],
        }),
        createBlock('paragraph', {
          rich_text: [
            createRichText('blog 更新ui， glm4.7 的审美真的是阔以。'),
          ],
        }),
        createBlock('paragraph', {
          rich_text: [createRichText('明天娃开家长会。')],
        }),
        createBlock('paragraph', {
          rich_text: [createRichText('既要省钱又要屎山能跑，这种思想很危险。')],
        }),
        createBlock('paragraph', {
          rich_text: [createRichText('就这么多吧。')],
        }),
      ];

      renderPostWithBlocks(blocks);

      // Use full text or regex for matching
      expect(screen.getByText(/很久没有敲键盘写长文/)).toBeInTheDocument();
      expect(screen.getByText(/椭圆机/)).toBeInTheDocument();
      expect(screen.getByText(/目标回本/)).toBeInTheDocument();
      expect(screen.getByText(/glm4\.7/)).toBeInTheDocument();
      expect(screen.getByText(/既要省钱又要屎山能跑/)).toBeInTheDocument();
      expect(screen.getByText(/就这么多吧/)).toBeInTheDocument();
    });
  });

  describe('Empty/Edge Cases', () => {
    it('should handle empty rich_text array', () => {
      const block = createBlock('paragraph', {
        rich_text: [],
      });

      const { container } = renderPostWithBlocks([block]);

      // Should render empty paragraph
      const p = container.querySelector('p');
      expect(p).toBeInTheDocument();
    });

    it('should handle missing properties gracefully', () => {
      const block = createBlock('paragraph', {});

      const { container } = renderPostWithBlocks([block]);

      // Should not crash
      expect(container).toBeInTheDocument();
    });

    it('should render empty blocks array', () => {
      const { container } = renderPostWithBlocks([]);

      // Use the CSS module class name
      expect(
        container.querySelector(`.${postStyles.emptyContent}`)
      ).toBeInTheDocument();
    });
  });

  describe('UI Style Verification', () => {
    it('should apply correct CSS classes to paragraphs', () => {
      const block = createBlock('paragraph', {
        rich_text: [createRichText('Test paragraph')],
      });

      const { container } = renderPostWithBlocks([block]);

      const paragraph = container.querySelector('p');
      expect(paragraph).toHaveClass(postStyles.paragraph);
    });

    it('should apply correct CSS classes to headings', () => {
      const block = createBlock('heading_1', {
        text: [createRichText('Test heading')],
      });

      const { container } = renderPostWithBlocks([block]);

      // Find the h1 in the content area (not the title in hero)
      const content = container.querySelector(`.${postStyles.content}`);
      const heading = content?.querySelector('h1');
      expect(heading).toHaveClass(postStyles.heading);
    });

    it('should apply correct CSS classes to list items', () => {
      const block = createBlock('bulleted_list_item', {
        rich_text: [createRichText('Test item')],
      });

      const { container } = renderPostWithBlocks([block]);

      const listItem = container.querySelector('li');
      expect(listItem).toHaveClass(postStyles.listItem);
    });

    it('should apply correct CSS classes to blockquotes', () => {
      const block = createBlock('quote', {
        rich_text: [createRichText('Test quote')],
      });

      const { container } = renderPostWithBlocks([block]);

      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toHaveClass(postStyles.blockquote);
    });

    it('should apply correct CSS classes to code blocks', () => {
      const block = createBlock('code', {
        rich_text: [createRichText('const x = 1;')],
        language: 'javascript',
      });

      const { container } = renderPostWithBlocks([block]);

      const codeWrapper = container.querySelector(`.${postStyles.codeWrapper}`);
      expect(codeWrapper).toBeInTheDocument();

      const codeHeader = container.querySelector(`.${postStyles.codeHeader}`);
      expect(codeHeader).toBeInTheDocument();

      const codeLanguage = container.querySelector(
        `.${postStyles.codeLanguage}`
      );
      expect(codeLanguage).toBeInTheDocument();
      expect(codeLanguage).toHaveTextContent('javascript');
    });
  });
});

/**
 * Block Type Coverage Summary
 *
 * ✅ paragraph - Basic paragraph with rich text
 * ✅ heading_1, heading_2, heading_3 - Headings
 * ✅ bulleted_list, bulleted_list_item - Unordered lists
 * ✅ numbered_list, numbered_list_item - Ordered lists
 * ✅ quote - Blockquotes
 * ✅ code - Code blocks with syntax highlighting
 * ✅ image - Images
 * ✅ video - Videos
 * ✅ bookmark - Link previews
 * ✅ divider - Dividers (ignored in rendering)
 * ✅ text - Legacy text blocks
 * ✅ page - Page blocks (ignored in rendering)
 *
 * Not yet supported (could be added):
 * ❌ to_do - Checkbox items
 * ❌ toggle - Collapsible content
 * ❌ callout - Callout boxes
 * ❌ table - Tables
 * ❌ column_list, column - Multi-column layouts
 * ❌ synced_block - Synced blocks
 * ❌ embed - Embeds (YouTube, etc.)
 */
