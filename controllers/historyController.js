const { WatchHistory, MovieMeta } = require('../models');
const {syncMovieMeta} = require('../services/movieService');
const historyController = {
  syncHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const { movieData, episode, currentTime, duration } = req.body;
      const movieMeta = await syncMovieMeta(movieData);
      let progressToSave = currentTime;
      let isFinished = false;
      
      if (duration > 0 && (currentTime / duration) > 0.95) {
          progressToSave = 0;
          isFinished = true;
      }

      const history = await WatchHistory.findOneAndUpdate(
        { user: userId, movie: movieMeta._id },
        { 
          episode,
          currentTime: progressToSave,
          duration,
          updatedAt: new Date() 
        },
        { new: true, upsert: true }
      );

      return res.status(200).json({ success: true, data: history, isFinished });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  getHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      const historyList = await WatchHistory.find({ user: userId })
        .populate('movie')
        .sort({ updatedAt: -1 })
        .skip(skip)   
        .limit(limit);

      const total = await WatchHistory.countDocuments({ user: userId });

      return res.status(200).json({ 
        success: true, 
        data: historyList,
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
getDetailHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const { slug } = req.query; 

      if (!slug) {
        return res.status(400).json({ message: "Thiếu slug phim" });
      }

      const movieMeta = await MovieMeta.findOne({ slug: slug });
      
      if (!movieMeta) {
        return res.status(200).json({ 
            success: true, 
            currentTime: 0, 
            episode: null 
        });
      }

      const history = await WatchHistory.findOne({ 
          user: userId, 
          movie: movieMeta._id 
      });

      if (!history) {
         return res.status(200).json({ 
             success: true, 
             currentTime: 0, 
             episode: null 
         });
      }

      return res.status(200).json({ 
          success: true, 
          currentTime: history.currentTime, 
          episode: history.episode 
      });

    } catch (error) {
      console.error("Lỗi lấy chi tiết lịch sử:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },
  deleteHistoryItem: async (req, res) => {
    try {
      const userId = req.user.id;
      const { historyId } = req.params;

      await WatchHistory.findOneAndDelete({ _id: historyId, user: userId });
      return res.status(200).json({ success: true, message: "Đã xóa" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports = historyController;