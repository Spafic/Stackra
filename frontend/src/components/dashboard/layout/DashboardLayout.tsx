'use client';
import React from 'react';
import '../../../app/globals.css';

export interface MenuItem {
    id: string;
    label: string;
    iconName: string;
}

interface DashboardLayoutProps {
    menuItems: MenuItem[];
    activeMenu: string;
    onMenuSelect: (id: string) => void;
    pageTitle: string;
    pageSubtitle: string;
    children: React.ReactNode;
}

const Icon = ({ name }: { name: string }) => {
    const props = {
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
    };

    switch (name) {
        case 'dashboard':
            return <svg {...props}><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
        case 'profile':
            return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
        case 'post':
            return <svg {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
        case 'manage':
            return <svg {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
        case 'applicants':
            return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
        case 'shortlisted':
            return <svg {...props}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>;
        case 'packages':
            return <svg {...props}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
        case 'alerts':
            return <svg {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
        case 'password':
            return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
        case 'delete':
            return <svg {...props}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
        case 'logout':
            return <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
        case 'find_work':
            return <svg {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
        case 'proposals':
            return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
        default:
            return <svg {...props}><circle cx="12" cy="12" r="10"></circle></svg>;
    }
};

export default function DashboardLayout({
    menuItems,
    activeMenu,
    onMenuSelect,
    pageTitle,
    pageSubtitle,
    children
}: DashboardLayoutProps) {
    return (
        <div className="superio-dashboard-layout">
            {/* Left Sidebar Navigation */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-menu">
                    <ul>
                        {menuItems.map(item => (
                            <li key={item.id}>
                                <button 
                                    className={`menu-btn ${activeMenu === item.id ? 'active' : ''}`}
                                    onClick={() => onMenuSelect(item.id)}
                                >
                                    <span className="icon"><Icon name={item.iconName} /></span> {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-main-content">
                <div className="page-header">
                    <h2>{pageTitle}</h2>
                    <p>{pageSubtitle}</p>
                </div>

                {children}
            </main>

            <style jsx>{`
                .superio-dashboard-layout {
                    display: flex;
                    min-height: calc(100vh - 70px);
                    background-color: #f5f7fc;
                }

                /* Sidebar Navigation */
                .dashboard-sidebar {
                    width: 300px;
                    background-color: #ffffff;
                    border-right: 1px solid #ecedf2;
                    padding: 30px 0;
                    flex-shrink: 0;
                    overflow-y: auto;
                    height: calc(100vh - 70px);
                    position: sticky;
                    top: 0;
                }
                .sidebar-menu ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .sidebar-menu li {
                    margin-bottom: 5px;
                }
                .menu-btn {
                    width: 100%;
                    text-align: left;
                    padding: 15px 30px 15px 40px;
                    background: transparent;
                    border: none;
                    font-size: 15px;
                    color: #696969;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                .menu-btn:hover {
                    color: #ff4b2b;
                    background-color: rgba(255, 75, 43, 0.03);
                }
                .menu-btn.active {
                    color: #ff4b2b;
                    background-color: rgba(255, 75, 43, 0.07);
                    border-left: 4px solid #ff4b2b;
                    padding-left: 36px; /* 40px - 4px border */
                }
                .menu-btn .icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: inherit;
                }

                /* Main Content Area */
                .dashboard-main-content {
                    flex: 1;
                    padding: 40px 50px;
                    max-width: calc(100% - 300px);
                }
                .page-header {
                    margin-bottom: 30px;
                }
                .page-header h2 {
                    font-size: 30px;
                    color: #202124;
                    margin: 0 0 10px 0;
                    font-weight: 500;
                }
                .page-header p {
                    font-size: 14px;
                    color: #696969;
                    margin: 0;
                }
            `}</style>
        </div>
    );
}
