'use client';
import React from 'react';
import styles from './Header.module.css';

interface NavigationProps {
  role: string;
  currentPage: string;
}

export default function Navigation({ role, currentPage }: NavigationProps) {
  const getNavigationItems = () => {
    const commonItems = [{ label: 'Home', href: '/' }];
    
    if (role === 'client') {
      return [
        ...commonItems,
        { label: 'Find Freelancers', href: '#' },
        { label: 'Dashboard', href: '/dashboard' },
      ];
    }
    
    if (role === 'freelancer') {
      return [
        ...commonItems,
        { label: 'Find Jobs', href: '#' },
        { label: 'Dashboard', href: '/dashboard' },
      ];
    }

    return [
      ...commonItems,
      { label: 'Find Jobs', href: '#' },
      { label: 'Employers', href: '#' },
      { label: 'Candidates', href: '#' },
      { label: 'Pages', href: '#' },
    ];
  };

  const navigationItems = getNavigationItems();

  return (
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
  );
}
