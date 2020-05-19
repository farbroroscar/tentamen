const express = require('express')
const router = express.Router()

const book = require('./book.js')

router.get("/books",          book.getBooks)
router.get("/books",          book.getBooks)
router.get("/books/:ISBN",    book.showBook)
router.post("/books",         book.createBook)
router.put("/books/:ISBN",    book.updateBook)
router.delete("/books/:ISBN", book.deleteBook)
router.delete("/books",       book.deleteBook)

module.exports = router


