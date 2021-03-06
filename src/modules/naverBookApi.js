/* eslint-disable no-undef */
const request = require('request');
const dotenv = require('dotenv');

dotenv.config();

exports.callBookApi = (query, start) =>
  new Promise((resolved, rejected) => {
    const api_url =
      'https://openapi.naver.com/v1/search/book.json?query=' +
      encodeURI(query) +
      '&start=' +
      start;
    const options = {
      url: api_url,
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
      },
    };
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolved(JSON.parse(body).items);
      } else {
        rejected(response.statusCode);
      }
    });
  });
