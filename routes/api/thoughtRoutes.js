const router = require('express').Router();
import { Thought, User } from '../models';

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find().select('-__v');
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single thought by id
router.get('/:id', async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.id }).select('-__v');

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new thought
router.post('/', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    
    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { thoughts: thought._id } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: 'Thought created, but found no user with that ID',
      });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT to update a thought by id
router.put('/:id', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a thought by id
router.delete('/:id', async (req, res) => {
  try {
    const thought = await Thought.findOneAndDelete({ _id: req.params.id });

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }

    const user = await User.findOneAndUpdate(
      { thoughts: req.params.id },
      { $pull: { thoughts: req.params.id } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: 'Thought deleted but no user found with this id!',
      });
    }

    res.json({ message: 'Thought successfully deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to create a reaction
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to remove a reaction
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;