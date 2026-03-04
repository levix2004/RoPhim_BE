const cors = require('cors')
const express = require('express');
const morgan = require("morgan");
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); 
const commentRoutes = require('./routes/commentRoutes'); 
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('combined'));
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
}));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/comment', commentRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/upload', uploadRoutes);
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('API ROPHIM hoạt động!');
});

app.listen(port, () => {
  console.log(`Server chạy ở port ${port}`);
});
