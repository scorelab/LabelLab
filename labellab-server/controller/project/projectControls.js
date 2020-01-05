let User = require('../../models/user')
let Project = require('../../models/project')
let ProjectMembers = require('../../models/projectMembers')
let Image = require('../../models/image')
let Label = require('../../models/label')

exports.projectInfo = function(req, res) {
	User.findOne({
		_id: req.user._id
	})
		.select('username')
		.populate('project')
		.exec(function(err, project) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: 'Unable to connect to database. Please try again.',
					error: err
				})
			}
			if (!project) {
				return res
					.status(400)
					.send({ success: false, msg: 'Project not found' })
			} else {
				return res.json({
					success: true,
					msg: 'Project Data Found',
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
			.select('id projectName projectDescription')
			.populate({
				path: 'image members labels',
				populate: { path: 'label member' }
			})
			.exec(function(err, project) {
				if (err) {
					return res.status(400).send({
						success: false,
						msg: 'Unable to connect to database. Please try again.',
						error: err
					})
				}
				if (!project) {
					return res
						.status(400)
						.send({ success: false, msg: 'Project not found' })
				} else {
					return res.json({
						success: true,
						msg: 'Project Data Found',
						body: project
					})
				}
			})
	} else res.status(400).send({ success: false, msg: 'Invalid Data' })
}

exports.initializeProject = function(req, res) {
	if (req && req.body && req.body.projectName) {
		const { projectDescription, projectName } = req.body
		Project.findOne({
			user: req.user.id,
			projectName: projectName
		}).then(project => {
			if (project) {
				return res.status(400).json({ msg: 'Project name already exists' })
			}
			var data = {
				projectName: projectName,
				user: req.user.id
			}
			if (projectDescription) data['projectDescription'] = projectDescription
			const newProject = new Project(data)
			newProject.save(function(err, project) {
				if (err) {
					return res
						.status(400)
						.send({ success: false, msg: 'Unable to Add Project' })
				} else if (project._id) {
					const newProjectMember = new ProjectMembers({
						projectId: project._id,
						member: req.user.id,
						role: 'Admin'
					})
					newProjectMember.save(function(err, member) {
						if (err) {
							return res
								.status(400)
								.send({ success: false, msg: 'Unable to add Member' })
						} else {
							User.update(
								{ _id: req.user._id },
								{ $addToSet: { project: project._id } }
							).exec(function(err) {
								if (err) {
									return res.status(400).send({
										success: false,
										msg: 'Cannot Append Project',
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
											msg: 'Cannot Append Member',
											error: err
										})
									}
									return res.json({
										success: true,
										msg: 'Project Successfully Posted',
										body: updatedproject
									})
								})
							})
						}
					})
				} else {
					return res.status(400).send({
						success: false,
						msg: 'Project ID Not Found',
						body: project
					})
				}
			})
		})
	} else res.status(400).send({ success: false, msg: 'Invalid Data' })
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
					msg: 'Unable to connect to database. Please try again.',
					error: err
				})
			}
			if (!project) {
				return res
					.status(400)
					.send({ success: false, msg: 'Project not found' })
			}
			res.json({
				success: true,
				msg: 'Project updated successfully!',
				body: project
			})
		})
	} else {
		return res.status(400).send({ success: false, msg: 'Invalid Params' })
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
					msg: 'Unable to connect to database. Please try again.'
				})
			}
			if (!project) {
				return res
					.status(400)
					.send({ success: false, msg: 'Project not found' })
			}

			Image.deleteMany({
				project: req.params.id
			  }).exec(function(err, image) {
				if (err) {
				  return res.status(400).send({
					success: false,
					msg: 'Unable to connect to database. Please try again.',
					error: err
				  })
				}
			  })
		
			  Label.deleteMany({
				project: req.params.id
			  }).exec(function(err, image) {
				if (err) {
				  return res.status(400).send({
					success: false,
					msg: 'Unable to connect to database. Please try again.',
					error: err
				  })
				}
			  })
		
			  ProjectMembers.deleteMany({
				projectId: req.params.id
			  }).exec(function(err, image) {
				if (err) {
				  return res.status(400).send({
					success: false,
					msg: 'Unable to connect to database. Please try again.',
					error: err
				  })
				}
			  })

			res.json({
				success: true,
				msg: 'Project deleted successfully!',
				body: project
			})
		})
	} else {
		return res.status(400).send({ success: false, msg: 'Invalid Params' })
	}
}

exports.addMember = function(req, res) {
	if (req && req.params && req.params.projectId) {
		User.findOne({ email: req.body.memberEmail }, function(err, user) {
			if (err) {
				return res
					.status(400)
					.send({ success: false, msg: 'Something went wrong', error: err })
			}
			if (!user) {
				return res
					.status(400)
					.send({ success: false, msg: 'Unable to find Member' })
			}
			ProjectMembers.findOne(
				{
					member: user._id,
					projectId: req.params.projectId
				},
				function(err, member) {
					if (member) {
						return res
							.status(400)
							.send({ success: false, msg: 'Member already added' })
					}
					const newProjectMember = new ProjectMembers({
						projectId: req.params.projectId,
						member: user._id,
						role: req.body.role
					})
					newProjectMember.save(function(err, member) {
						if (err) {
							return res
								.status(400)
								.send({ success: false, msg: 'Unable to add Member' })
						} else {
							Project.update(
								{ _id: req.params.projectId },
								{ $addToSet: { members: member._id } }
							).exec(function(err) {
								if (err) {
									return res.status(400).send({
										success: false,
										msg: 'Cannot Append Member',
										error: err
									})
								}
								User.update(
									{ _id: user._id },
									{ $addToSet: { project: req.params.projectId } }
								).exec(function(err) {
									if (err) {
										return res.status(400).send({
											success: false,
											msg: 'Cannot Append Project',
											error: err
										})
									}
									res.json({
										success: true,
										msg: 'Project member added successfully!',
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
		return res.status(400).send({ success: false, msg: 'Invalid Params' })
	}
}

exports.removeMember = function(req, res) {
	if (req && req.params && req.params.projectId) {
		User.findOne({ email: req.body.memberEmail }, function(err, user) {
			if (err) {
				return res
					.status(400)
					.send({ success: false, msg: 'Something went wrong', error: err })
			}
			if (!user) {
				return res
					.status(400)
					.send({ success: false, msg: 'Unable to find Member' })
			}
			ProjectMembers.findOne(
				{
					member: user._id,
					projectId: req.params.projectId
				},
				function(err, member) {
					if (err) {
						return res.status(400).send({
							success: false,
							msg: 'Error in findind member',
							error: err
						})
					}
					Project.update(
						{ _id: req.params.projectId },
						{ $pullAll: { members: [member._id] } }
					).exec(function(err) {
						if (err) {
							return res.status(400).send({
								success: false,
								msg: 'Cannot delete Member',
								error: err
							})
						}
						ProjectMembers.findOneAndDelete({ _id: member._id }, function(err) {
							if (err) {
								return res.status(400).send({
									success: false,
									msg: 'Something went wrong',
									error: err
								})
							}
							return res.status(200).send({
								success: true,
								msg: 'Member deleted successfully'
							})
						})
					})
				}
			)
		})
	} else {
		return res.status(400).send({ success: false, msg: 'Invalid Params' })
	}
}

exports.searchProject = function(req, res) {
	if (req && req.params && req.params.query) {
		console.log(req.user._id)
		Project.find(
			{
				user: req.user._id,
				projectName: { $regex: req.params.query, $options: 'i' }
			},
			function(err, project) {
				if (err) return console.log(err)
				res.json({
					success: true,
					body: project,
					user: req.user._id
				})
			}
		)
	} else {
		return res.status(400).send({ success: false, msg: 'Invalid Params' })
	}
}
