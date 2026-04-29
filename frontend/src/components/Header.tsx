'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

interface HeaderProps {
  currentPage?: string;
}

const LightningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);



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

export default function Header({ currentPage = 'Home' }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [role, setRole] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    setRole(localStorage.getItem('role') || 'client');
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.clear();
    router.push('/');
  };

  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Find Jobs', href: '#' },
    { label: 'Employers', href: '#' },
    { label: 'Candidates', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Pages', href: '#' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <LightningIcon />
          </div>
          <span className={styles.logoText}>Stackra</span>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`${styles.navLink} ${
                currentPage === item.label ? styles.active : ''
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Section */}
        <div className={styles.rightSection}>


          {/* My Account Dropdown */}
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
                <a href="#" className={styles.dropdownItem}>
                  Profile
                </a>
                <a href="#" className={styles.dropdownItem}>
                  Settings
                </a>
                <a href="#" className={styles.dropdownItem}>
                  Messages
                </a>
                <hr className={styles.divider} />
                <a href="#" className={styles.dropdownItem} onClick={handleLogout}>
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
