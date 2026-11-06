import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function Dashboard({ onSelectBoard, user }) {
    const [boards, setBoards] = useState([]);
    const [newBoardName, setNewBoardName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [selectedBoardForInvite, setSelectedBoardForInvite] = useState(null);

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        try {
            const res = await API.get('/boards');
            setBoards(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        if (!newBoardName.trim()) return;
        try {
            await API.post('/boards', { name: newBoardName });
            setNewBoardName('');
            fetchBoards();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendInvite = async (boardId) => {
        // Find user by email or pass recipient ID directly if available
        // For simplicity, we assume an endpoint or user mapping exists
        alert(`Invite feature mapped for board ID: ${boardId}`);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">Manage your Boards</h2>
            
            {/* Create Board Form */}
            <form onSubmit={handleCreateBoard} className="row justify-content-center mb-5">
                <div className="col-md-6 d-flex gap-2">
                    <input type="text" className="form-control" placeholder="New board name" 
                        value={newBoardName} onChange={e => setNewBoardName(e.target.value)} />
                    <button type="submit" className="btn btn-dark text-nowrap">Create Board</button>
                </div>
            </form>

            <h4 className="mb-3">Select a Board</h4>
            <div className="row">
                {boards.map(board => (
                    <div className="col-md-4 mb-3" key={board._id}>
                        <div className="card shadow-sm p-3 bg-light border-0">
                            <h5>{board.name}</h5>
                            <p className="text-muted small">Owned by {board.owner?.username || 'You'}</p>
                            
                            <div className="d-flex gap-2 mb-3">
                                <button className="btn btn-sm btn-outline-primary" onClick={() => onSelectBoard(board)}>Open</button>
                                <button className="btn btn-sm btn-outline-secondary">Edit</button>
                                <button className="btn btn-sm btn-outline-danger">Delete</button>
                            </div>

                            <hr />
                            <h6>Board Members</h6>
                            <ul className="list-unstyled small mb-3">
                                {board.members?.length > 0 ? (
                                    board.members.map(m => <li key={m._id}>{m.username}</li>)
                                ) : (
                                    <li className="text-muted">No members to show !!</li>
                                )}
                            </ul>

                            <div className="input-group input-group-sm">
                                <input type="text" className="form-control" placeholder="Add member email" 
                                    value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
                                <button className="btn btn-secondary" onClick={() => handleSendInvite(board._id)}>Invite</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}