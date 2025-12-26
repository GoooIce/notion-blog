'use client';

import React from 'react';
import styles from './SyncedBlock.module.css';

/** Notion Block 基础类型定义 */
interface NotionBlock {
  id: string;
  type: string;
  children?: NotionBlock[];
  [key: string]: any;
}

/**
 * SyncedBlock component for Notion 'synced_block' block type
 * Renders a synced/copy of a block from another location
 */
interface SyncedBlockProps {
  /** Notion block ID */
  id: string;
  /** Child blocks to render */
  children?: NotionBlock[];
  /** Function to render child blocks recursively */
  renderBlock?: (block: NotionBlock) => React.ReactNode;
}

export const SyncedBlock: React.FC<SyncedBlockProps> = ({
  id,
  children = [],
  renderBlock,
}) => {
  if (!children || children.length === 0) {
    return null;
  }

  if (!renderBlock) {
    console.error(
      'SyncedBlock: renderBlock function is required but not provided'
    );
    return (
      <div className={styles.syncedBlock}>
        Error: Missing renderBlock function
      </div>
    );
  }

  return (
    <div
      className={styles.syncedBlock}
      role="region"
      aria-label="Synced block"
      data-synced-block-id={id}
    >
      <div className={styles.syncedBlockIcon} aria-hidden="true">
        🔄
      </div>
      <div className={styles.syncedBlockContent}>
        {children.map((childBlock: NotionBlock, index: number) => (
          <React.Fragment key={`${id}-child-${index}`}>
            {renderBlock(childBlock)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
