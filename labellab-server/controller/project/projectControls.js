let User = require("../../models/user")
let Project = require("../../models/project")
let ProjectMembers = require("../../models/projectMembers")

exports.projectInfo = function(req, res) {
	Project.find({
		user: req.user._id
	})
		.select("project_name project_image project_description")
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
			.select("id project_name")
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
			const newProject = new Project({
				project_name: req.body.project_name,
				user: req.user.id
			})
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
			req.body.data,
			{ new: true }
		).exec(function(err, project) {
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
				msg: "Project updated successfully!",
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
