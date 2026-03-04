const jwt = require('jsonwebtoken');
const { User } = require('../models'); 

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: "Không tìm thấy Token hoặc Token không hợp lệ!" 
            });
        }

        const token = authHeader.split(' ')[1];
        if (!process.env.JWT_SECRET) {
            throw new Error("Chưa cấu hình JWT_SECRET trong file .env");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id || decoded.userId); 
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Token hợp lệ nhưng User không còn tồn tại!" 
            });
        }
        req.user = user; 
        next(); 

    } catch (error) {
        console.error("Auth Error:", error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "Token đã hết hạn, vui lòng đăng nhập lại!" 
            });
        }

        return res.status(403).json({ 
            success: false, 
            message: "Token không hợp lệ!" 
        });
    }
};

module.exports = authMiddleware;