const express = require('express');
const router = express.Router();
const { 
  getGames, 
  getGameById, 
  getGameBySlug,
  createGame,
  updateGame,
  deleteGame
} = require('../controllers/gameController');
const { uploadGame } = require('../middleware/uploadMiddleware');
const { authMiddleware, roleMiddleware } = require('../middleware');

// Public routes
router.get('/', getGames);
router.get('/id/:id', getGameById);
router.get('/:slug', getGameBySlug);

// Admin routes
router.post('/', authMiddleware, roleMiddleware('admin'), uploadGame, createGame);
router.put('/:id', authMiddleware, roleMiddleware('admin'), uploadGame, updateGame);
router.patch('/:id', authMiddleware, roleMiddleware('admin'), uploadGame, updateGame);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteGame);

module.exports = router;