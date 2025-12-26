'use client';

import React from 'react';
import styles from './File.module.css';
import { textBlock } from '../../../../lib/notion/renderers';

interface FileProps {
  id: string;
  caption?: Array<any>;
  file?: {
    type: 'file' | 'external';
    file?: {
      url: string;
      expiry_time: string;
    };
    external?: {
      url: string;
    };
    name: string;
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
  // Get URL based on storage type
  const fileUrl = file?.type === 'file' ? file?.file?.url : file?.external?.url;

  if (!fileUrl) {
    return null;
  }

  const fileName = file?.name || '未知文件';
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
