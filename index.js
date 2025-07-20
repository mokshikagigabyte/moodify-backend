const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: ["http://localhost:3000", "https://your-frontend-domain"], // Replace with your frontend domain
  methods: ["GET", "POST"],
  credentials: true // If using cookies/auth tokens
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const helpRoute = require('./routes/help');
const authRoute = require('./routes/auth'); // Add auth routes
app.use('/api', helpRoute);
app.use('/api', authRoute); // Mount auth routes

// Default Route
app.get('/', (req, res) => {
  res.send('🎵 Moodify backend is live!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
