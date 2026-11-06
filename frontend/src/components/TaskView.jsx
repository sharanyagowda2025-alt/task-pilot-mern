import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function TaskView({ board, onBack }) {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchTasks();
    }, [board._id]);

    const fetchTasks = async () => {
        try {
            const res = await API.get(`/tasks/board/${board._id}`);
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
            await API.post('/tasks', { title, description, boardId: board._id });
            setTitle('');
            setDescription('');
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await API.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={onBack}>← Back to Boards</button>
            <h2>Board: {board.name}</h2>
            <hr />

            <div className="row">
                <div className="col-md-4">
                    <div className="card p-3 bg-light">
                        <h5>Create New Task</h5>
                        <form onSubmit={handleCreateTask}>
                            <div className="mb-2">
                                <input type="text" className="form-control" placeholder="Task Title" 
                                    value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="mb-2">
                                <textarea className="form-control" placeholder="Description" 
                                    value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Add Task</button>
                        </form>
                    </div>
                </div>

                <div className="col-md-8">
                    <h4>Tasks</h4>
                    <div className="list-group">
                        {tasks.map(task => (
                            <div className="list-group-item d-flex justify-content-between align-items-center" key={task._id}>
                                <div>
                                    <h5 className="mb-1">{task.title}</h5>
                                    <p className="mb-1 text-muted">{task.description}</p>
                                    <span className="badge bg-info text-dark">{task.status}</span>
                                </div>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}