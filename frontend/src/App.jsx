import React, { useState, useEffect } from 'react';
import API from './services/api';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import TaskView from './components/TaskView';
import Notifications from './components/Notifications';

export default function App() {
    const [user, setUser] = useState(null);
    const [selectedBoard, setSelectedBoard] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            API.get('/auth/me')
                .then(res => setUser(res.data))
                .catch(() => localStorage.removeItem('token'));
        }
    }, []);

    if (!user) return <Auth setUser={setUser} />;

    return (
        <div>
            <nav className="navbar navbar-dark bg-dark px-4">
                <span className="navbar-brand">Task Pilot (MERN Edition)</span>
                <span className="text-white">Hello, {user.username}</span>
                <button className="btn btn-outline-light btn-sm" onClick={() => {
                    localStorage.removeItem('token');
                    setUser(null);
                }}>Logout</button>
            </nav>

            {!selectedBoard ? (
                <Dashboard onSelectBoard={setSelectedBoard} user={user} />
            ) : (
                <TaskView board={selectedBoard} onBack={() => setSelectedBoard(null)} />
            )}
            <Notifications user={user} />
        </div>
    );
}