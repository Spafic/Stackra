'use client';
import React from 'react';
import styles from './Header.module.css';

const LightningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export default function Logo() {
  return (
    <div className={styles.logo}>
      <div className={styles.logoIcon}>
        <LightningIcon />
      </div>
      <span className={styles.logoText}>Stackra</span>
    </div>
  );
}
