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

router.get('/apis', async (req,res) => {
	try{
	const books = await naverAPI.callBookApi(req.query.query);
	const refinedBooks = books.map(book => {
		let bookTitle = JSON.stringify(book.title)
			.replace(/(<b>)|(<\/b>)/gi,'')
			.replace(/ *\([^)]*\) */g, "");
		let bookDescription = JSON.stringify(book.description)
			.replace(/(<b>)|(<\/b>)/gi,'')
		return {
			title: JSON.parse(bookTitle),
			link: book.link,
			image: book.image,
			author: book.author,
			isbn: book.isbn,
			description: JSON.parse(bookDescription)
		}
	})
	console.log(refinedBooks[0])
	const ridi = await scrapper.ridiSelect(refinedBooks[0]);
	const milli = await scrapper.milli(refinedBooks[0]);

	 res.status(200).send({ridi, milli})
	} catch(err) {
		console.log(err)
		res.status(500).send({})
	}
})


module.exports = router;
