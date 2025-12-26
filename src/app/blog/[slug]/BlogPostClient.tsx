'use client';

import Link from 'next/link';
import Heading from '../../../components/heading';
import blogStyles from '../../../styles/blog.module.css';
import postStyles from '../../../styles/blog-post.module.css';
import { textBlock } from '../../../lib/notion/renderers';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Callout } from '../../../components/notion/blocks/text/Callout';
import { Todo } from '../../../components/notion/blocks/text/Todo';
import { Toggle } from '../../../components/notion/blocks/list/Toggle';
import { Audio } from '../../../components/notion/blocks/media/Audio';
import { File } from '../../../components/notion/blocks/media/File';
import { Pdf } from '../../../components/notion/blocks/media/Pdf';
import { Equation } from '../../../components/notion/blocks/embed/Equation';
import { LinkPreview } from '../../../components/notion/blocks/embed/LinkPreview';

interface BlogPostClientProps {
  post: any;
  redirect?: string;
  preview?: boolean;
}

// Calculate reading time from content blocks
const calculateReadingTime = (blocks: any[]): number => {
  if (!blocks || blocks.length === 0) return 1;

  let charCount = 0;
  blocks.forEach((block) => {
    const properties = block[block.type];
    if (properties?.text) {
      charCount += properties.text.length || 0;
    } else if (properties?.rich_text?.[0]?.plain_text) {
      charCount += properties.rich_text[0].plain_text.length || 0;
    }
  });

  const wordsPerMinute = 400; // Chinese characters per minute
  return Math.max(1, Math.ceil(charCount / wordsPerMinute));
};

// Format date to readable format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Generate table of contents from headings
const generateTOC = (blocks: any[]) => {
  const toc: { id: string; text: string; level: number }[] = [];

  blocks.forEach((block) => {
    if (
      block.type === 'heading_1' ||
      block.type === 'heading_2' ||
      block.type === 'heading_3'
    ) {
      const properties = block[block.type];
      const text = properties?.text?.[0]?.plain_text || '';
      const level = parseInt(block.type.split('_')[1]);

      if (text) {
        toc.push({
          id: block.id,
          text,
          level,
        });
      }
    }
  });

  return toc;
};

const BlogPostClient: React.FC<BlogPostClientProps> = ({
  post,
  redirect,
  preview,
}) => {
  const router = useRouter();
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>('');

  // Calculate reading time and TOC
  const readingTime = useMemo(
    () => calculateReadingTime(post.page_blocks || []),
    [post.page_blocks]
  );
  const toc = useMemo(
    () => generateTOC(post.page_blocks || []),
    [post.page_blocks]
  );
  const formattedDate = useMemo(() => formatDate(post.date), [post.date]);

  // Handle redirect
  useEffect(() => {
    if (redirect && !post) {
      router.replace(redirect);
    }
  }, [redirect, post, router]);

  // Reading progress effect
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));

      // Show/hide back to top button
      setShowBackToTop(scrollTop > 500);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  // Track active heading
  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66%' }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  // Scroll to heading
  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // If the page is not yet generated
  if (!post) {
    return (
      <div className={postStyles.notFound}>
        <div className={postStyles.notFoundIcon}>∅</div>
        <p>文章未找到，正在返回博客列表...</p>
      </div>
    );
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div
        className={postStyles.readingProgress}
        style={{
          width: `${readingProgress}%`,
        }}
      >
        <div className={postStyles.progressGlow} />
      </div>

      {/* Back to Top Button */}
      <button
        className={`${postStyles.backToTop} ${showBackToTop ? postStyles.visible : ''}`}
        onClick={scrollToTop}
        aria-label="返回顶部"
      >
        <svg viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 12a.5.5 0 01.5-.5V5.707l2.146 2.147a.5.5 0 00.708-.708l-3-3a.5.5 0 00-.708 0l-3 3a.5.5 0 00.708.708L7.5 5.707V11.5a.5.5 0 01.5.5z" />
        </svg>
      </button>

      {/* Preview Alert */}
      {preview && (
        <div className={postStyles.previewAlert}>
          <span className={postStyles.previewBadge}>预览模式</span>
          <Link href={`/api/clear-preview?slug=${post.Slug}`}>
            <button className={postStyles.exitPreview}>退出预览</button>
          </Link>
        </div>
      )}

      {/* Article Container */}
      <article className={postStyles.article}>
        {/* Hero Section */}
        <header className={postStyles.hero}>
          {/* Circuit decoration */}
          <div className={postStyles.heroDecoration}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 200"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient
                  id="circuit-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="rgba(0, 255, 65, 0.1)" />
                  <stop offset="50%" stopColor="rgba(0, 255, 65, 0.3)" />
                  <stop offset="100%" stopColor="rgba(0, 255, 65, 0.1)" />
                </linearGradient>
              </defs>
              {/* Top circuit lines */}
              <path
                d="M0,80 L100,80 L120,60 L180,60 L200,80 L350,80 L370,100 L430,100 L450,80 L600,80 L620,60 L680,60 L700,80 L800,80"
                stroke="url(#circuit-gradient)"
                strokeWidth="1"
                fill="none"
                className={postStyles.circuitFlow}
              />
              {/* Bottom circuit lines */}
              <path
                d="M100,120 L200,120 L220,140 L280,140 L300,120 L500,120 L520,100 L580,100 L600,120 L800,120"
                stroke="url(#circuit-gradient)"
                strokeWidth="1"
                fill="none"
                className={postStyles.circuitFlow}
              />
              {/* Circuit nodes */}
              <circle
                cx="0"
                cy="80"
                r="4"
                fill="var(--accent-primary)"
                className={postStyles.pulseDot}
              />
              <circle
                cx="350"
                cy="80"
                r="3"
                fill="var(--accent-primary)"
                opacity="0.6"
              />
              <circle
                cx="800"
                cy="80"
                r="4"
                fill="var(--accent-primary)"
                className={postStyles.pulseDot}
              />
              <circle
                cx="100"
                cy="120"
                r="3"
                fill="var(--accent-primary)"
                opacity="0.6"
              />
              <circle
                cx="500"
                cy="120"
                r="3"
                fill="var(--accent-primary)"
                opacity="0.6"
              />
            </svg>
          </div>

          <div className={postStyles.heroContent}>
            {/* Breadcrumb */}
            <nav className={postStyles.breadcrumb}>
              <Link href="/">首页</Link>
              <span className={postStyles.breadcrumbSeparator}>/</span>
              <Link href="/blog">博客</Link>
              <span className={postStyles.breadcrumbSeparator}>/</span>
              <span className={postStyles.breadcrumbCurrent}>文章</span>
            </nav>

            {/* Title */}
            <h1 className={postStyles.title}>{post.title || 'Untitled'}</h1>

            {/* Metadata */}
            <div className={postStyles.metadata}>
              <div className={postStyles.metadataItem}>
                <svg
                  className={postStyles.metadataIcon}
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" />
                  <path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3.5a.5.5 0 01-.5-.5v-3.5A.5.5 0 018 4z" />
                </svg>
                <time dateTime={post.date}>{formattedDate}</time>
              </div>

              <div className={postStyles.metadataDivider} />

              <div className={postStyles.metadataItem}>
                <svg
                  className={postStyles.metadataIcon}
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zM2.5 2a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z" />
                </svg>
                <span>{readingTime} 分钟阅读</span>
              </div>

              {post.author && post.author.length > 0 && (
                <>
                  <div className={postStyles.metadataDivider} />
                  <div className={postStyles.metadataItem}>
                    <svg
                      className={postStyles.metadataIcon}
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm2-3a2 2 0 11-4 0 2 2 0 014 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                    </svg>
                    <span>{post.author}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className={postStyles.contentWrapper}>
          {/* Table of Contents Sidebar */}
          {toc.length > 0 && (
            <aside className={postStyles.tocSidebar}>
              <div className={postStyles.tocContainer}>
                <h4 className={postStyles.tocTitle}>目录</h4>
                <nav className={postStyles.tocNav}>
                  {toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToHeading(item.id)}
                      className={`${postStyles.tocItem} ${postStyles[`tocLevel${item.level}`]} ${
                        activeHeading === item.id ? postStyles.active : ''
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Content */}
          <div className={postStyles.content}>
            {(!post.page_blocks || post.page_blocks.length === 0) && (
              <div className={postStyles.emptyContent}>
                <p>这篇文章暂无内容</p>
              </div>
            )}

            {useMemo(() => {
              // Block grouping types
              type GroupedBlock =
                | { type: 'single'; block: any }
                | { type: 'list'; listType: 'ul' | 'ol'; items: any[] };

              // Helper: check if block is a list item
              const isListItem = (block: any): boolean =>
                [
                  'bulleted_list',
                  'bulleted_list_item',
                  'numbered_list',
                  'numbered_list_item',
                ].includes(block.type);

              // Helper: get list type from block
              const getListType = (block: any): 'ul' | 'ol' => {
                if (
                  block.type === 'numbered_list' ||
                  block.type === 'numbered_list_item'
                )
                  return 'ol';
                return 'ul';
              };

              // Group consecutive list items using reduce
              const groupBlocks = (blocks: any[]): GroupedBlock[] => {
                return blocks.reduce<GroupedBlock[]>((acc, block) => {
                  if (isListItem(block)) {
                    const listType = getListType(block);
                    const lastGroup = acc[acc.length - 1];

                    // If last group is same type of list, append to it
                    if (
                      lastGroup?.type === 'list' &&
                      lastGroup.listType === listType
                    ) {
                      lastGroup.items.push(block);
                    } else {
                      // Create new list group
                      acc.push({ type: 'list', listType, items: [block] });
                    }
                  } else {
                    // Non-list block, single group
                    acc.push({ type: 'single', block });
                  }

                  return acc;
                }, []);
              };

              // Render a single block
              const renderSingleBlock = (block: any): React.ReactNode => {
                const id = block.id;
                const properties = block[block.type];

                // Renderer functions map
                const renderers: Record<string, () => React.ReactNode> = {
                  text: () =>
                    properties ? textBlock(properties.text, false, id) : null,
                  paragraph: () =>
                    properties?.rich_text ? (
                      <p key={id} className={postStyles.paragraph}>
                        {textBlock(properties.rich_text, true, id)}
                      </p>
                    ) : null,
                  image: () => (
                    <div key={id} className={postStyles.mediaWrapper}>
                      <img
                        src={`/api/asset?id=${id}`}
                        alt="An image from Notion"
                        className={postStyles.image}
                      />
                    </div>
                  ),
                  video: () => (
                    <div key={id} className={postStyles.mediaWrapper}>
                      <video
                        src={`/api/asset?id=${id}`}
                        loop
                        muted
                        controls
                        autoPlay
                        className={postStyles.video}
                      />
                    </div>
                  ),
                  heading_1: () => (
                    <Heading key={id}>
                      <h1 id={id} className={postStyles.heading}>
                        {textBlock(properties.text, true, id)}
                      </h1>
                    </Heading>
                  ),
                  heading_2: () => (
                    <Heading key={id}>
                      <h2 id={id} className={postStyles.heading}>
                        {textBlock(properties.text, true, id)}
                      </h2>
                    </Heading>
                  ),
                  heading_3: () => (
                    <Heading key={id}>
                      <h3 id={id} className={postStyles.heading}>
                        {textBlock(properties.text, true, id)}
                      </h3>
                    </Heading>
                  ),
                  quote: () =>
                    properties?.rich_text ? (
                      <blockquote key={id} className={postStyles.blockquote}>
                        {properties.rich_text[0]?.plain_text || ''}
                      </blockquote>
                    ) : null,
                  code: () => {
                    if (!properties?.rich_text) return null;
                    const language = properties.language || '';
                    const code = properties.rich_text[0]?.plain_text || '';
                    return (
                      <div key={id} className={postStyles.codeWrapper}>
                        {language && (
                          <div className={postStyles.codeHeader}>
                            <span className={postStyles.codeLanguage}>
                              {language}
                            </span>
                            <button
                              className={postStyles.copyButton}
                              onClick={() =>
                                navigator.clipboard.writeText(code)
                              }
                            >
                              复制
                            </button>
                          </div>
                        )}
                        <pre className={postStyles.codeBlock}>
                          <code className={`language-${language}`}>{code}</code>
                        </pre>
                      </div>
                    );
                  },
                  bookmark: () => {
                    // Notion API bookmark structure: properties = { url, caption, format }
                    const url = properties.url || '';
                    const caption = properties.caption || [];
                    const title = caption[0]?.plain_text || '';
                    const description = caption[1]?.plain_text || '';
                    const { bookmark_icon: icon, bookmark_cover: cover } =
                      properties.format || {};

                    // Use custom title if available, otherwise use full URL
                    const displayTitle = title || url || 'Bookmark';
                    // Show link section only if there's a custom title
                    const showLinkSection = !!title;

                    return (
                      <a
                        key={id}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={postStyles.bookmark}
                      >
                        <div className={postStyles.bookmarkInfo}>
                          <div className={postStyles.bookmarkTitle}>
                            {displayTitle}
                          </div>
                          {description && (
                            <div className={postStyles.bookmarkDescription}>
                              {description}
                            </div>
                          )}
                          {showLinkSection && (
                            <div className={postStyles.bookmarkLink}>
                              {icon && (
                                <img
                                  src={icon}
                                  alt=""
                                  className={postStyles.bookmarkIcon}
                                />
                              )}
                              <span>{url}</span>
                            </div>
                          )}
                        </div>
                        {cover && (
                          <img
                            src={cover}
                            alt=""
                            className={postStyles.bookmarkCover}
                          />
                        )}
                      </a>
                    );
                  },
                  callout: () => {
                    const calloutProps = block.callout;
                    if (!calloutProps) return null;
                    const { rich_text = [], icon, color } = calloutProps;
                    return (
                      <Callout
                        key={id}
                        id={id}
                        rich_text={rich_text}
                        icon={icon}
                        color={color}
                      />
                    );
                  },
                  to_do: () => {
                    const todoProps = block.to_do;
                    if (!todoProps) return null;
                    const { rich_text = [], checked, color } = todoProps;
                    return (
                      <Todo
                        key={id}
                        id={id}
                        rich_text={rich_text}
                        checked={checked}
                        color={color}
                      />
                    );
                  },
                  toggle: () => {
                    const toggleProps = block.toggle;
                    if (!toggleProps) return null;
                    const { rich_text = [], color } = toggleProps;

                    // Render children blocks if they exist
                    const children =
                      block.children && block.children.length > 0
                        ? block.children.map((childBlock: any) =>
                            renderSingleBlock(childBlock)
                          )
                        : null;

                    return (
                      <Toggle
                        key={id}
                        id={id}
                        rich_text={rich_text}
                        color={color}
                      >
                        {children}
                      </Toggle>
                    );
                  },
                  audio: () => {
                    const audioProps = block.audio;
                    if (!audioProps) return null;
                    const { caption = [], audio } = audioProps;
                    return (
                      <Audio key={id} id={id} caption={caption} audio={audio} />
                    );
                  },
                  file: () => {
                    const fileProps = block.file;
                    if (!fileProps) return null;
                    const { caption = [], file } = fileProps;
                    return (
                      <File key={id} id={id} caption={caption} file={file} />
                    );
                  },
                  pdf: () => {
                    const pdfProps = block.pdf;
                    if (!pdfProps) return null;
                    const { caption = [], pdf } = pdfProps;
                    return <Pdf key={id} id={id} caption={caption} pdf={pdf} />;
                  },
                  equation: () => {
                    const equationProps = block.equation;
                    if (!equationProps) return null;
                    const { expression } = equationProps;
                    return (
                      <Equation key={id} id={id} expression={expression} />
                    );
                  },
                  link_preview: () => {
                    const linkPreviewProps = block.link_preview;
                    if (!linkPreviewProps) return null;
                    const { url } = linkPreviewProps;
                    return <LinkPreview key={id} id={id} url={url} />;
                  },
                };

                // Skip ignored block types
                if (['page', 'divider', 'embed'].includes(block.type)) {
                  return null;
                }

                return renderers[block.type]?.() || null;
              };

              // Render a list group
              const renderListGroup = (
                group: Extract<GroupedBlock, { type: 'list' }>
              ): React.ReactNode => {
                const ListTag = group.listType;
                return (
                  <ListTag
                    key={`list-${group.items[0].id}`}
                    className={postStyles.list}
                  >
                    {group.items.map((item) => {
                      const properties = item[item.type];
                      const plainText =
                        properties?.rich_text?.[0]?.plain_text || '';
                      return (
                        <li key={item.id} className={postStyles.listItem}>
                          {plainText}
                        </li>
                      );
                    })}
                  </ListTag>
                );
              };

              // Main: group blocks and render
              const groupedBlocks = groupBlocks(post.page_blocks || []);

              return groupedBlocks.flatMap((group) => {
                if (group.type === 'list') {
                  return renderListGroup(group);
                }
                return renderSingleBlock(group.block);
              });
            }, [post.page_blocks])}
          </div>
        </div>

        {/* Article Footer */}
        <footer className={postStyles.footer}>
          <Link href="/blog" className={postStyles.backLink}>
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className={postStyles.backIcon}
            >
              <path d="M11.354 1.646a.5.5 0 010 .708L5.707 8l5.647 5.646a.5.5 0 01-.708.708l-6-6a.5.5 0 010-.708l6-6a.5.5 0 01.708 0z" />
            </svg>
            返回博客列表
          </Link>
        </footer>
      </article>
    </>
  );
};

export default BlogPostClient;
