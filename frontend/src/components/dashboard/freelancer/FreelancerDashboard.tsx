'use client';
import React, { useState } from 'react';
import DashboardLayout, { MenuItem } from '../layout/DashboardLayout';
import '../layout/DashboardContent.css';

// Section Components
import OverviewSection from './OverviewSection';
import FindWorkSection from './FindWorkSection';
import ProposalsSection from './ProposalsSection';
import ActiveJobsSection from './ActiveJobsSection';
import ProfileSection from './ProfileSection';

export default function FreelancerDashboard() {
    const [view, setView] = useState<string>('dashboard');

    const freelancerMenuItems: MenuItem[] = [
        { id: 'dashboard', label: 'Dashboard', iconName: 'dashboard' },
        { id: 'find_work', label: 'Find Work', iconName: 'find_work' },
        { id: 'proposals', label: 'My Proposals', iconName: 'proposals' },
        { id: 'active_jobs', label: 'Active Jobs', iconName: 'manage' },
        { id: 'profile', label: 'My Profile', iconName: 'profile' }
    ];

    const renderContent = () => {
        switch (view) {
            case 'find_work':
                return <FindWorkSection />;
            case 'proposals':
                return <ProposalsSection />;
            case 'active_jobs':
                return <ActiveJobsSection />;
            case 'profile':
                return <ProfileSection />;
            default:
                return <OverviewSection />;
        }
    };

    const pageTitles: Record<string, { title: string, subtitle: string }> = {
        'dashboard': { title: 'Welcome back!', subtitle: 'Ready to find your next gig?' },
        'find_work': { title: 'Find Work!', subtitle: 'Explore jobs that match your skills' },
        'proposals': { title: 'My Proposals', subtitle: 'Track your active bids' },
        'active_jobs': { title: 'Active Jobs', subtitle: 'Manage your ongoing contracts' },
        'profile': { title: 'My Profile', subtitle: 'Keep your portfolio up to date' },
    };

    return (
        <DashboardLayout
            menuItems={freelancerMenuItems}
            activeMenu={view}
            onMenuSelect={setView}
            pageTitle={pageTitles[view]?.title || 'Dashboard'}
            pageSubtitle={pageTitles[view]?.subtitle || 'Ready to jump back in?'}
        >
            {renderContent()}
        </DashboardLayout>
    );
}
