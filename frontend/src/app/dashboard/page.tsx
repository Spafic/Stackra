'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FreelancerDashboard from '../../components/dashboard/freelancer/FreelancerDashboard';
import ClientDashboard from '../../components/dashboard/client/ClientDashboard';

export default function HomePage() {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedToken = localStorage.getItem('accessToken');

        if (!storedToken) {
            router.push('/');
        } else {
            setRole(storedRole);
            setLoading(false);
        }
    }, [router]);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Montserrat, sans-serif' }}>Loading Dashboard...</div>;

    return (
        <div style={{ minHeight: 'calc(100vh - 70px)', width: '100%' }}>
            {role === 'freelancer' ? <FreelancerDashboard /> : <ClientDashboard />}
        </div>
    );
}
