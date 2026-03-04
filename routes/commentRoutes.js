const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/:slug', commentController.getCommentsByMovie);
router.post('/', authMiddleware, commentController.addComment);

module.exports = router;