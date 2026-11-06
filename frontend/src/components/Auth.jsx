import React, { useState } from 'react';
import API from '../services/api';

export default function Auth({ setUser }) {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const res = await API.post(endpoint, form);
            
            if (isLogin) {
                localStorage.setItem('token', res.data.token);
                setUser(res.data.user);
            } else {
                alert('Registration successful! Please login.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <div className="card shadow p-4">
                <h3 className="text-center mb-3">{isLogin ? 'Login' : 'Register'}</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" 
                                value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
                        </div>
                    )}
                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input type="email" className="form-control" 
                            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" 
                            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <button className="btn btn-link w-100 text-decoration-none" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
}