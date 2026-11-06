const router = require('express').Router();
const Board = require('/..models/board');
const Notification = require('../models/notification');
const auth = require('../middleware/auth');

// Create Board
router.post('/', auth, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ msg: 'Board name is required.' });

        const newBoard = new Board({ name, owner: req.user, members: [req.user] });
        const savedBoard = await newBoard.save();
        res.json(savedBoard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Boards for Logged-In User
router.get('/', auth, async (req, res) => {
    try {
        const boards = await Board.find({
            $or: [{ owner: req.user }, { members: req.user }]
        }).populate('owner', 'username email').populate('members', 'username email');
        res.json(boards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Send Collaboration Invite
router.post('/invite', auth, async (req, res) => {
    try {
        const { boardId, recipientId } = req.body;
        const newNotification = new Notification({
            recipient: recipientId,
            sender: req.user,
            type: 'invite',
            boardId
        });
        await newNotification.save();
        res.json({ msg: 'Invitation sent successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Accept Invite
router.post('/accept', auth, async (req, res) => {
    try {
        const { notificationId, boardId } = req.body;
        
        // Add user to board members if not already added
        await Board.findByIdAndUpdate(boardId, { $addToSet: { members: req.user } });
        
        // Update notification status
        await Notification.findByIdAndUpdate(notificationId, { status: 'accepted' });
        
        res.json({ msg: 'Successfully joined the board.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;