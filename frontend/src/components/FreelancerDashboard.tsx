'use client';
import { useState } from 'react';
import DashboardLayout, { MenuItem } from './DashboardLayout';
import '../app/globals.css';

interface CaseMock {
    id: number;
    title: string;
    client: string;
    location: string;
    timeAgo: string;
    budget: string;
    type: string;
    tags: string[];
    logoColor: string;
}

const mockCases: CaseMock[] = [
    { id: 1, title: 'Full Stack Next.js & .NET Developer Needed', client: 'TechCorp', location: 'Remote', timeAgo: '2 hours ago', budget: '$1200 - $2500', type: 'Freelance', tags: ['Urgent', 'Full Time'], logoColor: '#ff4b2b' },
    { id: 2, title: 'UI/UX Designer for Mobile App Redesign', client: 'StudioX', location: 'Remote', timeAgo: '5 hours ago', budget: '$800 - $1200', type: 'Temporary', tags: ['Design', 'Figma'], logoColor: '#3498db' },
    { id: 3, title: 'Database Optimization Expert (SQL Server)', client: 'DataFlow Inc.', location: 'Cairo, Egypt', timeAgo: '1 day ago', budget: '$3000+', type: 'Contract', tags: ['Database', 'Senior'], logoColor: '#2ecc71' },
    { id: 4, title: 'React Native Developer for E-commerce', client: 'ShopifyPlus', location: 'Remote', timeAgo: '2 days ago', budget: '$1500 - $2000', type: 'Freelance', tags: ['Mobile', 'React'], logoColor: '#9b59b6' },
];

export default function FreelancerDashboard() {
    const [view, setView] = useState<string>('find_work');
    const [searchTerm, setSearchTerm] = useState('');

    const freelancerMenuItems: MenuItem[] = [
        { id: 'find_work', label: 'Find Work', iconName: 'find_work' },
        { id: 'proposals', label: 'My Proposals', iconName: 'proposals' },
        { id: 'profile', label: 'My Profile', iconName: 'profile' }
    ];

    const renderContent = () => {
        if (view === 'find_work') {
            return (
                <div className="dashboard-content">
                    {/* Filters Sidebar */}
                    <div className="filters-sidebar content-card">
                        <div className="filter-group">
                            <label>Search by Keywords</label>
                            <input type="text" placeholder="Job title, keywords, or company" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="filter-input" />
                        </div>

                        <div className="filter-group">
                            <label>Category</label>
                            <select className="filter-input">
                                <option>Choose a category</option>
                                <option>Web Development</option>
                                <option>Design</option>
                                <option>Database</option>
                                <option>Mobile Apps</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Job Type</label>
                            <div className="checkbox-group">
                                <label><input type="checkbox" /> Freelancer</label>
                                <label><input type="checkbox" /> Full Time</label>
                                <label><input type="checkbox" /> Part Time</label>
                                <label><input type="checkbox" /> Temporary</label>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Experience Level</label>
                            <div className="checkbox-group">
                                <label><input type="checkbox" /> Entry Level</label>
                                <label><input type="checkbox" /> 1-3 Years</label>
                                <label><input type="checkbox" /> 3-5 Years</label>
                                <label><input type="checkbox" /> 5+ Years</label>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Tags</label>
                            <div className="tags-container">
                                <span className="filter-tag">App</span>
                                <span className="filter-tag">Administrative</span>
                                <span className="filter-tag">Android</span>
                                <span className="filter-tag">React</span>
                                <span className="filter-tag">Design</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="cases-main">
                        <div className="cases-header">
                            <span>Showing <strong>{mockCases.length}</strong> cases</span>
                            <div className="sort-by">
                                <select className="sort-select">
                                    <option>Sort by (default)</option>
                                    <option>Newest</option>
                                    <option>Oldest</option>
                                </select>
                            </div>
                        </div>

                        <div className="cases-list">
                            {mockCases.map(c => (
                                <div key={c.id} className="case-card content-card">
                                    <div className="case-card-header">
                                        <div className="client-logo" style={{ backgroundColor: c.logoColor }}>
                                            {c.client.charAt(0)}
                                        </div>
                                        <div className="case-info">
                                            <h4>{c.title}</h4>
                                            <div className="case-meta">
                                                <span><i className="icon-client">🏢</i> {c.client}</span>
                                                <span><i className="icon-location">📍</i> {c.location}</span>
                                                <span><i className="icon-time">🕒</i> {c.timeAgo}</span>
                                                <span><i className="icon-budget">💰</i> {c.budget}</span>
                                            </div>
                                            <div className="case-badges">
                                                <span className="badge type-badge">{c.type}</span>
                                                {c.tags.map(tag => (
                                                    <span key={tag} className={`badge ${tag === 'Urgent' ? 'urgent-badge' : 'tag-badge'}`}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="case-actions">
                                            <button className="bookmark-btn">🔖</button>
                                            <button className="apply-btn">Apply Now</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="pagination">
                            <button className="show-more-btn">Show More</button>
                        </div>
                    </div>
                </div>
            );
        }

        // Default Dashboard View
        return (
            <div className="content-card">
                <h3 style={{ color: '#202124', marginBottom: '20px' }}>Dashboard Overview</h3>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ flex: 1, padding: '30px', backgroundColor: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
                        <h2 style={{ color: '#34a853', fontSize: '36px', margin: '0 0 10px 0' }}>14</h2>
                        <p style={{ color: '#696969', margin: 0 }}>Active Proposals</p>
                    </div>
                    <div style={{ flex: 1, padding: '30px', backgroundColor: '#f0f5f7', borderRadius: '8px', textAlign: 'center' }}>
                        <h2 style={{ color: '#1967d2', fontSize: '36px', margin: '0 0 10px 0' }}>5</h2>
                        <p style={{ color: '#696969', margin: 0 }}>Active Cases</p>
                    </div>
                    <div style={{ flex: 1, padding: '30px', backgroundColor: '#fff0f0', borderRadius: '8px', textAlign: 'center' }}>
                        <h2 style={{ color: '#ff4b2b', fontSize: '36px', margin: '0 0 10px 0' }}>$4,200</h2>
                        <p style={{ color: '#696969', margin: 0 }}>Earned</p>
                    </div>
                </div>
            </div>
        );
    };

    const pageTitles: Record<string, { title: string, subtitle: string }> = {
        'dashboard': { title: 'Dashboard Home!', subtitle: 'Ready to jump back in?' },
        'find_work': { title: 'Find Work!', subtitle: 'Ready to jump back in?' },
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

            <style jsx>{`
                .content-card {
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0px 6px 15px rgba(64, 79, 104, 0.05);
                    padding: 30px;
                }
                .dashboard-content {
                    display: flex;
                    gap: 30px;
                    align-items: flex-start;
                }
                .filters-sidebar {
                    flex: 0 0 300px;
                    padding: 30px;
                }
                .filter-group {
                    margin-bottom: 30px;
                }
                .filter-group label {
                    display: block;
                    font-weight: 500;
                    margin-bottom: 12px;
                    color: #202124;
                    font-size: 15px;
                }
                .filter-input {
                    width: 100%;
                    padding: 12px 15px;
                    background-color: #f0f5f7;
                    border: 1px solid transparent;
                    border-radius: 8px;
                    font-family: inherit;
                    color: #696969;
                    font-size: 14px;
                }
                .filter-input:focus {
                    outline: none;
                    background-color: #ffffff;
                    border-color: #ff4b2b;
                }
                .checkbox-group {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .checkbox-group label {
                    font-weight: 400;
                    color: #696969;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 0;
                    cursor: pointer;
                }
                .tags-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .filter-tag {
                    padding: 6px 15px;
                    background-color: #f0f5f7;
                    border-radius: 20px;
                    font-size: 13px;
                    color: #696969;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .filter-tag:hover {
                    background-color: #ff4b2b;
                    color: #fff;
                }
                .cases-main {
                    flex: 1;
                }
                .cases-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    font-size: 14px;
                    color: #696969;
                }
                .sort-select {
                    padding: 8px 15px;
                    background-color: #f0f5f7;
                    border: 1px solid transparent;
                    border-radius: 8px;
                    font-family: inherit;
                    color: #696969;
                }
                .cases-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .case-card {
                    padding: 30px;
                    transition: all 0.3s;
                }
                .case-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0px 10px 25px rgba(64, 79, 104, 0.1);
                }
                .case-card-header {
                    display: flex;
                    gap: 25px;
                    align-items: flex-start;
                }
                .client-logo {
                    width: 60px;
                    height: 60px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 24px;
                    font-weight: bold;
                    flex-shrink: 0;
                }
                .case-info {
                    flex: 1;
                }
                .case-info h4 {
                    margin: 0 0 10px 0;
                    font-size: 18px;
                    color: #202124;
                    font-weight: 500;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .case-info h4:hover {
                    color: #ff4b2b;
                }
                .case-meta {
                    display: flex;
                    gap: 20px;
                    color: #696969;
                    font-size: 14px;
                    margin-bottom: 15px;
                    flex-wrap: wrap;
                }
                .case-meta span {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .case-badges {
                    display: flex;
                    gap: 10px;
                }
                .badge {
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 13px;
                }
                .type-badge {
                    background-color: rgba(255, 75, 43, 0.1);
                    color: #ff4b2b;
                }
                .urgent-badge {
                    background-color: rgba(217, 48, 37, 0.15);
                    color: #d93025;
                }
                .tag-badge {
                    background-color: rgba(52, 168, 83, 0.15);
                    color: #34a853;
                }
                .case-actions {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 15px;
                }
                .bookmark-btn {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #ccc;
                    transition: color 0.2s;
                }
                .bookmark-btn:hover {
                    color: #ff4b2b;
                }
                .apply-btn {
                    padding: 10px 25px;
                    background-color: rgba(255, 75, 43, 0.1);
                    color: #ff4b2b;
                    border: none;
                    border-radius: 8px;
                    font-weight: 500;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .apply-btn:hover {
                    background-color: #ff4b2b;
                    color: #fff;
                }
                .pagination {
                    text-align: center;
                    margin-top: 40px;
                }
                .show-more-btn {
                    padding: 12px 30px;
                    background-color: #fff;
                    border: 1px solid #ff4b2b;
                    color: #ff4b2b;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .show-more-btn:hover {
                    background-color: #ff4b2b;
                    color: #fff;
                }
            `}</style>
        </DashboardLayout>
    );
}
