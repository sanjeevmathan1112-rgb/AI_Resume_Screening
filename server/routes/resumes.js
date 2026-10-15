const express = require('express');
const router = express.Router();
const { uploadResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', protect, upload.single('resume'), uploadResume);

module.exports = router;
