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
  /** Whether this is a header row */
  isHeader?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
  id,
  cells = [],
  isHeader = false,
}) => {
  const Tag = isHeader ? 'th' : 'td';

  return (
    <tr className={styles.tableRow}>
      {cells.map((cell, index) => (
        <Tag
          key={`${id}-cell-${index}`}
          className={isHeader ? styles.tableHeaderCell : styles.tableCell}
        >
          {textBlock(cell, false, `${id}-cell-${index}`)}
        </Tag>
      ))}
    </tr>
  );
};
