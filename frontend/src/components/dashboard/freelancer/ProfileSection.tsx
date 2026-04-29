'use client';
import React, { useState } from 'react';
import { TIME_ZONES } from '../shared/constants';

export default function ProfileSection() {
    // Profile States (DB Aligned)
    const [username, setUsername] = useState('JohnDoe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [timeZone, setTimeZone] = useState(TIME_ZONES[0]);
    const [portfolio, setPortfolio] = useState('Experienced Full-Stack Developer with 5+ years of experience in React and .NET.');

    // Skills State
    const [skills, setSkills] = useState<string[]>(['React', 'Node.js', 'SQL Server', 'TypeScript']);
    const [newSkill, setNewSkill] = useState('');

    // Experience State (Experience Table)
    const [experiences, setExperiences] = useState([
        { company: 'Tech Solutions', position: 'Senior Dev', startDate: '2020-01-01', endDate: '2023-05-01', description: 'Led the frontend team.' }
    ]);

    // Socials State (Socials Table)
    const [socials, setSocials] = useState([
        { type: 'GitHub', url: 'https://github.com/johndoe' },
        { type: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' }
    ]);

    const handleAddSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const handleAddExperience = () => {
        setExperiences([...experiences, { company: '', position: '', startDate: '', endDate: '', description: '' }]);
    };

    const handleAddSocial = () => {
        setSocials([...socials, { type: '', url: '' }]);
    };

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

                    <div className="form-group">
                        <label>Skills</label>
                        <div className="skills-input-wrapper">
                            <input
                                type="text"
                                placeholder="Add a skill (e.g. React)"
                                value={newSkill}
                                onChange={e => setNewSkill(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleAddSkill()}
                                className="form-input"
                            />
                            <button onClick={handleAddSkill} className="add-btn">Add</button>
                        </div>
                        <div className="skills-list">
                            {skills.map(skill => (
                                <span key={skill} className="skill-chip">
                                    {skill}
                                    <button onClick={() => handleRemoveSkill(skill)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </span>
                            ))}
                        </div>
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

            <button className="save-profile-btn" onClick={() => alert('Profile changes saved! (Mock)')}>Save Profile Changes</button>
        </div>
    );
}
