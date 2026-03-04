const User = require('../models/User'); 
const bcrypt = require('bcryptjs'); 

const userController = {
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id; 
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
      }

      return res.status(200).json({
        success: true,
        message: 'Lấy thông tin thành công',
        data: {
          id: user._id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Lỗi get profile:", error);
      return res.status(500).json({ success: false, message: 'Lỗi server khi lấy thông tin' });
    }
  },


  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id; 
      const { username, password, avatarUrl } = req.body;
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      if (username && username.trim() !== '' && username !== user.username) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
           return res.status(400).json({ message: 'Tên hiển thị này đã có người sử dụng. Vui lòng chọn tên khác.' });
        }
        user.username = username; 
      }

      if (avatarUrl) {
        user.avatar = avatarUrl;
      }

      if (password && password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      await user.save();

      const updatedUser = {
        id: user._id,
        email: user.email,
        username: user.username, 
        avatar: user.avatar,
        role: user.role
      };

      return res.status(200).json({ 
          success: true, 
          message: 'Cập nhật thông tin thành công',
          data: updatedUser
      });

    } catch (error) {
      console.error("Lỗi update profile:", error);
      return res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin' });
    }
  }
};

module.exports = userController;