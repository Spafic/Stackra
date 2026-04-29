'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../globals.css';

interface Experience {
    company: string;
    startDate: string;
    endDate: string;
    position: string;
    description: string;
}

interface SocialLink {
    url: string;
    type: string;
}

export default function CompleteProfile() {
    const router = useRouter();
    const [role, setRole] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    // Field states
    const [timeZone, setTimeZone] = useState('(UTC+02:00) Cairo, Egypt, Johannesburg');
    const [avgSpending, setAvgSpending] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [faxNumber, setFaxNumber] = useState('');
    const [portfolio, setPortfolio] = useState('');

    // Multiple Experiences
    const [experiences, setExperiences] = useState<Experience[]>([
        { company: '', startDate: '', endDate: '', position: '', description: '' }
    ]);

    // Multiple Socials
    const [socials, setSocials] = useState<SocialLink[]>([
        { url: '', type: 'LinkedIn' }
    ]);

    const socialTypes = ['LinkedIn', 'GitHub', 'Behance', 'Dribbble', 'X / Twitter', 'Facebook', 'Portfolio', 'Other'];

    const timeZones = [
        "(UTC+04:00) Abu Dhabi, Muscat, Baku",
        "(UTC+09:30) Adelaide, Darwin",
        "(UTC-09:00) Alaska",
        "(UTC+06:00) Almaty, Novosibirsk, Dhaka",
        "(UTC+03:00) Arabia Standard Time, Riyadh",
        "(UTC-04:00) Atlantic Time (Canada)",
        "(UTC+12:00) Auckland, Wellington, Fiji",
        "(UTC-01:00) Azores, Cape Verde Islands",
        "(UTC+03:00) Baghdad, Moscow, St. Petersburg",
        "(UTC+07:00) Bangkok, Hanoi, Jakarta",
        "(UTC+08:00) Beijing, Hong Kong, Singapore",
        "(UTC+01:00) Berlin, Paris, Madrid, Rome",
        "(UTC-05:00) Bogota, Lima, Quito",
        "(UTC-03:00) Brazil, Buenos Aires, Georgetown",
        "(UTC+02:00) Cairo, Egypt, Johannesburg",
        "(UTC+10:00) Canberra, Melbourne, Sydney",
        "(UTC-06:00) Central Time (US & Canada)",
        "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
        "(UTC-05:00) Eastern Time (US & Canada)",
        "(UTC-10:00) Hawaii",
        "(UTC+05:00) Islamabad, Karachi, Tashkent",
        "(UTC+04:30) Kabul",
        "(UTC+05:45) Kathmandu",
        "(UTC+00:00) London, Lisbon, Casablanca",
        "(UTC+11:00) Magadan, Solomon Islands",
        "(UTC-06:00) Mexico City, Monterrey",
        "(UTC-02:00) Mid-Atlantic",
        "(UTC-11:00) Midway Island, Samoa",
        "(UTC-07:00) Mountain Time (US & Canada)",
        "(UTC+09:00) Osaka, Sapporo, Tokyo, Seoul",
        "(UTC-08:00) Pacific Time (US & Canada)",
        "(UTC+03:30) Tehran",
        "(UTC+06:30) Yangon (Rangoon)"
    ].sort();

    const [msg, setMsg] = useState('');

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedToken = localStorage.getItem('accessToken');
        const storedUsername = localStorage.getItem('regUsername');
        const storedEmail = localStorage.getItem('regEmail');

        if (!storedToken) {
            router.push('/');
        } else {
            setRole(storedRole || '');
            setAccessToken(storedToken);
            setUsername(storedUsername || '');
            setEmail(storedEmail || '');
        }
    }, [router]);

    const addExperience = () => {
        setExperiences([...experiences, { company: '', startDate: '', endDate: '', position: '', description: '' }]);
    };

    const removeExperience = (index: number) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };

    const updateExperience = (index: number, field: keyof Experience, value: string) => {
        const newExps = [...experiences];
        newExps[index][field] = value;
        setExperiences(newExps);
    };

    const addSocial = () => {
        setSocials([...socials, { url: '', type: 'LinkedIn' }]);
    };

    const removeSocial = (index: number) => {
        setSocials(socials.filter((_, i) => i !== index));
    };

    const updateSocial = (index: number, field: keyof SocialLink, value: string) => {
        const newSocials = [...socials];
        newSocials[index][field] = value;
        setSocials(newSocials);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg('Saving your profile...');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };

        try {
            await fetch('/api/users/me', {
                method: 'PUT',
                headers,
                body: JSON.stringify({ username, email, timeZone })
            });

            if (role === 'client') {
                await fetch('/api/clients/me', {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({ avgSpending: parseFloat(avgSpending) || 0 })
                });
                if (phoneNumber) {
                    await fetch('/api/clients/me/phone', { method: 'POST', headers, body: JSON.stringify({ phoneNumber }) });
                }
                if (faxNumber) {
                    await fetch('/api/clients/me/fax', { method: 'POST', headers, body: JSON.stringify({ faxNumber }) });
                }
            } else if (role === 'freelancer') {
                await fetch('/api/freelancers/me', {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({ portfolio })
                });

                for (const exp of experiences) {
                    if (exp.company && exp.startDate) {
                        await fetch('/api/freelancers/me/experiences', {
                            method: 'POST',
                            headers,
                            body: JSON.stringify({
                                company: exp.company,
                                startDate: exp.startDate,
                                endDate: exp.endDate || null,
                                position: exp.position,
                                description: exp.description
                            })
                        });
                    }
                }

                for (const social of socials) {
                    if (social.url) {
                        await fetch('/api/freelancers/me/socials', {
                            method: 'POST',
                            headers,
                            body: JSON.stringify({ url: social.url, type: social.type })
                        });
                    }
                }
            }

            setMsg('Profile completed successfully!');
            setTimeout(() => router.push('/home'), 1500);
        } catch (err) {
            setMsg('Error saving details.');
        }
    };

    if (!role) return <div className="container">Loading...</div>;

    return (
        <div className="complete-profile-wrapper">
            <form onSubmit={handleSubmit} className="professional-form">
                <h1>Complete Your Profile</h1>
                <p className="subtitle">Let's finalize your <strong>{role}</strong> details.</p>

                <div className="form-section">
                    <div className="section-header">
                        <h3>Primary Time Zone</h3>
                    </div>
                    <div className="input-group">
                        <select value={timeZone} onChange={e => setTimeZone(e.target.value)}>
                            {timeZones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                        </select>
                    </div>
                </div>

                {role === 'client' ? (
                    <div className="form-section">
                        <div className="section-header">
                            <h3>Client Profile</h3>
                        </div>
                        <div className="input-group">
                            <label>Average Monthly Spending ($)</label>
                            <input type="number" step="0.01" placeholder="Budget estimate" value={avgSpending} onChange={e => setAvgSpending(e.target.value)} />
                        </div>
                        <div className="row">
                            <div className="input-group">
                                <label>Phone Number</label>
                                <input type="text" placeholder="+20 123..." value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Fax Number</label>
                                <input type="text" placeholder="+20 2..." value={faxNumber} onChange={e => setFaxNumber(e.target.value)} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="form-section">
                            <div className="section-header">
                                <h3>Experience History</h3>
                            </div>

                            {experiences.map((exp, index) => (
                                <div key={index} className="experience-box">
                                    <div className="box-header">
                                        <h4>Experience {index + 1}</h4>
                                        <button type="button" className="remove-link-btn" onClick={() => removeExperience(index)}>Remove</button>
                                    </div>
                                    <div className="input-group">
                                        <label>Company</label>
                                        <input type="text" placeholder="Company Name" value={exp.company} onChange={e => updateExperience(index, 'company', e.target.value)} />
                                    </div>
                                    <div className="row">
                                        <div className="input-group">
                                            <label>Start Date</label>
                                            <input type="date" value={exp.startDate} onChange={e => updateExperience(index, 'startDate', e.target.value)} />
                                        </div>
                                        <div className="input-group">
                                            <label>End Date (Optional)</label>
                                            <input type="date" value={exp.endDate} onChange={e => updateExperience(index, 'endDate', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label>Position</label>
                                        <input type="text" placeholder="e.g. Senior Developer" value={exp.position} onChange={e => updateExperience(index, 'position', e.target.value)} />
                                    </div>
                                    <div className="input-group">
                                        <label>Description</label>
                                        <textarea
                                            placeholder="Brief description of your role..."
                                            value={exp.description}
                                            onChange={e => updateExperience(index, 'description', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                            {experiences.length === 0 && (
                                <p style={{ textAlign: 'center', color: '#999', margin: '20px 0' }}>No experience entries added yet.</p>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: experiences.length > 0 ? '-10px' : '0', marginBottom: '30px' }}>
                                <button type="button" className="add-btn" onClick={addExperience}>+ Add Experience</button>
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="section-header">
                                <h3>Portfolio & Showcases</h3>
                            </div>
                            <div className="input-group">
                                <label>Portfolio URL</label>
                                <input type="text" placeholder="https://behance.net/yourname" value={portfolio} onChange={e => setPortfolio(e.target.value)} />
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="section-header">
                                <h3>Social Presence</h3>
                            </div>

                            {socials.map((social, index) => (
                                <div key={index} className="experience-box" style={{ marginBottom: '15px' }}>
                                    <div className="row" style={{ alignItems: 'flex-end' }}>
                                        <div className="input-group" style={{ flex: 3 }}>
                                            <label>Profile URL</label>
                                            <input type="text" placeholder="https://..." value={social.url} onChange={e => updateSocial(index, 'url', e.target.value)} />
                                        </div>
                                        <div className="input-group" style={{ flex: 1 }}>
                                            <label>Platform</label>
                                            <select value={social.type} onChange={e => updateSocial(index, 'type', e.target.value)}>
                                                {socialTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="input-group" style={{ marginBottom: '35px', marginLeft: '20px', display: 'flex', alignItems: 'flex-end' }}>
                                            <button type="button" className="remove-link-btn" onClick={() => removeSocial(index)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {socials.length === 0 && (
                                <p style={{ textAlign: 'center', color: '#999', margin: '15px 0' }}>No social links added.</p>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <button type="button" className="add-btn" onClick={addSocial}>+ Add Social Link</button>
                            </div>
                        </div>
                    </>
                )}

                <button type="submit" className="finish-btn">Save and Continue</button>
                {msg && <div className={msg.includes('successfully') ? 'success-msg' : 'error-msg'}>{msg}</div>}
            </form>

            <style jsx>{`
                .complete-profile-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    min-height: 100vh;
                    padding: 50px 0;
                    background-color: #fff;
                    width: 100%;
                }
                .professional-form {
                    width: 100%;
                    max-width: 1100px;
                    padding: 0 40px;
                    text-align: left;
                    display: block;
                }
                h1 {
                    font-size: 32px;
                    margin-bottom: 8px;
                    text-align: center;
                    color: #333;
                    font-weight: 700;
                }
                .subtitle {
                    text-align: center;
                    margin-top: 0;
                    margin-bottom: 40px;
                    color: #888;
                    font-size: 14px;
                }
                .form-section {
                    margin-bottom: 40px;
                }
                .section-header {
                    margin-bottom: 20px;
                    border-bottom: 1.5px solid #f0f0f0;
                }
                .section-header h3 {
                    margin: 0;
                    font-size: 18px;
                    color: #ff416c;
                    display: inline-block;
                    border-bottom: 2.5px solid #ff416c;
                    padding-bottom: 8px;
                    margin-bottom: -1.5px;
                }
                .input-group {
                    margin-bottom: 15px;
                }
                label {
                    display: block;
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #444;
                }
                input, textarea, select {
                    width: 100%;
                    padding: 12px 16px;
                    background-color: #f9f9f9;
                    border: 1px solid #eee;
                    border-radius: 10px;
                    font-family: inherit;
                    font-size: 14px;
                    transition: all 0.3s;
                }
                input:focus, textarea:focus, select:focus {
                    outline: none;
                    border-color: #ff4b2b;
                    background-color: #fff;
                    box-shadow: 0 0 0 3px rgba(255, 75, 43, 0.1);
                }
                .row {
                    display: flex;
                    gap: 16px;
                }
                .row .input-group {
                    flex: 1;
                }
                .experience-box {
                    background-color: #fff;
                    padding: 25px;
                    border-radius: 14px;
                    border: 1px solid #eee;
                    margin-bottom: 20px;
                    position: relative;
                }
                .box-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }
                .box-header h4 {
                    margin: 0;
                    font-size: 15px;
                    color: #333;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .add-btn {
                    background-color: #fff;
                    border: 1.5px dashed #ff4b2b;
                    color: #ff4b2b;
                    padding: 10px 25px;
                    border-radius: 12px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: bold;
                }
                .add-btn:hover {
                    background-color: #ff4b2b;
                    color: #fff;
                    transform: translateY(-1px);
                }
                .remove-link-btn {
                    color: #cc0000;
                    font-size: 12px;
                    font-weight: bold;
                    cursor: pointer;
                    background: none;
                    border: none;
                    padding: 8px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .remove-link-btn:hover {
                    color: #ff0000;
                    text-decoration: underline;
                }
                textarea {
                    min-height: 100px;
                }
                .finish-btn {
                    width: 100%;
                    height: 55px;
                    background: linear-gradient(to right, #ff4b2b, #ff416c);
                    border: none;
                    border-radius: 30px;
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    cursor: pointer;
                    margin-top: 30px;
                    transition: all 0.2s;
                }
                .finish-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(255, 75, 43, 0.2);
                }
                .success-msg, .error-msg {
                    text-align: center;
                    margin-top: 25px;
                    font-weight: bold;
                    font-size: 14px;
                }
                .success-msg { color: #2ecc71; }
                .error-msg { color: #e74c3c; }
            `}</style>
        </div>
    );
}
