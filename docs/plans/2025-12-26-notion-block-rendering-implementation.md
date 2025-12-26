# Notion Block 渲染系统完整实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现完整的 Notion block 类型支持，包括 callout、to_do、toggle、audio、file、pdf、equation、link_preview、divider、column、table、synced_block 等所有常用 block 类型的渲染。

**Architecture:** 采用策略模式 + 分类处理，将 block 分为 6 大类（text、list、media、embed、layout、special），每个类型有独立的组件和渲染器。使用 React Context 管理交互状态（toggle 展开、todo 勾选），递归处理嵌套 block。

**Tech Stack:** React 18、TypeScript、Next.js 15、CSS Modules、KaTeX（公式渲染）、Vitest（测试）

---

## 前置准备

### Task 0: 安装依赖

**Files:**

- Modify: `package.json`

**Step 1: 添加 KaTeX 依赖**

在 `package.json` 的 `dependencies` 中添加：

```json
"katex": "^0.16.0",
"react-katex": "^3.0.0"
```

**Step 2: 安装依赖**

Run: `npm install`

Expected: 包成功安装，无错误

**Step 3: 添加 KaTeX CSS 到全局样式**

在 `src/app/layout.tsx` 的 `<head>` 中添加：

```typescript
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
  integrity="sha384-n8MVd4RsNIU0KOVEMQNogdwFxk+ZbOHzwAYyyySGBbDG2r4zaX/bGb1bGjlX+Rf"
  crossOrigin="anonymous"
/>
```

**Step 4: 提交**

Run:

```bash
git add package.json package-lock.json src/app/layout.tsx
git commit -m "chore: add KaTeX dependencies for equation rendering"
```

---

## 阶段 1: 基础文本类组件

### Task 1: 创建 hooks 目录和状态管理

**Files:**

- Create: `src/components/notion/hooks/useToggleState.ts`
- Create: `src/components/notion/hooks/useTodoState.ts`
- Create: `src/components/notion/hooks/index.ts`

**Step 1: 创建 useToggleState hook**

File: `src/components/notion/hooks/useToggleState.ts`

```typescript
import { useState } from 'react';

interface ToggleState {
  [blockId: string]: boolean;
}

export const useToggleState = () => {
  const [openToggles, setOpenToggles] = useState<ToggleState>({});

  const toggle = (id: string) => {
    setOpenToggles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isOpen = (id: string) => {
    return openToggles[id] || false;
  };

  return { openToggles, toggle, isOpen };
};
```

**Step 2: 创建 useTodoState hook**

File: `src/components/notion/hooks/useTodoState.ts`

```typescript
import { useState } from 'react';

interface TodoState {
  [blockId: string]: boolean;
}

export const useTodoState = () => {
  const [checkedTodos, setCheckedTodos] = useState<TodoState>({});

  const toggleTodo = (id: string) => {
    setCheckedTodos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isChecked = (id: string, initialChecked: boolean = false) => {
    return checkedTodos[id] !== undefined ? checkedTodos[id] : initialChecked;
  };

  return { toggleTodo, isChecked };
};
```

**Step 3: 创建 hooks 导出文件**

File: `src/components/notion/hooks/index.ts`

```typescript
export { useToggleState } from './useToggleState';
export { useTodoState } from './useTodoState';
```

**Step 4: 提交**

Run:

```bash
git add src/components/notion/hooks/
git commit -m "feat: add state management hooks for interactive blocks"
```

---

### Task 2: 创建 Callout 组件

**Files:**

- Create: `src/components/notion/blocks/text/Callout.tsx`
- Create: `src/components/notion/blocks/text/Callout.module.css`

**Step 1: 创建 Callout 组件**

File: `src/components/notion/blocks/text/Callout.tsx`

```typescript
import React from 'react';
import { textBlock } from '@/lib/notion/renderers';
import styles from './Callout.module.css';

interface CalloutProps {
  id: string;
  icon?: { emoji?: string; external?: { url: string } };
  rich_text: any[];
  color: string;
}

export const Callout: React.FC<CalloutProps> = ({ id, icon, rich_text, color }) => {
  // Map Notion colors to CSS classes
  const colorClass = color !== 'default' ? `${styles.callout}--${color}` : '';

  return (
    <div className={`${styles.callout} ${colorClass}`}>
      {icon && (
        <div className={styles.callout__icon}>
          {icon.emoji && <span>{icon.emoji}</span>}
          {icon.external && <img src={icon.external.url} alt="" className={styles.callout__iconImg} />}
        </div>
      )}
      <div className={styles.callout__content}>
        {textBlock(rich_text, false, id)}
      </div>
    </div>
  );
};
```

**Step 2: 创建 Callout 样式**

File: `src/components/notion/blocks/text/Callout.module.css`

```css
.callout {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  line-height: 1.6;
}

.callout__icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
}

.callout__iconImg {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
}

.callout__content {
  flex: 1;
  min-width: 0;
}

/* Color variants */
.callout--blue {
  background: rgba(59, 130, 246, 0.1);
  border-left: 3px solid #3b82f6;
}

.callout--green {
  background: rgba(34, 197, 94, 0.1);
  border-left: 3px solid #22c55e;
}

.callout--red {
  background: rgba(239, 68, 68, 0.1);
  border-left: 3px solid #ef4444;
}

.callout--yellow {
  background: rgba(234, 179, 8, 0.1);
  border-left: 3px solid #eab308;
}

.callout--gray {
  background: rgba(107, 114, 128, 0.1);
  border-left: 3px solid #6b7280;
}

.callout--default {
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid rgba(255, 255, 255, 0.1);
}
```

**Step 3: 提交**

Run:

```bash
git add src/components/notion/blocks/text/Callout.tsx src/components/notion/blocks/text/Callout.module.css
git commit -m "feat: add Callout block component"
```

---

### Task 3: 创建 Todo 组件

**Files:**

- Create: `src/components/notion/blocks/text/Todo.tsx`
- Create: `src/components/notion/blocks/text/Todo.module.css`

**Step 1: 创建 Todo 组件**

File: `src/components/notion/blocks/text/Todo.tsx`

```typescript
import React from 'react';
import { textBlock } from '@/lib/notion/renderers';
import { useTodoState } from '../../hooks';
import styles from './Todo.module.css';

interface TodoProps {
  id: string;
  rich_text: any[];
  checked: boolean;
  color: string;
}

export const Todo: React.FC<TodoProps> = ({ id, rich_text, checked, color }) => {
  const { toggleTodo, isChecked } = useTodoState();
  const checkedState = isChecked(id, checked);

  const handleToggle = () => {
    toggleTodo(id);
  };

  return (
    <label className={`${styles.todo} ${checkedState ? styles.checked : ''}`}>
      <input
        type="checkbox"
        checked={checkedState}
        onChange={handleToggle}
        className={styles.todo__checkbox}
      />
      <span className={styles.todo__content}>
        {textBlock(rich_text, true, id)}
      </span>
    </label>
  );
};
```

**Step 2: 创建 Todo 样式**

File: `src/components/notion/blocks/text/Todo.module.css`

```css
.todo {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
  margin: 0.5rem 0;
  cursor: pointer;
  transition: opacity 0.2s;
}

.todo:hover {
  opacity: 0.8;
}

.todo__checkbox {
  width: 1.1rem;
  height: 1.1rem;
  margin-top: 0.2rem;
  accent-color: var(--accent-primary, #00ff41);
  cursor: pointer;
}

.todo__content {
  flex: 1;
  line-height: 1.6;
  color: var(--text-secondary, #888);
}

.todo.checked .todo__content {
  text-decoration: line-through;
  opacity: 0.5;
}
```

**Step 3: 提交**

Run:

```bash
git add src/components/notion/blocks/text/Todo.tsx src/components/notion/blocks/text/Todo.module.css
git commit -m "feat: add Todo block component with checkbox state"
```

---

### Task 4: 在 BlogPostClient 中集成 Callout 和 Todo

**Files:**

- Modify: `src/app/blog/[slug]/BlogPostClient.tsx`

**Step 1: 添加 TodoProvider 包装**

在 `BlogPostClient` 组件中，使用 `TodoProvider` 包装内容渲染部分。

找到 `return` 语句中的 `<div className={postStyles.content}>` 部分，在其外层添加 context provider：

```typescript
// 在组件顶部导入
import { TodoProvider, useTodoState } from '@/components/notion/hooks';

// 修改组件，使用 provider
<div className={postStyles.content}>
  <TodoProvider>
    {/* ...existing content rendering code... */}
  </TodoProvider>
</div>
```

**Step 2: 在 renderers 中添加 callout 和 to_do**

找到 `renderers` 对象定义，添加：

```typescript
const renderers: Record<string, () => React.ReactNode> = {
  // ... existing renderers ...

  callout: () => {
    const { icon, rich_text, color } = properties;
    return React.createElement(
      require('@/components/notion/blocks/text/Callout').Callout,
      { key: id, id, icon, rich_text, color }
    );
  },

  to_do: () => {
    const { rich_text, checked, color } = properties;
    return React.createElement(
      require('@/components/notion/blocks/text/Todo').Todo,
      { key: id, id, rich_text, checked, color }
    );
  },
};
```

**Step 3: 从 ignore 列表中移除（如果存在）**

确保 `'callout', 'to_do'` 不在 ignore 列表中。

**Step 4: 提交**

Run:

```bash
git add "src/app/blog/[slug]/BlogPostClient.tsx"
git commit -m "feat: integrate Callout and Todo blocks into BlogPostClient"
```

---

## 阶段 2: 列表类组件

### Task 5: 创建 Toggle 组件

**Files:**

- Create: `src/components/notion/blocks/list/Toggle.tsx`
- Create: `src/components/notion/blocks/list/Toggle.module.css`

**Step 1: 创建 Toggle 组件**

File: `src/components/notion/blocks/list/Toggle.tsx`

```typescript
import React, { useState } from 'react';
import { textBlock } from '@/lib/notion/renderers';
import styles from './Toggle.module.css';

interface ToggleProps {
  id: string;
  rich_text: any[];
  color: string;
  children?: React.ReactNode;
}

export const Toggle: React.FC<ToggleProps> = ({ id, rich_text, color, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.toggle}>
      <button
        className={styles.toggle__header}
        onClick={handleToggle}
        type="button"
      >
        <span className={`${styles.toggle__arrow} ${isOpen ? styles.open : ''}`}>▶</span>
        <span>{textBlock(rich_text, true, id)}</span>
      </button>
      {isOpen && <div className={styles.toggle__content}>{children}</div>}
    </div>
  );
};
```

**Step 2: 创建 Toggle 样式**

File: `src/components/notion/blocks/list/Toggle.module.css`

```css
.toggle {
  margin: 0.75rem 0;
  border: 1px solid var(--circuit-idle, rgba(0, 255, 65, 0.2));
  border-radius: 6px;
  overflow: hidden;
}

.toggle__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 255, 65, 0.02);
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
  border: none;
  width: 100%;
  text-align: left;
  color: var(--text-secondary, #888);
}

.toggle__header:hover {
  background: rgba(0, 255, 65, 0.05);
}

.toggle__arrow {
  transition: transform 0.2s;
  font-size: 0.75rem;
  color: var(--text-secondary, #888);
}

.toggle__arrow.open {
  transform: rotate(90deg);
}

.toggle__content {
  padding: 0 1rem 1rem 1rem;
  border-top: 1px solid rgba(0, 255, 65, 0.1);
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Step 3: 提交**

Run:

```bash
git add src/components/notion/blocks/list/Toggle.tsx src/components/notion/blocks/list/Toggle.module.css
git commit -m "feat: add Toggle block component"
```

---

### Task 6: 集成 Toggle 到 BlogPostClient

**Files:**

- Modify: `src/app/blog/[slug]/BlogPostClient.tsx`

**Step 1: 添加 toggle 渲染器**

在 `renderers` 对象中添加：

```typescript
toggle: () => {
  const { rich_text, color } = properties;
  // Toggle 可能包含子 blocks，需要特殊处理
  const hasChildren = block.has_children;
  const children = hasChildren ? block.children : [];

  return React.createElement(
    require('@/components/notion/blocks/list/Toggle').Toggle,
    { key: id, id, rich_text, color },
    hasChildren && children.map((childBlock: any) => renderSingleBlock(childBlock))
  );
},
```

**Step 2: 提交**

Run:

```bash
git add "src/app/blog/[slug]/BlogPostClient.tsx"
git commit -m "feat: integrate Toggle block into BlogPostClient"
```

---

## 阶段 3: 媒体文件类组件

### Task 7: 创建 Audio 组件

**Files:**

- Create: `src/components/notion/blocks/media/Audio.tsx`
- Create: `src/components/notion/blocks/media/Audio.module.css`

**Step 1: 创建 Audio 组件**

File: `src/components/notion/blocks/media/Audio.tsx`

```typescript
import React from 'react';
import styles from './Audio.module.css';

interface AudioProps {
  id: string;
  audio: {
    type: 'file' | 'external';
    external?: { url: string };
    file?: { url: string; expiry_time: string };
  };
  caption?: any[];
}

export const Audio: React.FC<AudioProps> = ({ id, audio, caption }) => {
  const url = audio.type === 'external' ? audio.external?.url : audio.file?.url;

  if (!url) return null;

  return (
    <div className={styles.audioWrapper}>
      <audio
        src={url}
        controls
        className={styles.audio}
      />
      {caption && caption.length > 0 && (
        <div className={styles.caption}>
          {caption[0].plain_text}
        </div>
      )}
    </div>
  );
};
```

**Step 2: 创建 Audio 样式**

File: `src/components/notion/blocks/media/Audio.module.css`

```css
.audioWrapper {
  margin: 2rem 0;
}

.audio {
  width: 100%;
  border-radius: 8px;
}

.caption {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-tertiary, #666);
  text-align: center;
}
```

**Step 3: 提交**

Run:

```bash
git add src/components/notion/blocks/media/Audio.tsx src/components/notion/blocks/media/Audio.module.css
git commit -m "feat: add Audio block component"
```

---

### Task 8: 创建 File 组件

**Files:**

- Create: `src/components/notion/blocks/media/File.tsx`
- Create: `src/components/notion/blocks/media/File.module.css`

**Step 1: 创建 File 组件**

File: `src/components/notion/blocks/media/File.tsx`

```typescript
import React from 'react';
import styles from './File.module.css';

interface FileProps {
  id: string;
  file: {
    type: 'file' | 'external' | 'file_upload';
    external?: { url: string };
    file?: { url: string; expiry_time: string };
    name?: string;
  };
  caption?: any[];
}

export const File: React.FC<FileProps> = ({ id, file, caption }) => {
  const url = file.type === 'external' ? file.external?.url : file.file?.url;
  const name = file.name || caption?.[0]?.plain_text || 'File';

  if (!url) return null;

  // 简单的文件大小估算（从 URL 或使用默认值）
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const ext = getFileExtension(name);
  const getFileIcon = (extension: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      ppt: '📽️',
      pptx: '📽️',
      zip: '📦',
      rar: '📦',
      txt: '📃',
      default: '📎'
    };
    return icons[extension] || icons.default;
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.fileAttachment}
    >
      <div className={styles.fileAttachment__icon}>
        {getFileIcon(ext)}
      </div>
      <div className={styles.fileAttachment__info}>
        <div className={styles.fileAttachment__name}>{name}</div>
        <div className={styles.fileAttachment__size}>{ext.toUpperCase()}</div>
      </div>
    </a>
  );
};
```

**Step 2: 创建 File 样式**

File: `src/components/notion/blocks/media/File.module.css`

```css
.fileAttachment {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  margin: 1.5rem 0;
  text-decoration: none;
  transition: all 0.3s;
}

.fileAttachment:hover {
  border-color: var(--accent-primary, #00ff41);
  background: rgba(0, 255, 65, 0.03);
  transform: translateY(-1px);
}

.fileAttachment__icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 255, 65, 0.1);
  border-radius: 6px;
  font-size: 1.5rem;
}

.fileAttachment__info {
  flex: 1;
  min-width: 0;
}

.fileAttachment__name {
  font-weight: 500;
  color: var(--text-primary, #fff);
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fileAttachment__size {
  font-size: 0.75rem;
  color: var(--text-tertiary, #666);
}
```

**Step 3: 提交**

Run:

```bash
git add src/components/notion/blocks/media/File.tsx src/components/notion/blocks/media/File.module.css
git commit -m "feat: add File block component"
```

---

### Task 9: 创建 PDF 组件

**Files:**

- Create: `src/components/notion/blocks/media/Pdf.tsx`
- Create: `src/components/notion/blocks/media/Pdf.module.css`

**Step 1: 创建 PDF 组件**

File: `src/components/notion/blocks/media/Pdf.tsx`

```typescript
import React from 'react';
import styles from './Pdf.module.css';

interface PdfProps {
  id: string;
  pdf: {
    type: 'file' | 'external' | 'file_upload';
    external?: { url: string };
    file?: { url: string; expiry_time: string };
  };
  caption?: any[];
}

export const Pdf: React.FC<PdfProps> = ({ id, pdf, caption }) => {
  const url = pdf.type === 'external' ? pdf.external?.url : pdf.file?.url;

  if (!url) return null;

  return (
    <div className={styles.pdfWrapper}>
      <iframe
        src={url}
        className={styles.pdf}
        title={caption?.[0]?.plain_text || 'PDF'}
      />
      {caption && caption.length > 0 && (
        <div className={styles.caption}>
          {caption[0].plain_text}
        </div>
      )}
    </div>
  );
};
```

**Step 2: 创建 PDF 样式**

File: `src/components/notion/blocks/media/Pdf.module.css`

```css
.pdfWrapper {
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--circuit-idle, rgba(0, 255, 65, 0.2));
}

.pdf {
  width: 100%;
  height: 600px;
  border: none;
  display: block;
}

.caption {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-tertiary, #666);
  text-align: center;
}
```

**Step 3: 提交**

Run:

```bash
git add src/components/notion/blocks/media/Pdf.tsx src/components/notion/blocks/media/Pdf.module.css
git commit -m "feat: add PDF block component"
```

---

### Task 10: 集成媒体组件到 BlogPostClient

**Files:**

- Modify: `src/app/blog/[slug]/BlogPostClient.tsx`

**Step 1: 添加媒体渲染器**

在 `renderers` 对象中添加：

```typescript
audio: () => {
  return React.createElement(
    require('@/components/notion/blocks/media/Audio').Audio,
    { key: id, id, audio: properties }
  );
},

file: () => {
  return React.createElement(
    require('@/components/notion/blocks/media/File').File,
    { key: id, id, file: properties, caption: properties.caption }
  );
},

pdf: () => {
  return React.createElement(
    require('@/components/notion/blocks/media/Pdf').Pdf,
    { key: id, id, pdf: properties, caption: properties.caption }
  );
},
```

**Step 2: 提交**

Run:

```bash
git add "src/app/blog/[slug]/BlogPostClient.tsx"
git commit -m "feat: integrate Audio, File, PDF blocks into BlogPostClient"
```

---

## 阶段 4: 嵌入内容类组件

### Task 11: 创建 Equation 组件

**Files:**

- Create: `src/components/notion/blocks/embed/Equation.tsx`
- Create: `src/components/notion/blocks/embed/Equation.module.css'

**Step 1: 创建 Equation 组件**

File: `src/components/notion/blocks/embed/Equation.tsx`

```typescript
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import styles from './Equation.module.css';

interface EquationProps {
  id: string;
  equation: {
    expression: string;
  };
}

export const Equation: React.FC<EquationProps> = ({ id, equation }) => {
  const { expression } = equation;

  if (!expression) return null;

  // 判断是行内公式还是块级公式
  // 如果表达式包含换行或较长，使用块级公式
  const isBlockLevel = expression.includes('\n') || expression.length > 50;

  return (
    <div className={styles.equation}>
      {isBlockLevel ? (
        <BlockMath math={expression} />
      ) : (
        <InlineMath math={expression} />
      )}
    </div>
  );
};
```

**Step 2: 创建 Equation 样式**

File: `src/components/notion/blocks/embed/Equation.module.css`

```css
.equation {
  overflow-x: auto;
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  text-align: center;
}

/* 覆盖 KaTeX 默认样式以匹配主题 */
.equation :global(.katex) {
  color: var(--text-primary, #fff);
}

.equation :global(.katex .mord) {
  color: var(--text-primary, #fff);
}
```

**Step 3: 提交**

Run:

```bash
git add src/components/notion/blocks/embed/Equation.tsx src/components/notion/blocks/embed/Equation.module.css
git commit -m "feat: add Equation block component with KaTeX"
```

---

### Task 12: 创建 LinkPreview 组件

**Files:**

- Create: `src/components/notion/blocks/embed/LinkPreview.tsx`
- Create: `src/components/notion/blocks/embed/LinkPreview.module.css`

**Step 1: 创建 LinkPreview 组件**

File: `src/components/notion/blocks/embed/LinkPreview.tsx`

```typescript
import React from 'react';
import styles from './LinkPreview.module.css';

interface LinkPreviewProps {
  id: string;
  link_preview: {
    url: string;
  };
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ id, link_preview }) => {
  const { url } = link_preview;

  if (!url) return null;

  // 提取域名用于显示
  const getDomain = (urlString: string) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.hostname;
    } catch {
      return urlString;
    }
  };

  const domain = getDomain(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.linkPreview}
    >
      <svg className={styles.linkPreview__icon} viewBox="0 0 16 16" fill="currentColor" width="16" height="16">
        <path d="M8 3a5 5 0 100 10A5 5 0 008 3zm0 1a4 4 0 110 8 4 4 0 010-8z"/>
        <path d="M7.5 7.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 000-1H8V8a.5.5 0 00-.5-.5z"/>
      </svg>
      <span className={styles.linkPreview__url}>{url}</span>
    </a>
  );
};
```

**Step 2: 创建 LinkPreview 样式**

File: `src/components/notion/blocks/embed/LinkPreview.module.css`

```css
.linkPreview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 255, 65, 0.03);
  border: 1px solid rgba(0, 255, 65, 0.2);
  border-radius: 6px;
  margin: 1rem 0;
  text-decoration: none;
  color: var(--text-primary, #fff);
  transition: all 0.2s;
}

.linkPreview:hover {
  border-color: var(--accent-primary, #00ff41);
  background: rgba(0, 255, 65, 0.05);
  transform: translateY(-1px);
}

.linkPreview__icon {
  color: var(--accent-primary, #00ff41);
  flex-shrink: 0;
}

.linkPreview__url {
  font-size: 0.875rem;
  color: var(--accent-primary, #00ff41);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

**Step 3: 提交**

Run:

```bash
git add src/components/notion/blocks/embed/LinkPreview.tsx src/components/notion/blocks/embed/LinkPreview.module.css
git commit -m "feat: add LinkPreview block component"
```

---

### Task 13: 集成嵌入组件到 BlogPostClient

**Files:**

- Modify: `src/app/blog/[slug]/BlogPostClient.tsx`

**Step 1: 添加嵌入渲染器**

在 `renderers` 对象中添加：

```typescript
equation: () => {
  return React.createElement(
    require('@/components/notion/blocks/embed/Equation').Equation,
    { key: id, id, equation: properties }
  );
},

link_preview: () => {
  return React.createElement(
    require('@/components/notion/blocks/embed/LinkPreview').LinkPreview,
    { key: id, id, link_preview: properties }
  );
},
```

**Step 2: 提交**

Run:

```bash
git add "src/app/blog/[slug]/BlogPostClient.tsx"
git commit -m "feat: integrate Equation and LinkPreview blocks into BlogPostClient"
```

---

## 阶段 5: 布局类组件

### Task 14: 创建 Divider 组件

**Files:**

- Create: `src/components/notion/blocks/layout/Divider.tsx'
- Create: `src/components/notion/blocks/layout/Divider.module.css'

**Step 1: 创建 Divider 组件**

File: `src/components/notion/blocks/layout/Divider.tsx`

```typescript
import React from 'react';
import styles from './Divider.module.css';

interface DividerProps {
  id: string;
}

export const Divider: React.FC<DividerProps> = ({ id }) => {
  return <hr className={styles.divider} />;
};
```

**Step 2: 创建 Divider 样式**

File: `src/components/notion/blocks/layout/Divider.module.css`

```css
.divider {
  height: 1px;
  background: var(--circuit-idle, rgba(0, 255, 65, 0.2));
  margin: 2.5rem 0;
  border: none;
}
```

**Step 3: 提交**

Run:

```bash
git add src/components/notion/blocks/layout/Divider.tsx src/components/notion/blocks/layout/Divider.module.css
git commit -m "feat: add Divider block component"
```

---

### Task 15: 创建 ColumnList 和 Column 组件

**Files:**

- Create: `src/components/notion/blocks/layout/ColumnList.tsx`
- Create: `src/components/notion/blocks/layout/ColumnList.module.css'

**Step 1: 创建 ColumnList 组件**

File: `src/components/notion/blocks/layout/ColumnList.tsx`

```typescript
import React from 'react';
import styles from './ColumnList.module.css';

interface ColumnListProps {
  id: string;
  children: React.ReactNode;
}

export const ColumnList: React.FC<ColumnListProps> = ({ id, children }) => {
  return (
    <div className={styles.columnList}>
      {children}
    </div>
  );
};

interface ColumnProps {
  id: string;
  width_ratio?: number;
  children: React.ReactNode;
}

export const Column: React.FC<ColumnProps> = ({ id, width_ratio, children }) => {
  const style = width_ratio ? { flex: width_ratio } : undefined;

  return (
    <div className={styles.column} style={style}>
      {children}
    </div>
  );
};
```

**Step 2: 创建 ColumnList 样式**

File: `src/components/notion/blocks/layout/ColumnList.module.css`

```css
.columnList {
  display: flex;
  gap: 1.5rem;
  margin: 1.5rem 0;
  align-items: flex-start;
}

.column {
  flex: 1;
  min-width: 0;
}

/* 响应式：移动端改为单列布局 */
@media (max-width: 768px) {
  .columnList {
    flex-direction: column;
  }

  .column {
    flex: 1 !important;
  }
}
```

**Step 3: 提交**

Run:

```bash
git add src/components/notion/blocks/layout/ColumnList.tsx src/components/notion/blocks/layout/ColumnList.module.css
git commit -m "feat: add ColumnList and Column block components"
```

---

### Task 16: 创建 Table 和 TableRow 组件

**Files:**

- Create: `src/components/notion/blocks/layout/Table.tsx`
- Create: `src/components/notion/blocks/layout/Table.module.css'

**Step 1: 创建 Table 组件**

File: `src/components/notion/blocks/layout/Table.tsx`

```typescript
import React from 'react';
import styles from './Table.module.css';

interface TableProps {
  id: string;
  table_width: number;
  has_column_header: boolean;
  has_row_header: boolean;
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({
  id,
  table_width,
  has_column_header,
  has_row_header,
  children
}) => {
  // 将 children 转换为数组（如果还不是的话）
  const rows = React.Children.toArray(children);

  // 分离表头和表体
  let headerRow = null;
  let bodyRows = rows;

  if (has_column_header && rows.length > 0) {
    [headerRow, ...bodyRows] = rows;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        {headerRow && (
          <thead>
            {headerRow}
          </thead>
        )}
        <tbody>
          {bodyRows}
        </tbody>
      </table>
    </div>
  );
};

interface TableRowProps {
  id: string;
  table_row: {
    cells: any[][];
  };
  isHeader?: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({ id, table_row, isHeader = false }) => {
  const { cells } = table_row;

  const Tag = isHeader ? 'th' : 'td';

  return (
    <tr className={styles.tableRow}>
      {cells.map((cell, cellIndex) => (
        <Tag key={`${id}-cell-${cellIndex}`} className={styles.tableCell}>
          {cell.map((richText: any, rtIndex: number) => (
            <span key={`${id}-cell-${cellIndex}-rt-${rtIndex}`}>
              {richText.plain_text}
            </span>
          ))}
        </Tag>
      ))}
    </tr>
  );
};
```

**Step 2: 创建 Table 样式**

File: `src/components/notion/blocks/layout/Table.module.css`

```css
.tableWrapper {
  overflow-x: auto;
  margin: 2rem 0;
  border-radius: 8px;
  border: 1px solid var(--circuit-idle, rgba(0, 255, 65, 0.2));
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tableRow {
  border-bottom: 1px solid var(--circuit-idle, rgba(0, 255, 65, 0.1));
}

.tableRow:last-child {
  border-bottom: none;
}

.tableCell {
  padding: 0.75rem 1rem;
  text-align: left;
  color: var(--text-secondary, #888);
}

/* 表头样式 */
.table thead .tableCell {
  background: rgba(0, 255, 65, 0.05);
  font-weight: 600;
  color: var(--text-primary, #fff);
  border-bottom: 2px solid var(--circuit-idle, rgba(0, 255, 65, 0.2));
}

/* 悬停效果 */
.table tbody tr:hover .tableCell {
  background: rgba(0, 255, 65, 0.02);
}
```

**Step 3: 提交**

Run:

```bash
git add src/components/notion/blocks/layout/Table.tsx src/components/notion/blocks/layout/Table.module.css
git commit -m "feat: add Table and TableRow block components"
```

---

### Task 17: 集成布局组件到 BlogPostClient

**Files:**

- Modify: `src/app/blog/[slug]/BlogPostClient.tsx`

**Step 1: 添加布局渲染器**

在 `renderers` 对象中添加，并修改 divider 的处理：

```typescript
divider: () => {
  return React.createElement(
    require('@/components/notion/blocks/layout/Divider').Divider,
    { key: id, id }
  );
},

column_list: () => {
  // column_list 包含 column children
  const hasChildren = block.has_children;
  const children = hasChildren ? block.children : [];

  return React.createElement(
    require('@/components/notion/blocks/layout/ColumnList').ColumnList,
    { key: id, id },
    children.map((childBlock: any) => {
      if (childBlock.type === 'column') {
        const columnProps = childBlock.column || {};
        const columnChildren = childBlock.has_children ? childBlock.children : [];

        return React.createElement(
          require('@/components/notion/blocks/layout/ColumnList').Column,
          { key: childBlock.id, id: childBlock.id, width_ratio: columnProps.width_ratio },
          columnChildren.map((cb: any) => renderSingleBlock(cb))
        );
      }
      return null;
    })
  );
},

table: () => {
  const { table_width, has_column_header, has_row_header } = properties;
  // table 的 children 是 table_row blocks
  const hasChildren = block.has_children;
  const children = hasChildren ? block.children : [];

  return React.createElement(
    require('@/components/notion/blocks/layout/Table').Table,
    { key: id, id, table_width, has_column_header, has_row_header },
    children.map((rowBlock: any) => {
      if (rowBlock.type === 'table_row') {
        return React.createElement(
          require('@/components/notion/blocks/layout/Table').TableRow,
          { key: rowBlock.id, id: rowBlock.id, table_row: rowBlock.table_row, isHeader: false }
        );
      }
      return null;
    })
  );
},
```

**Step 2: 从 ignore 列表移除 divider**

将 `'divider'` 从 ignore 列表中移除。

**Step 3: 提交**

Run:

```bash
git add "src/app/blog/[slug]/BlogPostClient.tsx"
git commit -m "feat: integrate Divider, ColumnList, and Table blocks into BlogPostClient"
```

---

## 阶段 6: 特殊类组件

### Task 18: 创建 SyncedBlock 组件

**Files:**

- Create: `src/components/notion/blocks/special/SyncedBlock.tsx`
- Create: `src/components/notion/blocks/special/SyncedBlock.module.css'

**Step 1: 创建 SyncedBlock 组件**

File: `src/components/notion/blocks/special/SyncedBlock.tsx`

```typescript
import React from 'react';
import styles from './SyncedBlock.module.css';

interface SyncedBlockProps {
  id: string;
  synced_block: {
    synced_from: {
      type: 'block_id' | null;
      block_id?: string;
    } | null;
  };
  children?: React.ReactNode;
}

export const SyncedBlock: React.FC<SyncedBlockProps> = ({ id, synced_block, children }) => {
  const isOriginal = synced_block.synced_from === null;

  return (
    <div className={`${styles.syncedBlock} ${isOriginal ? styles.original : ''}`}>
      {!isOriginal && (
        <div className={styles.syncedBlock__badge}>
          Synced
        </div>
      )}
      <div className={styles.syncedBlock__content}>
        {children}
      </div>
    </div>
  );
};
```

**Step 2: 创建 SyncedBlock 样式**

File: `src/components/notion/blocks/special/SyncedBlock.module.css'

```css
.syncedBlock {
  position: relative;
  padding: 1rem;
  border: 1px dashed rgba(0, 255, 65, 0.3);
  border-radius: 8px;
  margin: 1.5rem 0;
}

.syncedBlock__badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  background: rgba(0, 255, 65, 0.1);
  border-radius: 4px;
  color: var(--accent-primary, #00ff41);
}

.syncedBlock.original {
  border-style: solid;
  border-color: rgba(0, 255, 65, 0.4);
}

.syncedBlock__content {
  margin-top: 1rem;
}
```

**Step 3: 提交**

Run:

```bash
git add src/components/notion/blocks/special/SyncedBlock.tsx src/components/notion/blocks/special/SyncedBlock.module.css
git commit -m "feat: add SyncedBlock component"
```

---

### Task 19: 集成 SyncedBlock 到 BlogPostClient

**Files:**

- Modify: `src/app/blog/[slug]/BlogPostClient.tsx`

**Step 1: 添加 synced_block 渲染器**

在 `renderers` 对象中添加：

```typescript
synced_block: () => {
  const { synced_from } = properties;
  const hasChildren = block.has_children;
  const children = hasChildren ? block.children : [];

  return React.createElement(
    require('@/components/notion/blocks/special/SyncedBlock').SyncedBlock,
    { key: id, id, synced_block: { synced_from } },
    children.map((childBlock: any) => renderSingleBlock(childBlock))
  );
},
```

**Step 2: 提交**

Run:

```bash
git add "src/app/blog/[slug]/BlogPostClient.tsx"
git commit -m "feat: integrate SyncedBlock into BlogPostClient"
```

---

## 阶段 7: 测试和文档

### Task 20: 创建 Callout 组件测试

**Files:**

- Create: `src/test/notion/blocks/Callout.test.tsx`

**Step 1: 创建测试文件**

File: `src/test/notion/blocks/Callout.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { Callout } from '@/components/notion/blocks/text/Callout';

describe('Callout Block', () => {
  it('renders with emoji icon', () => {
    const props = {
      id: 'test-id',
      icon: { emoji: '⭐' },
      rich_text: [{ type: 'text', plain_text: 'Important note' }],
      color: 'default'
    };

    render(<Callout {...props} />);
    expect(screen.getByText('⭐')).toBeInTheDocument();
    expect(screen.getByText('Important note')).toBeInTheDocument();
  });

  it('applies correct color class', () => {
    const props = {
      id: 'test-id',
      icon: { emoji: 'ℹ️' },
      rich_text: [{ type: 'text', plain_text: 'Info' }],
      color: 'blue'
    };

    const { container } = render(<Callout {...props} />);
    expect(container.querySelector('.callout--blue')).toBeInTheDocument();
  });

  it('renders without icon', () => {
    const props = {
      id: 'test-id',
      rich_text: [{ type: 'text', plain_text: 'No icon' }],
      color: 'default'
    };

    render(<Callout {...props} />);
    expect(screen.getByText('No icon')).toBeInTheDocument();
  });
});
```

**Step 2: 运行测试**

Run: `npm run test:run src/test/notion/blocks/Callout.test.tsx`

Expected: 测试通过

**Step 3: 提交**

Run:

```bash
git add src/test/notion/blocks/Callout.test.tsx
git commit -m "test: add Callout block unit tests"
```

---

### Task 21: 创建 Todo 组件测试

**Files:**

- Create: `src/test/notion/blocks/Todo.test.tsx`

**Step 1: 创建测试文件**

File: `src/test/notion/blocks/Todo.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoProvider } from '@/components/notion/hooks';
import { Todo } from '@/components/notion/blocks/text/Todo';

describe('Todo Block', () => {
  const renderWithProvider = (component: React.ReactElement) => {
    return render(<TodoProvider>{component}</TodoProvider>);
  };

  it('renders checkbox with text', () => {
    const props = {
      id: 'test-id',
      rich_text: [{ type: 'text', plain_text: 'Complete task' }],
      checked: false,
      color: 'default'
    };

    renderWithProvider(<Todo {...props} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(screen.getByText('Complete task')).toBeInTheDocument();
  });

  it('toggles checked state on click', () => {
    const props = {
      id: 'test-id',
      rich_text: [{ type: 'text', plain_text: 'Task' }],
      checked: false,
      color: 'default'
    };

    renderWithProvider(<Todo {...props} />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('renders with checked state', () => {
    const props = {
      id: 'test-id',
      rich_text: [{ type: 'text', plain_text: 'Done task' }],
      checked: true,
      color: 'default'
    };

    renderWithProvider(<Todo {...props} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
```

**Step 2: 运行测试**

Run: `npm run test:run src/test/notion/blocks/Todo.test.tsx`

Expected: 测试通过

**Step 3: 提交**

Run:

```bash
git add src/test/notion/blocks/Todo.test.tsx
git commit -m "test: add Todo block unit tests"
```

---

### Task 22: 创建 Toggle 组件测试

**Files:**

- Create: `src/test/notion/blocks/Toggle.test.tsx`

**Step 1: 创建测试文件**

File: `src/test/notion/blocks/Toggle.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Toggle } from '@/components/notion/blocks/list/Toggle';

describe('Toggle Block', () => {
  it('renders toggle header', () => {
    const props = {
      id: 'test-id',
      rich_text: [{ type: 'text', plain_text: 'Click to expand' }],
      color: 'default'
    };

    render(<Toggle {...props} />);
    expect(screen.getByText('Click to expand')).toBeInTheDocument();
  });

  it('toggles content visibility', () => {
    const props = {
      id: 'test-id',
      rich_text: [{ type: 'text', plain_text: 'Toggle' }],
      color: 'default',
      children: <div>Hidden content</div>
    };

    render(<Toggle {...props} />);

    // Initially collapsed
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByText('Hidden content')).toBeInTheDocument();
  });

  it('shows arrow rotation when open', () => {
    const props = {
      id: 'test-id',
      rich_text: [{ type: 'text', plain_text: 'Toggle' }],
      color: 'default'
    };

    const { container } = render(<Toggle {...props} />);

    // Arrow initially pointing right
    let arrow = container.querySelector('.toggle__arrow');
    expect(arrow).not.toHaveClass('open');

    // Click to expand
    fireEvent.click(screen.getByText('Toggle'));

    // Arrow should rotate
    arrow = container.querySelector('.toggle__arrow');
    expect(arrow).toHaveClass('open');
  });
});
```

**Step 2: 运行测试**

Run: `npm run test:run src/test/notion/blocks/Toggle.test.tsx`

Expected: 测试通过

**Step 3: 提交**

Run:

```bash
git add src/test/notion/blocks/Toggle.test.tsx
git commit -m "test: add Toggle block unit tests"
```

---

### Task 23: 创建 Table 组件测试

**Files:**

- Create: `src/test/notion/blocks/Table.test.tsx`

**Step 1: 创建测试文件**

File: `src/test/notion/blocks/Table.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { Table, TableRow } from '@/components/notion/blocks/layout/Table';

describe('Table Block', () => {
  const mockTable = {
    id: 'table-id',
    table_width: 3,
    has_column_header: true,
    has_row_header: false,
  };

  const mockRows = [
    {
      id: 'row-1',
      table_row: {
        cells: [
          [{ plain_text: 'Name' }],
          [{ plain_text: 'Age' }],
          [{ plain_text: 'City' }]
        ]
      }
    },
    {
      id: 'row-2',
      table_row: {
        cells: [
          [{ plain_text: 'John' }],
          [{ plain_text: '25' }],
          [{ plain_text: 'NYC' }]
        ]
      }
    }
  ];

  it('renders table with column headers', () => {
    render(
      <Table {...mockTable}>
        <TableRow id={mockRows[0].id} table_row={mockRows[0].table_row} isHeader={true} />
        <TableRow id={mockRows[1].id} table_row={mockRows[1].table_row} isHeader={false} />
      </Table>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('NYC')).toBeInTheDocument();
  });

  it('renders table without headers', () => {
    render(
      <Table {...mockTable} has_column_header={false}>
        <TableRow id={mockRows[0].id} table_row={mockRows[0].table_row} isHeader={false} />
      </Table>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders correct number of cells', () => {
    const { container } = render(
      <Table {...mockTable} has_column_header={false}>
        <TableRow id={mockRows[0].id} table_row={mockRows[0].table_row} isHeader={false} />
      </Table>
    );

    const cells = container.querySelectorAll('td');
    expect(cells).toHaveLength(3);
  });
});
```

**Step 2: 运行测试**

Run: `npm run test:run src/test/notion/blocks/Table.test.tsx`

Expected: 测试通过

**Step 3: 提交**

Run:

```bash
git add src/test/notion/blocks/Table.test.tsx
git commit -m "test: add Table block unit tests"
```

---

### Task 24: 更新 README 文档

**Files:**

- Modify: `README.md` (如果存在) 或创建 `FEATURES.md`

**Step 1: 添加支持的 Block 类型说明**

在项目 README 中添加支持的 Notion block 类型列表：

```markdown
## 支持的 Notion Block 类型

### 基础文本

- 段落 (Paragraph)
- 标题 (Heading 1/2/3)
- 引用 (Quote)
- 代码块 (Code)
- 提示框 (Callout) ⭐
- 复选框任务 (Todo) ⭐

### 列表

- 无序列表 (Bulleted List)
- 有序列表 (Numbered List)
- 可折叠内容 (Toggle) ⭐

### 媒体

- 图片 (Image)
- 视频 (Video)
- 音频 (Audio) ⭐
- 文件附件 (File) ⭐
- PDF 文档 (PDF) ⭐

### 嵌入

- 书签 (Bookmark)
- 链接预览 (Link Preview) ⭐
- 数学公式 (Equation) ⭐

### 布局

- 分隔线 (Divider) ⭐
- 分栏布局 (Column) ⭐
- 表格 (Table) ⭐

### 特殊

- 同步块 (Synced Block) ⭐

⭐ = 新增支持
```

**Step 2: 提交**

Run:

```bash
git add README.md
git commit -m "docs: update supported Notion block types in README"
```

---

### Task 25: 最终测试和验证

**Files:**

- Test existing blog posts

**Step 1: 启动开发服务器**

Run: `npm run dev`

**Step 2: 访问测试博客**

在浏览器中打开已有的博客文章，验证：

- Callout 块正确显示
- Todo 块可以勾选/取消勾选
- Toggle 块可以展开/折叠
- Audio 块可以播放
- File/PDF 块可以下载
- Equation 公式正确渲染
- LinkPreview 正确显示
- Divider 分隔线显示
- Column 分栏布局正确
- Table 表格正确显示
- SyncedBlock 显示正确

**Step 3: 运行完整测试套件**

Run: `npm run test:run`

Expected: 所有测试通过

**Step 4: 构建验证**

Run: `npm run build`

Expected: 构建成功，无错误

**Step 5: 最终提交**

Run:

```bash
git add -A
git commit -m "feat: complete Notion block rendering system implementation

Implemented support for all common Notion block types:
- Callout, Todo (text blocks with state)
- Toggle (collapsible content)
- Audio, File, PDF (media attachments)
- Equation, LinkPreview (embedded content)
- Divider, Column, Table (layout blocks)
- SyncedBlock (special blocks)

Added:
- State management hooks for interactive blocks
- CSS modules for all new components
- Unit tests for key components
- KaTeX integration for math equations
- Updated documentation

All blocks render correctly with proper styling and interactivity.
"
```

---

## 完成检查清单

完成所有任务后，验证以下内容：

- [ ] 所有新组件已创建并正确导入
- [ ] BlogPostClient 正确集成所有新 block 类型
- [ ] 样式正确应用，视觉效果符合设计
- [ ] 交互功能正常（todo 勾选、toggle 展开）
- [ ] 单元测试全部通过
- [ ] 构建成功无错误
- [ ] 在真实博客文章中验证渲染效果
- [ ] 文档已更新

---

## 故障排除

### 如果 KaTeX 样式未加载

确保在 `src/app/layout.tsx` 中正确添加了 KaTeX CSS 链接。

### 如果 Todo 状态不持久

这是预期行为 - todo 状态仅存储在前端，刷新页面会重置。

### 如果 Table 渲染不正确

检查 `table_row` blocks 是否正确作为 `table` block 的 children 传递。

### 如果 Column 布局错乱

检查 `width_ratio` 是否正确计算，并确保总和等于 1。

---

## 附录：完整的 Block 渲染器映射

完成实施后，`BlogPostClient.tsx` 中的 `renderers` 对象应包含以下所有类型：

```typescript
const renderers: Record<string, () => React.ReactNode> = {
  // Text blocks
  paragraph: () => {
    /* ... */
  },
  heading_1: () => {
    /* ... */
  },
  heading_2: () => {
    /* ... */
  },
  heading_3: () => {
    /* ... */
  },
  quote: () => {
    /* ... */
  },
  code: () => {
    /* ... */
  },
  callout: () => {
    /* ... */
  },
  to_do: () => {
    /* ... */
  },

  // List blocks
  bulleted_list_item: () => {
    /* ... */
  },
  numbered_list_item: () => {
    /* ... */
  },
  toggle: () => {
    /* ... */
  },

  // Media blocks
  image: () => {
    /* ... */
  },
  video: () => {
    /* ... */
  },
  audio: () => {
    /* ... */
  },
  file: () => {
    /* ... */
  },
  pdf: () => {
    /* ... */
  },

  // Embed blocks
  bookmark: () => {
    /* ... */
  },
  link_preview: () => {
    /* ... */
  },
  equation: () => {
    /* ... */
  },

  // Layout blocks
  divider: () => {
    /* ... */
  },
  column_list: () => {
    /* ... */
  },
  column: () => {
    /* ... */
  },
  table: () => {
    /* ... */
  },
  table_row: () => {
    /* ... */
  },

  // Special blocks
  synced_block: () => {
    /* ... */
  },
};
```
