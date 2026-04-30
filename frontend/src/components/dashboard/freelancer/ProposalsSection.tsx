'use client';
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';

export default function ProposalsSection() {
    const [proposals, setProposals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProposals = async () => {
        try {
            const res = await apiFetch('/proposals');
            if (res.ok) {
                const data = await res.json();
                const freelancerId = localStorage.getItem('userId');
                setProposals(data.filter((p: any) => p.freelancerId.toString() === freelancerId));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to withdraw this proposal?')) {
            try {
                const res = await apiFetch(`/proposals/${id}`, { method: 'DELETE' });
                if (res.ok) fetchProposals();
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return <div>Loading proposals...</div>;

    return (
        <div className="content-card">
            <h3 className="section-title">My Proposals</h3>
            <div className="table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Job ID</th>
                            <th>Proposed Price</th>
                            <th>Status</th>
                            <th>Message Preview</th>
                            <th>Date Sent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proposals.length === 0 ? (
                            <tr><td colSpan={6} style={{textAlign:'center', padding:'20px'}}>No proposals yet.</td></tr>
                        ) : proposals.map(p => (
                            <tr key={p.proposalId}>
                                <td><strong>Job #{p.postId}</strong></td>
                                <td>${p.price}</td>
                                <td>
                                    <span className={`status-badge status-${p.status || 'pending'}`}>
                                        {(p.status || 'pending').charAt(0).toUpperCase() + (p.status || 'pending').slice(1)}
                                    </span>
                                </td>
                                <td>{p.proposalMessage ? p.proposalMessage.substring(0, 30) + '...' : ''}</td>
                                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button className="view-btn" onClick={() => handleDelete(p.proposalId)} style={{backgroundColor: '#ff4d4f', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px'}}>Withdraw</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
