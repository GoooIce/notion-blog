'use client';

import React from 'react';
import styles from './Column.module.css';

interface ColumnProps {
  id: string;
  children?: any[];
  column_ratio?: number;
  renderBlock?: (block: any) => React.ReactNode;
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
    console.warn('Column component requires renderBlock prop');
    return null;
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
      {children.map((childBlock: any, index: number) => (
        <React.Fragment key={`${id}-child-${index}`}>
          {renderBlock(childBlock)}
        </React.Fragment>
      ))}
    </div>
  );
};
