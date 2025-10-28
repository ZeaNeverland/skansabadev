// src/pages/UpdatePassword.tsx
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage('Password berhasil diperbarui!');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleUpdate}>
            <input
                type="password"
                placeholder="Password baru"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Memperbarui...' : 'Update Password'}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default UpdatePassword;