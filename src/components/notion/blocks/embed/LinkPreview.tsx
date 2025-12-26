'use client';

import React from 'react';
import styles from './LinkPreview.module.css';

interface LinkPreviewProps {
  id: string;
  url?: string;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ id, url = '' }) => {
  if (!url) {
    return null;
  }

  // 从 URL 提取域名用于显示
  const getDomain = (urlString: string): string => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.hostname;
    } catch {
      return urlString;
    }
  };

  const domain = getDomain(url);
  const ariaLabel = `链接预览: ${domain}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.linkPreview}
      aria-label={ariaLabel}
    >
      <div className={styles.linkPreviewCard}>
        <div className={styles.linkPreviewIcon}>🔗</div>
        <div className={styles.linkPreviewContent}>
          <div className={styles.linkPreviewDomain}>{domain}</div>
          <div className={styles.linkPreviewUrl}>
            {url.length > 50 ? url.substring(0, 50) + '...' : url}
          </div>
        </div>
        <div className={styles.linkPreviewArrow}>↗</div>
      </div>
    </a>
  );
};
