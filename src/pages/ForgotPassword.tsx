// src/pages/ForgotPassword.tsx
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Pastikan sudah di-setup

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/update-password', // URL redirect setelah reset
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage('Link reset password sudah dikirim ke email Anda!');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleReset}>
            <input
                type="email"
                placeholder="Email admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Mengirim...' : 'Reset Password'}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default ForgotPassword;