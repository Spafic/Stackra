'use client';
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';

export default function ApplicantsSection() {
    const [proposals, setProposals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const clientId = localStorage.getItem('userId');
                const [postsRes, propsRes] = await Promise.all([
                    apiFetch('/posts'),
                    apiFetch('/proposals')
                ]);
                
                if (postsRes.ok && propsRes.ok) {
                    const postsData = await postsRes.json();
                    const propsData = await propsRes.json();
                    
                    const myPosts = postsData.filter((p: any) => p.createdByClientId.toString() === clientId);
                    const myPostIds = myPosts.map((p: any) => p.postId);
                    
                    const apps = propsData.filter((p: any) => myPostIds.includes(p.postId));
                    setProposals(apps);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, []);

    const handleAccept = async (prop: any) => {
        try {
            const res = await apiFetch('/jobs', {
                method: 'POST',
                body: JSON.stringify({
                    status: 'in_progress',
                    price: prop.price,
                    acceptedProposalId: prop.proposalId,
                    projectDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // default +14 days
                })
            });
            if (res.ok) {
                await apiFetch(`/proposals/${prop.proposalId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ ...prop, status: 'accepted' })
                });
                alert('Proposal accepted and Job created successfully!');
                window.location.reload();
            }
        } catch (e) {
            alert('Error accepting proposal');
        }
    };

    const handleLeaveReview = async (prop: any) => {
        const rating = window.prompt("Enter rating for freelancer (0-5):");
        if (!rating) return;
        const desc = window.prompt("Enter review description:");
        
        try {
            // First we need the jobId. Let's find it.
            const jobsRes = await apiFetch('/jobs');
            const jobsData = await jobsRes.json();
            const job = jobsData.find((j: any) => j.acceptedProposalId === prop.proposalId);
            
            if (!job) {
                alert('No active job found for this proposal to review yet.');
                return;
            }

            const res = await apiFetch('/reviews', {
                method: 'POST',
                body: JSON.stringify({
                    jobId: job.jobId,
                    flRating: parseFloat(rating),
                    flDescription: desc || ''
                })
            });
            if (res.ok) {
                alert('Review added successfully!');
            }
        } catch (e) {
            alert('Error leaving review');
        }
    };

    if (loading) return <div>Loading applicants...</div>;

    return (
        <div className="content-card">
            <h3 style={{ color: '#202124', marginBottom: '20px' }}>Recent Applicants & Proposals</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {proposals.length === 0 && <p>No applicants yet.</p>}
                {proposals.map((app) => (
                    <div key={app.proposalId} className="applicant-card animate-fade-in" style={{ border: '1px solid #ecedf2', borderRadius: '12px', padding: '25px', display: 'flex', gap: '20px', backgroundColor: '#fff', transition: 'all 0.3s' }}>
                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#f0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#696969', flexShrink: 0 }}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#202124', fontWeight: 500 }}>Freelancer ID: {app.freelancerId}</h4>
                            </div>
                            <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#696969' }}>{app.proposalMessage}</p>
                            <div style={{ display: 'flex', gap: '15px', color: '#696969', fontSize: '13px', marginBottom: '15px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                    ${app.price}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    Duration: {app.expJobDuration}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {app.status === 'pending' ? (
                                    <button onClick={() => handleAccept(app)} style={{ backgroundColor: '#1967d2', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Accept Proposal</button>
                                ) : (
                                    <>
                                        <span style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '6px 12px', borderRadius: '4px' }}>Accepted</span>
                                        <button onClick={() => handleLeaveReview(app)} style={{ backgroundColor: '#f9ab00', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Leave Review</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
