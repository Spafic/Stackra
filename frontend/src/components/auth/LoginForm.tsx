'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';

export default function LoginForm() {
    const router = useRouter();
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginMsg, setLoginMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginMsg('');
        try {
            const res = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ usernameOrEmail: loginIdentifier, password: loginPassword })
            });
            const data = await res.json();
            if (res.ok) {
                setLoginMsg('Login successful!');
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('role', data.role);
                localStorage.setItem('userId', data.userId.toString());
                localStorage.setItem('username', data.username);
                localStorage.setItem('regEmail', data.email);
                
                router.push('/dashboard');
            } else {
                setLoginMsg(data.message || 'Email or password is not valid.');
            }
        } catch (err) {
            setLoginMsg((err as Error).message);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <input type="text" placeholder="Email or Username" required value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} />
            <input type="password" placeholder="Password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
            <a href="#">Forgot your password?</a>
            <button type="submit">Sign In</button>
            {loginMsg && <div className={loginMsg.includes('successful') ? 'success-msg' : 'error-msg'}>{loginMsg}</div>}
        </form>
    );
}
