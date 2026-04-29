'use client';
import React from 'react';

export default function OverviewSection() {
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
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
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
                    <h3 style={{ color: '#202124', margin: 0, fontSize: '18px', fontWeight: 600 }}>Applications to your jobs</h3>
                    <select style={{ padding: '8px 15px', borderRadius: '4px', width: '150px', border: '1px solid #ecedf2', color: '#696969', fontSize: '14px', backgroundColor: '#f0f5f7', outline: 'none' }}>
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
}
