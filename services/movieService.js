const { MovieMeta } = require('../models');

const syncMovieMeta = async (movieData) => {
  if (!movieData || !movieData.refId) {
    throw new Error("Dữ liệu phim không hợp lệ (Thiếu refId)");
  }

  return await MovieMeta.findOneAndUpdate(
    { refId: movieData.refId },
    {
      title: movieData.name || movieData.title,
      posterUrl: movieData.poster_url || movieData.posterUrl,
      slug: movieData.slug,
      totalEpisodes: movieData.totalEpisodes,
    },
    { new: true, upsert: true }
  );
};

module.exports = { syncMovieMeta };