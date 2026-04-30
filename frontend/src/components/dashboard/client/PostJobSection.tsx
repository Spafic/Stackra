'use client';
import React, { useState } from 'react';
import { apiFetch } from '../../../lib/api';

export default function PostJobSection() {
    const [formStep, setFormStep] = useState(1);
    const [jobDescription, setJobDescription] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [availCommHours, setAvailCommHours] = useState('');
    const [expectedDeadline, setExpectedDeadline] = useState('');
    const [msg, setMsg] = useState('');

    const handlePostJob = async () => {
        try {
            const clientId = localStorage.getItem('userId');
            const res = await apiFetch('/posts', {
                method: 'POST',
                body: JSON.stringify({
                    jobDescription,
                    priceMin: parseFloat(priceMin),
                    priceMax: parseFloat(priceMax),
                    availCommHours,
                    expectedDeadline,
                    createdByClientId: parseInt(clientId || '0', 10),
                    status: 'pending'
                })
            });

            if (res.ok) {
                setMsg('Job posted successfully! Waiting for admin approval.');
                setFormStep(1);
                setJobDescription('');
                setPriceMin('');
                setPriceMax('');
                setAvailCommHours('');
                setExpectedDeadline('');
            } else {
                setMsg('Failed to post job.');
            }
        } catch (err) {
            setMsg('Error posting job: ' + (err as Error).message);
        }
    };

    return (
        <div className="content-card">
            {msg && <div style={{ padding: '10px', background: '#e6f4ea', color: '#137333', marginBottom: '15px', borderRadius: '5px' }}>{msg}</div>}
            <div className="form-stepper">
                <div className={`step ${formStep >= 1 ? 'active' : ''}`}>
                    <div className="step-circle">1</div> <span>Job Details</span>
                </div>
                <div className="step-divider"></div>
                <div className={`step ${formStep >= 2 ? 'active' : ''}`}>
                    <div className="step-circle">2</div> <span>Confirmation</span>
                </div>
            </div>

            {formStep === 1 && (
                <div className="form-section animate-fade-in">
                    <div className="form-group">
                        <label>Job Description</label>
                        <textarea
                            placeholder="Describe the requirements, skills needed, deliverables, and goals..."
                            value={jobDescription}
                            onChange={e => setJobDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Minimum Price (USD)</label>
                            <input type="number" placeholder="e.g. 500" value={priceMin} onChange={e => setPriceMin(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Maximum Price (USD)</label>
                            <input type="number" placeholder="e.g. 1500" value={priceMax} onChange={e => setPriceMax(e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Available Communication Hours</label>
                            <input type="text" placeholder="e.g. 9:00 AM - 5:00 PM EST" value={availCommHours} onChange={e => setAvailCommHours(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Expected Deadline</label>
                            <input type="date" value={expectedDeadline} onChange={e => setExpectedDeadline(e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="submit-btn" onClick={() => setFormStep(2)}>Save and Continue</button>
                    </div>
                </div>
            )}

            {formStep === 2 && (
                <div className="form-section animate-fade-in">
                    <h3 style={{ marginBottom: '25px', color: '#202124' }}>Final Review</h3>
                    <div className="summary-box" style={{ backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #ecedf2' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <p><strong>Min Price:</strong> ${priceMin}</p>
                            <p><strong>Max Price:</strong> ${priceMax}</p>
                            <p><strong>Deadline:</strong> {expectedDeadline}</p>
                            <p><strong>Comm. Hours:</strong> {availCommHours}</p>
                        </div>
                        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ddd' }} />
                        <p><strong>Description:</strong></p>
                        <p style={{ color: '#696969', lineHeight: '1.6' }}>{jobDescription}</p>
                    </div>

                    <div className="form-actions" style={{ display: 'flex', gap: '20px' }}>
                        <button className="submit-btn ghost-btn" onClick={() => setFormStep(1)} style={{ backgroundColor: '#f0f5f7', color: '#696969' }}>Back</button>
                        <button className="submit-btn" onClick={handlePostJob}>Post Job Now</button>
                    </div>
                </div>
            )}
        </div>
    );
}
