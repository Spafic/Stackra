'use client';
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';

export default function ActiveJobsSection() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const freelancerId = localStorage.getItem('userId');
                const [jobsRes, propsRes] = await Promise.all([
                    apiFetch('/jobs'),
                    apiFetch('/proposals')
                ]);
                
                if (jobsRes.ok && propsRes.ok) {
                    const jobsData = await jobsRes.json();
                    const propsData = await propsRes.json();
                    
                    const myProps = propsData.filter((p: any) => p.freelancerId.toString() === freelancerId);
                    const myPropIds = myProps.map((p: any) => p.proposalId);
                    
                    const myJobs = jobsData.filter((j: any) => myPropIds.includes(j.acceptedProposalId));
                    setJobs(myJobs);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleAddDeliverable = async (jobId: number) => {
        const desc = window.prompt("Enter description of deliverable:");
        if (!desc) return;
        const url = window.prompt("Enter attachment URL/link:");
        
        try {
            const num = Math.floor(Math.random() * 10000) + 1;
            const res = await apiFetch('/deliverables', {
                method: 'POST',
                body: JSON.stringify({
                    jobId,
                    number: num,
                    attachment: url || '',
                    description: desc,
                    deadline: new Date().toISOString()
                })
            });
            if (res.ok) {
                alert('Deliverable added successfully!');
            } else {
                alert('Failed to add deliverable.');
            }
        } catch (e) {
            alert('Error adding deliverable: ' + (e as Error).message);
        }
    };

    if (loading) return <div>Loading active jobs...</div>;

    return (
        <div className="content-card">
            <h3 className="section-title">Active Jobs & Deliverables</h3>
            <div className="table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Job ID</th>
                            <th>Status</th>
                            <th>Price</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.length === 0 ? (
                            <tr><td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>No active jobs.</td></tr>
                        ) : jobs.map(j => (
                            <tr key={j.jobId}>
                                <td><strong>Job #{j.jobId}</strong></td>
                                <td>
                                    <span className="status-badge status-active">{j.status || 'In Progress'}</span>
                                </td>
                                <td>${j.price}</td>
                                <td>{j.projectDeadline ? new Date(j.projectDeadline).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                    <button className="view-btn" onClick={() => handleAddDeliverable(j.jobId)} style={{backgroundColor: '#1967d2', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px'}}>Add Deliverable</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
