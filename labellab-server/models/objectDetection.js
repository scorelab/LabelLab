const mongoose = require('mongoose')

const ObjectDetectionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    imageUrl: {
        type: String,
        required: true
    },
    detections: [{
        confidence: Number,
        label_name: String,
        x1: Number,
        y1: Number,
        x2: Number,
        y2: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('ObjectDetection', ObjectDetectionSchema)