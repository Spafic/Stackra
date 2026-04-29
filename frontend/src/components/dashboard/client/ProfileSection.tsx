'use client';
import React, { useState } from 'react';
import { TIME_ZONES } from '../shared/constants';

export default function ProfileSection() {
    // Client Profile States
    const [companyUsername, setCompanyUsername] = useState('Stackra_Dev');
    const [companyEmail, setCompanyEmail] = useState('contact@stackra.com');
    const [companyTimeZone, setCompanyTimeZone] = useState(TIME_ZONES[0]);
    const [avgSpending, setAvgSpending] = useState('5000');
    
    // Dynamic lists
    const [phoneNumbers, setPhoneNumbers] = useState(['+1 234 567 890']);
    const [faxNumbers, setFaxNumbers] = useState(['+1 234 567 891']);

    return (
        <div className="content-card">
            <div className="profile-section">
                <div className="signup-section-header">
                    <h3>Company Profile</h3>
                </div>
                
                <div className="content-card">
                    <div className="form-section">
                        <div className="form-group">
                            <label>Username (Company ID)</label>
                            <input type="text" value={companyUsername} onChange={e => setCompanyUsername(e.target.value)} className="form-input" />
                            <small style={{ color: '#696969', fontSize: '12px' }}>This is your primary identifier on the platform.</small>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label>Time Zone</label>
                                <select value={companyTimeZone} onChange={e => setCompanyTimeZone(e.target.value)} className="form-input">
                                    {TIME_ZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Average Spending (USD)</label>
                            <input type="number" value={avgSpending} onChange={e => setAvgSpending(e.target.value)} className="form-input" />
                        </div>

                        <div className="form-group">
                            <label>Phone Numbers</label>
                            {phoneNumbers.map((phone, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <input 
                                        type="text" 
                                        value={phone} 
                                        onChange={e => {
                                            const newPhones = [...phoneNumbers];
                                            newPhones[idx] = e.target.value;
                                            setPhoneNumbers(newPhones);
                                        }} 
                                        className="form-input"
                                    />
                                    <button 
                                        className="action-btn delete-btn" 
                                        onClick={() => setPhoneNumbers(phoneNumbers.filter((_, i) => i !== idx))}
                                        style={{ height: '45px', width: '45px' }}
                                    >
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#d93025" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            ))}
                            <button 
                                className="signup-add-btn" 
                                onClick={() => setPhoneNumbers([...phoneNumbers, ''])}
                                style={{ padding: '8px 15px', fontSize: '13px', width: 'auto' }}
                            >
                                + Add Phone Number
                            </button>
                        </div>

                        <div className="form-group">
                            <label>Fax Numbers</label>
                            {faxNumbers.map((fax, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <input 
                                        type="text" 
                                        value={fax} 
                                        onChange={e => {
                                            const newFaxes = [...faxNumbers];
                                            newFaxes[idx] = e.target.value;
                                            setFaxNumbers(newFaxes);
                                        }} 
                                        className="form-input"
                                    />
                                    <button 
                                        className="action-btn delete-btn" 
                                        onClick={() => setFaxNumbers(faxNumbers.filter((_, i) => i !== idx))}
                                        style={{ height: '45px', width: '45px' }}
                                    >
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#d93025" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            ))}
                            <button 
                                className="signup-add-btn" 
                                onClick={() => setFaxNumbers([...faxNumbers, ''])}
                                style={{ padding: '8px 15px', fontSize: '13px', width: 'auto' }}
                            >
                                + Add Fax Number
                            </button>
                        </div>

                        <div className="form-actions" style={{ marginTop: '30px' }}>
                            <button className="submit-btn" onClick={() => alert('Profile updated successfully! (Mock)')}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
