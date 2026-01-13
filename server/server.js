require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const layoutRoutes = require('./routes/layout');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5176,http://localhost:5174').split(',');
console.log('Allowed Origins:', allowedOrigins);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/layout', layoutRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
