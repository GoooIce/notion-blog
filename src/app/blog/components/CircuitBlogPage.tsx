// src/app/blog/components/CircuitBlogPage.tsx
'use client';

import React from 'react';
import ChipCard from '@/components/circuit/ChipCard';
import styles from '@/styles/circuit-home.module.css';

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

export default function CircuitBlogPage({ posts }: CircuitBlogPageProps) {
  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 className={styles.sectionTitle}>blog/posts/</h1>
      <div className={styles.chipGrid}>
        {posts.map((post) => (
          <ChipCard
            key={post.id}
            id={post.id}
            title={post.title}
            excerpt={post.excerpt || ''}
            date={new Date(post.date).toLocaleDateString('zh-CN')}
            slug={post.slug}
            tag={post.tag}
          />
        ))}
      </div>
    </div>
  );
}
