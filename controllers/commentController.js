const Comment = require('../models/Comment');

const commentController = {
  getCommentsByMovie: async (req, res) => {
    try {
      const { slug } = req.params;

      const comments = await Comment.find({ movieSlug: slug })
        .populate('user', 'username avatarUrl avatar') 
        .sort({ createdAt: -1 }); 

      return res.status(200).json({ 
        success: true, 
        data: comments 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Lỗi server khi tải bình luận' });
    }
  },

  addComment: async (req, res) => {
    try {
      const userId = req.user.id; 
      const { movieSlug, rating, content } = req.body;

      if (!movieSlug || !rating || !content) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ thông tin!' });
      }

      const newComment = new Comment({
        user: userId,
        movieSlug,
        rating,
        content
      });

      await newComment.save();
      const populatedComment = await Comment.findById(newComment._id).populate('user', 'username avatarUrl avatar');

      return res.status(201).json({ 
        success: true, 
        data: populatedComment,
        message: 'Gửi bình luận thành công' 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Lỗi server khi gửi bình luận' });
    }
  }
};

module.exports = commentController;