const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path'); // also add this

const app = express();
app.use(cors({
  origin: 'http://localhost:8080', // Allow frontend origin
  credentials: true                // Allow cookies, tokens, etc. if needed
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ✅ Upload route
const uploadRoute = require('./routes/upload');
app.use('/api/upload', uploadRoute);

// ✅ Serve static folders (optional but useful for accessing uploaded/segmented images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/segment_output', express.static(path.join(__dirname, 'segment_output')));
app.use('/uploads/pdfs', express.static('uploads/pdfs')); // To serve uploaded files
app.use('/api/history', require('./routes/history')); // use your route
const dashboardRoutes = require('./routes/dashboardStats');
app.use('/api/dashboard', dashboardRoutes);

// Default test route
app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
