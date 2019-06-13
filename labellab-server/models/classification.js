const mongoose = require("mongoose")

const ClassificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  image_url: {
    type: String,
    required: true
  },
  label: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Label"
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Classification", ClassificationSchema)
