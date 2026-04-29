'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';

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
        const endpoint = regRole === 'client' ? '/auth/register/client' : '/auth/register/freelancer';

        try {
            const res = await apiFetch(endpoint, {
                method: 'POST',
                body: JSON.stringify({ username: regUsername, email: regEmail, password: regPassword })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('role', data.role);
                localStorage.setItem('userId', data.userId.toString());
                localStorage.setItem('username', data.username);
                localStorage.setItem('regEmail', data.email);
                
                router.push('/auth/complete');
            } else {
                setRegMsg(data.message || 'Registration failed');
            }
        } catch (err) {
            setRegMsg((err as Error).message);
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
