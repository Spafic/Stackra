'use client';
import React from 'react';
import { mockCases } from '../shared/constants';

export default function OverviewSection() {
    return (
        <div className="content-card">
            <h3 className="section-title">Dashboard Overview</h3>
            <div className="overview-stats">
                <div className="stat-card green">
                    <h2>14</h2>
                    <p>Active Proposals</p>
                </div>
                <div className="stat-card blue">
                    <h2>5</h2>
                    <p>Active Jobs</p>
                </div>
                <div className="stat-card red">
                    <h2>$4,200</h2>
                    <p>Total Earned</p>
                </div>
            </div>

            <div className="recent-activity">
                <h4 className="sub-section-title">Recent Applied Jobs</h4>
                {/* Small list of recent jobs */}
                <div className="mini-list">
                    {mockCases.slice(0, 2).map(c => (
                        <div key={c.id} className="mini-item">
                            <div>
                                <strong>{c.title}</strong>
                                <p>{c.client} • {c.budget}</p>
                            </div>
                            <span className="status-badge status-pending">Applied</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
