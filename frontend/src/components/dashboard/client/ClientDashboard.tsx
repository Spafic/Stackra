'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout, { MenuItem } from '../layout/DashboardLayout';
import '../layout/DashboardContent.css';

// Section Components
import OverviewSection from './OverviewSection';
import PostJobSection from './PostJobSection';
import ManageJobsSection from './ManageJobsSection';
import ApplicantsSection from './ApplicantsSection';
import ProfileSection from './ProfileSection';

export default function ClientDashboard() {
    const [view, setView] = useState<string>('dashboard');
    const router = useRouter();

    const clientMenuItems: MenuItem[] = [
        { id: 'dashboard', label: 'Dashboard', iconName: 'dashboard' },
        { id: 'post', label: 'Post a New Job', iconName: 'post' },
        { id: 'manage', label: 'Manage Jobs', iconName: 'manage' },
        { id: 'applicants', label: 'All Applicants', iconName: 'applicants' },
        { id: 'profile', label: 'Company Profile', iconName: 'profile' },
        { id: 'logout', label: 'Logout', iconName: 'logout' },
    ];

    const handleMenuSelect = (id: string) => {
        if (id === 'logout') {
            localStorage.clear();
            router.push('/');
        } else {
            setView(id);
        }
    };

    const renderContent = () => {
        switch (view) {
            case 'post':
                return <PostJobSection />;
            case 'manage':
                return <ManageJobsSection />;
            case 'applicants':
                return <ApplicantsSection />;
            case 'profile':
                return <ProfileSection />;
            default:
                return <OverviewSection />;
        }
    };

    const pageTitles: Record<string, { title: string, subtitle: string }> = {
        'dashboard': { title: 'Dashboard', subtitle: 'See your statistics' },
        'post': { title: 'Post a New Job', subtitle: 'Ready to find the best talent?' },
        'manage': { title: 'Manage Jobs', subtitle: 'Check and manage your job postings' },
        'applicants': { title: 'All Applicants', subtitle: 'Review proposals and hire freelancers' },
        'profile': { title: 'Company Profile', subtitle: 'Manage your company information' },
    };

    return (
        <DashboardLayout
            menuItems={clientMenuItems}
            activeMenu={view}
            onMenuSelect={handleMenuSelect}
            pageTitle={pageTitles[view]?.title || 'Dashboard'}
            pageSubtitle={pageTitles[view]?.subtitle || ''}
        >
            {renderContent()}
        </DashboardLayout>
    );
}
