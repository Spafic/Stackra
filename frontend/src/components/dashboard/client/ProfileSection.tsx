'use client';
import React, { useState, useEffect } from 'react';
import { TIME_ZONES } from '../shared/constants';
import { apiFetch } from '../../../lib/api';

export default function ProfileSection() {
    // Client Profile States
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [timeZone, setTimeZone] = useState(TIME_ZONES[0]);
    const [avgSpending, setAvgSpending] = useState('');
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    
    // Dynamic lists
    const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
    const [faxNumbers, setFaxNumbers] = useState<string[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await apiFetch('/clients/me');
                if (res.ok) {
                    const data = await res.json();
                    setUsername(data.username);
                    setEmail(data.email);
                    setTimeZone(data.timeZone || TIME_ZONES[0]);
                    setAvgSpending(data.avgSpending?.toString() || '');
                    setPhoneNumbers(data.phoneNumbers || []);
                    setFaxNumbers(data.faxNumbers || []);
                }
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setMsg('Saving changes...');
        try {
            // 1. Update User info
            await apiFetch('/users/me', {
                method: 'PUT',
                body: JSON.stringify({ username, email, timeZone })
            });
            localStorage.setItem('username', username);
            localStorage.setItem('regEmail', email);

            // 2. Update Client info
            await apiFetch('/clients/me', {
                method: 'PUT',
                body: JSON.stringify({ avgSpending: parseFloat(avgSpending) || 0 })
            });

            // 3. Sync Phone Numbers
            const clientData = await (await apiFetch('/clients/me')).json();
            const dbPhones: string[] = clientData.phoneNumbers || [];
            
            // Add new ones
            for (const phone of phoneNumbers) {
                if (phone && !dbPhones.includes(phone)) {
                    await apiFetch('/clients/me/phone', {
                        method: 'POST',
                        body: JSON.stringify({ phoneNumber: phone })
                    }).catch(() => {});
                }
            }
            // Remove deleted ones
            for (const oldPhone of dbPhones) {
                if (!phoneNumbers.includes(oldPhone)) {
                    await apiFetch('/clients/me/phone', {
                        method: 'DELETE',
                        body: JSON.stringify({ phoneNumber: oldPhone })
                    }).catch(() => {});
                }
            }

            // 4. Sync Fax Numbers
            const dbFaxes: string[] = clientData.faxNumbers || [];
            
            // Add new ones
            for (const fax of faxNumbers) {
                if (fax && !dbFaxes.includes(fax)) {
                    await apiFetch('/clients/me/fax', {
                        method: 'POST',
                        body: JSON.stringify({ faxNumber: fax })
                    }).catch(() => {});
                }
            }
            // Remove deleted ones
            for (const oldFax of dbFaxes) {
                if (!faxNumbers.includes(oldFax)) {
                    await apiFetch('/clients/me/fax', {
                        method: 'DELETE',
                        body: JSON.stringify({ faxNumber: oldFax })
                    }).catch(() => {});
                }
            }

            setMsg('Profile updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Error saving changes: ' + (err as Error).message);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Montserrat, sans-serif' }}>Loading Profile...</div>;

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
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="form-input" />
                            <small style={{ color: '#696969', fontSize: '12px' }}>This is your primary identifier on the platform.</small>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label>Time Zone</label>
                                <select value={timeZone} onChange={e => setTimeZone(e.target.value)} className="form-input">
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
                            <button className="submit-btn" onClick={handleSave}>
                                Save Changes
                            </button>
                            {msg && <div className={msg.includes('successfully') ? 'success-msg' : 'error-msg'} style={{ textAlign: 'center', marginTop: '15px', fontWeight: 'bold' }}>{msg}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
