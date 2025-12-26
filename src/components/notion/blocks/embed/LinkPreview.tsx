'use client';

import React from 'react';
import styles from './LinkPreview.module.css';

/** URL 截断长度常量 */
const URL_TRUNCATE_LENGTH = 50;

/**
 * 从 URL 中提取域名
 * @param urlString - URL 字符串
 * @returns 域名或原始字符串（解析失败时）
 */
const getDomain = (urlString: string): string => {
  try {
    const urlObj = new URL(urlString);
    return urlObj.hostname;
  } catch {
    return urlString;
  }
};

/** LinkPreview 组件属性 */
interface LinkPreviewProps {
  /** 唯一标识符，用于可访问性和调试 */
  id: string;
  /** 要预览的链接 URL，如果为空则不渲染 */
  url?: string;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ id, url = '' }) => {
  if (!url) {
    return null;
  }

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
            {url.length > URL_TRUNCATE_LENGTH
              ? url.substring(0, URL_TRUNCATE_LENGTH) + '...'
              : url}
          </div>
        </div>
        <div className={styles.linkPreviewArrow}>↗</div>
      </div>
    </a>
  );
};
