const request = require('request');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
/**
 * baseURL: https://select.ridibooks.com/search?q=%EC%8B%9C%EA%B0%84&type=Books
 * parameter: title(String)
 * input: Json
 * output: -{title: String, isExisted: boolean}
 */

const pupRequest = async (url, selector, childSelectorArr, platform,) => {
  const browse = await puppeteer.launch();
  const page = await browse.newPage();
  await page.goto(url);

  const content = await page.content()
  const $ = cheerio.load(content);
  const lists = []
  $(selector).each((_, list) => {
    const titleName = $(list).find(childSelectorArr[0]).text();
    const authorName = $(list).find(childSelectorArr[1]).text()
    const publisherName = $(list).find(childSelectorArr[2]).text()
    lists.push({titleName, authorName, publisherName, platform, url})
  })
  browse.close()
  return lists;
}

exports.ridiSelect = async (books) => {
  const platform = 'ridiselect'
  const title = books.title;
  const url = 'https://select.ridibooks.com/search?q=' + encodeURI(title) +'&type=Books';
  const selector = "#app > main > ul> li";
  const childSelectorArr = [
    "div > div > a > h3 ",
    "div > div > a > span.SearchResultBookList_Authors",
    "div > div > a > span.SearchResultBookList_Publisher",
  ]
  const data = await pupRequest(url, selector, childSelectorArr, platform);
  return data
}

exports.milli = async (books) => {
  const platform = 'milli'
  const title = books.title;
  const url = 'https://www.millie.co.kr/v3/search/result/'+ encodeURI(title) +'?type=all&order=keyword&category=1';
  const selector = "#wrap > section > div > section.search-list > div > ul > li";
  const childSelectorArr = [
    "a > div.body > span.title",
    "a > div.body > div > span",
    ""
  ]
  const data = await pupRequest(url, selector, childSelectorArr, platform);
  return data
}

exports.yes24 = books => new Promise((resolved, rejected) => {
  const title = books.title;
  const url = 'https://bookclub.yes24.com/BookClub/Search?keyword='+encodeURI(title) +'&OrderBy=01&pageNo=2';
  console.log(url);
  request.get(url, (err, res, body) => {
    const $ = cheerio.load(body)
    console.log(body)
  })
  resolved(true)
})

exports.kyoBoBook = books => new Promise((resolved, rejected) => {
  const title = books.title;
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
