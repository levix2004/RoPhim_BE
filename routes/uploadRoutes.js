const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/avatars'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
}); 

router.post('/', authMiddleware, upload.single('avatar'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Vui lòng chọn một file ảnh' });
        }
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;

        return res.status(200).json({
            success: true,
            message: 'Upload thành công',
            url: fileUrl 
        });
    } catch (error) {
        console.error('Lỗi upload ảnh:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi upload ảnh' });
    }
});

module.exports = router;