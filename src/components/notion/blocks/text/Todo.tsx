'use client';

import React from 'react';
import styles from './Todo.module.css';
import { textBlock } from '../../../../lib/notion/renderers';
import { useTodoState } from '../../hooks';

// 使用 Array<any> 类型以保持与 textBlock 的兼容性
// textBlock 需要完整的 Notion RichTextItem 结构
interface TodoProps {
  id: string;
  rich_text?: Array<any>;
  checked?: boolean;
  color?: string;
}

// 标准化 Notion 颜色到 CSS 类名
// 与 Callout 组件的 normalizeColor 逻辑保持一致
const normalizeColor = (color?: string): string => {
  if (!color || color === 'default') return 'default';

  // 移除 _background 后缀(如果存在)
  if (color.endsWith('_background')) {
    return color.replace('_background', '');
  }

  return color;
};

export const Todo: React.FC<TodoProps> = ({
  id,
  rich_text = [],
  checked = false,
  color = 'default'
}) => {
  const { toggleTodo, isChecked } = useTodoState();
  const normalizedColor = normalizeColor(color);

  // 获取当前选中状态(可能已被用户切换)
  const currentChecked = isChecked(id, checked);

  const handleToggle = () => {
    // 修复:传递当前状态而不是初始状态
    toggleTodo(id, currentChecked);
  };

  // 生成可访问性标签
  const todoText = rich_text?.[0]?.plain_text || '未命名任务';
  const ariaLabel = `待办事项: ${todoText}${currentChecked ? ' (已完成)' : ' (未完成)'}`;

  return (
    <label className={styles.todo}>
      <input
        type="checkbox"
        checked={currentChecked}
        onChange={handleToggle}
        className={styles.todoCheckbox}
        aria-checked={currentChecked}
        aria-label={ariaLabel}
      />
      <span
        className={`${styles.todoText} ${styles[`todoText--${normalizedColor}`]}`}
      >
        {textBlock(rich_text, false, id)}
      </span>
    </label>
  );
};
