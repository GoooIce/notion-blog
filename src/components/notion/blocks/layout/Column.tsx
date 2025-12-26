'use client';

import React from 'react';
import styles from './Column.module.css';

/** Notion Block 基础类型定义 */
interface NotionBlock {
  id: string;
  type: string;
  children?: NotionBlock[];
  [key: string]: any;
}

/**
 * Column component for Notion 'column' block type
 * Renders a single column with ratio-based width
 */
interface ColumnProps {
  /** Notion block ID for debugging and anchor navigation */
  id: string;
  /** Child blocks to render inside this column */
  children?: NotionBlock[];
  /** Column width ratio from Notion (e.g., 0.5 for half width) */
  column_ratio?: number;
  /** Function to render child blocks recursively */
  renderBlock?: (block: NotionBlock) => React.ReactNode;
}

export const Column: React.FC<ColumnProps> = ({
  id,
  children = [],
  column_ratio,
  renderBlock,
}) => {
  if (!children || children.length === 0) {
    return null;
  }

  if (!renderBlock) {
    console.error('Column: renderBlock function is required but not provided');
    return (
      <div className={styles.column}>Error: Missing renderBlock function</div>
    );
  }

  // 计算宽度百分比 (Notion 使用 ratio 而不是百分比)
  const widthStyle = column_ratio
    ? { flex: `${column_ratio} 1 0%` }
    : { flex: '1 1 0%' };

  return (
    <div
      className={styles.column}
      style={widthStyle}
      role="region"
      aria-label={`Column ${id}`}
    >
      {children.map((childBlock: NotionBlock, index: number) => (
        <React.Fragment key={`${id}-child-${index}`}>
          {renderBlock(childBlock)}
        </React.Fragment>
      ))}
    </div>
  );
};
