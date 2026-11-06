const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { 
        type: String, 
        enum: ['To-Do', 'In Progress', 'Done'], 
        default: 'To-Do' 
    },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);