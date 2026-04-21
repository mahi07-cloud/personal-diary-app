const express = require('express');
const router = express.Router();
const { createEntry, getEntries, deleteEntry } = require('../controllers/entryController');
const { protect } = require('../middleware/authMiddleware');

// Route for /api/entries/
router.route('/')
  .get(protect, getEntries)
  .post(protect, createEntry);

// Route for /api/entries/:id
router.route('/:id')
  .delete(protect, deleteEntry);

module.exports = router;