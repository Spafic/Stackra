'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import Logo from './Logo';
import Navigation from './Navigation';
import AccountDropdown from './AccountDropdown';

interface HeaderProps {
  currentPage?: string;
}

export default function Header({ currentPage = 'Home' }: HeaderProps) {
  const [role, setRole] = useState<string>('');
  const pathname = usePathname();

  useEffect(() => {
    setRole(localStorage.getItem('role') || 'guest');
  }, []);

  // Do not show header on auth pages (login/signup) or profile completion pages
  if (pathname === '/auth' || pathname === '/auth/complete') {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo />
        <Navigation role={role} currentPage={currentPage} />
        <div className={styles.rightSection}>
          <AccountDropdown />
        </div>
      </div>
    </header>
  );
}
