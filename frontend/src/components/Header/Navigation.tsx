'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

interface NavigationProps {
  role: string;
  currentPage: string;
}

export default function Navigation({ role, currentPage }: NavigationProps) {
  const router = useRouter();

  const getNavigationItems = () => {
    const commonItems = [{ label: 'Home', href: '/' }];
    
    if (role === 'client') {
      return [
        ...commonItems,
        { label: 'Find Freelancers', href: '/dashboard' },
        { label: 'Dashboard', href: '/dashboard' },
      ];
    }
    
    if (role === 'freelancer') {
      return [
        ...commonItems,
        { label: 'Find Jobs', href: '/dashboard' },
        { label: 'Dashboard', href: '/dashboard' },
      ];
    }

    // Guest / unauthenticated users
    return [
      ...commonItems,
      { label: 'Find Jobs', href: '/auth' },
      { label: 'Employers', href: '/auth' },
      { label: 'Candidates', href: '/auth' },
      { label: 'Pages', href: '/auth' },
    ];
  };

  const navigationItems = getNavigationItems();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <nav className={styles.navigation}>
      {navigationItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          onClick={(e) => handleClick(e, item.href)}
          className={`${styles.navLink} ${
            currentPage === item.label ? styles.active : ''
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

