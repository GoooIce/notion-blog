// src/components/circuit/ChipCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from '@/styles/chip-card.module.css';

export interface ChipCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tag?: string;
  slug: string;
}

export default function ChipCard({
  id,
  title,
  excerpt,
  date,
  tag,
  slug,
}: ChipCardProps) {
  // Generate chip ID from post ID
  const chipId = `CHIP-${id.slice(-6).toUpperCase()}`;

  return (
    <div className={styles.chip}>
      <span className={styles.chipId}>{chipId}</span>
      <h3 className={styles.chipTitle}>{title}</h3>
      <div className={styles.chipMetadata}>
        <span className={styles.chipDate}>{date}</span>
        {tag && (
          <>
            <span className={styles.tagDot}></span>
            <span className={styles.tagName}>{tag}</span>
          </>
        )}
      </div>
      <p className={styles.chipExcerpt}>{excerpt}</p>

      {/* SVG circuit decoration */}
      <svg className={styles.circuitLines} width="100%" height="100%">
        <path
          d="M 0 0 L 20 0 L 30 10 L 100 10"
          stroke="rgba(0, 255, 65, 0.3)"
          strokeWidth="1"
          fill="none"
          className={styles.circuitFlow}
        />
        <circle cx="0" cy="0" r="3" fill="rgba(0, 255, 65, 0.5)" />
        <circle cx="100" cy="10" r="2" fill="rgba(0, 255, 65, 0.3)" />
      </svg>

      <Link href={`/blog/${slug}`} className={styles.chipLink}>
        <span className={styles.srOnly}>Read {title}</span>
      </Link>
    </div>
  );
}
