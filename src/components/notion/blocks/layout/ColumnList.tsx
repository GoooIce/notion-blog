'use client';

import React from 'react';
import styles from './ColumnList.module.css';
import { Column } from './Column';

interface ColumnListProps {
  id: string;
  children?: any[];
  renderBlock?: (block: any) => React.ReactNode;
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
  const columns = children.filter((child: any) => child?.type === 'column');

  if (columns.length === 0) {
    return null;
  }

  return (
    <div className={styles.columnList} role="region" aria-label="Column layout">
      {columns.map((columnBlock: any) => (
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
