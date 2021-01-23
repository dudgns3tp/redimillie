const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

const scrapper = require('../modules/scrapper');
const apiControllers = require('../controller/apiControllers');

dotenv.config()

router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

router.get('/apis', apiControllers.naverAPI);

module.exports = router;
