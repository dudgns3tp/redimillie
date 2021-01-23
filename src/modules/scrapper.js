const request = require('request');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const pupRequest = async (url, selector, childSelectorArr, platform, title) => {
  const [TITLE, AUTHOR, PUBLISHER, REDIRECT_URL] = [0, 1, 2, 3];
  const browse = await puppeteer.launch();
  const page = await browse.newPage();
  await page.goto(url);
  const content = await page.content();
  const $ = cheerio.load(content);
  let lists = [];
  $(selector).each((_, list) => {
    const titleName = $(list).find(childSelectorArr[TITLE]).text();
    const authorName = $(list).find(childSelectorArr[AUTHOR]).text();
    const publisherName = $(list).find(childSelectorArr[PUBLISHER]).text();
    const redirectURL = $(list)
      .find(childSelectorArr[REDIRECT_URL])
      .attr('href');
    lists.push({
      titleName,
      authorName,
      publisherName,
      platform,
      redirectURL,
    });
  });
  browse.close();
  if (lists.length) {
    return lists.filter((item) => title.match(item.titleName))[0];
  }
  return;
};

exports.ridiSelect = async (title) => {
  const platform = 'ridiselect';
  const url =
    'https://select.ridibooks.com/search?q=' + encodeURI(title) + '&type=Books';
  const selector = '#app > main > ul> li';
  const childSelectorArr = [
    'div > div > a > h3 ',
    'div > div > a > span.SearchResultBookList_Authors',
    'div > div > a > span.SearchResultBookList_Publisher',
    'div > div > a',
  ];
  let book = await pupRequest(url, selector, childSelectorArr, platform, title);
  return book;
};

exports.milli = async (title) => {
  const platform = 'milli';
  const url =
    'https://www.millie.co.kr/v3/search/result/' +
    encodeURI(title) +
    '?type=all&order=keyword&category=1';
  const selector =
    '#wrap > section > div > section.search-list > div > ul > li';
  const childSelectorArr = [
    'a > div.body > span.title',
    'a > div.body > div > span',
    '',
    'a',
  ];
  const book = await pupRequest(
    url,
    selector,
    childSelectorArr,
    platform,
    title
  );
  return book;
};

exports.yes24 = (title) =>
  new Promise((resolved, rejected) => {
    const url =
      'https://bookclub.yes24.com/BookClub/Search?keyword=' +
      encodeURI(title) +
      '&OrderBy=01&pageNo=1';

    const options = {
      url,
      headers: { 'User-Agent': 'Mozilla/5.0' },
      encoding: null,
    };

    request.get(options, function (error, response, body) {
      if (error) {
        rejected(response.statusCode);
      }

      const $ = cheerio.load(body);
      const selector = '#ulGoodsList > li';
      const childSelectorArr = ['div > div > div > a', 'div > p > span > a'];
      let books = {};

      $(selector).each((_, list) => {
        const title = $(list).find(childSelectorArr[0]).text();
        const redirectURL = $(list).find(childSelectorArr[1]).attr('href');
        books = {
          title,
          redirectURL: 'http://bookclub.yes24.com' + redirectURL,
        };
      });
      resolved(books);
    });
  });

exports.kyoBoBook = async (title) => {
  const platform = 'kyoBoSam';
  const url =
    'https://search.kyobobook.co.kr/web/search?vPstrKeyWord=' +
    encodeURI(title) +
    '&orderClick=LEK&searchCategory=SAM%40DIGITAL&collName=DIGITAL&searchPcondition=1';
  const selector = '#search_list > tr';
  const childSelectorArr = [
    'td.detail > div.title > a > strong',
    'td.detail > div.author > a:nth-child(1)',
    '',
  ];
  const book = await pupRequest(
    url,
    selector,
    childSelectorArr,
    platform,
    title
  );
  return book;
};

//@todo Map 한글플랫폼 -> 영어 플랫폼으로 바꿔주기
exports.searchNaverBook = (bid) =>
  new Promise((resolved, rejected) => {
    const url = 'https://book.naver.com/bookdb/book_detail.nhn?bid=' + bid;
    const options = {
      url,
      headers: { 'User-Agent': 'Mozilla/5.0' },
      encoding: null,
    };

    request.get(options, function (error, response, body) {
      if (error) {
        rejected(response.statusCode);
      }

      const $ = cheerio.load(body);
      const selector = '#productListLayer > ul > li';
      let lists = [];

      $(selector).each((_, list) => {
        const isEbook = $(list).find('strong').text();
        const platform = $(list).find('div > a').text();
        const price = $(list).find('span > em').text();
        if (isEbook.match('ebook')) {
          lists.push({
            platform: platform.split('Naver')[0],
            price: price.split('원')[0],
          });
        }
      });

      resolved(lists);
    });
  });
