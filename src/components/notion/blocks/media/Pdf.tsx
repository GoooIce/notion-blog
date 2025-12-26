'use client';

import React from 'react';
import styles from './Pdf.module.css';
import { textBlock } from '../../../../lib/notion/renderers';

interface PdfProps {
  id: string;
  caption?: Array<any>;
  pdf?: {
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

export const Pdf: React.FC<PdfProps> = ({ id, caption = [], pdf }) => {
  // Get URL based on storage type
  const pdfUrl = pdf?.type === 'file' ? pdf?.file?.url : pdf?.external?.url;

  if (!pdfUrl) {
    return null;
  }

  const fileName = pdf?.name || '文档.pdf';

  // Generate accessibility label
  const ariaLabel = `PDF 文档: ${fileName}`;

  return (
    <figure className={styles.pdf} role="figure" aria-label={ariaLabel}>
      <div className={styles.pdfContainer}>
        <iframe
          src={pdfUrl}
          className={styles.pdfViewer}
          title={fileName}
          aria-label={`PDF 预览: ${fileName}`}
        />
      </div>
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.pdfLink}
        aria-label={`下载 ${fileName}`}
      >
        📥 下载 PDF
      </a>
      {caption && caption.length > 0 && (
        <figcaption className={styles.pdfCaption}>
          {textBlock(caption, true, `${id}-caption`)}
        </figcaption>
      )}
    </figure>
  );
};
