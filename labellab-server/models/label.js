const mongoose = require("mongoose")

var LabelSchema = new mongoose.Schema({
	// image:{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "Image"
	// },
	// label_name:{
	// 	type:String,
	// 	required:true
	// },
	// startX:{
	// 	type:String,
	// 	reruired:true
	// },
	// endX:{
	// 	type:String,
	// 	reruired:true
	// },
	// startY:{
	// 	type:String,
	// 	reruired:true
	// },
	// endY:{
	// 	type:String,
	// 	reruired:true
	// }
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project"
	},
	id: {
		type: String,
		unique: true
	},
	name: {
		type: String
	},
	type: {
		type: String
	}
})

module.exports = mongoose.model("Label", LabelSchema)
