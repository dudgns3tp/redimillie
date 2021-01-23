const naverAPI = require('../modules/naverBookApi');
const sc = require('../modules/statusCode');
const ut = require('../modules/util');
const rm = require('../modules/responseMessage');

exports.naverAPI = async (req, res) => {
    const start = req.query.start || 1;

	try {
        if(!req.query.query) {
            return res.status(400).json(ut.fail(rm.NULL_VALUE));
        }

		const apiBooks = await naverAPI.callBookApi(req.query.query, start);
		const books = apiBooks.map(book => {
			let bookTitle = JSON
				.stringify(book.title)
				.replace(/(<b>)|(<\/b>)/gi, '')
				.replace(/ *\([^)]*\) */g, "");
			let bookDescription = JSON
				.stringify(book.description)
                .replace(/(<b>)|(<\/b>)/gi, '');
                
			return {
				title: JSON.parse(bookTitle),
				link: book.link,
				image: book.image,
				author: book.author,
				isbn: book.isbn,
				description: JSON.parse(bookDescription)
			}
		})

		// const [ridi, milli, yes24, kyoBo] = await Promise.all([
		// 	scrapper.ridiSelect(books[0]), 
		// 	scrapper.milli(books[0]), 
		// 	scrapper.yes24(books[0]),
		// 	scrapper.kyoBoBook(books[0])
		// ]);
		// const dto = [ridi, milli, yes24, kyoBo].filter(item => `${books[0].title}`.match(item.titleName));
		res.status(200).json(ut.success(rm.GET_NAVER_BOOK_SUCCESS, books));
	} catch (err) {
		console.log(err)
		res.status(500).json(ut.fail(rm.GET_NAVER_BOOK_FAIL));
	}
}