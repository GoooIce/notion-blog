// src/components/footer.tsx
import React from 'react';
import styles from '@/styles/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.prompt}>root@miantu:~$</div>
      <p className={styles.text}>
        Powered by{' '}
        <a href="https://notion.so" target="_blank" rel="noopener noreferrer">
          Notion
        </a>
        {' '}© 王雪
      </p>
      <p className={styles.links}>
        2021-{new Date().getFullYear()}{' '}
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
          冀ICP备15007337号
        </a>
      </p>
    </footer>
  );
}
