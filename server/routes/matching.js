const express = require('express');
const router = express.Router();
const { getJobRanking } = require('../controllers/matchingController');
const { protect } = require('../middleware/auth');

router.get('/:jobId/ranking', protect, getJobRanking);

module.exports = router;
