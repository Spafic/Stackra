'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
    const router = useRouter();
    const [regUsername, setRegUsername] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regRole, setRegRole] = useState('client');
    const [regMsg, setRegMsg] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegMsg('');
        const endpoint = regRole === 'client' ? '/api/auth/register/client' : '/api/auth/register/freelancer';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: regUsername, email: regEmail, password: regPassword })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('role', data.role);
                localStorage.setItem('regUsername', regUsername);
                localStorage.setItem('regEmail', regEmail);
                router.push('/auth/complete');
            } else {
                setRegMsg(data.message || 'Registration failed');
            }
        } catch (err) {
            setRegMsg('An error occurred');
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h1>Create Account</h1>
            <input type="text" placeholder="Username" required value={regUsername} onChange={e => setRegUsername(e.target.value)} />
            <input type="email" placeholder="Email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} />
            <input type="password" placeholder="Password" required value={regPassword} onChange={e => setRegPassword(e.target.value)} />
            <select value={regRole} onChange={e => setRegRole(e.target.value)}>
                <option value="client">Client</option>
                <option value="freelancer">Freelancer</option>
            </select>
            <button type="submit" style={{ marginTop: '10px' }}>Sign Up</button>
            {regMsg && <div className={regMsg.includes('saved') ? 'success-msg' : 'error-msg'}>{regMsg}</div>}
        </form>
    );
}
