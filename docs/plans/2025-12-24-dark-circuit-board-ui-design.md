# 暗黑工业风电路板 UI 设计文档

**日期:** 2025-12-24
**项目:** MiantuBlog (Notion-based Blog)
**设计方向:** 简洁电路板工业风

---

## 1. 概述

将现有艺术彩色风格博客重新设计为暗黑工业风格，强调极简、科技感和工程美学。

### 1.1 设计目标

- **视觉风格:** 暗黑工业风 - 纯黑背景 + 细白电路走线
- **交互体验:** 全新电路板主题交互（鼠标电流追踪）
- **布局系统:** 像电路板组件阵列一样的网格布局
- **导航风格:** 终端命令行风格
- **配色方案:** 黑白为主 + 终端绿/电光蓝双色强调

---

## 2. 配色系统

### 2.1 基础色彩

| 用途               | 颜色值                     | 说明                      |
| ------------------ | -------------------------- | ------------------------- |
| 背景色             | `#0a0a0a`                  | 近乎纯黑，比纯#000更柔和  |
| 电路走线（未通电） | `rgba(255, 255, 255, 0.1)` | 低透明度白色              |
| 主强调色           | `#00ff41`                  | 终端绿，用于主要交互/链接 |
| 次强调色           | `#00d4ff`                  | 电光蓝，用于次要元素      |
| 文字主色           | `#e8e8e8`                  | 主要正文内容              |
| 文字次色           | `rgba(232, 232, 232, 0.6)` | 次要信息                  |
| 代码块背景         | `#1a1a1a`                  | 深灰色                    |

### 2.2 CSS 变量定义

```css
:root {
  /* Base colors */
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-tertiary: #1a1a1a;

  /* Circuit colors */
  --circuit-idle: rgba(255, 255, 255, 0.1);
  --circuit-active: #00ff41;

  /* Accent colors */
  --accent-primary: #00ff41; /* Terminal green */
  --accent-secondary: #00d4ff; /* Electric blue */

  /* Text colors */
  --text-primary: #e8e8e8;
  --text-secondary: rgba(232, 232, 232, 0.6);
  --text-tertiary: rgba(232, 232, 232, 0.4);

  /* Typography */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
}
```

---

## 3. 布局系统

### 3.1 网格系统

基于 CSS Grid 的响应式网格：

| 断点                  | 列数   | 说明     |
| --------------------- | ------ | -------- |
| 移动端 (< 640px)      | 1 列   | 单列布局 |
| 平板 (640px - 1024px) | 2-3 列 | 中等密度 |
| 桌面 (> 1024px)       | 4 列   | 完整阵列 |

### 3.2 首页结构

```
┌─────────────────────────────────────────┐
│  [终端导航栏]                           │
├─────────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│  │ LOGO │ │芯片1│ │芯片2│ │芯片3│       │
│  └─────┘ └─────┘ └─────┘ └─────┘       │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│  │芯片4│ │芯片5│ │芯片6│ │芯片7│       │
│  └─────┘ └─────┘ └─────┘ └─────┘       │
│  [底部终端信息]                         │
└─────────────────────────────────────────┘
```

### 3.3 芯片模块（文章卡片）

每个内容单元是一个"芯片模块"：

```tsx
<div className="chip-module">
  <span className="chip-id">CHIP-001</span>
  <h3>文章标题</h3>
  <div className="chip-metadata">
    <span>2025-12-24</span>
    <span className="tag-dot"></span>
    <span>技术</span>
  </div>
  <p>文章摘要...</p>
</div>
```

---

## 4. 导航设计

### 4.1 终端风格头部

```
root@miantu:~# [home] [blog] [about] [contact]
```

**样式规范：**

- 使用等宽字体
- `root@miantu:~#` 固定命令提示符
- 导航项用方括号包裹
- 悬停效果：方括号内填充终端绿，文字变黑，出现闪烁光标

### 4.2 面包屑导航

单篇文章页顶部面包屑：

```
/home/blog/post-slug
```

---

## 5. 交互设计

### 5.1 鼠标电流追踪

使用 Canvas 实现的交互层：

**技术实现：**

- 监听鼠标移动事件
- 生成贝塞尔曲线路径连接到最近焊盘
- 颜色渐变：终端绿 → 电光蓝
- 衰减时间：1-2 秒
- 移动速度越快，电流越亮

### 5.2 芯片悬停效果

- 边框发光（终端绿模糊扩散）
- 内部电路"通电"流动动画
- 轻微上浮 2-3px

### 5.3 通电动画

使用 SVG `stroke-dashoffset` 实现：

```css
@keyframes circuit-flow {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.circuit-active {
  stroke-dasharray: 10 5;
  animation: circuit-flow 2s linear infinite;
}
```

---

## 6. 组件样式

### 6.1 芯片模块 CSS

```css
.chip-module {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chip-module::before {
  /* 四角焊点装饰 */
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.chip-module:hover {
  border-color: var(--accent-primary);
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
  transform: translateY(-2px);
}
```

### 6.2 代码块样式

```css
pre {
  background: var(--bg-tertiary);
  border: 1px solid var(--circuit-idle);
  border-left: 3px solid var(--accent-primary);
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
}
```

---

## 7. 电路板背景

### 7.1 静态背景

使用 CSS/SVG 绘制：

- 45° 角折线风格（真实 PCB 走线）
- 走线宽度 1-2px
- 透明度 10%
- 关键交叉点设置焊盘圆点（3px）

### 7.2 走线风格

**主框架：** 直角走线（45° 折线）
**交互效果：** 贝塞尔曲线连接

---

## 8. 动画细节

### 8.1 终端打字效果

页面加载时重要文字使用打字机效果：

- 逐字显示
- 伴随光标闪烁
- 可通过配置开关控制

### 8.2 光标闪烁

```css
@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.cursor-blink {
  animation: blink 1s infinite;
}
```

---

## 9. 移动端适配

### 9.1 布局调整

- 网格变为 1-2 列
- 简化装饰元素
- 导航栏改为可折叠汉堡菜单（终端风格）

### 9.2 交互优化

- 保留触摸触发电流效果
- 禁用复杂装饰动画
- 确保文字可读性

### 9.3 性能优化

- 禁用粒子场等高消耗效果
- 减少动画数量
- 使用更简单的 CSS 渐变

---

## 10. 性能优化

### 10.1 渲染优化

- 电流效果使用 Canvas，限制帧率到 30fps
- 装饰性 SVG 使用 CSS `will-change`
- 使用 `requestAnimationFrame` 优化动画

### 10.2 资源优化

- 等宽字体按需加载
- SVG 背景内联或使用雪碧图
- 懒加载非首屏内容

### 10.3 减少媒体查询

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }

  .current-canvas,
  .circuit-decoration {
    display: none !important;
  }
}
```

---

## 11. 文件结构

```
src/
├── styles/
│   ├── circuit-theme.css          # 电路板主题核心样式
│   ├── circuit-grid.css           # 网格布局
│   └── circuit-animations.css     # 动画定义
├── components/
│   ├── circuit/
│   │   ├── ChipCard.tsx           # 芯片卡片组件
│   │   ├── TerminalNav.tsx        # 终端导航
│   │   ├── CurrentCanvas.tsx      # 电流追踪 Canvas
│   │   └── CircuitBackground.tsx  # 电路背景
│   └── ...
└── app/
    ├── layout.tsx                 # 更新为主题布局
    ├── page.tsx                   # 首页（网格布局）
    └── blog/
        ├── page.tsx               # 博客列表
        └── [slug]/
            └── page.tsx           # 单篇文章
```

---

## 12. 实施清单

### 12.1 核心样式

- [ ] 创建 `circuit-theme.css` 定义 CSS 变量和基础样式
- [ ] 创建 `circuit-grid.css` 实现网格布局
- [ ] 创建 `circuit-animations.css` 定义动画

### 12.2 组件开发

- [ ] `CircuitBackground.tsx` - 静态电路背景
- [ ] `CurrentCanvas.tsx` - 鼠标电流追踪
- [ ] `TerminalNav.tsx` - 终端风格导航
- [ ] `ChipCard.tsx` - 芯片卡片组件

### 12.3 页面更新

- [ ] 更新 `layout.tsx` 应用新主题
- [ ] 更新 `page.tsx` 为网格布局
- [ ] 更新博客列表页
- [ ] 更新单篇文章页

### 12.4 移除旧代码

- [ ] 移除/替换 `src/components/decorations/` 下的旧装饰组件
- [ ] 清理旧的颜色变量和渐变样式

### 12.5 测试

- [ ] 响应式测试（移动端/平板/桌面）
- [ ] 性能测试（Lighthouse）
- [ ] 可访问性测试
- [ ] 跨浏览器测试

---

## 13. 设计参考

**视觉灵感：**

- 印刷电路板（PCB）美学
- 终端/命令行界面
- 赛博朋克工业风格

**技术参考：**

- CSS Grid 布局
- Canvas 交互效果
- SVG 路径动画
- CSS 自定义属性

---

**文档版本:** 1.0
**最后更新:** 2025-12-24
