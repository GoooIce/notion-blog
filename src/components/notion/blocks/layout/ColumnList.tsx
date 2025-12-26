'use client';

import React from 'react';
import styles from './ColumnList.module.css';
import { Column } from './Column';

/** Notion Block 基础类型定义 */
interface NotionBlock {
  id: string;
  type: string;
  children?: NotionBlock[];
  [key: string]: any;
}

/**
 * ColumnList component for Notion 'column_list' block type
 * Renders a flex container with multiple column children
 */
interface ColumnListProps {
  /** Notion block ID for debugging and anchor navigation */
  id: string;
  /** Child blocks (should contain column-type blocks) */
  children?: NotionBlock[];
  /** Function to render child blocks recursively */
  renderBlock?: (block: NotionBlock) => React.ReactNode;
}

export const ColumnList: React.FC<ColumnListProps> = ({
  id,
  children = [],
  renderBlock,
}) => {
  if (!children || children.length === 0) {
    return null;
  }

  // 过滤出 column 类型的子块
  const columns = children.filter(
    (child: NotionBlock) => child?.type === 'column'
  );

  if (columns.length === 0) {
    return null;
  }

  return (
    <div className={styles.columnList} role="region" aria-label="Column layout">
      {columns.map((columnBlock: NotionBlock) => (
        <Column
          key={columnBlock.id}
          id={columnBlock.id}
          column_ratio={columnBlock.column?.ratio}
          renderBlock={renderBlock}
        >
          {columnBlock.children}
        </Column>
      ))}
    </div>
  );
};
