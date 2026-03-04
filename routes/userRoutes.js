const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const watchListController = require('../controllers/watchListController');
const authMiddleware = require('../middleware/authMiddleware'); 
const userController = require('../controllers/userController'); 



router.post('/history', authMiddleware, historyController.syncHistory);
router.get('/history', authMiddleware, historyController.getHistory);
router.get('/history/detail', authMiddleware, historyController.getDetailHistory);
router.post('/watchlist', authMiddleware, watchListController.addToWatchList);
router.delete('/watchlist/:movieRefId', authMiddleware, watchListController.removeFromWatchList);
router.get('/watchlist', authMiddleware, watchListController.getWatchList);
router.get('/watchlist/status', authMiddleware, watchListController.checkStatus);
router.put('/profile', authMiddleware, userController.updateProfile);
router.get('/profile', authMiddleware, userController.getProfile);
module.exports = router;