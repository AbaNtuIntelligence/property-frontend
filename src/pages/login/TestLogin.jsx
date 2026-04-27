import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function TestLogin() {
    const { login, user, isAuthenticated } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('Logging in...');
        const result = await login(username, password);
        if (result.success) {
            setMessage(`✅ Login successful! Welcome ${result.user.username}`);
            console.log('Token:', localStorage.getItem('access_token'));
            console.log('User:', localStorage.getItem('user'));
        } else {
            setMessage(`❌ Login failed: ${result.error}`);
        }
    };

    return (
        <div style={{ padding: '100px 20px', maxWidth: '400px', margin: '0 auto' }}>
            <h1>Test Login</h1>
            <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
            {user && <p>User: {user.username}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px' }}>Login</button>
            </form>
            <p>{message}</p>
            <button onClick={() => {
                localStorage.clear();
                window.location.reload();
            }}>Clear Storage</button>
        </div>
    );
}