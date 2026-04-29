'use client';
import React from 'react';
import { mockActiveJobs } from '../shared/constants';

export default function ActiveJobsSection() {
    return (
        <div className="content-card">
            <h3 className="section-title">Active Jobs</h3>
            <div className="table-container">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Client</th>
                            <th>Price</th>
                            <th>Deadline</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockActiveJobs.map(j => (
                            <tr key={j.id}>
                                <td><strong>{j.title}</strong></td>
                                <td>{j.client}</td>
                                <td>{j.price}</td>
                                <td>{j.deadline}</td>
                                <td>
                                    <span className="status-badge status-active">In Progress</span>
                                </td>
                                <td>
                                    <button className="view-btn">Submit Work</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
