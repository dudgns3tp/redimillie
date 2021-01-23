const request = require('request');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
/**
 * baseURL: https://select.ridibooks.com/search?q=%EC%8B%9C%EA%B0%84&type=Books
 * parameter: title(String)
 * input: Json
 * output: -{title: String, isExisted: boolean}
 */

const pupRequest = async (url, selector, childSelectorArr, platform, title) => {
  const [TITLE, AUTHOR, PUBLISHER, REDIRECT_URL] = [0, 1, 2, 3];
  const browse = await puppeteer.launch();
  const page = await browse.newPage();
  await page.goto(url);
  const content = await page.content();
  const $ = cheerio.load(content);
  const lists = [];
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
  lists.filter((item) => title.match(item.titleName));
  return lists[0];
};

const pricePupRequest = async (url, selectors) => {
  const [PRICE, RENT_PRICE] = [0, 1];
  const browse = await puppeteer.launch();
  const page = await browse.newPage();
  await page.goto(url);

  const content = await page.content();
  const $ = cheerio.load(content);
  prices = {
    price: $(selectors[PRICE]).text(),
    rentPrice: $(selectors[RENT_PRICE]).text(),
  };
  browse.close();
  return prices;
};

exports.ridiSelect = async (books) => {
  const platform = 'ridiselect';
  const title = books.title;
  const url =
    'https://select.ridibooks.com/search?q=' + encodeURI(title) + '&type=Books';
  const selector = '#app > main > ul> li';
  const childSelectorArr = [
    'div > div > a > h3 ',
    'div > div > a > span.SearchResultBookList_Authors',
    'div > div > a > span.SearchResultBookList_Publisher',
    'div > div > a',
  ];
  //책 정보
  let book = await pupRequest(url, selector, childSelectorArr, platform, title);
  if (book) {
    book.redirectURL =
      'https://ridibooks.com' + book.redirectURL.replace('book', 'books');

    // 대여, 구매 가격
    const priceSelectors = [
      '#page_detail > div.detail_wrap > div.detail_body_wrap > section > article.detail_header.trackable > div.header_info_wrap > div.info_price_wrap > div > div > table > tbody > tr.selling_price_row > td.book_price > span',
      '#page_detail > div.detail_wrap > div.detail_body_wrap > section > article.detail_header.trackable > div.header_info_wrap > div.info_price_wrap > div > div > table > tbody > tr.single_rent_row.last_rent_row > td.book_price > span',
    ];
    const prices = await pricePupRequest(book.redirectURL, priceSelectors);
    book = {
      ...book,
      ...prices,
    };
  }
  return book;
};

// 밀리의 서재는 책 구매가 없습니다~.
exports.milli = async (books) => {
  const platform = 'milli';
  const title = books.title;
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

exports.yes24 = async (books) => {
  const platform = 'yes24';
  const title = books.title;
  const url =
    'https://bookclub.yes24.com/BookClub/Search?keyword=' +
    encodeURI(title) +
    '&OrderBy=01&pageNo=1';
  const selector = '#ulGoodsList > li';
  const childSelectorArr = [
    'div > div > div > a',
    '',
    '',
    'div > p > span > a',
  ];
  let book = await pupRequest(url, selector, childSelectorArr, platform, title);
  if (book) {
    book.redirectURL =
      'http://www.yes24.com/Product/Goods/' +
      book.redirectURL.split('goodsNo=')[1];

    // 대여, 구매 가격
    const priceSelectors = [
      '#yDetailTopWrap > div.topColRgt > div.gd_infoBot > div.gd_infoTbArea > div:nth-child(3) > table > tbody > tr:nth-child(2) > td > span > em',
      '',
    ];
    const prices = await pricePupRequest(book.redirectURL, priceSelectors);
    book = {
      ...book,
      ...prices,
    };
  }
  return book;
};

exports.kyoBoBook = async (books) => {
  const platform = 'kyoBoSam';
  const title = books.title;
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
