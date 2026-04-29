'use client';
import { useState } from 'react';
import DashboardLayout, { MenuItem } from './DashboardLayout';
import './DashboardContent.css';

interface PostedCase {
    id: number;
    title: string;
    status: string;
    applicants: number;
    postedDate: string;
}

const mockPostedCases: PostedCase[] = [
    { id: 1, title: 'Build a Next.js E-commerce Platform', status: 'Active', applicants: 12, postedDate: 'Oct 24, 2023' },
    { id: 2, title: 'Database Migration to SQL Server', status: 'Active', applicants: 5, postedDate: 'Oct 26, 2023' },
    { id: 3, title: 'UI Redesign for Mobile App', status: 'Closed', applicants: 28, postedDate: 'Sep 15, 2023' },
];

export default function ClientDashboard() {
    const [view, setView] = useState<string>('dashboard');

    // Form states matching POST schema
    const [formStep, setFormStep] = useState(1);
    const [jobDescription, setJobDescription] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [availCommHours, setAvailCommHours] = useState('');
    const [expectedDeadline, setExpectedDeadline] = useState('');
    const [selectedPackage, setSelectedPackage] = useState('Standard');
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');

    const handlePostCase = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Case posted successfully! (Mock)');
        setView('manage');
    };

    const clientMenuItems: MenuItem[] = [
        { id: 'dashboard', label: 'Dashboard', iconName: 'dashboard' },
        { id: 'post', label: 'Post A New Case', iconName: 'post' },
        { id: 'manage', label: 'Manage Cases', iconName: 'manage' },
        { id: 'applicants', label: 'All Applicants', iconName: 'applicants' },
        { id: 'profile', label: 'Company Profile', iconName: 'profile' }
    ];

    const renderContent = () => {
        if (view === 'manage') {
            return (
                <div className="content-card">
                    <div className="cases-table-wrapper">
                        <table className="cases-table">
                            <thead>
                                <tr>
                                    <th>Case Title</th>
                                    <th>Date Posted</th>
                                    <th>Status</th>
                                    <th>Proposals</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockPostedCases.map(c => (
                                    <tr key={c.id}>
                                        <td className="title-cell">{c.title}</td>
                                        <td>{c.postedDate}</td>
                                        <td>
                                            <span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span>
                                        </td>
                                        <td className="applicants-cell">{c.applicants} Applicants</td>
                                        <td className="actions-cell">
                                            <button className="action-btn view-btn" title="View Detail">
                                                <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            </button>
                                            <button className="action-btn edit-btn" title="Edit Case">
                                                <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button className="action-btn delete-btn" title="Delete Case">
                                                <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        if (view === 'post') {
            return (
                <div className="content-card">
                    <div className="form-stepper">
                        <div className={`step ${formStep >= 1 ? 'active' : ''}`}>
                            <div className="step-circle">1</div> <span>Case Detail</span>
                        </div>
                        <div className="step-divider"></div>
                        <div className={`step ${formStep >= 2 ? 'active' : ''}`}>
                            <div className="step-circle">2</div> <span>Package & Payments</span>
                        </div>
                        <div className="step-divider"></div>
                        <div className={`step ${formStep >= 3 ? 'active' : ''}`}>
                            <div className="step-circle">3</div> <span>Confirmation</span>
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
                            <div className="form-group">
                                <label>Select Package</label>
                                <div className="package-options" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                    {['Standard', 'Featured', 'Urgent'].map(pkg => (
                                        <div 
                                            key={pkg} 
                                            className={`package-card ${selectedPackage === pkg ? 'selected' : ''}`}
                                            onClick={() => setSelectedPackage(pkg)}
                                            style={{ 
                                                padding: '25px', 
                                                border: `2px solid ${selectedPackage === pkg ? '#ff4b2b' : '#ecedf2'}`,
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            <h4 style={{ margin: '0 0 10px 0', color: selectedPackage === pkg ? '#ff4b2b' : '#202124' }}>{pkg}</h4>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#696969' }}>
                                                {pkg === 'Standard' ? 'Free listing for 30 days' : pkg === 'Featured' ? 'Top of search results ($29)' : 'Highlighted in red ($49)'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Payment Method</label>
                                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                                    <option>Credit Card</option>
                                    <option>PayPal</option>
                                    <option>Wallet Balance</option>
                                </select>
                            </div>

                            <div className="form-actions" style={{ display: 'flex', gap: '20px' }}>
                                <button className="submit-btn ghost-btn" onClick={() => setFormStep(1)} style={{ backgroundColor: '#f0f5f7', color: '#696969' }}>Back</button>
                                <button className="submit-btn" onClick={() => setFormStep(3)}>Save and Continue</button>
                            </div>
                        </div>
                    )}

                    {formStep === 3 && (
                        <div className="form-section animate-fade-in">
                            <h3 style={{ marginBottom: '25px', color: '#202124' }}>Final Review</h3>
                            <div className="summary-box" style={{ backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #ecedf2' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <p><strong>Min Price:</strong> ${priceMin}</p>
                                    <p><strong>Max Price:</strong> ${priceMax}</p>
                                    <p><strong>Deadline:</strong> {expectedDeadline}</p>
                                    <p><strong>Comm. Hours:</strong> {availCommHours}</p>
                                    <p><strong>Package:</strong> {selectedPackage}</p>
                                    <p><strong>Payment:</strong> {paymentMethod}</p>
                                </div>
                                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ddd' }} />
                                <p><strong>Description:</strong></p>
                                <p style={{ color: '#696969', lineHeight: '1.6' }}>{jobDescription}</p>
                            </div>

                            <div className="form-actions" style={{ display: 'flex', gap: '20px' }}>
                                <button className="submit-btn ghost-btn" onClick={() => setFormStep(2)} style={{ backgroundColor: '#f0f5f7', color: '#696969' }}>Back</button>
                                <button className="submit-btn" onClick={handlePostCase}>Post Case Now</button>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (view === 'applicants') {
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
                                        <button className="action-btn"><svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg></button>
                                    </div>
                                    <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#1967d2', fontWeight: 500 }}>Full Stack Developer</p>
                                    <div style={{ display: 'flex', gap: '15px', color: '#696969', fontSize: '13px', marginBottom: '15px' }}>
                                        <span>📍 Cairo, EG</span>
                                        <span>💰 $50 / hr</span>
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

        // Default Dashboard View
        return (
            <div className="dashboard-home">
                {/* 4 Cards Row */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                    {/* Card 1: Posted Jobs */}
                    <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '8px', padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0px 6px 15px rgba(64, 79, 104, 0.05)' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: 'rgba(25, 103, 210, 0.1)', color: '#1967d2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ color: '#1967d2', fontSize: '30px', margin: '0 0 5px 0', fontWeight: 600 }}>22</h2>
                            <p style={{ color: '#202124', margin: 0, fontSize: '14px', fontWeight: 500 }}>Posted Jobs</p>
                        </div>
                    </div>

                    {/* Card 2: Applications */}
                    <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '8px', padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0px 6px 15px rgba(64, 79, 104, 0.05)' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: 'rgba(217, 48, 37, 0.1)', color: '#d93025', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ color: '#d93025', fontSize: '30px', margin: '0 0 5px 0', fontWeight: 600 }}>9382</h2>
                            <p style={{ color: '#202124', margin: 0, fontSize: '14px', fontWeight: 500 }}>Application</p>
                        </div>
                    </div>

                    {/* Card 3: Messages */}
                    <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '8px', padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0px 6px 15px rgba(64, 79, 104, 0.05)' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: 'rgba(249, 171, 0, 0.1)', color: '#f9ab00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ color: '#f9ab00', fontSize: '30px', margin: '0 0 5px 0', fontWeight: 600 }}>74</h2>
                            <p style={{ color: '#202124', margin: 0, fontSize: '14px', fontWeight: 500 }}>Messages</p>
                        </div>
                    </div>

                    {/* Card 4: Shortlist */}
                    <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '8px', padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0px 6px 15px rgba(64, 79, 104, 0.05)' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: 'rgba(52, 168, 83, 0.1)', color: '#34a853', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ color: '#34a853', fontSize: '30px', margin: '0 0 5px 0', fontWeight: 600 }}>32</h2>
                            <p style={{ color: '#202124', margin: 0, fontSize: '14px', fontWeight: 500 }}>Shortlist</p>
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '30px 30px 50px 50px', boxShadow: '0px 6px 15px rgba(64, 79, 104, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <h3 style={{ color: '#202124', margin: 0, fontSize: '18px', fontWeight: 600 }}>Your Profile Views</h3>
                        <select style={{ padding: '8px 15px', borderRadius: '4px', border: '1px solid #ecedf2', color: '#696969', fontSize: '14px', backgroundColor: '#f0f5f7', outline: 'none' }}>
                            <option>Last 6 Months</option>
                            <option>Last 12 Months</option>
                        </select>
                    </div>

                    <div style={{ height: '300px', position: 'relative', borderLeft: '1px solid #ecedf2', borderBottom: '1px solid #ecedf2', marginTop: '20px' }}>
                        {/* Horizontal grid lines */}
                        {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} style={{ position: 'absolute', top: `${i * 25}%`, left: 0, width: '100%', borderTop: '1px dashed #ecedf2', zIndex: 1 }} />
                        ))}
                        
                        {/* SVG Line Chart */}
                        <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, overflow: 'visible' }}>
                            <polyline points="0,200 200,260 400,100 600,250 800,200 1000,240" fill="none" stroke="#1967d2" strokeWidth="3" />
                            <circle cx="0" cy="200" r="5" fill="#1967d2" stroke="#ffffff" strokeWidth="2" />
                            <circle cx="200" cy="260" r="5" fill="#1967d2" stroke="#ffffff" strokeWidth="2" />
                            <circle cx="400" cy="100" r="5" fill="#1967d2" stroke="#ffffff" strokeWidth="2" />
                            <circle cx="600" cy="250" r="5" fill="#1967d2" stroke="#ffffff" strokeWidth="2" />
                            <circle cx="800" cy="200" r="5" fill="#1967d2" stroke="#ffffff" strokeWidth="2" />
                            <circle cx="1000" cy="240" r="5" fill="#1967d2" stroke="#ffffff" strokeWidth="2" />
                        </svg>

                        {/* X-axis labels */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', bottom: '-35px', width: '100%', color: '#696969', fontSize: '13px' }}>
                            <span style={{ transform: 'translateX(-50%)' }}>January</span>
                            <span style={{ transform: 'translateX(-50%)' }}>February</span>
                            <span style={{ transform: 'translateX(-50%)' }}>March</span>
                            <span style={{ transform: 'translateX(-50%)' }}>April</span>
                            <span style={{ transform: 'translateX(-50%)' }}>May</span>
                            <span style={{ transform: 'translateX(50%)' }}>June</span>
                        </div>

                        {/* Y-axis labels */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'absolute', left: '-45px', top: '-10px', height: '100%', color: '#696969', fontSize: '13px', textAlign: 'right', width: '30px' }}>
                            <span>400</span>
                            <span>300</span>
                            <span>200</span>
                            <span>100</span>
                            <span style={{ transform: 'translateY(10px)' }}>0</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const pageTitles: Record<string, { title: string, subtitle: string }> = {
        'dashboard': { title: 'Dashboard Home!', subtitle: 'Ready to jump back in?' },
        'post': { title: 'Post a New Case!', subtitle: 'Ready to jump back in?' },
        'manage': { title: 'Manage Cases!', subtitle: 'Ready to jump back in?' },
        'applicants': { title: 'All Applicants!', subtitle: 'Ready to jump back in?' },
    };

    return (
        <DashboardLayout
            menuItems={clientMenuItems}
            activeMenu={view}
            onMenuSelect={(newView) => {
                setView(newView);
                if (newView === 'post') setFormStep(1);
            }}
            pageTitle={pageTitles[view]?.title || 'Dashboard'}
            pageSubtitle={pageTitles[view]?.subtitle || 'Ready to jump back in?'}
        >
            {renderContent()}

        </DashboardLayout>
    );
}
