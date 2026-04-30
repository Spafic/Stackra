'use client';
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';

export default function OverviewSection() {
    const [stats, setStats] = useState({ jobs: 0, applications: 0, pending: 0, accepted: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const clientId = localStorage.getItem('userId');
                const [postsRes, proposalsRes] = await Promise.all([
                    apiFetch('/posts'),
                    apiFetch('/proposals')
                ]);

                if (postsRes.ok && proposalsRes.ok) {
                    const posts = await postsRes.json();
                    const proposals = await proposalsRes.json();
                    
                    const clientPosts = posts.filter((p: any) => p.createdByClientId.toString() === clientId);
                    const postIds = clientPosts.map((p: any) => p.postId);
                    const clientProposals = proposals.filter((p: any) => postIds.includes(p.postId));

                    setStats({
                        jobs: clientPosts.length,
                        applications: clientProposals.length,
                        pending: clientProposals.filter((p: any) => p.status === 'pending').length,
                        accepted: clientProposals.filter((p: any) => p.status === 'accepted').length,
                    });
                }
            } catch (err) {
                console.error("Failed to load overview stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading overview...</div>;

    return (
        <div className="dashboard-home">
            {/* 4 Cards Row */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                {/* Card 1: Posted Jobs */}
                <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '8px', padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0px 6px 15px rgba(64, 79, 104, 0.05)' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: 'rgba(25, 103, 210, 0.1)', color: '#1967d2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ color: '#1967d2', fontSize: '30px', margin: '0 0 5px 0', fontWeight: 600 }}>{stats.jobs}</h2>
                        <p style={{ color: '#202124', margin: 0, fontSize: '14px', fontWeight: 500 }}>Posted Jobs</p>
                    </div>
                </div>

                {/* Card 2: Applications */}
                <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '8px', padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0px 6px 15px rgba(64, 79, 104, 0.05)' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: 'rgba(217, 48, 37, 0.1)', color: '#d93025', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ color: '#d93025', fontSize: '30px', margin: '0 0 5px 0', fontWeight: 600 }}>{stats.applications}</h2>
                        <p style={{ color: '#202124', margin: 0, fontSize: '14px', fontWeight: 500 }}>Applications</p>
                    </div>
                </div>

                {/* Card 3: Pending */}
                <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '8px', padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0px 6px 15px rgba(64, 79, 104, 0.05)' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: 'rgba(249, 171, 0, 0.1)', color: '#f9ab00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ color: '#f9ab00', fontSize: '30px', margin: '0 0 5px 0', fontWeight: 600 }}>{stats.pending}</h2>
                        <p style={{ color: '#202124', margin: 0, fontSize: '14px', fontWeight: 500 }}>Pending Bids</p>
                    </div>
                </div>

                {/* Card 4: Accepted */}
                <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '8px', padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0px 6px 15px rgba(64, 79, 104, 0.05)' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: 'rgba(52, 168, 83, 0.1)', color: '#34a853', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h2 style={{ color: '#34a853', fontSize: '30px', margin: '0 0 5px 0', fontWeight: 600 }}>{stats.accepted}</h2>
                        <p style={{ color: '#202124', margin: 0, fontSize: '14px', fontWeight: 500 }}>Accepted</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
