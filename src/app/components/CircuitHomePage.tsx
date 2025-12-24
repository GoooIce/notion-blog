// src/app/components/CircuitHomePage.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import ChipCard from '@/components/circuit/ChipCard';
import styles from '@/styles/circuit-home.module.css';

export interface CircuitHomePageProps {
  recentPosts: Array<{
    id: string;
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    tag?: string;
  }>;
}

export default function CircuitHomePage({ recentPosts }: CircuitHomePageProps) {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroPrompt}>root@miantu:~$ ./welcome.sh</div>
        <h1 className={styles.heroTitle}>GoooIce的MiantuNet</h1>
        <p className={styles.heroSubtitle}>
          一个关于技术、生活与思考的个人博客
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>recent_posts/</h2>
        <div className={styles.chipGrid}>
          {recentPosts.map((post) => (
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
        <div style={{ textAlign: 'center' }}>
          <Link href="/blog" className={styles.allPostsLink}>
            [view_all_posts]
          </Link>
        </div>
      </section>
    </div>
  );
}
