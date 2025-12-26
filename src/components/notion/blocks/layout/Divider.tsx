'use client';

import React from 'react';
import styles from './Divider.module.css';

interface DividerProps {
  id: string;
}

export const Divider: React.FC<DividerProps> = ({ id }) => {
  return (
    <hr
      className={styles.divider}
      aria-hidden="true"
      role="separator"
      aria-orientation="horizontal"
    />
  );
};
