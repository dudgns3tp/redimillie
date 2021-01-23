const naverAPI = require('../modules/naverBookApi');
const scrapper = require('../modules/scrapper');
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');

exports.naverAPI = async (req, res) => {
  const start = req.query.start || 1;
  try {
    if (!req.query.query) {
      return res.status(400).json(ut.fail(rm.NULL_VALUE));
    }
    const apiBooks = await naverAPI.callBookApi(req.query.query, start);
    const books = apiBooks.map((book) => {
      let bookTitle = JSON.stringify(book.title)
        .replace(/(<b>)|(<\/b>)/gi, '')
        .replace(/ *\([^)]*\) */g, '');
      let bookDescription = JSON.stringify(book.description).replace(
        /(<b>)|(<\/b>)/gi,
        ''
      );
      return {
        title: JSON.parse(bookTitle),
        link: book.link,
        image: book.image,
        author: book.author,
        isbn: book.isbn,
        description: JSON.parse(bookDescription),
      };
    });

    res.status(200).json(ut.success(rm.GET_NAVER_BOOK_SUCCESS, books));
  } catch (err) {
    console.log(err);
    res.status(500).json(ut.fail(rm.GET_NAVER_BOOK_FAIL));
  }
};

/**
 * @body = title, link
 * @return  json array
 */
exports.crawling = async (req, res) => {
  const { title, link } = req.query;

  if (!title) {
    return res.status(400).json(ut.fail(rm.NULL_VALUE));
  }

  console.log(title);
  try {
    let dto = await Promise.all([
      scrapper.ridiSelect(title),
      scrapper.milli(title),
      scrapper.yes24(title),
      scrapper.kyoBoBook(title),
    ]);
    console.log(dto);
    dto = dto.filter((item) => `${title}`.match(item.titleName));
    res.status(200).json(ut.success(rm.GET_CRAWLING_BOOKS_SUCCESS, dto));
  } catch (err) {
    console.log(err);
    res.status(500).json(ut.fail(rm.GET_CRAWLING_BOOKS_FAILED));
  }
};
