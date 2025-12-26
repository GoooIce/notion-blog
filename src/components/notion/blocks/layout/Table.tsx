'use client';

import React from 'react';
import styles from './Table.module.css';
import { TableRow } from './TableRow';

/** Notion Block 基础类型定义 */
interface NotionBlock {
  id: string;
  type: string;
  children?: NotionBlock[];
  [key: string]: any;
}

/**
 * Table component for Notion 'table' block type
 * Renders a table with optional column header
 */
interface TableProps {
  /** Notion block ID */
  id: string;
  /** Table width in number of columns */
  table_width?: number;
  /** Whether first row is column header */
  has_column_header?: boolean;
  /** Whether first column is row header */
  has_row_header?: boolean;
  /** Child blocks (table_row blocks) */
  children?: NotionBlock[];
}

export const Table: React.FC<TableProps> = ({
  id,
  table_width = 1,
  has_column_header = false,
  has_row_header = false,
  children = [],
}) => {
  if (!children || children.length === 0) {
    return null;
  }

  // 过滤出 table_row 类型的子块
  const rows = children.filter(
    (child: NotionBlock) => child?.type === 'table_row'
  );

  if (rows.length === 0) {
    return null;
  }

  return (
    <figure className={styles.tableWrapper} role="region" aria-label="Table">
      <div className={styles.tableOverflow}>
        <table className={styles.table}>
          <tbody>
            {rows.map((rowBlock: NotionBlock, index: number) => {
              const isFirstRow = index === 0;
              const isHeader = has_column_header && isFirstRow;

              return (
                <TableRow
                  key={rowBlock.id}
                  id={rowBlock.id}
                  cells={rowBlock.table_row?.cells}
                  isHeader={isHeader}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </figure>
  );
};
