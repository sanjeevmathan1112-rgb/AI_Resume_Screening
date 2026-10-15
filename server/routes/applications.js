const express = require('express');
const router = express.Router();
const { updateApplicationStatus, updateApplicationNotes } = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

router.put('/:id/status', protect, updateApplicationStatus);
router.put('/:id/notes', protect, updateApplicationNotes);

module.exports = router;
