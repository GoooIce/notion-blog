'use client';

import React from 'react';
import styles from './TableRow.module.css';
import { textBlock } from '../../../../lib/notion/renderers';

/** Notion Block 基础类型定义 */
interface NotionBlock {
  id: string;
  type: string;
  [key: string]: any;
}

/**
 * TableRow component for Notion 'table_row' block type
 * Renders a single row in a table
 */
interface TableRowProps {
  /** Notion block ID */
  id: string;
  /** Table row cells from Notion */
  cells?: string[][];
  /** Whether this is a header row (column header) */
  isHeader?: boolean;
  /** Whether first column should be header (row header) */
  isFirstRowHeader?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
  id,
  cells = [],
  isHeader = false,
  isFirstRowHeader = false,
}) => {
  // 边界情况处理：空 cells
  if (!cells || cells.length === 0) {
    return null;
  }

  return (
    <tr className={styles.tableRow}>
      {cells.map((cell, index) => {
        const isFirstCell = index === 0;
        const isRowHeaderCell = isFirstRowHeader && isFirstCell;
        const isHeaderCell = isHeader || isRowHeaderCell;
        const Tag = isHeaderCell ? 'th' : 'td';

        return (
          <Tag
            key={`${id}-cell-${index}`}
            className={isHeaderCell ? styles.tableHeaderCell : styles.tableCell}
          >
            {textBlock(cell, false, `${id}-cell-${index}`)}
          </Tag>
        );
      })}
    </tr>
  );
};
