'use client';
import React from 'react';
import { mockProposals } from '../shared/constants';

export default function ProposalsSection() {
    return (
        <div className="content-card">
            <h3 className="section-title">My Proposals</h3>
            <div className="table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Date Sent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockProposals.map(p => (
                            <tr key={p.id}>
                                <td><strong>{p.jobTitle}</strong></td>
                                <td>{p.price}</td>
                                <td>
                                    <span className={`status-badge status-${p.status}`}>
                                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                                    </span>
                                </td>
                                <td>{p.date}</td>
                                <td>
                                    <button className="view-btn">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
