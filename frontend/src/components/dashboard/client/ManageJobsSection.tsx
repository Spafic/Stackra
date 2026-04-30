'use client';
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../../lib/api';

export default function ManageJobsSection() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            const res = await apiFetch('/posts');
            if (res.ok) {
                const data = await res.json();
                const clientId = localStorage.getItem('userId');
                setJobs(data.filter((j: any) => j.createdByClientId.toString() === clientId));
            }
        } catch (err) {
            console.error('Failed to fetch jobs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this job post?')) {
            try {
                const res = await apiFetch(`/posts/${id}`, { method: 'DELETE' });
                if (res.ok) fetchJobs();
            } catch (err) {
                console.error('Delete failed', err);
            }
        }
    };

    const handleEdit = async (job: any) => {
        const newDesc = window.prompt("Edit Job Description:", job.jobDescription);
        if (!newDesc) return;
        try {
            const res = await apiFetch(`/posts/${job.postId}`, {
                method: 'PUT',
                body: JSON.stringify({ ...job, jobDescription: newDesc })
            });
            if (res.ok) fetchJobs();
        } catch (err) {
            console.error('Edit failed', err);
        }
    };

    if (loading) return <div>Loading jobs...</div>;

    return (
        <div className="content-card">
            <div className="cases-table-wrapper">
                <table className="cases-table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Date Posted</th>
                            <th>Status</th>
                            <th>Budget</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.length === 0 ? (
                            <tr><td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>No jobs posted yet.</td></tr>
                        ) : jobs.map(j => (
                            <tr key={j.postId}>
                                <td className="title-cell" title={j.jobDescription}>
                                    {j.jobDescription && j.jobDescription.length > 50 ? j.jobDescription.substring(0, 50) + '...' : j.jobDescription}
                                </td>
                                <td>{new Date(j.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span className={`status-badge status-${(j.status || 'pending').toLowerCase()}`}>{j.status}</span>
                                </td>
                                <td>${j.priceMin} - ${j.priceMax}</td>
                                <td className="actions-cell">
                                    <button className="action-btn view-btn" title="Edit Job" onClick={() => handleEdit(j)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f9ab00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                    </button>
                                    <button className="action-btn delete-btn" title="Delete Job" onClick={() => handleDelete(j.postId)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d93025" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
