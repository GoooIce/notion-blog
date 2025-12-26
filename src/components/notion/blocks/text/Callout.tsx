'use client';

import React from 'react';
import styles from './Callout.module.css';
import { textBlock } from '../../../../lib/notion/renderers';

interface CalloutProps {
  id?: string;
  rich_text?: Array<any>;
  icon?: {
    emoji?: string;
    external?: { url: string };
  } | null;
  color?: string;
}

// Normalize Notion color to CSS class name
const normalizeColor = (color?: string): string => {
  if (!color || color === 'default') return 'default';

  // Remove _background suffix if present
  if (color.endsWith('_background')) {
    return color.replace('_background', '');
  }

  return color;
};

export const Callout: React.FC<CalloutProps> = ({
  id,
  rich_text = [],
  icon,
  color = 'default'
}) => {
  const normalizedColor = normalizeColor(color);

  const iconContent = icon?.emoji || (icon?.external?.url && (
    <img
      src={icon.external.url}
      alt=""
      className={styles.calloutIcon}
      loading="lazy"
    />
  ));

  return (
    <div
      role="note"
      className={`${styles.callout} ${styles[`callout--${normalizedColor}`]}`}
      aria-label="Callout"
    >
      {iconContent && (
        <span
          className={styles.calloutIconWrapper}
          aria-hidden="true"
        >
          {iconContent}
        </span>
      )}
      <div className={styles.calloutContent}>
        {textBlock(rich_text, true, id)}
      </div>
    </div>
  );
};
