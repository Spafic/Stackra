'use client';
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';

export default function FindWorkSection() {
    const [searchTerm, setSearchTerm] = useState('');
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await apiFetch('/posts');
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data.filter((p: any) => p.status === 'pending' || p.status === 'active'));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleApply = async (postId: number) => {
        const message = window.prompt("Enter your proposal message:");
        if (!message) return;
        const price = window.prompt("Enter your proposed price (USD):");
        if (!price) return;
        const duration = window.prompt("Expected Job Duration (e.g., 2 weeks):");
        
        try {
            const freelancerId = localStorage.getItem('userId');
            const res = await apiFetch('/proposals', {
                method: 'POST',
                body: JSON.stringify({
                    proposalMessage: message,
                    price: parseFloat(price),
                    expJobDuration: duration,
                    availCommHours: 'Any',
                    postId,
                    freelancerId: parseInt(freelancerId || '0', 10),
                    status: 'pending'
                })
            });
            if (res.ok) {
                alert('Proposal submitted successfully!');
            } else {
                alert('Failed to submit proposal.');
            }
        } catch (err) {
            alert('Error: ' + (err as Error).message);
        }
    };

    if (loading) return <div>Loading available jobs...</div>;

    const filteredPosts = posts.filter(p =>
        searchTerm === '' || (p.jobDescription && p.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="dashboard-content">
            {/* Filters Sidebar */}
            <div className="filters-sidebar content-card">
                <div className="filter-group">
                    <label>Search by Keywords</label>
                    <input
                        type="text"
                        placeholder="Job description keywords..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="filter-input"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="cases-main">
                <div className="cases-header">
                    <span>Showing <strong>{filteredPosts.length}</strong> cases</span>
                </div>

                <div className="cases-list">
                    {filteredPosts.map(c => (
                        <div key={c.postId} className="case-card content-card">
                            <div className="case-card-header">
                                <div className="client-logo" style={{ backgroundColor: '#1967d2' }}>
                                    C
                                </div>
                                <div className="case-info">
                                    <h4>Job #{c.postId}</h4>
                                    <p style={{ color: '#696969', margin: '5px 0' }}>{c.jobDescription}</p>
                                    <div className="case-meta">
                                        <span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4b2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                            Deadline: {c.expectedDeadline ? new Date(c.expectedDeadline).toLocaleDateString() : 'N/A'}
                                        </span>
                                        <span>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                            Budget: ${c.priceMin} - ${c.priceMax}
                                        </span>
                                    </div>
                                    <div className="case-badges">
                                        <span className="badge type-badge">{c.status}</span>
                                    </div>
                                </div>
                                <div className="case-actions">
                                    <button className="apply-btn" onClick={() => handleApply(c.postId)}>Apply Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredPosts.length === 0 && <p style={{textAlign: 'center', marginTop: '20px'}}>No jobs match your search.</p>}
                </div>
            </div>
        </div>
    );
}
