const mongoose = require('mongoose');

const watchListSchema = new mongoose.Schema({
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
    addedAt: { 
        type: Date, 
        default: Date.now 
    }
});

watchListSchema.index({ user: 1, movie: 1 }, { unique: true });

module.exports = mongoose.model('WatchList', watchListSchema);