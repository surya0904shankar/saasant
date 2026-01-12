const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
    },
    size: {
        type: mongoose.Schema.Types.Mixed, // { width, height }
        default: { width: 'auto', height: 'auto' }
    },
    parentId: {
        type: String,
        default: null
    },
    section: {
        type: String,
        enum: ['header', 'body', 'footer'],
        default: 'body'
    },
    props: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
}, { _id: false, strict: false }); // strict: false allows other properties if added in future

const layoutSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    widgets: {
        type: [widgetSchema],
        default: [],
    },
    canvasSettings: {
        background: { type: String, default: '#ffffff' },
        headerHeight: { type: String, default: '100px' },
        footerHeight: { type: String, default: '150px' },
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Layout', layoutSchema);
