import React, { useState, useEffect } from 'react';
import { TIME_ZONES } from '../shared/constants';
import { apiFetch } from '../../../lib/api';

export default function ProfileSection() {
    // Profile States (DB Aligned)
    const [userId, setUserId] = useState<number | null>(null);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [timeZone, setTimeZone] = useState(TIME_ZONES[0]);
    const [portfolio, setPortfolio] = useState('');
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    // Experience State
    const [experiences, setExperiences] = useState<any[]>([]);

    // Socials State
    const [socials, setSocials] = useState<any[]>([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await apiFetch('/freelancers/me');
                if (res.ok) {
                    const data = await res.json();
                    setUserId(data.userId);
                    setUsername(data.username);
                    setEmail(data.email);
                    setTimeZone(data.timeZone || TIME_ZONES[0]);
                    setPortfolio(data.portfolio || '');
                    setExperiences(data.experiences || []);
                    setSocials(data.socials || []);
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

            // 2. Update Freelancer info
            await apiFetch('/freelancers/me', {
                method: 'PUT',
                body: JSON.stringify({ portfolio })
            });

            // 3. Sync Experiences (Simple approach: Try to add each)
            const freelancerData = await (await apiFetch('/freelancers/me')).json();
            const dbExperiences: any[] = freelancerData.experiences || [];

            for (const exp of experiences) {
                if (exp.company && exp.startDate) {
                    // Check if already in DB (matching by company and start date)
                    const exists = dbExperiences.some(e => e.company === exp.company && e.startDate.startsWith(exp.startDate));
                    if (!exists) {
                        await apiFetch('/freelancers/me/experiences', {
                            method: 'POST',
                            body: JSON.stringify(exp)
                        }).catch(() => {});
                    } else {
                        // Update existing
                        await apiFetch('/freelancers/me/experiences', {
                            method: 'PUT',
                            body: JSON.stringify(exp)
                        }).catch(() => {});
                    }
                }
            }
            // Remove deleted ones
            for (const oldExp of dbExperiences) {
                const stillExists = experiences.some(e => e.company === oldExp.company && oldExp.startDate.startsWith(e.startDate));
                if (!stillExists) {
                    await apiFetch('/freelancers/me/experiences', {
                        method: 'DELETE',
                        body: JSON.stringify({ company: oldExp.company, startDate: oldExp.startDate })
                    }).catch(() => {});
                }
            }

            // 4. Sync Socials
            const dbSocials: any[] = freelancerData.socials || [];
            for (const social of socials) {
                if (social.url) {
                    const exists = dbSocials.some(s => s.url === social.url);
                    if (!exists) {
                        await apiFetch('/freelancers/me/socials', {
                            method: 'POST',
                            body: JSON.stringify(social)
                        }).catch(() => {});
                    } else {
                        await apiFetch('/freelancers/me/socials', {
                            method: 'PUT',
                            body: JSON.stringify(social)
                        }).catch(() => {});
                    }
                }
            }
            // Remove deleted ones
            for (const oldSocial of dbSocials) {
                if (!socials.some(s => s.url === oldSocial.url)) {
                    await apiFetch('/freelancers/me/socials', {
                        method: 'DELETE',
                        body: JSON.stringify({ url: oldSocial.url })
                    }).catch(() => {});
                }
            }

            setMsg('Profile updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            setMsg('Error saving changes: ' + (err as Error).message);
        }
    };

    const handleAddExperience = () => {
        setExperiences([...experiences, { company: '', position: '', startDate: '', endDate: '', description: '' }]);
    };

    const handleAddSocial = () => {
        setSocials([...socials, { type: 'LinkedIn', url: '' }]);
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Montserrat, sans-serif' }}>Loading Profile...</div>;

    return (
        <div className="profile-container">
            {/* USERS Table Fields */}
            <div className="profile-section">
                <div className="signup-section-header">
                    <h3>Account Information</h3>
                </div>
                <div className="content-card" style={{ marginBottom: '30px' }}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="form-input" />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" />
                        </div>
                        <div className="form-group full-width">
                            <label>Time Zone</label>
                            <select value={timeZone} onChange={e => setTimeZone(e.target.value)} className="form-input">
                                {TIME_ZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* FREELANCER Table Fields */}
            <div className="profile-section">
                <div className="signup-section-header">
                    <h3>Professional Profile</h3>
                </div>
                <div className="content-card" style={{ marginBottom: '30px' }}>
                    <div className="form-group">
                        <label>Portfolio / About Me</label>
                        <textarea value={portfolio} onChange={e => setPortfolio(e.target.value)} className="form-input textarea" rows={4} />
                    </div>
                </div>
            </div>

            {/* EXPERIENCE Table Fields */}
            <div className="profile-section">
                <div className="signup-section-header">
                    <h3>Experience History</h3>
                </div>
                <div className="content-card" style={{ marginBottom: '30px' }}>
                    {experiences.map((exp, index) => (
                        <div key={index} className="signup-box">
                            <div className="signup-box-header">
                                <h4>Experience {index + 1}</h4>
                                <button
                                    className="signup-remove-btn"
                                    onClick={() => setExperiences(experiences.filter((_, i) => i !== index))}
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Company</label>
                                    <input
                                        type="text"
                                        value={exp.company}
                                        onChange={e => {
                                            const next = [...experiences];
                                            next[index].company = e.target.value;
                                            setExperiences(next);
                                        }}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Position</label>
                                    <input
                                        type="text"
                                        value={exp.position}
                                        onChange={e => {
                                            const next = [...experiences];
                                            next[index].position = e.target.value;
                                            setExperiences(next);
                                        }}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        value={exp.startDate}
                                        onChange={e => {
                                            const next = [...experiences];
                                            next[index].startDate = e.target.value;
                                            setExperiences(next);
                                        }}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        value={exp.endDate}
                                        onChange={e => {
                                            const next = [...experiences];
                                            next[index].endDate = e.target.value;
                                            setExperiences(next);
                                        }}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={handleAddExperience} className="signup-add-btn">+ Add Experience</button>
                    </div>
                </div>
            </div>

            {/* SOCIALS Table Fields */}
            <div className="profile-section">
                <div className="signup-section-header">
                    <h3>Social Presence</h3>
                </div>
                <div className="content-card" style={{ marginBottom: '30px' }}>
                    {socials.map((social, index) => (
                        <div key={index} className="signup-box" style={{ marginBottom: '15px' }}>
                            <div className="form-row" style={{ alignItems: 'flex-end', display: 'flex', gap: '20px' }}>
                                <div className="form-group" style={{ flex: 3, marginBottom: 0 }}>
                                    <label>Profile URL</label>
                                    <input
                                        type="text"
                                        value={social.url}
                                        onChange={e => {
                                            const next = [...socials];
                                            next[index].url = e.target.value;
                                            setSocials(next);
                                        }}
                                        placeholder="https://..."
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                    <label>Platform</label>
                                    <select
                                        value={social.type}
                                        onChange={e => {
                                            const next = [...socials];
                                            next[index].type = e.target.value;
                                            setSocials(next);
                                        }}
                                        className="form-input"
                                    >
                                        {['LinkedIn', 'GitHub', 'Behance', 'Dribbble', 'X / Twitter', 'Facebook', 'Portfolio', 'Other'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: '25px' }}>
                                    <button className="signup-remove-btn" onClick={() => setSocials(socials.filter((_, i) => i !== index))}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {socials.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#999', margin: '15px 0' }}>No social links added.</p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button onClick={handleAddSocial} className="signup-add-btn">+ Add Social Link</button>
                    </div>
                </div>
            </div>

            <button className="save-profile-btn" onClick={handleSave}>Save Profile Changes</button>
            {msg && <div className={msg.includes('successfully') ? 'success-msg' : 'error-msg'} style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>{msg}</div>}
        </div>
    );
}
