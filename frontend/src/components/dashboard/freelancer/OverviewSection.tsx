'use client';
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';

export default function OverviewSection() {
    const [stats, setStats] = useState({ pending: 0, accepted: 0, rejected: 0 });
    const [recentProposals, setRecentProposals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const freelancerId = localStorage.getItem('userId');
                const res = await apiFetch('/proposals');

                if (res.ok) {
                    const proposals = await res.json();
                    
                    const myProposals = proposals.filter((p: any) => p.freelancerId.toString() === freelancerId);

                    setStats({
                        pending: myProposals.filter((p: any) => p.status === 'pending').length,
                        accepted: myProposals.filter((p: any) => p.status === 'accepted').length,
                        rejected: myProposals.filter((p: any) => p.status === 'rejected').length,
                    });
                    
                    setRecentProposals(myProposals.slice(-3).reverse());
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
        <div className="content-card">
            <h3 className="section-title">Dashboard Overview</h3>
            <div className="overview-stats">
                <div className="stat-card blue">
                    <h2>{stats.pending}</h2>
                    <p>Pending Proposals</p>
                </div>
                <div className="stat-card green">
                    <h2>{stats.accepted}</h2>
                    <p>Accepted Jobs</p>
                </div>
                <div className="stat-card red">
                    <h2>{stats.rejected}</h2>
                    <p>Rejected Bids</p>
                </div>
            </div>

            <div className="recent-activity">
                <h4 className="sub-section-title">Recent Proposals</h4>
                <div className="mini-list">
                    {recentProposals.length === 0 ? (
                        <p style={{ color: '#696969' }}>No recent proposals.</p>
                    ) : recentProposals.map(c => (
                        <div key={c.proposalId} className="mini-item">
                            <div>
                                <strong>Job ID: {c.postId}</strong>
                                <p>Bid: ${c.proposedPrice} • {c.estimatedDuration}</p>
                            </div>
                            <span className={`status-badge ${c.status?.toLowerCase() || 'pending'}`}>{c.status || 'pending'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
