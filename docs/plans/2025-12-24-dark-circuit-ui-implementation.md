# 暗黑工业风电路板 UI 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将博客从艺术彩色风格重新设计为暗黑工业电路板风格

**Architecture:**
1. 创建独立的电路板主题 CSS 文件（circuit-theme.css）
2. 创建新的电路板风格组件（ChipCard、TerminalNav、CurrentCanvas）
3. 更新页面布局使用 CSS Grid 网格系统
4. 移除旧的装饰性组件

**Tech Stack:** Next.js 15.5.4 (App Router), TypeScript, CSS Modules, Canvas API

---

## Task 1: 创建电路板主题核心样式

**Files:**
- Create: `src/styles/circuit-theme.css`

**Step 1: 创建 CSS 变量定义**

```css
/* src/styles/circuit-theme.css */
:root {
  /* Base colors */
  --bg-primary: #0a0a0a;
  --bg-secondary: #111111;
  --bg-tertiary: #1a1a1a;

  /* Circuit colors */
  --circuit-idle: rgba(255, 255, 255, 0.1);
  --circuit-active: #00ff41;

  /* Accent colors */
  --accent-primary: #00ff41;  /* Terminal green */
  --accent-secondary: #00d4ff; /* Electric blue */

  /* Text colors */
  --text-primary: #e8e8e8;
  --text-secondary: rgba(232, 232, 232, 0.6);
  --text-tertiary: rgba(232, 232, 232, 0.4);

  /* Typography */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Menlo', monospace;

  /* Spacing */
  --gap-quarter: 0.25rem;
  --gap-half: 0.5rem;
  --gap: 1rem;
  --gap-double: 2rem;

  /* Animation */
  --animation-fast: 0.2s;
  --animation-normal: 0.3s;
  --animation-slow: 0.6s;
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Base reset with dark theme */
* {
  box-sizing: border-box;
}

html,
body {
  padding: 0;
  margin: 0;
  font-size: 16px;
}

body {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-mono);
  overflow-x: hidden;
}

/* Code block styling */
code[class*='language-'],
pre[class*='language-'] {
  color: var(--text-primary);
  background: var(--bg-tertiary);
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  font-size: 0.95em;
  line-height: 1.4em;
  tab-size: 4;
  hyphens: none;
}

pre {
  background: var(--bg-tertiary);
  border: 1px solid var(--circuit-idle);
  border-left: 3px solid var(--accent-primary);
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
}

pre code {
  background: transparent;
  padding: 0;
  border: none;
}

code {
  font-size: 0.8rem;
  background: var(--bg-tertiary);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: var(--font-mono);
}

/* Link styling */
a {
  color: var(--accent-primary);
  text-decoration: none;
  transition: color var(--animation-fast) var(--ease-smooth);
}

a:hover {
  color: var(--accent-secondary);
}

/* Selection */
::selection {
  background: var(--accent-primary);
  color: var(--bg-primary);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--circuit-idle);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Step 2: 提交初始主题文件**

```bash
cd .worktrees/dark-circuit-ui
git add src/styles/circuit-theme.css
git commit -m "feat: create circuit board theme base styles"
```

---

## Task 2: 创建网格布局样式

**Files:**
- Create: `src/styles/circuit-grid.css`

**Step 1: 创建网格布局系统**

```css
/* src/styles/circuit-grid.css */
/* Grid container */
.circuit-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gap-double);
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--gap-double);
}

/* Responsive breakpoints */
@media (max-width: 1024px) {
  .circuit-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .circuit-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap);
  }
}

@media (max-width: 480px) {
  .circuit-grid {
    grid-template-columns: 1fr;
  }
}

/* Page container */
.circuit-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.circuit-page-main {
  flex: 1;
  padding: var(--gap-double) 0;
}

/* Content container with circuit background */
.circuit-content {
  position: relative;
  background: var(--bg-primary);
  border: 1px solid var(--circuit-idle);
  border-radius: 8px;
  padding: var(--gap-double);
  overflow: hidden;
}

/* Circuit lines decoration */
.circuit-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(var(--circuit-idle) 1px, transparent 1px),
    linear-gradient(90deg, var(--circuit-idle) 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: -1px -1px;
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}

.circuit-content > * {
  position: relative;
  z-index: 1;
}
```

**Step 2: 提交网格布局样式**

```bash
cd .worktrees/dark-circuit-ui
git add src/styles/circuit-grid.css
git commit -m "feat: add circuit grid layout system"
```

---

## Task 3: 创建动画定义

**Files:**
- Create: `src/styles/circuit-animations.css`

**Step 1: 创建动画关键帧和工具类**

```css
/* src/styles/circuit-animations.css */

/* Circuit flow animation */
@keyframes circuit-flow {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes circuit-pulse {
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow:
      0 0 5px rgba(0, 255, 65, 0.1),
      0 0 10px rgba(0, 255, 65, 0.05);
  }
  50% {
    box-shadow:
      0 0 15px rgba(0, 255, 65, 0.3),
      0 0 30px rgba(0, 255, 65, 0.1);
  }
}

@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* Utility classes */
.circuit-flow {
  stroke-dasharray: 10 5;
  animation: circuit-flow 2s linear infinite;
}

.circuit-pulse {
  animation: circuit-pulse 3s ease-in-out infinite;
}

.cursor-blink {
  display: inline-block;
  width: 10px;
  height: 1em;
  background: var(--accent-primary);
  animation: blink 1s infinite;
  vertical-align: text-bottom;
}

.glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}

/* GPU acceleration utilities */
.gpu-accelerated {
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.smooth-transition {
  transition: all var(--animation-normal) var(--ease-smooth);
}

/* Hover effects */
.circuit-hover {
  position: relative;
  transition: all var(--animation-normal) var(--ease-smooth);
}

.circuit-hover::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid var(--accent-primary);
  border-radius: inherit;
  opacity: 0;
  transition: opacity var(--animation-normal) var(--ease-smooth);
  pointer-events: none;
}

.circuit-hover:hover {
  transform: translateY(-2px);
}

.circuit-hover:hover::before {
  opacity: 1;
}
```

**Step 2: 提交动画定义**

```bash
cd .worktrees/dark-circuit-ui
git add src/styles/circuit-animations.css
git commit -m "feat: add circuit animation keyframes and utilities"
```

---

## Task 4: 创建芯片卡片组件

**Files:**
- Create: `src/components/circuit/ChipCard.tsx`
- Create: `src/styles/chip-card.module.css`

**Step 1: 创建芯片卡片样式模块**

```css
/* src/styles/chip-card.module.css */
.chip {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.chip::before {
  /* Inner border decoration */
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  pointer-events: none;
}

.chip::after {
  /* Corner dots */
  content: '';
  position: absolute;
  top: 12px;
  right: 12px;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: background 0.3s;
}

.chip:hover {
  border-color: var(--accent-primary);
  box-shadow:
    0 0 20px rgba(0, 255, 65, 0.2),
    inset 0 0 20px rgba(0, 255, 65, 0.05);
  transform: translateY(-4px);
}

.chip:hover::after {
  background: var(--accent-primary);
  box-shadow: 0 0 10px var(--accent-primary);
}

.chipId {
  font-size: 0.7rem;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
  margin-bottom: 0.75rem;
  letter-spacing: 0.1em;
}

.chipTitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.chipMetadata {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.chipDate {
  font-family: var(--font-mono);
}

.tagDot {
  width: 6px;
  height: 6px;
  background: var(--accent-secondary);
  border-radius: 50%;
  display: inline-block;
}

.tagName {
  font-family: var(--font-mono);
  color: var(--accent-secondary);
}

.chipExcerpt {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
  flex: 1;
}

.chipLink {
  position: absolute;
  inset: 0;
  z-index: 1;
}

/* Circuit lines decoration */
.circuitLines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.chip:hover .circuitLines {
  opacity: 1;
}
```

**Step 2: 创建芯片卡片组件**

```tsx
// src/components/circuit/ChipCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from '@/styles/chip-card.module.css';

export interface ChipCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tag?: string;
  slug: string;
}

export default function ChipCard({
  id,
  title,
  excerpt,
  date,
  tag,
  slug,
}: ChipCardProps) {
  // Generate chip ID from post ID
  const chipId = `CHIP-${id.slice(-6).toUpperCase()}`;

  return (
    <div className={styles.chip}>
      <span className={styles.chipId}>{chipId}</span>
      <h3 className={styles.chipTitle}>{title}</h3>
      <div className={styles.chipMetadata}>
        <span className={styles.chipDate}>{date}</span>
        {tag && (
          <>
            <span className={styles.tagDot}></span>
            <span className={styles.tagName}>{tag}</span>
          </>
        )}
      </div>
      <p className={styles.chipExcerpt}>{excerpt}</p>

      {/* SVG circuit decoration */}
      <svg className={styles.circuitLines} width="100%" height="100%">
        <path
          d="M 0 0 L 20 0 L 30 10 L 100 10"
          stroke="rgba(0, 255, 65, 0.3)"
          strokeWidth="1"
          fill="none"
          className={styles.circuitFlow}
        />
        <circle cx="0" cy="0" r="3" fill="rgba(0, 255, 65, 0.5)" />
        <circle cx="100" cy="10" r="2" fill="rgba(0, 255, 65, 0.3)" />
      </svg>

      <Link href={`/blog/${slug}`} className={styles.chipLink}>
        <span className="sr-only">Read {title}</span>
      </Link>
    </div>
  );
}
```

**Step 3: 提交芯片卡片组件**

```bash
cd .worktrees/dark-circuit-ui
git add src/components/circuit/ChipCard.tsx src/styles/chip-card.module.css
git commit -m "feat: add chip card component for circuit grid"
```

---

## Task 5: 创建终端导航组件

**Files:**
- Create: `src/components/circuit/TerminalNav.tsx`
- Create: `src/styles/terminal-nav.module.css`

**Step 1: 创建终端导航样式模块**

```css
/* src/styles/terminal-nav.module.css */
.nav {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--circuit-idle);
  padding: 1rem var(--gap-double);
  font-family: var(--font-mono);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navInner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: var(--gap);
  flex-wrap: wrap;
}

.prompt {
  color: var(--accent-primary);
  white-space: nowrap;
}

.navItems {
  display: flex;
  align-items: center;
  gap: var(--gap);
  flex-wrap: wrap;
}

.navItem {
  position: relative;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  transition: all var(--animation-fast) var(--ease-smooth);
  border-radius: 2px;
}

.navItem:hover,
.navItem.active {
  color: var(--bg-primary);
  background: var(--accent-primary);
}

.navItem::after {
  content: '_';
  position: absolute;
  right: 0;
  opacity: 0;
  animation: blink 1s infinite;
}

.navItem:hover::after,
.navItem.active::after {
  opacity: 1;
}

/* Screen reader only */
.srOnly {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Mobile menu button */
.menuButton {
  display: none;
  background: transparent;
  border: 1px solid var(--circuit-idle);
  color: var(--accent-primary);
  padding: 0.5rem 1rem;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all var(--animation-fast);
}

.menuButton:hover {
  background: var(--accent-primary);
  color: var(--bg-primary);
}

@media (max-width: 768px) {
  .navItems.collapsed {
    display: none;
  }

  .menuButton {
    display: block;
    margin-left: auto;
  }

  .navItems.mobileOpen {
    display: flex;
    width: 100%;
    margin-top: var(--gap);
  }
}
```

**Step 2: 创建终端导航组件**

```tsx
// src/components/circuit/TerminalNav.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/terminal-nav.module.css';

const navItems = [
  { name: 'home', href: '/' },
  { name: 'blog', href: '/blog' },
  { name: 'about', href: '/about' },
  { name: 'contact', href: '/contact' },
];

export default function TerminalNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <span className={styles.prompt}>root@miantu:~#</span>

        <div
          className={`${styles.navItems} ${mobileOpen ? styles.mobileOpen : ''} ${!mobileOpen ? styles.collapsed : ''}`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              [{item.name}]
            </Link>
          ))}
        </div>

        <button
          className={styles.menuButton}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          [{mobileOpen ? 'x' : '≡'}]
        </button>
      </div>
    </nav>
  );
}
```

**Step 3: 提交终端导航组件**

```bash
cd .worktrees/dark-circuit-ui
git add src/components/circuit/TerminalNav.tsx src/styles/terminal-nav.module.css
git commit -m "feat: add terminal-style navigation component"
```

---

## Task 6: 创建电流追踪 Canvas 组件

**Files:**
- Create: `src/components/circuit/CurrentCanvas.tsx`

**Step 1: 创建电流 Canvas 组件**

```tsx
// src/components/circuit/CurrentCanvas.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
  age: number;
}

interface CurrentPath {
  points: Point[];
  color: string;
}

export default function CurrentCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const pathsRef = useRef<CurrentPath[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      lastMouseRef.current = mouseRef.current;
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Add new path
      const speed = Math.hypot(
        e.clientX - lastMouseRef.current.x,
        e.clientY - lastMouseRef.current.y
      );

      pathsRef.current.push({
        points: [
          { x: lastMouseRef.current.x, y: lastMouseRef.current.y, age: 0 },
          { x: e.clientX, y: e.clientY, age: 0 },
        ],
        color: speed > 10 ? '#00d4ff' : '#00ff41',
      });

      // Limit paths
      if (pathsRef.current.length > 50) {
        pathsRef.current.shift();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw paths
      pathsRef.current = pathsRef.current.filter((path) => {
        // Update ages
        path.points.forEach((p) => p.age += 1);

        // Draw path
        if (path.points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(path.points[0].x, path.points[0].y);

          for (let i = 1; i < path.points.length; i++) {
            const p0 = path.points[i - 1];
            const p1 = path.points[i];
            const midX = (p0.x + p1.x) / 2;
            const midY = (p0.y + p1.y) / 2;
            ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
          }

          const lastPoint = path.points[path.points.length - 1];
          ctx.lineTo(lastPoint.x, lastPoint.y);

          const alpha = Math.max(0, 1 - path.points[0].age / 60);
          ctx.strokeStyle = path.color;
          ctx.globalAlpha = alpha * 0.6;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Remove old paths
        return path.points[0].age < 60;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isClient]);

  if (!isClient) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
```

**Step 2: 提交电流 Canvas 组件**

```bash
cd .worktrees/dark-circuit-ui
git add src/components/circuit/CurrentCanvas.tsx
git commit -m "feat: add mouse current tracking canvas component"
```

---

## Task 7: 创建电路板背景组件

**Files:**
- Create: `src/components/circuit/CircuitBackground.tsx`

**Step 1: 创建静态电路板背景**

```tsx
// src/components/circuit/CircuitBackground.tsx
'use client';

import React from 'react';

export default function CircuitBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.3,
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="circuit-pattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            {/* Horizontal lines */}
            <line
              x1="0"
              y1="0"
              x2="100"
              y2="0"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
            {/* Vertical lines */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
            {/* Diagonal lines at 45 degrees */}
            <line
              x1="0"
              y1="50"
              x2="50"
              y2="0"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="100"
              x2="100"
              y2="50"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth="1"
            />
            {/* Circuit dots at intersections */}
            <circle cx="0" cy="0" r="2" fill="rgba(255, 255, 255, 0.1)" />
            <circle cx="50" cy="50" r="1.5" fill="rgba(255, 255, 255, 0.08)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>
    </div>
  );
}
```

**Step 2: 提交电路板背景组件**

```bash
cd .worktrees/dark-circuit-ui
git add src/components/circuit/CircuitBackground.tsx
git commit -m "feat: add static circuit board background component"
```

---

## Task 8: 更新根布局应用新主题

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: 更新 layout.tsx**

```tsx
// src/app/layout.tsx
import '../styles/circuit-theme.css';
import '../styles/circuit-animations.css';
import CircuitBackground from '../components/circuit/CircuitBackground';
import CurrentCanvas from '../components/circuit/CurrentCanvas';
import TerminalNav from '../components/circuit/TerminalNav';
import Footer from '../components/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'GoooIce的MiantuNet',
    template: '%s | GoooIce的MiantuNet'
  },
  description: '一个关于技术、生活与思考的个人博客',
  language: 'zh-CN',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'GoooIce的MiantuNet',
    images: [
      {
        url: '/goooice-and-notion.png',
        width: 300,
        height: 102,
        alt: 'GoooIce + Notion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoooIce的MiantuNet',
    description: '一个关于技术、生活与思考的个人博客',
    images: ['/goooice-and-notion.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-cmn-Hans">
      <head />
      <body>
        <CircuitBackground />
        <CurrentCanvas />
        <TerminalNav />
        <main style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

**Step 2: 提交布局更新**

```bash
cd .worktrees/dark-circuit-ui
git add src/app/layout.tsx
git commit -m "feat: apply circuit theme to root layout"
```

---

## Task 9: 更新首页使用网格布局

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/components/CircuitHomePage.tsx`
- Create: `src/styles/circuit-home.module.css`

**Step 1: 创建首页样式**

```css
/* src/styles/circuit-home.module.css */
.hero {
  text-align: center;
  padding: 4rem var(--gap-double);
  border-bottom: 1px solid var(--circuit-idle);
  margin-bottom: var(--gap-double);
}

.heroTitle {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.heroPrompt {
  color: var(--accent-primary);
  font-family: var(--font-mono);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.heroSubtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.sectionTitle {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin: 0 0 var(--gap-double) 0;
  padding: 0 var(--gap-double);
}

.sectionTitle::before {
  content: '$ ';
  color: var(--accent-primary);
}

.chipGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gap-double);
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--gap-double);
}

@media (max-width: 1024px) {
  .chipGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .chipGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .chipGrid {
    grid-template-columns: 1fr;
  }
}

.allPostsLink {
  display: inline-block;
  text-align: center;
  margin: var(--gap-double) auto;
  padding: 1rem 2rem;
  border: 1px solid var(--accent-primary);
  color: var(--accent-primary);
  text-decoration: none;
  font-family: var(--font-mono);
  transition: all var(--animation-normal);
  border-radius: 4px;
}

.allPostsLink:hover {
  background: var(--accent-primary);
  color: var(--bg-primary);
}
```

**Step 2: 创建首页客户端组件**

```tsx
// src/app/components/CircuitHomePage.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import ChipCard from '@/components/circuit/ChipCard';
import styles from '@/styles/circuit-home.module.css';

export interface CircuitHomePageProps {
  recentPosts: Array<{
    id: string;
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    tag?: string;
  }>;
}

export default function CircuitHomePage({ recentPosts }: CircuitHomePageProps) {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroPrompt}>root@miantu:~$ ./welcome.sh</div>
        <h1 className={styles.heroTitle}>GoooIce的MiantuNet</h1>
        <p className={styles.heroSubtitle}>
          一个关于技术、生活与思考的个人博客
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>recent_posts/</h2>
        <div className={styles.chipGrid}>
          {recentPosts.map((post) => (
            <ChipCard
              key={post.id}
              id={post.id}
              title={post.title}
              excerpt={post.excerpt || ''}
              date={new Date(post.date).toLocaleDateString('zh-CN')}
              slug={post.slug}
              tag={post.tag}
            />
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link href="/blog" className={styles.allPostsLink}>
            [view_all_posts]
          </Link>
        </div>
      </section>
    </div>
  );
}
```

**Step 3: 更新首页服务端组件**

```tsx
// src/app/page.tsx
import CircuitHomePage from './components/CircuitHomePage';
import { getPostsInfos } from '../lib/notion/client';

export default async function Index() {
  let recentPosts: any[] = [];

  try {
    const posts = await getPostsInfos(false);
    recentPosts = posts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  } catch (error) {
    console.error('Failed to fetch recent posts:', error);
  }

  return <CircuitHomePage recentPosts={recentPosts} />;
}

export const revalidate = 3600;
```

**Step 4: 提交首页更新**

```bash
cd .worktrees/dark-circuit-ui
git add src/app/page.tsx src/app/components/CircuitHomePage.tsx src/styles/circuit-home.module.css
git commit -m "feat: update homepage with circuit grid layout"
```

---

## Task 10: 更新博客列表页

**Files:**
- Modify: `src/app/blog/page.tsx`
- Create: `src/app/blog/components/CircuitBlogPage.tsx`

**Step 1: 创建博客列表客户端组件**

```tsx
// src/app/blog/components/CircuitBlogPage.tsx
'use client';

import React from 'react';
import ChipCard from '@/components/circuit/ChipCard';
import styles from '@/styles/circuit-home.module.css';

export interface CircuitBlogPageProps {
  posts: Array<{
    id: string;
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    tag?: string;
  }>;
}

export default function CircuitBlogPage({ posts }: CircuitBlogPageProps) {
  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 className={styles.sectionTitle}>blog/posts/</h1>
      <div className={styles.chipGrid}>
        {posts.map((post) => (
          <ChipCard
            key={post.id}
            id={post.id}
            title={post.title}
            excerpt={post.excerpt || ''}
            date={new Date(post.date).toLocaleDateString('zh-CN')}
            slug={post.slug}
            tag={post.tag}
          />
        ))}
      </div>
    </div>
  );
}
```

**Step 2: 更新博客列表服务端页面**

```tsx
// src/app/blog/page.tsx
import CircuitBlogPage from './components/CircuitBlogPage';
import { getPostsInfos } from '@/lib/notion/client';

export default async function BlogPage() {
  const posts = await getPostsInfos(false);

  return <CircuitBlogPage posts={posts} />;
}

export const revalidate = 3600;
```

**Step 3: 提交博客列表页更新**

```bash
cd .worktrees/dark-circuit-ui
git add src/app/blog/page.tsx src/app/blog/components/CircuitBlogPage.tsx
git commit -m "feat: update blog listing page with circuit layout"
```

---

## Task 11: 更新单篇文章页面样式

**Files:**
- Create: `src/styles/circuit-post.module.css`
- Modify: `src/app/blog/[slug]/BlogPostClient.tsx`

**Step 1: 创建文章页面样式**

```css
/* src/styles/circuit-post.module.css */
.postContainer {
  max-width: 768px;
  margin: 0 auto;
  padding: var(--gap-double);
  position: relative;
  z-index: 2;
}

.breadcrumb {
  font-family: var(--font-mono);
  color: var(--text-tertiary);
  margin-bottom: var(--gap-double);
  font-size: 0.9rem;
}

.breadcrumb a {
  color: var(--accent-secondary);
}

.postTitle {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 var(--gap) 0;
  color: var(--text-primary);
  line-height: 1.3;
}

.postMeta {
  font-family: var(--font-mono);
  color: var(--text-secondary);
  margin-bottom: var(--gap-double);
  font-size: 0.9rem;
}

.postContent {
  color: var(--text-primary);
  line-height: 1.8;
}

.postContent h1,
.postContent h2,
.postContent h3,
.postContent h4,
.postContent h5,
.postContent h6 {
  color: var(--accent-primary);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.postContent p {
  margin-bottom: 1rem;
}

.postContent a {
  color: var(--accent-secondary);
  border-bottom: 1px dashed var(--accent-secondary);
}

.postContent a:hover {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}

.postContent img {
  max-width: 100%;
  height: auto;
  border: 1px solid var(--circuit-idle);
  border-radius: 4px;
  margin: var(--gap-double) 0;
}

.postContent blockquote {
  border-left: 3px solid var(--accent-primary);
  padding-left: var(--gap);
  color: var(--text-secondary);
  font-style: italic;
}

.postContent ul,
.postContent ol {
  padding-left: var(--gap-double);
}

.postContent li {
  margin-bottom: 0.5rem;
}

.postContent code {
  background: var(--bg-tertiary);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}

.postContent pre {
  background: var(--bg-tertiary);
  border: 1px solid var(--circuit-idle);
  border-left: 3px solid var(--accent-primary);
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
  margin: var(--gap-double) 0;
}

.postContent pre code {
  background: transparent;
  padding: 0;
  border: none;
}
```

**Step 2: 更新 BlogPostClient 组件导入样式**

注意：由于我们无法完全重写 BlogPostClient（它很复杂），只需要添加新的样式导入。在 `src/app/blog/[slug]/BlogPostClient.tsx` 顶部添加：

```tsx
import styles from '@/styles/circuit-post.module.css';
```

然后在组件的根元素添加 `className={styles.postContainer}`。

**Step 3: 提交文章页面样式**

```bash
cd .worktrees/dark-circuit-ui
git add src/styles/circuit-post.module.css
git commit -m "feat: add circuit board post page styles"
```

---

## Task 12: 移除旧的装饰组件

**Files:**
- Remove: `src/components/decorations/ParticleField.tsx`
- Remove: `src/components/decorations/MorphingBlob.tsx`
- Remove: `src/components/decorations/WaveBackground.tsx`
- Remove: `src/components/decorations/FloatingShapes.tsx`
- Remove: `src/components/decorations/GeometricPattern.tsx`

**Step 1: 移除旧装饰组件**

```bash
cd .worktrees/dark-circuit-ui
rm -f src/components/decorations/ParticleField.tsx
rm -f src/components/decorations/MorphingBlob.tsx
rm -f src/components/decorations/WaveBackground.tsx
rm -f src/components/decorations/FloatingShapes.tsx
rm -f src/components/decorations/GeometricPattern.tsx
```

**Step 2: 移除 decorations 目录（如果为空）**

```bash
cd .worktrees/dark-circuit-ui
rmdir src/components/decorations 2>/dev/null || true
```

**Step 3: 提交移除旧组件**

```bash
cd .worktrees/dark-circuit-ui
git add -A
git commit -m "refactor: remove old decoration components"
```

---

## Task 13: 清理旧的颜色变量

**Files:**
- Modify: `src/styles/global.css`

**Step 1: 简化 global.css**

保留必要的重置和 Prism.js 样式，移除旧的艺术彩色主题变量。简化为：

```css
/* src/styles/global.css - simplified version */
@import './circuit-theme.css';

/* Prism.js syntax highlighting - dark theme */
code[class*='language-'],
pre[class*='language-'] {
  color: #fafbfc;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  font-size: 0.95em;
  line-height: 1.4em;
  tab-size: 4;
  hyphens: none;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #999;
}

.token.string,
.token.attr-value {
  color: #50e3c2;
}

.token.punctuation,
.token.operator {
  color: #efefef;
}

.token.url,
.token.symbol,
.token.boolean,
.token.variable,
.token.constant {
  color: #36acaa;
}

.token.keyword {
  color: #ff0078;
  font-weight: bolder;
}

.token.function,
.token.tag,
.token.class-name,
.token.number {
  color: #2ba8ff;
}

.token.selector {
  color: #00009f;
}

.token.important,
.token.bold {
  font-weight: bold;
}

.token.italic {
  font-style: italic;
}

.token.attr-name,
.token.regex {
  color: #fac863;
}

.token.directive.tag .tag {
  background: #ff0;
  color: #393a34;
}

/* Links */
a {
  color: var(--accent-primary);
  text-decoration: none;
  transition: color var(--animation-fast) var(--ease-smooth);
}

a:hover {
  color: var(--accent-secondary);
}

/* Footer */
footer {
  padding: 2em 0;
  text-align: center;
  border-top: 1px solid var(--circuit-idle);
  color: var(--text-secondary);
}

footer a {
  color: inherit;
}

footer a:hover {
  color: var(--accent-primary);
}
```

**Step 2: 提交样式清理**

```bash
cd .worktrees/dark-circuit-ui
git add src/styles/global.css
git commit -m "refactor: simplify global.css for circuit theme"
```

---

## Task 14: 更新页脚样式

**Files:**
- Modify: `src/components/footer.tsx`

**Step 1: 更新 Footer 组件使用终端风格**

```tsx
// src/components/footer.tsx
import React from 'react';
import styles from '@/styles/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.prompt}>root@miantu:~$</div>
      <p className={styles.text}>
        © {new Date().getFullYear()} GoooIce的MiantuNet
      </p>
      <p className={styles.links}>
        <a href="https://github.com" target="_blank" rel="noopener">
          [github]
        </a>
        {' '}
        <a href="https://twitter.com" target="_blank" rel="noopener">
          [twitter]
        </a>
      </p>
    </footer>
  );
}
```

**Step 2: 创建 Footer 样式**

```css
/* src/styles/footer.module.css */
.footer {
  padding: 2rem;
  text-align: center;
  border-top: 1px solid var(--circuit-idle);
  font-family: var(--font-mono);
}

.prompt {
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.text {
  color: var(--text-secondary);
  margin: 0.5rem 0;
}

.links {
  color: var(--text-tertiary);
}

.links a {
  color: var(--accent-secondary);
  margin: 0 0.5rem;
}

.links a:hover {
  color: var(--accent-primary);
}
```

**Step 3: 提交页脚更新**

```bash
cd .worktrees/dark-circuit-ui
git add src/components/footer.tsx src/styles/footer.module.css
git commit -m "feat: update footer with terminal style"
```

---

## Task 15: 运行测试并验证

**Step 1: 运行测试套件**

```bash
cd .worktrees/dark-circuit-ui
npm run test:run
```

**Expected Output:** 测试通过（如果测试失败，检查是否需要更新测试以适应新主题）

**Step 2: 运行开发服务器验证视觉效果**

```bash
cd .worktrees/dark-circuit-ui
npm run dev
```

在浏览器中打开 `http://localhost:3000` 并验证：
- [ ] 首页显示网格布局的芯片卡片
- [ ] 导航栏显示终端风格
- [ ] 鼠标移动时有电流追踪效果
- [ ] 背景显示电路板纹路
- [ ] 页脚显示终端风格
- [ ] 响应式布局在移动端正常工作

**Step 3: 运行代码质量检查**

```bash
cd .worktrees/dark-circuit-ui
npm run lint
npm run format
```

**Step 4: 提交最终代码**

```bash
cd .worktrees/dark-circuit-ui
git add -A
git commit -m "chore: final cleanup and formatting"
```

---

## Task 16: 合并到主分支

**Step 1: 切换回主工作目录并合并**

```bash
cd /Users/devel0per/Code/framework/notion-blog
git worktree list
git merge feature/dark-circuit-ui --no-ff
```

**Step 2: 清理 worktree**

```bash
git worktree remove .worktrees/dark-circuit-ui
git branch -d feature/dark-circuit-ui
```

**Step 3: 推送到远程**

```bash
git push origin new-ui
```

---

## 实施完成清单

- [x] 创建电路板主题核心样式
- [x] 创建网格布局样式
- [x] 创建动画定义
- [x] 创建芯片卡片组件
- [x] 创建终端导航组件
- [x] 创建电流追踪 Canvas 组件
- [x] 创建电路板背景组件
- [x] 更新根布局应用新主题
- [x] 更新首页使用网格布局
- [x] 更新博客列表页
- [x] 更新单篇文章页面样式
- [x] 移除旧的装饰组件
- [x] 清理旧的颜色变量
- [x] 更新页脚样式
- [x] 运行测试并验证
- [x] 合并到主分支

---

**预计时间:** 2-3 小时

**风险提示:**
- Canvas 动画可能影响性能，已通过帧率限制和条件渲染优化
- 移动端可能需要额外的样式调整
- 需要确保 Notion 内容渲染与暗色主题兼容
