const express = require('express');
const router = express.Router();
const { getCandidates, getCandidate, deleteCandidate } = require('../controllers/candidateController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getCandidates);

router.route('/:id')
  .get(protect, getCandidate)
  .delete(protect, deleteCandidate);

module.exports = router;
