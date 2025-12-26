// src/app/blog/components/CircuitBlogPage.tsx
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import styles from '@/styles/blog-page.module.css';

export interface CircuitBlogPageProps {
  posts: Array<{
    id: string;
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    tag?: string;
  }>;
}

// Calculate estimated reading time (words per minute = 400 for Chinese)
const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 400; // Chinese characters per minute
  const characterCount = text.length;
  return Math.max(1, Math.ceil(characterCount / wordsPerMinute));
};

// Format date to relative time
const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays} 天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} 个月前`;
  return `${Math.floor(diffDays / 365)} 年前`;
};

export default function CircuitBlogPage({ posts }: CircuitBlogPageProps) {
  // Sort posts by date (newest first) and add computed properties
  const processedPosts = useMemo(() => {
    return posts
      .map((post) => ({
        ...post,
        readingTime: calculateReadingTime(post.excerpt || ''),
        relativeDate: formatRelativeDate(post.date),
        formattedDate: new Date(post.date).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts]);

  // Calculate total reading time for all posts
  const totalReadingTime = useMemo(() => {
    return processedPosts.reduce((acc, post) => acc + post.readingTime, 0);
  }, [processedPosts]);

  return (
    <div className={styles.blogPage}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroDecoration}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,50 L50,50 L60,40 L80,40 L90,50 L150,50"
              stroke="rgba(0, 255, 65, 0.3)"
              strokeWidth="1"
              fill="none"
              className={styles.circuitFlow}
            />
            <path
              d="M200,50 L250,50 L260,60 L280,60 L290,50 L350,50 L400,50"
              stroke="rgba(0, 255, 65, 0.3)"
              strokeWidth="1"
              fill="none"
              className={styles.circuitFlow}
            />
            <circle
              cx="0"
              cy="50"
              r="3"
              fill="var(--accent-primary)"
              className={styles.pulseDot}
            />
            <circle
              cx="400"
              cy="50"
              r="3"
              fill="var(--accent-primary)"
              className={styles.pulseDot}
            />
          </svg>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroTitle}>
            <span className={styles.titlePrefix}>{'{'}</span>
            <span className={styles.titleText}>技术博客</span>
            <span className={styles.titleSuffix}>{'}'}</span>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{posts.length}</span>
              <span className={styles.statLabel}>篇文章</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>{totalReadingTime}</span>
              <span className={styles.statLabel}>分钟阅读</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>
                {new Set(posts.map((p) => p.tag).filter(Boolean)).size}
              </span>
              <span className={styles.statLabel}>个分类</span>
            </div>
          </div>

          <p className={styles.heroSubtitle}>探索技术、分享知识、记录成长</p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className={styles.postsContainer}>
        <div className={styles.postsHeader}>
          <h2 className={styles.postsTitle}>
            <span className={styles.prompt}>{'>'}</span>
            文章列表
          </h2>
          <div className={styles.postsCount}>{processedPosts.length} 篇</div>
        </div>

        <div className={styles.postsGrid}>
          {processedPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={styles.postCard}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Card decoration */}
              <div className={styles.cardCorner} />
              <div className={styles.cardCornerBottom} />

              {/* Card header */}
              <div className={styles.cardHeader}>
                <span className={styles.cardIndex}>
                  #{String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.cardId}>
                  {post.id.slice(-6).toUpperCase()}
                </span>
              </div>

              {/* Card title */}
              <h3 className={styles.cardTitle}>{post.title}</h3>

              {/* Card excerpt */}
              <p className={styles.cardExcerpt}>{post.excerpt || '暂无摘要'}</p>

              {/* Card metadata */}
              <div className={styles.cardMetadata}>
                <div className={styles.metadataGroup}>
                  <svg
                    className={styles.metadataIcon}
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" />
                    <path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3.5a.5.5 0 01-.5-.5v-3.5A.5.5 0 018 4z" />
                  </svg>
                  <time className={styles.metadataText} dateTime={post.date}>
                    {post.relativeDate}
                  </time>
                </div>

                <div className={styles.metadataDivider} />

                <div className={styles.metadataGroup}>
                  <svg
                    className={styles.metadataIcon}
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zM2.5 2a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zM1 10.5A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z" />
                  </svg>
                  <span className={styles.metadataText}>
                    {post.readingTime} 分钟阅读
                  </span>
                </div>

                {post.tag && (
                  <>
                    <div className={styles.metadataDivider} />
                    <div className={styles.metadataGroup}>
                      <svg
                        className={styles.metadataIcon}
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M3 2.5A1.5 1.5 0 014.5 1h7A1.5 1.5 0 0113 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 00.5-.5v-9a.5.5 0 011 0v9a1.5 1.5 0 01-1.5 1.5H1.497a.5.5 0 01-.5-.485V2.5A1.5 1.5 0 012.5 1h.963zM3 2h-.5a.5.5 0 00-.5.5v9.843l.013.049a.452.452 0 00.046-.123L3 2zm10 9.843V2.5a.5.5 0 00-.5-.5h-8a.5.5 0 00-.5.5v9.843a.5.5 0 00.5.5h8a.5.5 0 00.5-.5z" />
                      </svg>
                      <span className={styles.tag}>{post.tag}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Card circuit decoration */}
              <svg className={styles.cardCircuit} viewBox="0 0 200 100">
                <path
                  d="M0,20 L30,20 L40,30 L60,30 L70,20 L100,20"
                  stroke="rgba(0, 255, 65, 0.2)"
                  strokeWidth="1"
                  fill="none"
                />
                <circle cx="0" cy="20" r="2" fill="var(--accent-primary)" />
                <circle cx="100" cy="20" r="2" fill="var(--accent-primary)" />
                <path
                  d="M100,80 L130,80 L140,70 L160,70 L170,80 L200,80"
                  stroke="rgba(0, 255, 65, 0.2)"
                  strokeWidth="1"
                  fill="none"
                />
                <circle cx="100" cy="80" r="2" fill="var(--accent-primary)" />
                <circle cx="200" cy="80" r="2" fill="var(--accent-primary)" />
              </svg>

              {/* Hover overlay */}
              <div className={styles.cardHover}>
                <span className={styles.readMore}>阅读全文 →</span>
              </div>
            </Link>
          ))}
        </div>

        {processedPosts.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>∅</div>
            <p>暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
