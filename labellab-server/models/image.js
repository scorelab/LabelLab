const mongoose = require("mongoose")

const ImageSchema = new mongoose.Schema({
	project:{
		type: mongoose.Schema.Types.ObjectId, 
		ref: "Project"
	},
	image_name:{
		type:String,
		required:true
	},
	image_url:{
		type:String,
		required:true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	label:[{
		type: mongoose.Schema.Types.ObjectId, 
		ref: "Label"
	}]
})

module.exports = mongoose.model("Image", ImageSchema)