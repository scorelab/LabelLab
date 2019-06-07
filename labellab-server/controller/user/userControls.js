let User = require("../../models/user")

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
