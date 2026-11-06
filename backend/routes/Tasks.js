const router = require('express').Router();
const Task = require('/..models/task');
const auth = require('../middleware/auth');

// Create Task
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, boardId, assignedTo, dueDate } = req.body;
        if (!title || !boardId) return res.status(400).json({ msg: 'Title and Board ID are required.' });

        const newTask = new Task({ title, description, boardId, assignedTo, dueDate });
        const savedTask = await newTask.save();
        res.json(savedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Tasks by Board ID
router.get('/board/:boardId', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ boardId: req.params.boardId }).populate('assignedTo', 'username email');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Task
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Task deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;