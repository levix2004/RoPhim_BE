const mongoose = require('mongoose');

const movieMetaSchema = new mongoose.Schema({
    refId: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true   
    },
    title: { type: String, required: true },
    posterUrl: String,
    slug: String,     
    totalEpisodes: Number,
}, { timestamps: true });

module.exports = mongoose.model('MovieMeta', movieMetaSchema);