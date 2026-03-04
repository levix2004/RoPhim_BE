const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    movie: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'MovieMeta', 
        required: true 
    },
    episode: { type: String },   
    episodeIdRef: { type: String }, 
    currentTime: { type: Number, default: 0 }, 
    duration: { type: Number, default: 0 },  
    updatedAt: { type: Date, default: Date.now }
});

watchHistorySchema.index({ user: 1, movie: 1 }, { unique: true });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);