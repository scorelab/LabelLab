let User = require("../../models/user")
let Project = require("../../models/project")

exports.userInfo = function(req, res) {
	User.findOne({
		email: req.user.email
	})
		.select("name email thumbnail googleId githubId username")
		.exec(function(err, user) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: "Unable to connect to database. Please try again.",
					error: err
				})
			}
			if (!user) {
				return res.status(400).send({ success: false, msg: "User not found" })
			} else {
				return res.json({ success: true, msg: "User Data Found", body: user })
			}
		})
}

exports.projectInfo = function(req, res) {
	Project.find({
		user: req.user._id
	})
		.select("project_name")
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

exports.initializeProject = function(req, res) {
	if (req && req.body && req.body.project_name) {
		Project.findOne({ project_name: req.body.project_name }).then(project => {
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
						.send({ success: false, msg: "Unable to Add Idea" })
				} else if (project._id) {
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
						return res.json({
							success: true,
							msg: "Project Successfully Posted",
							body: project
						})
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
