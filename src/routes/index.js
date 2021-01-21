const express = require('express');
const dotenv = require('dotenv');

const router = express.Router();
const naverAPI = require('../modules/naverBookApi');
const scrapper = require('../modules/scrapper');

dotenv.config()

router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

router.get('/apis', async (req, res) => {
	try {
		const apiBooks = await naverAPI.callBookApi(req.query.query);
		const books = apiBooks.map(book => {
			let bookTitle = JSON
				.stringify(book.title)
				.replace(/(<b>)|(<\/b>)/gi, '')
				.replace(/ *\([^)]*\) */g, "");
			let bookDescription = JSON
				.stringify(book.description)
				.replace(/(<b>)|(<\/b>)/gi, '')
			return {
				title: JSON.parse(bookTitle),
				link: book.link,
				image: book.image,
				author: book.author,
				isbn: book.isbn,
				description: JSON.parse(bookDescription)
			}
		})
		console.log(books[0])
		/*
		const ridi = await scrapper.ridiSelect(books[0]);
		const milli = await scrapper.milli(books[0]);
		const yes24 = await scrapper.yes24(books[0]);
		const kyoBo = await scrapper.kyoBoBook(books[0])
		const dto = [...ridi, ...milli, ...yes24, ...kyoBo] 
			.filter(item => `${books[0].title}`.match(item.titleName));
		*/
		
		const [ridi, milli, yes24, kyoBo] = await Promise.all([
			scrapper.ridiSelect(books[0]), 
			scrapper.milli(books[0]), 
			scrapper.yes24(books[0]),
			scrapper.kyoBoBook(books[0])
		]);
		const dto = [ridi, milli, yes24, kyoBo].filter(item => `${books[0].title}`.match(item.titleName));;

		res.status(200).send(dto)
	} catch (err) {
		console.log(err)
		res.status(500).send(err)
	}
})


module.exports = router;
