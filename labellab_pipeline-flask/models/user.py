from app import db


class User(db.Document):
    name = db.StringField()
    username = db.StringField()
    email = db.StringField()
    password = db.StringField()
    accessToken = db.StringField(required=False)
    googleId = db.StringField(required=False)
    githubId = db.StringField(required=False)
    createdAt = db.DateTimeField(required=False)
    thumbnaild = db.StringField(required=False)
    profileImage: db.StringField(required=False)
    resetPasswordToken: db.StringField(required=False)
    resetPasswordExpires: db.DateTimeField(required=False)
#     TODO: Need to create a separate model for project and then refer it
# 	project: [
# 		{
# 			type: mongoose.Schema.Types.ObjectId,
# 			ref: 'Project'
# 		}
# 	]
# }

# TODO: Presave query and hashing function of bcrypt for password need to be added in a query class
# As no functionality if provided to set values by default,
# presave can be used or a separate function for setting defaults can be made
