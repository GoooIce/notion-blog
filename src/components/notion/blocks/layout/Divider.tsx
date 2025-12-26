'use client';

import React from 'react';
import styles from './Divider.module.css';

/**
 * Divider component for Notion 'divider' block type
 * Renders a horizontal separator line
 */
interface DividerProps {
  /** Notion block ID for debugging and anchor navigation */
  id: string;
}

export const Divider: React.FC<DividerProps> = ({ id }) => {
  return (
    <hr
      id={id}
      className={styles.divider}
      role="separator"
      aria-orientation="horizontal"
    />
  );
};
