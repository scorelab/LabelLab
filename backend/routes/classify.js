var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Classiy images' });
});

router.post('/image', function (req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  var image = req.files.image;

  res.send({ size: image.data.length });
});

module.exports = router;
