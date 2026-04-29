'use client';
import React from 'react';

export default function ApplicantsSection() {
    return (
        <div className="content-card">
            <h3 style={{ color: '#202124', marginBottom: '20px' }}>Recent Applicants</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {[1, 2, 3, 4].map((app) => (
                    <div key={app} className="applicant-card animate-fade-in" style={{ border: '1px solid #ecedf2', borderRadius: '12px', padding: '25px', display: 'flex', gap: '20px', backgroundColor: '#fff', transition: 'all 0.3s' }}>
                        <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#f0f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#696969', flexShrink: 0 }}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#202124', fontWeight: 500 }}>Applicant Name {app}</h4>
                            </div>
                            <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#1967d2', fontWeight: 500 }}>Full Stack Developer</p>
                            <div style={{ display: 'flex', gap: '15px', color: '#696969', fontSize: '13px', marginBottom: '15px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1967d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                    Cairo, EG
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                    $50 / hr
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <span style={{ backgroundColor: '#f0f5f7', color: '#1967d2', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>React</span>
                                <span style={{ backgroundColor: '#f0f5f7', color: '#1967d2', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>.NET</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
