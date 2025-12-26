'use client';

import Link from 'next/link';
import ExtLink from './ext-link';
import { usePathname } from 'next/navigation';
import { useMagneticEffect } from '../hooks/useParallax';
import styles from '../styles/header.module.css';

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Home', page: '/' },
  { label: 'Blog', page: '/blog' },
  { label: 'Contact', page: '/contact' },
  { label: 'Source Code', link: 'https://github.com/goooice/notion-blog' },
];

const Header = ({ titlePre = '' }) => {
  const pathname = usePathname();
  const logoMagneticRef = useMagneticEffect({ intensity: 0.3 });

  return (
    <header className={`${styles.header} ${styles.glassmorphism}`}>
      <div className={styles.navContainer}>
        <Link href="/">
          <div ref={logoMagneticRef as any} className={styles.logoWrapper}>
            <img
              src="/goooice-and-notion.png"
              alt="GoooIce + Notion"
              className={`${styles.logo} artistic-hover-lift`}
              height={30}
            />
          </div>
        </Link>

        <nav>
          <ul className={styles.nav}>
            {navItems.map((item) => {
              const isActive = item.page && pathname === item.page;
              const navMagneticRef = useMagneticEffect({ intensity: 0.2 });

              return (
                <li key={item.label} ref={navMagneticRef as any}>
                  {item.page ? (
                    <Link
                      href={item.page}
                      className={`${isActive ? styles.active : ''} ${styles.navLink} artistic-hover-lift`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <ExtLink
                      href={item.link}
                      className={`${styles.navLink} artistic-hover-lift`}
                    >
                      {item.label}
                    </ExtLink>
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
