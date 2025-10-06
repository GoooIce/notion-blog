'use client';

import Link from 'next/link';
import ExtLink from './ext-link';
import { usePathname } from 'next/navigation';
import styles from '../styles/header.module.css';

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Home', page: '/' },
  { label: 'Blog', page: '/blog' },
  { label: 'Contact', page: '/contact' },
  { label: 'Source Code', link: 'https://github.com/goooice/notion-blog' },
];

const Header = ({ titlePre = '' }) => {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <Link href="/">
          <div className={styles.logoWrapper}>
            <img
              src="/goooice-and-notion.png"
              alt="GoooIce + Notion"
              className={styles.logo}
              height={30}
            />
          </div>
        </Link>

        <nav>
          <ul className={styles.nav}>
            {navItems.map((item) => {
              const isActive = item.page && pathname === item.page;

              return (
                <li key={item.label}>
                  {item.page ? (
                    <Link href={item.page} className={isActive ? styles.active : ''}>
                      {item.label}
                    </Link>
                  ) : (
                    <ExtLink href={item.link}>{item.label}</ExtLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;