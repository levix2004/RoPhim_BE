// src/seed.js
const mongoose = require('mongoose');
const { User, MovieMeta, WatchHistory, WatchList } = require('./models'); // Import từ file index.js

// Thay bằng chuỗi kết nối của bạn
const MONGO_URI = 'mongodb://localhost:27017/rophim'; 

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('🔌 Đã kết nối MongoDB');

        // 1. Xóa sạch dữ liệu cũ (để tránh trùng lặp khi chạy lại)
        await User.deleteMany({});
        await MovieMeta.deleteMany({});
        await WatchHistory.deleteMany({});
        await WatchList.deleteMany({});
        console.log('🧹 Đã dọn dẹp dữ liệu cũ');

        // 2. Tạo User mẫu
        const user1 = await User.create({
            username: 'nguyenvana',
            email: 'vana@gmail.com',
            password: 'hash_password_123', // Thực tế phải mã hóa
            role: 'user'
        });
        console.log('👤 Đã tạo User:', user1.username);

        // 3. Tạo Phim mẫu (MovieMeta)
        // Đây là phim giả lập lấy từ API về
        const movie1 = await MovieMeta.create({
            refId: 'phim-dao-hai-tac', // ID bên API thứ 3
            title: 'Đảo Hải Tặc (One Piece)',
            posterUrl: 'https://example.com/luffy.jpg',
            slug: 'dao-hai-tac',
            totalEpisodes: 1000
        });
        console.log('🎬 Đã tạo Phim:', movie1.title);

        // 4. Tạo Lịch sử xem (User A đang xem Phim 1)
        await WatchHistory.create({
            user: user1._id,
            movie: movie1._id, // Lấy _id của phim vừa tạo ở trên
            episode: 'Tập 500',
            currentTime: 1540, // Đang xem ở giây 1540
            duration: 2400
        });
        console.log('clock: Đã tạo Lịch sử xem');

        // 5. Thêm vào Tủ phim
        await WatchList.create({
            user: user1._id,
            movie: movie1._id
        });
        console.log('❤️ Đã thêm vào Tủ phim');

        console.log('✅ SEED DATA THÀNH CÔNG!');
        process.exit();
    } catch (error) {
        console.error('❌ Lỗi:', error);
        process.exit(1);
    }
};

seedDatabase();