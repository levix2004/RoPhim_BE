const { WatchList, MovieMeta } = require('../models');
const { syncMovieMeta } = require('../services/movieService');
const watchListController = {
  addToWatchList: async (req, res) => {
    try {
      const userId = req.user.id;
      const { movieData } = req.body;

      const movieMeta = await syncMovieMeta(movieData);

      await WatchList.create({ user: userId, movie: movieMeta._id });
      return res.status(200).json({ success: true, message: "Đã thêm" });

    } catch (error) {
      if (error.code === 11000) { 
         return res.status(400).json({ message: "Đã có trong danh sách" });
      }
      return res.status(500).json({ message: error.message });
    }
  },

  removeFromWatchList: async (req, res) => {
    try {
      const userId = req.user.id;
      const { movieRefId } = req.params; 

      const movieMeta = await MovieMeta.findOne({ refId: movieRefId });
      
      if (movieMeta) {
        await WatchList.findOneAndDelete({ user: userId, movie: movieMeta._id });
      }

      return res.status(200).json({ success: true, message: "Đã xóa khỏi yêu thích" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getWatchList: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      const list = await WatchList.find({ user: userId })
        .populate('movie') 
        .sort({ createdAt: -1 }) 
        .skip(skip)   
        .limit(limit);
      const total = await WatchList.countDocuments({ user: userId });

      return res.status(200).json({ 
        success: true, 
        data: list,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) 
        }
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  checkStatus: async (req, res) => {
    try {
      const userId = req.user.id;
      const { refId } = req.query;

      const movieMeta = await MovieMeta.findOne({ refId });
      if (!movieMeta) return res.json({ isLiked: false });

      const exists = await WatchList.exists({ user: userId, movie: movieMeta._id });
      return res.json({ isLiked: !!exists });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports = watchListController;