'use client';

import React from 'react';
import styles from './File.module.css';
import { textBlock } from '../../../../lib/notion/renderers';

interface FileProps {
  id: string;
  caption?: Array<any>;
  file?: {
    url?: string;
    expiry_time?: string;
    // Notion API may also return nested structure
    type?: 'file' | 'external';
    file?: {
      url: string;
      expiry_time: string;
    };
    external?: {
      url: string;
    };
    name?: string;
  };
}

// Get file icon based on extension
const getFileIcon = (fileName: string): string => {
  const iconMap: Record<string, string> = {
    PDF: '📕',
    DOC: '📘',
    DOCX: '📘',
    XLS: '📗',
    XLSX: '📗',
    PPT: '📙',
    PPTX: '📙',
    ZIP: '📦',
    RAR: '📦',
    TXT: '📄',
  };

  const ext = fileName.split('.').pop()?.toUpperCase() || '';
  return iconMap[ext] || '📄';
};

export const File: React.FC<FileProps> = ({ id, caption = [], file }) => {
  // Get URL - handle both flat and nested structures
  let fileUrl = file?.url;
  if (!fileUrl && file?.type === 'file') {
    fileUrl = file?.file?.url;
  } else if (!fileUrl && file?.type === 'external') {
    fileUrl = file?.external?.url;
  }

  if (!fileUrl) {
    return null;
  }

  // Extract file name from URL or use provided name
  let fileName = file?.name;
  if (!fileName && fileUrl) {
    try {
      const urlObj = new URL(fileUrl);
      const pathname = urlObj.pathname;
      const fileNameWithParams = pathname.split('/').pop() || '';
      fileName = fileNameWithParams.split('?')[0] || '未知文件';
    } catch {
      fileName = '未知文件';
    }
  }
  if (!fileName) {
    fileName = '未知文件';
  }

  const fileIcon = getFileIcon(fileName);

  // Generate accessibility label
  const ariaLabel = `文件下载: ${fileName}`;

  return (
    <figure className={styles.file} role="figure" aria-label={ariaLabel}>
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.fileLink}
        aria-label={`下载 ${fileName}`}
      >
        <div className={styles.fileIcon}>{fileIcon}</div>
        <div className={styles.fileInfo}>
          <div className={styles.fileName}>{fileName}</div>
        </div>
      </a>
      {caption && caption.length > 0 && (
        <figcaption className={styles.fileCaption}>
          {textBlock(caption, true, `${id}-caption`)}
        </figcaption>
      )}
    </figure>
  );
};
