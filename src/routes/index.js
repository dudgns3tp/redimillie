const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

const apiControllers = require('../controller/apiControllers');

dotenv.config();

router.get('/', function (req, res) {
  res.render('index', {
    title: 'Express',
  });
});

router.get('/apis', apiControllers.naverAPI);
router.get('/apis/crawling', apiControllers.crawling);

module.exports = router;
