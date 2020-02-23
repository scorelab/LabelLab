const path = require('path')

let User = require('../../models/user')

exports.userInfo = function(req, res) {
  User.findOne({
    email: req.user.email
  })
    .select('name email thumbnail googleId githubId username profileImage')
    .exec(function(err, user) {
      if (err) {
        return res.status(400).send({
          success: false,
          msg: 'Unable to connect to database. Please try again.',
          error: err
        })
      }
      if (!user) {
        return res.status(400).send({ success: false, msg: 'User not found' })
      } else {
        return res.json({ success: true, msg: 'User Data Found', body: user })
      }
    })
}

exports.editInfo = function(req, res) {
  User.findOneAndUpdate(
    {
      email: req.user.email
    },
    req.body,
    { new: true }
  ).exec(function(err, user) {
    if (err) {
      return res.status(400).send({
        success: false,
        msg: 'Unable to connect to database. Please try again.',
        error: err
      })
    }
    if (!user) {
      return res.status(400).send({ success: false, msg: 'User not updated' })
    } else {
      return res.json({ success: true, msg: 'User updated!', body: user })
    }
  })
}

exports.searchUser = function(req, res) {
  if (req && req.params && req.params.query) {
    User.find(
      {
        email: { $regex: req.params.query, $ne: req.user.email }
      },
      function(err, user) {
        if (err) return console.log(err)
        res.json({
          success: true,
          body: user
        })
      }
    )
  } else {
    return res.status(400).send({ success: false, msg: 'Invalid Params' })
  }
}

exports.countInfo = function(req, res) {
  User.findOne({
    _id: req.user._id
  })
    .select('email')
    .populate('project')
    .exec(function(err, user) {
      if (err) {
        return res.status(400).send({
          success: false,
          msg: 'Unable to connect to database. Please try again.',
          error: err
        })
      }
      if (!user) {
        return res.status(400).send({ success: false, msg: 'User not found' })
      } else {
        let data = {
          totalProjects: user.project.length,
          totalImages: 0,
          totalLabels: 0
        }
        user.project.map((project, index) => {
          data.totalImages += project.image.length
          data.totalLabels += project.labels.length
        })

        return res.json({ success: true, body: data })
      }
    })
}

exports.userUploadImage = function(req, res) {
  let isUploadingImage = false
  let profileURL = ''
  const { id, email } = req.user
  let data, binaryData, updateData, url

  if (req && req.body && req.body.image == null) {
    isUploadingImage = false
    data = {
      email: email
    }
    profileURL = ''
  } else if (req && req.body && req.body.image && req.body.format) {
    isUploadingImage = true
    const { image, format } = req.body
    data = {
      id: id,
      email: email,
      img: image,
      format: format
    }
    let baseImg = data.img.split(',')[1]
    binaryData = new Buffer(baseImg, 'base64')
    let ext = data.format.split('/')[1]
    updateData = { profileImage: `${data.id}.${ext}` }
    url = `/public/img/${updateData.profileImage}`
    profileURL = 'http://localhost:4000/static/img/' + updateData.profileImage
  }

  User.findOneAndUpdate(
    {
      email: data.email
    },
    {
      profileImage: profileURL
    }
  ).exec(function(err, user) {
    if (err)
      return res.status(400).send({
        success: false,
        msg: 'Unable To Change Image. Please Try Again.'
      })

    if (!isUploadingImage) {
      let profileImage = user.profileImage.replace(
        'http://localhost:4000/static/img/',
        ''
      )
      if (
        profileImage != '' &&
        require('fs').existsSync(
          path.join(__dirname, '../../', `public/img/${profileImage}`)
        )
      ) {
        require('fs').unlinkSync(
          path.join(__dirname, '../../', `public/img/${profileImage}`)
        )
        res.json({
          success: true,
          body: url,
          msg: 'Image Removed Successfully.'
        })
      } else {
        return res.status(400).send({ success: false, msg: 'No saved image' })
      }
    } else {
      require('fs').writeFile(
        `./public/img/${updateData.profileImage}`,
        binaryData,
        function(err) {
          if (err) {
            return res
              .status(400)
              .send({ success: false, msg: 'Something went wrong' })
          } else {
            res.json({
              success: true,
              body: url,
              msg: 'Image Uploaded Successfully.'
            })
          }
        }
      )
    }
  })
}
