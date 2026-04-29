'use client';
import React from 'react';
import { mockPostedJobs } from '../shared/constants';

export default function ManageJobsSection() {
    return (
        <div className="content-card">
            <div className="cases-table-wrapper">
                <table className="cases-table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Date Posted</th>
                            <th>Status</th>
                            <th>Proposals</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockPostedJobs.map(j => (
                            <tr key={j.id}>
                                <td className="title-cell" title={j.description}>
                                    {j.description.length > 50 ? j.description.substring(0, 50) + '...' : j.description}
                                </td>
                                <td>{j.postedDate}</td>
                                <td>
                                    <span className={`status-badge ${j.status.toLowerCase()}`}>{j.status}</span>
                                </td>
                                <td className="applicants-cell">{j.applicants} Applicants</td>
                                <td className="actions-cell">
                                    <button className="action-btn view-btn" title="View Detail">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1967d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    </button>
                                    <button className="action-btn edit-btn" title="Edit Job">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f9ab00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                    </button>
                                    <button className="action-btn delete-btn" title="Delete Job">
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
