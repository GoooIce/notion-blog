'use client';

import React from 'react';
import styles from './Toggle.module.css';
import { textBlock } from '../../../../lib/notion/renderers';
import { useToggleState } from '../../hooks';

interface ToggleProps {
  id: string;
  rich_text?: Array<any>;
  color?: string;
  children?: React.ReactNode;
}

// 标准化 Notion 颜色到 CSS 类名
// 与 Todo 和 Callout 组件的 normalizeColor 逻辑保持一致
const normalizeColor = (color?: string): string => {
  if (!color || color === 'default') return 'default';

  // 移除 _background 后缀(如果存在)
  if (color.endsWith('_background')) {
    return color.replace('_background', '');
  }

  return color;
};

export const Toggle: React.FC<ToggleProps> = ({
  id,
  rich_text = [],
  color = 'default',
  children
}) => {
  const { isOpen, toggle } = useToggleState();
  const normalizedColor = normalizeColor(color);
  const open = isOpen(id, false);

  // 生成可访问性标签
  const toggleText = rich_text?.[0]?.plain_text || '展开/折叠';
  const ariaLabel = `切换内容: ${toggleText}${open ? ' (已展开)' : ' (已折叠)'}`;

  return (
    <div className={styles.toggle}>
      <button
        type="button"
        className={styles.toggleHeader}
        onClick={() => toggle(id)}
        aria-expanded={open}
        aria-label={ariaLabel}
        aria-controls={`toggle-content-${id}`}
      >
        <span className={`${styles.toggleArrow} ${open ? styles.toggleArrowOpen : ''}`}>
          ▶
        </span>
        <span className={`${styles.toggleText} ${styles[`toggleText--${normalizedColor}`]}`}>
          {textBlock(rich_text, false, id)}
        </span>
      </button>
      {open && (
        <div
          className={styles.toggleContent}
          id={`toggle-content-${id}`}
          role="region"
          aria-label={`${toggleText} 内容`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
