# Notion Block 渲染系统设计文档

**日期**: 2025-12-26
**作者**: Claude Code
**状态**: 设计阶段

---

## 概述

本文档描述了 Notion 博客项目中完整的 block 内容渲染系统设计，旨在支持所有常用的 Notion block 类型，提供完整的内容渲染能力。

### 目标

- 支持所有常用的 Notion block 类型
- 保持代码的可维护性和可扩展性
- 提供良好的用户体验和视觉效果
- 确保组件的可测试性

---

## 第一部分：架构设计

### Block 类型分类

将 Notion block 类型分为以下几类来处理：

**1. 基础文本类**

- `paragraph` - 段落
- `heading_1/2/3` - 标题
- `quote` - 引用
- `code` - 代码块
- `callout` - 提示框 ⭐ 新增
- `to_do` - 复选框任务 ⭐ 新增

**2. 列表类**

- `bulleted_list_item` - 无序列表
- `numbered_list_item` - 有序列表
- `toggle` - 可折叠列表 ⭐ 新增

**3. 媒体文件类**

- `image` - 图片
- `video` - 视频
- `audio` - 音频 ⭐ 新增
- `file` - 文件附件 ⭐ 新增
- `pdf` - PDF 文件 ⭐ 新增

**4. 嵌入内容类**

- `bookmark` - 书签
- `link_preview` - 链接预览 ⭐ 新增
- `equation` - 公式 ⭐ 新增

**5. 布局类**

- `divider` - 分隔线 ⭐ 新增
- `column_list / column` - 分栏布局 ⭐ 新增
- `table / table_row` - 表格 ⭐ 新增

**6. 特殊类**

- `synced_block` - 同步块 ⭐ 新增

---

### 渲染器架构

采用**策略模式** + **分类处理**：

```typescript
// Block 类型分类
type BlockCategory =
  | 'text' // 基础文本
  | 'list' // 列表
  | 'media' // 媒体
  | 'embed' // 嵌入
  | 'layout' // 布局
  | 'special'; // 特殊

// Block 分类映射
const BLOCK_CATEGORIES: Record<string, BlockCategory> = {
  paragraph: 'text',
  heading_1: 'text',
  heading_2: 'text',
  heading_3: 'text',
  quote: 'text',
  code: 'text',
  callout: 'text',
  to_do: 'text',

  bulleted_list_item: 'list',
  numbered_list_item: 'list',
  toggle: 'list',

  image: 'media',
  video: 'media',
  audio: 'media',
  file: 'media',
  pdf: 'media',

  bookmark: 'embed',
  link_preview: 'embed',
  equation: 'embed',

  divider: 'layout',
  column_list: 'layout',
  column: 'layout',
  table: 'layout',
  table_row: 'layout',

  synced_block: 'special',
};
```

---

## 第二部分：组件设计

### 核心组件结构

```
src/components/notion/blocks/
├── index.ts                          # 导出所有 block 组件
├── BaseBlock.tsx                     # 基础容器组件
├── text/
│   ├── Paragraph.tsx                 # 段落（已存在，增强）
│   ├── Heading.tsx                   # 标题（已存在，增强）
│   ├── Quote.tsx                     # 引用（已存在，增强）
│   ├── Code.tsx                      # 代码块（已存在）
│   ├── Callout.tsx                   # 提示框 ⭐ 新增
│   └── Todo.tsx                      # 复选框任务 ⭐ 新增
├── list/
│   ├── ListGroup.tsx                 # 列表容器（已存在，重构）
│   ├── BulletedListItem.tsx          # 无序列表项
│   ├── NumberedListItem.tsx          # 有序列表项
│   └── Toggle.tsx                    # 可折叠列表 ⭐ 新增
├── media/
│   ├── Image.tsx                     # 图片（已存在）
│   ├── Video.tsx                     # 视频（已存在）
│   ├── Audio.tsx                     # 音频 ⭐ 新增
│   ├── File.tsx                      # 文件附件 ⭐ 新增
│   └── Pdf.tsx                       # PDF ⭐ 新增
├── embed/
│   ├── Bookmark.tsx                  # 书签（已存在）
│   ├── LinkPreview.tsx               # 链接预览 ⭐ 新增
│   └── Equation.tsx                  # 公式 ⭐ 新增
├── layout/
│   ├── Divider.tsx                   # 分隔线 ⭐ 新增
│   ├── ColumnList.tsx                # 分栏容器 ⭐ 新增
│   ├── Column.tsx                    # 单个分栏 ⭐ 新增
│   ├── Table.tsx                     # 表格 ⭐ 新增
│   └── TableRow.tsx                  # 表格行 ⭐ 新增
└── special/
    └── SyncedBlock.tsx               # 同步块 ⭐ 新增
```

---

### 关键组件接口设计

**1. Callout（提示框）**

```typescript
interface CalloutProps {
  id: string;
  icon?: { emoji?: string; external?: { url: string } };
  rich_text: RichText[];
  color: string;
}

// 渲染效果：带背景色的提示框，左侧有图标
<div className="callout callout--blue">
  <span className="callout__icon">⭐</span>
  <div className="callout__content">
    {richText}
  </div>
</div>
```

**2. Todo（复选框任务）**

```typescript
interface TodoProps {
  id: string;
  rich_text: RichText[];
  checked: boolean;
  color: string;
}

// 交互：点击切换 checked 状态（仅前端状态）
<label className="todo">
  <input type="checkbox" checked={checked} />
  <span>{richText}</span>
</label>
```

**3. Toggle（可折叠）**

```typescript
interface ToggleProps {
  id: string;
  rich_text: RichText[];
  children?: Block[];
  isOpen?: boolean;
}

// 交互：点击标题展开/折叠内容
<div className="toggle">
  <button onClick={toggle}>
    <span className="toggle__arrow">▶</span>
    {richText}
  </button>
  {isOpen && <div className="toggle__content">{children}</div>}
</div>
```

**4. Table（表格）**

```typescript
interface TableProps {
  id: string;
  table_width: number;
  has_column_header: boolean;
  has_row_header: boolean;
  children: TableRowBlock[];
}

// 渲染：标准 HTML 表格
<table>
  {has_column_header && <thead>...</thead>}
  <tbody>{rows}</tbody>
</table>
```

**5. Column Layout（分栏）**

```typescript
interface ColumnListProps {
  id: string;
  children: ColumnBlock[];
}

interface ColumnProps {
  id: string;
  width_ratio?: number;
  children: Block[];
}

// 渲染：CSS Grid 或 Flexbox
<div className="column-list" style={{ display: 'flex', gap: '1rem' }}>
  {columns.map(col => (
    <div className="column" style={{ flex: col.width_ratio || 1 }}>
      {col.children}
    </div>
  ))}
</div>
```

---

### 渲染器注册表模式

```typescript
// src/components/notion/blocks/index.ts
import { Paragraph } from './text/Paragraph';
import { Callout } from './text/Callout';
import { Todo } from './text/Todo';
// ... 其他导入

export const BLOCK_RENDERERS: Record<string, React.ComponentType<any>> = {
  paragraph: Paragraph,
  heading_1: (props) => <Heading level={1} {...props} />,
  heading_2: (props) => <Heading level={2} {...props} />,
  heading_3: (props) => <Heading level={3} {...props} />,
  quote: Quote,
  code: Code,
  callout: Callout,
  to_do: Todo,

  bulleted_list_item: BulletedListItem,
  numbered_list_item: NumberedListItem,
  toggle: Toggle,

  image: Image,
  video: Video,
  audio: Audio,
  file: File,
  pdf: Pdf,

  bookmark: Bookmark,
  link_preview: LinkPreview,
  equation: Equation,

  divider: Divider,
  column_list: ColumnList,
  column: Column,
  table: Table,
  table_row: TableRow,

  synced_block: SyncedBlock,
};
```

---

## 第三部分：数据流和状态管理

### Block 数据结构

```typescript
// Notion API Block 类型定义
interface NotionBlock {
  id: string;
  type: BlockType;
  created_time: string;
  last_edited_time: string;
  has_children: boolean;
  archived: boolean;
  [key: string]: any; // 动态属性，如 paragraph, heading_1 等
}

type BlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'toggle'
  | 'to_do'
  | 'quote'
  | 'code'
  | 'callout'
  | 'image'
  | 'video'
  | 'audio'
  | 'file'
  | 'pdf'
  | 'bookmark'
  | 'link_preview'
  | 'equation'
  | 'divider'
  | 'column_list'
  | 'column'
  | 'table'
  | 'table_row'
  | 'synced_block'
  | 'unsupported';

// Rich Text 结构（已在项目中使用）
interface RichText {
  type: 'text' | 'mention' | 'equation';
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href?: string;
  // ... type-specific fields
}
```

---

### 状态管理策略

**1. 展开状态管理**

```typescript
// src/components/notion/hooks/useToggleState.ts
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

  return { openToggles, toggle };
};
```

**2. Todo 状态管理**

```typescript
// src/components/notion/hooks/useTodoState.ts
interface TodoState {
  [blockId: string]: boolean; // checked 状态
}

export const useTodoState = () => {
  const [checkedTodos, setCheckedTodos] = useState<TodoState>({});

  const toggleTodo = (id: string, initialChecked: boolean) => {
    setCheckedTodos((prev) => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : !initialChecked,
    }));
  };

  const isChecked = (id: string, initialChecked: boolean) => {
    return checkedTodos[id] !== undefined ? checkedTodos[id] : initialChecked;
  };

  return { toggleTodo, isChecked };
};
```

**3. 渲染上下文**

```typescript
// src/components/notion/BlockRenderContext.tsx
interface BlockRenderContextValue {
  toggleState: ReturnType<typeof useToggleState>;
  todoState: ReturnType<typeof useTodoState>;
  renderDepth: number; // 防止嵌套过深
  maxDepth: number;
}

export const BlockRenderContext = createContext<BlockRenderContextValue | null>(null);

export const BlockRenderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toggleState = useToggleState();
  const todoState = useTodoState();

  return (
    <BlockRenderContext.Provider value={{ toggleState, todoState, renderDepth: 0, maxDepth: 10 }}>
      {children}
    </BlockRenderContext.Provider>
  );
};
```

---

### 递归渲染处理

```typescript
// 处理带 children 的 block
export const renderBlockWithChildren = (
  block: NotionBlock,
  renderDepth: number = 0
): React.ReactNode => {
  // 防止无限递归
  if (renderDepth > 10) {
    return <div className="error">Maximum nesting depth exceeded</div>;
  }

  const BlockComponent = BLOCK_RENDERERS[block.type];
  if (!BlockComponent) {
    return <UnsupportedBlock type={block.type} />;
  }

  // 处理有 children 的 block
  if (block.has_children && block.children) {
    return (
      <BlockComponent {...block[block.type]} id={block.id}>
        {block.children.map((childBlock: NotionBlock) =>
          renderBlockWithChildren(childBlock, renderDepth + 1)
        )}
      </BlockComponent>
    );
  }

  return <BlockComponent {...block[block.type]} id={block.id} />;
};
```

---

### 特殊处理场景

**1. 列表分组（保持现有逻辑）**

```typescript
const groupBlocks = (blocks: NotionBlock[]): GroupedBlock[] => {
  return blocks.reduce((acc, block) => {
    const isListItem = ['bulleted_list_item', 'numbered_list_item'].includes(
      block.type
    );
    // ... 现有的分组逻辑
  }, []);
};
```

**2. 表格行收集**

```typescript
const collectTableRows = (
  tableBlock: NotionBlock,
  allBlocks: NotionBlock[]
): TableRowBlock[] => {
  // table 的 children 需要单独处理
  // 因为 table_row 是 table 的子 block
  return allBlocks
    .filter(
      (b) =>
        b.type === 'table_row' &&
        b.parent?.type === 'block_id' &&
        b.parent?.block_id === tableBlock.id
    )
    .sort((a, b) => a.created_time.localeCompare(b.created_time));
};
```

**3. 分栏收集**

```typescript
const collectColumns = (
  columnListBlock: NotionBlock,
  allBlocks: NotionBlock[]
): ColumnBlock[] => {
  // column_list 的 children 是 column blocks
  return allBlocks
    .filter(
      (b) => b.type === 'column' && b.parent?.block_id === columnListBlock.id
    )
    .sort((a, b) => a.created_time.localeCompare(b.created_time));
};
```

---

## 第四部分：样式系统

### CSS 模块组织

样式文件与组件文件放在同一目录下，例如：

```
src/components/notion/blocks/
├── text/
│   ├── Callout.tsx
│   ├── Callout.module.css
│   ├── Todo.tsx
│   └── Todo.module.css
└── ...
```

主要样式类别：

- `.callout` - 提示框样式，支持多种颜色变体
- `.todo` - 复选框任务样式
- `.toggle` - 可折叠内容样式
- `.columnList` / `.column` - 分栏布局样式
- `.tableWrapper` / `.table` - 表格样式
- `.mediaAttachment` - 通用媒体附件样式
- `.equation` - 公式样式
- `.linkPreview` - 链接预览样式
- `.syncedBlock` - 同步块样式

完整样式定义请参见项目文件 `src/styles/blog-post.module.css`。

---

## 第五部分：测试策略

### 测试文件组织

```
src/test/notion/
├── blocks/
│   ├── Callout.test.tsx
│   ├── Todo.test.tsx
│   ├── Toggle.test.tsx
│   ├── Table.test.tsx
│   ├── ColumnList.test.tsx
│   ├── Equation.test.tsx
│   └── LinkPreview.test.tsx
├── utils/
│   ├── block分类.test.ts
│   └── richText.test.ts
└── fixtures/
    ├── notionBlocks.ts          # Mock Notion block 数据
    └── expectedRender.tsx       # 预期渲染结果
```

### 测试覆盖范围

**单元测试**：每个组件独立测试

- 渲染正确的内容
- Props 传递正确
- 交互行为正确
- 边界情况处理

**集成测试**：多个组件协作测试

- BlockRenderer 整体功能
- 嵌套 block 渲染
- 状态管理正确性

---

## 第六部分：实施计划

### 阶段划分

| 阶段 | 内容                                | 预计时间 |
| ---- | ----------------------------------- | -------- |
| 1    | 基础文本类（Callout, Todo）         | 1-2天    |
| 2    | 列表类（Toggle）                    | 1天      |
| 3    | 媒体文件类（Audio, File, PDF）      | 1天      |
| 4    | 嵌入内容类（Equation, LinkPreview） | 1天      |
| 5    | 布局类（Divider, Column, Table）    | 2天      |
| 6    | 特殊类（SyncedBlock）               | 0.5天    |
| 7    | 测试和优化                          | 1天      |

### 依赖包需求

```json
{
  "dependencies": {
    "katex": "^0.16.0",
    "react-katex": "^3.0.0"
  }
}
```

KaTeX 用于数学公式渲染。

---

## 附录

### 参考资料

- [Notion API Block Reference](https://developers.notion.com/reference/block)
- 项目现有代码：`src/app/blog/[slug]/BlogPostClient.tsx`
- 项目现有样式：`src/styles/blog-post.module.css`

### 已实现 Block 类型

- paragraph ✅
- heading_1/2/3 ✅
- bulleted_list_item ✅
- numbered_list_item ✅
- quote ✅
- code ✅
- image ✅
- video ✅
- bookmark ✅

### 待实现 Block 类型

- callout - 提示框
- to_do - 复选框任务
- toggle - 可折叠内容
- audio - 音频
- file - 文件附件
- pdf - PDF 文件
- divider - 分隔线
- link_preview - 链接预览
- equation - 公式
- column_list / column - 分栏布局
- table / table_row - 表格
- synced_block - 同步块
