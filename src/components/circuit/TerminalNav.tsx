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
