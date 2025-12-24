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
        <a href="https://notion.so" target="_blank" rel="noopener noreferrer">
          [notion]
        </a>
        {' '}
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
          [icp]
        </a>
      </p>
    </footer>
  );
}
