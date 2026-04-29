'use client';
import React, { useState } from 'react';
import { mockCases } from '../shared/constants';

export default function FindWorkSection() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
    const [selectedExpLevels, setSelectedExpLevels] = useState<string[]>([]);

    return (
        <div className="dashboard-content">
            {/* Filters Sidebar */}
            <div className="filters-sidebar content-card">
                <div className="filter-group">
                    <label>Search by Keywords</label>
                    <input
                        type="text"
                        placeholder="Job title, keywords, or company"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="filter-input"
                    />
                </div>

                <div className="filter-group">
                    <label>Category</label>
                    <select className="filter-input" defaultValue="">
                        <option value="">Choose a category</option>
                        <option>Web Development</option>
                        <option>Design</option>
                        <option>Database</option>
                        <option>Mobile Apps</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Job Type</label>
                    <div className="checkbox-group">
                        {['Freelance', 'Full Time', 'Part Time', 'Temporary'].map(type => (
                            <label key={type}>
                                <input
                                    type="checkbox"
                                    checked={selectedJobTypes.includes(type)}
                                    onChange={e => {
                                        if (e.target.checked) setSelectedJobTypes([...selectedJobTypes, type]);
                                        else setSelectedJobTypes(selectedJobTypes.filter(t => t !== type));
                                    }}
                                /> {type}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <label>Experience Level</label>
                    <div className="checkbox-group">
                        {['Entry Level', '1-3 Years', '3-5 Years', '5+ Years'].map(level => (
                            <label key={level}>
                                <input
                                    type="checkbox"
                                    checked={selectedExpLevels.includes(level)}
                                    onChange={e => {
                                        if (e.target.checked) setSelectedExpLevels([...selectedExpLevels, level]);
                                        else setSelectedExpLevels(selectedExpLevels.filter(l => l !== level));
                                    }}
                                /> {level}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <label>Tags</label>
                    <div className="tags-container">
                        <span className="filter-tag">App</span>
                        <span className="filter-tag">Administrative</span>
                        <span className="filter-tag">Android</span>
                        <span className="filter-tag">React</span>
                        <span className="filter-tag">Design</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="cases-main">
                <div className="cases-header">
                    <span>Showing <strong>{
                        mockCases.filter(c =>
                            (searchTerm === '' || c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.client.toLowerCase().includes(searchTerm.toLowerCase())) &&
                            (selectedJobTypes.length === 0 || selectedJobTypes.includes(c.type))
                        ).length
                    }</strong> cases</span>
                    <div className="sort-by">
                        <select className="sort-select" defaultValue="default">
                            <option value="default">Sort by (default)</option>
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                </div>

                <div className="cases-list">
                    {mockCases
                        .filter(c =>
                            (searchTerm === '' || c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.client.toLowerCase().includes(searchTerm.toLowerCase())) &&
                            (selectedJobTypes.length === 0 || selectedJobTypes.includes(c.type))
                        )
                        .map(c => (
                            <div key={c.id} className="case-card content-card">
                                <div className="case-card-header">
                                    <div className="client-logo" style={{ backgroundColor: c.logoColor }}>
                                        {c.client.charAt(0)}
                                    </div>
                                    <div className="case-info">
                                        <h4>{c.title}</h4>
                                        <div className="case-meta">
                                            <span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4b2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                                                {c.client}
                                            </span>
                                            <span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4b2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                {c.location}
                                            </span>
                                            <span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4b2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                {c.timeAgo}
                                            </span>
                                            <span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                                {c.budget}
                                            </span>
                                        </div>
                                        <div className="case-badges">
                                            <span className="badge type-badge">{c.type}</span>
                                            {c.tags.map(tag => (
                                                <span key={tag} className={`badge ${tag === 'Urgent' ? 'urgent-badge' : 'tag-badge'}`}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="case-actions">
                                        <button className="apply-btn">Apply Now</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                <div className="pagination">
                    <button className="show-more-btn">Show More</button>
                </div>
            </div>
        </div>
    );
}
