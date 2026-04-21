const Entry = require('../models/Entry');

// @desc    Create entry
// @route   POST /api/entries
const createEntry = async (req, res, next) => {
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400);
    return next(new Error('Title and content are required'));
  }

  try {
    const entry = await Entry.create({
      user: req.user._id,
      title,
      content
    });
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

// @desc    Get entries (Sorted by Newest)
// @route   GET /api/entries
const getEntries = async (req, res, next) => {
  try {
    const entries = await Entry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete entry
// @route   DELETE /api/entries/:id
const deleteEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      res.status(404);
      return next(new Error('Entry not found'));
    }

    if (entry.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('User not authorized to delete this'));
    }

    await entry.deleteOne();
    res.json({ id: req.params.id, message: 'Entry removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createEntry, getEntries, deleteEntry };