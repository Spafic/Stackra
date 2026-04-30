'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default function AccountDropdown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.clear();
    router.push('/');
  };

  return (
    <div className={styles.accountDropdown}>
      <button
        className={styles.accountButton}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className={styles.accountIcon}>
          <UserIcon />
        </span>
        <span className={styles.accountText}>MY ACCOUNT</span>
        <span className={styles.dropdownArrow}>
          <ChevronDownIcon />
        </span>
      </button>

      {dropdownOpen && (
        <div className={styles.dropdownMenu}>
          <a href="/dashboard" className={styles.dropdownItem}>
            Dashboard
          </a>
          <hr className={styles.divider} />
          <a href="#" className={styles.dropdownItem} onClick={handleLogout}>
            Logout
          </a>
        </div>
      )}
    </div>
  );
}
