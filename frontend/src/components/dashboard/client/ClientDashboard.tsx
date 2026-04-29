'use client';
import React, { useState } from 'react';
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

    const clientMenuItems: MenuItem[] = [
        { id: 'dashboard', label: 'Dashboard', iconName: 'dashboard' },
        { id: 'post', label: 'Post a New Job', iconName: 'post' },
        { id: 'manage', label: 'Manage Jobs', iconName: 'manage' },
        { id: 'applicants', label: 'All Applicants', iconName: 'applicants' },
        { id: 'profile', label: 'Company Profile', iconName: 'profile' },
    ];

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
        'dashboard': { title: 'Dashboard!', subtitle: 'See your statistics' },
        'post': { title: 'Post a New Job!', subtitle: 'Ready to jump back in?' },
        'manage': { title: 'Manage Jobs!', subtitle: 'Check and manage your jobs' },
        'applicants': { title: 'All Applicants!', subtitle: 'See all applicants' },
        'profile': { title: 'Company Profile!', subtitle: 'Manage your company information' },
    };

    return (
        <DashboardLayout
            menuItems={clientMenuItems}
            activeMenu={view}
            onMenuSelect={setView}
            pageTitle={pageTitles[view]?.title || 'Dashboard'}
            pageSubtitle={pageTitles[view]?.subtitle || 'Ready to jump back in?'}
        >
            {renderContent()}
        </DashboardLayout>
    );
}
