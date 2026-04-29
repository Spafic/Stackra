'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';

export default function Home() {
    const router = useRouter();
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    // Login states
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginMsg, setLoginMsg] = useState('');

    // Register states - Step 1
    const [regUsername, setRegUsername] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regRole, setRegRole] = useState('client');
    const [regMsg, setRegMsg] = useState('');

    // Store tokens
    const [tokenData, setTokenData] = useState<any>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginMsg('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail: loginIdentifier, password: loginPassword })
            });
            const data = await res.json();
            if (res.ok) {
                setLoginMsg('Login successful!');
                localStorage.setItem('token', data.accessToken);
                router.push('/home');
            } else {
                setLoginMsg(data.message || 'Email or password is not valid.');
            }
        } catch (err) {
            setLoginMsg('An error occurred');
        }
    };

    const handleRegisterStep1 = async (e: React.FormEvent) => {
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
                router.push('/complete');
            } else {
                setRegMsg(data.message || 'Registration failed');
            }
        } catch (err) {
            setRegMsg('An error occurred');
        }
    };


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', padding: '20px' }}>
            <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
                <div className="form-container sign-up-container">
                    <form onSubmit={handleRegisterStep1}>
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
                </div>
                <div className="form-container sign-in-container">
                    <form onSubmit={handleLogin}>
                        <h1>Sign in</h1>
                        <input type="text" placeholder="Email or Username" required value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} />
                        <input type="password" placeholder="Password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                        <a href="#">Forgot your password?</a>
                        <button type="submit">Sign In</button>
                        {loginMsg && <div className={loginMsg.includes('successful') ? 'success-msg' : 'error-msg'}>{loginMsg}</div>}
                    </form>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" onClick={() => { setIsRightPanelActive(false); setCurrentStep(1); }} type="button">Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start journey with us</p>
                            <button className="ghost" onClick={() => setIsRightPanelActive(true)} type="button">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
