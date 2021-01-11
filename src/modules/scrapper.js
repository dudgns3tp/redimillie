const request = require('request');
const cheerio = require('cheerio');

/**
 * baseURL: https://select.ridibooks.com/search?q=%EC%8B%9C%EA%B0%84&type=Books
 * parameter: title(String)
 * input: JsonArray
 * output: -{title: String, isExisted: boolean}
 */
exports.rediSelect = books => new Promise((resolved, rejected) => {
  const title = books[0].title;
  const url = 'https://select.ridibooks.com/search?q=' + encodeURI(title) +'&type=Books';
  request.get(url, (err, res, body) => {
    const $ = cheerio.load(body)
    console.log(body)
    const $bookList = $('.SearchResultBookList')
    $bookList.each(item => {
      let titleElement = $(this).find('.SearchResultBookList_Title').text();
      console.log(item)
      console.log(titleElement)
    })
    resolved(true)
  })
})

exports.milli = books => new Promise((resolved, rejected) => {
  const title = books[0].title;
  const url = 'https://www.millie.co.kr/v3/search/result/'+ encodeURI(title) +'?type=all&order=keyword&category=0';
  //const url = 'http://bookclub.yes24.com/BookClub/Search?keyword='+encodeURI(title) +'&OrderBy=01&pageNo=2';
  console.log(url)
  request.get(url, (err, res, body) => {
    const $ = cheerio.load(body)
    console.log(body)
    const $bookList = $('.SearchResultBookList')
    $bookList.each(item => {
      let titleElement = $(this).find('.SearchResultBookList_Title').text();
      console.log(item)
      console.log(titleElement)
    })
  })
  resolved(true)
})

exports.yes24 = books => new Promise((resolved, rejected) => {
  const title = books[0].title;
  const url = 'https://bookclub.yes24.com/BookClub/Search?keyword='+encodeURI(title) +'&OrderBy=01&pageNo=2';
  console.log(url);
  request.get(url, (err, res, body) => {
    const $ = cheerio.load(body)
    console.log(body)
  })
  resolved(true)
})

exports.kyoBoBook = books => new Promise((resolved, rejected) => {
  const title = books[0].title;
  const url = 'https://search.kyobobook.co.kr/web/search?vPstrKeyWord='+ encodeURI(title) +'&orderClick=LEK&searchCategory=SAM%40DIGITAL&collName=DIGITAL&searchPcondition=1'
  request.get(url, (err, res, body) => {
    const $ = cheerio.load(body)
    const $bookList = $('#search_list')
    $bookList.each(item => {
      let titleElement = $(this).find('.SearchResultBookList_Title').text();
      console.log(item)
      console.log(titleElement)
    })
  })
  resolved(true)
})
