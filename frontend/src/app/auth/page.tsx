'use client';
import { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import '../globals.css';

export default function Home() {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);

    return (
        <div className="auth-pattern-bg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
            <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
                <div className="form-container sign-up-container">
                    <RegisterForm />
                </div>
                <div className="form-container sign-in-container">
                    <LoginForm />
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" onClick={() => setIsRightPanelActive(false)} type="button">Sign In</button>
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
