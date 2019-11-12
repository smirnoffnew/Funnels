var express = require('express');
var router = express.Router();

var avatarUpload = require('../config/avatarUpload.js.js');
var backgroundUpload = require('../config/backgroundUpload.js.js');
var screenshotUpload = require('../config/screenshotUpload.js.js');

var uploadAvatar = require('../controller/avatar.js.js');
var uploadBackground = require('../controller/background.js.js');
var uploadScreenshot = require('../controller/screenshot.js.js');

router.post("/avatars", avatarUpload.single('img'), uploadAvatar);

router.post("/backgrounds", backgroundUpload.single('img'), uploadBackground);

router.post("/screenshots", screenshotUpload.single('img'), uploadScreenshot);

module.exports = router;