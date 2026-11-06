import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import API from '../services/api';

const socket = io('http://localhost:5000');

export default function Notifications({ user }) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            socket.emit('register', user.id);

            socket.on('notification', (data) => {
                setNotifications(prev => [data, ...prev]);
            });
        }

        return () => {
            socket.off('notification');
        };
    }, [user]);

    const handleAccept = async (notificationId, boardId) => {
        try {
            await API.post('/boards/accept', { notificationId, boardId });
            alert('Successfully joined the board!');
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
        } catch (err) {
            console.error(err);
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div className="alert alert-info position-fixed bottom-0 end-0 m-3 shadow" style={{ zIndex: 1050, maxWidth: '350px' }}>
            <h6>🔔 Notifications</h6>
            {notifications.map((n, index) => (
                <div key={index} className="border-top pt-2 mt-2 small">
                    <p className="mb-1">You have a new collaboration invite!</p>
                    <button className="btn btn-sm btn-success me-2" onClick={() => handleAccept(n._id, n.boardId)}>Accept</button>
                </div>
            ))}
        </div>
    );
}