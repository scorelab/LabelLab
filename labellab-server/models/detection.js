const mongoose = require('mongoose')

const DetectionSchema = new mongoose.Schema({
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
        label_name: ObjectId,
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

module.exports = mongoose.model('Detection', DetectionSchema)