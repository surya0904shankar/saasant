const express = require('express');
const router = express.Router();
const Layout = require('../models/Layout');
const { verifyToken } = require('../middleware/auth');

// Save layout - Upsert for authenticated user
router.post('/save-layout', verifyToken, async (req, res) => {
    try {
        let { widgets, canvasSettings } = req.body;
        const { userId } = req.user;
        const mongoose = require('mongoose');
        console.log(`Saving layout for User: ${userId}, DB State: ${mongoose.connection.readyState} (1=connected)`);

        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database not connected');
        }

        // Support both old array style and new object style
        if (Array.isArray(req.body)) {
            widgets = req.body;
        }

        if (!Array.isArray(widgets)) {
            return res.status(400).json({ error: 'Widgets must be an array' });
        }

        const layout = await Layout.findOneAndUpdate(
            { userId },
            { userId, widgets, canvasSettings },
            { upsert: true, new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Layout saved successfully',
            layout,
        });
    } catch (error) {
        console.error('Save layout error:', error);
        // Check for payload too large or specific database errors
        if (error.type === 'entity.too.large') {
            return res.status(413).json({ error: 'Payload too large. Try reducing image sizes.' });
        }
        res.status(500).json({ error: error.message || 'Failed to save layout', details: error.toString() });
    }
});

// Get layout for authenticated user
router.get('/get-layout', verifyToken, async (req, res) => {
    try {
        const { userId } = req.user;

        const layout = await Layout.findOne({ userId });

        if (!layout) {
            return res.json({
                success: true,
                layout: { widgets: [] },
            });
        }

        res.json({
            success: true,
            layout,
        });
    } catch (error) {
        console.error('Get layout error:', error);
        res.status(500).json({ error: 'Failed to get layout' });
    }
});

module.exports = router;
