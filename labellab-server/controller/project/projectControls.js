let User = require("../../models/user")
let Project = require("../../models/project")
let ProjectMembers = require("../../models/projectMembers")

exports.projectInfo = function(req, res) {
	Project.find({
		user: req.user._id
	})
		.select("project_name project_description project_image")
		.populate("image members")
		.exec(function(err, project) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: "Unable to connect to database. Please try again.",
					error: err
				})
			}
			if (!project) {
				return res
					.status(400)
					.send({ success: false, msg: "project not found" })
			} else {
				return res.json({
					success: true,
					msg: "project Data Found",
					body: project
				})
			}
		})
}

exports.projectInfoId = function(req, res) {
	if (req && req.params && req.params.id) {
		Project.findOne({
			_id: req.params.id
		})
			.select("id project_name project_description project_image")
			.populate({ path: "image members", populate: { path: "label member" } })
			.exec(function(err, project) {
				if (err) {
					return res.status(400).send({
						success: false,
						msg: "Unable to connect to database. Please try again.",
						error: err
					})
				}
				if (!project) {
					return res
						.status(400)
						.send({ success: false, msg: "Project not found" })
				} else {
					return res.json({
						success: true,
						msg: "Project Data Found",
						body: project
					})
				}
			})
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}

exports.initializeProject = function(req, res) {
	if (req && req.body && req.body.project_name) {
		Project.findOne({
			user: req.user.id,
			project_name: req.body.project_name
		}).then(project => {
			if (project) {
				return res.status(400).json({ msg: "Project name already exists" })
			}
      var data = {
				project_name: req.body.project_name,
				user: req.user.id
			};
      if (req.body.project_description)
        data['project_description'] = req.body.project_description;
			const newProject = new Project(data)
			newProject.save(function(err, project) {
				if (err) {
					return res
						.status(400)
						.send({ success: false, msg: "Unable to Add Project" })
				} else if (project._id) {
					const newProjectMember = new ProjectMembers({
						project_id: project._id,
						member: req.user.id,
						role: "Admin"
					})
					newProjectMember.save(function(err, member) {
						if (err) {
							return res
								.status(400)
								.send({ success: false, msg: "Unable to add Member" })
						} else {
							User.update(
								{ _id: req.user._id },
								{ $addToSet: { project: project._id } }
							).exec(function(err) {
								if (err) {
									return res.status(400).send({
										success: false,
										msg: "Cannot Append Project",
										error: err
									})
								}
								Project.findOneAndUpdate(
									{ _id: project._id },
									{ $addToSet: { members: member._id } },
									{ new: true }
								).exec(function(err, updatedproject) {
									if (err) {
										return res.status(400).send({
											success: false,
											msg: "Cannot Append Member",
											error: err
										})
									}
									return res.json({
										success: true,
										msg: "Project Successfully Posted",
										body: updatedproject
									})
								})
							})
						}
					})
				} else {
					return res.status(400).send({
						success: false,
						msg: "Project ID Not Found",
						body: project
					})
				}
			})
		})
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}

exports.updateProject = function(req, res) {
	if (req && req.params && req.params.id) {
		Project.findOneAndUpdate(
			{
				_id: req.params.id
			},
			req.body,
			{ new: true }
		).exec(function(err, project) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: "Unable to connect to database. Please try again.",
					error: err
				})
			}
			if (!project) {
				return res
					.status(400)
					.send({ success: false, msg: "Project not found" })
			}
			res.json({
				success: true,
				msg: "Project updated successfully!",
				body: project
			})
		})
	} else {
		return res.status(400).send({ success: false, msg: "Invalid Params" })
	}
}

exports.deleteProject = function(req, res) {
	if (req && req.params && req.params.id) {
		Project.findOneAndDelete({
			_id: req.params.id
		}).exec(function(err, project) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: "Unable to connect to database. Please try again."
				})
			}
			if (!project) {
				return res
					.status(400)
					.send({ success: false, msg: "Project not found" })
			}
			res.json({
				success: true,
				msg: "Project deleted successfully!",
				body: project
			})
		})
	} else {
		return res.status(400).send({ success: false, msg: "Invalid Params" })
	}
}

exports.addMember = function(req, res) {
	if (req && req.params && req.params.project_id) {
		User.findOne({ email: req.body.member_email }, function(err, user) {
			if (err) {
				return res
					.status(400)
					.send({ success: false, msg: "Something went wrong", error: err })
			}
			if (!user) {
				return res
					.status(400)
					.send({ success: false, msg: "Unable to find Member" })
			}
			ProjectMembers.findOne(
				{
					member: user._id,
					project_id: req.params.project_id
				},
				function(err, member) {
					if (member) {
						return res
							.status(400)
							.send({ success: false, msg: "Member already added" })
					}
					const newProjectMember = new ProjectMembers({
						project_id: req.params.project_id,
						member: user._id,
						role: req.body.role
					})
					newProjectMember.save(function(err, member) {
						if (err) {
							return res
								.status(400)
								.send({ success: false, msg: "Unable to add Member" })
						} else {
							Project.update(
								{ _id: req.params.project_id },
								{ $addToSet: { members: member._id } }
							).exec(function(err) {
								if (err) {
									return res.status(400).send({
										success: false,
										msg: "Cannot Append Member",
										error: err
									})
								}
								User.update(
									{ _id: member._id },
									{ $addToSet: { project: req.params.project_id } }
								).exec(function(err) {
									if (err) {
										return res.status(400).send({
											success: false,
											msg: "Cannot Append Project",
											error: err
										})
									}
									res.json({
										success: true,
										msg: "Project member added successfully!",
										body: member
									})
								})
							})
						}
					})
				}
			)
		})
	} else {
		return res.status(400).send({ success: false, msg: "Invalid Params" })
	}
}

exports.removeMember = function(req, res) {
	if (req && req.params && req.params.project_id) {
		User.findOne({ email: req.body.member_email }, function(err, user) {
			if (err) {
				return res
					.status(400)
					.send({ success: false, msg: "Something went wrong", error: err })
			}
			if (!user) {
				return res
					.status(400)
					.send({ success: false, msg: "Unable to find Member" })
			}
			ProjectMembers.findOne(
				{
					member: user._id,
					project_id: req.params.project_id
				},
				function(err, member) {
					if (err) {
						return res.status(400).send({
							success: false,
							msg: "Error in findind member",
							error: err
						})
					}
					Project.update(
						{ _id: req.params.project_id },
						{ $pullAll: { members: [member._id] } }
					).exec(function(err) {
						if (err) {
							return res.status(400).send({
								success: false,
								msg: "Cannot delete Member",
								error: err
							})
						}
						ProjectMembers.findOneAndDelete({ _id: member._id }, function(err) {
							if (err) {
								return res.status(400).send({
									success: false,
									msg: "Something went wrong",
									error: err
								})
							}
							return res.status(200).send({
								success: true,
								msg: "Member deleted successfully"
							})
						})
					})
				}
			)
		})
	} else {
		return res.status(400).send({ success: false, msg: "Invalid Params" })
	}
}
exports.projectUploadImage = function(req, res) {
	if (
		req &&
		req.body &&
		req.body.image &&
		req.body.format &&
		req.params.project_id
	) {
		let data = {
			id: req.user.id,
			img: req.body.image,
			format: req.body.format
		}
		let baseImg = data.img.split(",")[1]
		let binaryData = new Buffer(baseImg, "base64")
		let ext = data.format.split("/")[1]
		let updateData = { project_image: `${req.params.project_id}.${ext}` }
		const url = `/public/project/${updateData.project_image}`
		require("fs").writeFile(
			`./public/project/${updateData.project_image}`,
			binaryData,
			function(err) {
				if (err) {
					return res
						.status(400)
						.send({ success: false, msg: "something went wrong" })
				} else {
					Project.findOneAndUpdate(
						{
							_id: req.params.project_id
						},
						updateData
					).exec(function(err) {
						if (err)
							return res.status(400).send({
								success: false,
								msg: "Unable To Upload Image. Please Try Again."
							})
						res.json({
							success: true,
							body: url,
							msg: "Image Uploaded Successfully."
						})
					})
				}
			}
		)
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}

exports.searchProject = function(req, res) {
	if (req && req.params && req.params.query) {
		Project.find(
			{ user: req.user._id, project_name: { $regex: req.params.query, $options: "i" } },
			function(err, project) {
				if (err) return console.log(err)
				res.json({
					success: true,
					body: project,
				})
			}
		)
	} else {
		return res.status(400).send({ success: false, msg: "Invalid Params" })
	}
}
