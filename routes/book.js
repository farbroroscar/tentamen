getBooks = (req, res, next) => {
  if(req.params.Title){
    req.models.Book.find({Title: req.body.title})
    .then((book) =>  res.send(book))
    .catch((error) => next(error))
  }

  else {
    req.models.Book.find().then((books) => {
      return res.send(books);
    }).catch((error) => next(error))
  }
}


showBook = (req, res, next) => {
  req.models.Book.findOne({ISBN: req.params.ISBN})
  .then(book => res.send(book))
  .catch((error) => next(error))
}

createBook = (req, res, next) => {
  const { ISBN, Title, Author, Price, SellerEmail, Used } = req.body
  const { City, Street } = req.body.Location
  req.models.Book.create({
    ISBN,
    Title,
    Author,
    Price,
    SellerEmail,
    Used,
    Location: {
      City,
      Street
    }
  })
  .then(newBook => res.status(201).send(newBook))
  .catch((error) => next(error))
}

deleteBook = (req, res, next) => {
    req.models.Book.deleteOne({ISBN: req.params.ISBN})
    .then(deleted => res.send(deleted).status(200))
    .catch(info => res.send(info).status(204))
}

updateBook = (req, res, next) => {
  const { ISBN, Title, Author, Price, SellerEmail, Used } = req.body
  const { City, Street } = req.body.Location
  req.models.Book.findOneAndUpdate({ISBN: req.params.ISBN},
  { 
    ISBN,
    Title,
    Author,
    Price,
    SellerEmail,
    Used,
    Location: {
      City,
      Street
    }
  })
  .then((updatedBook) => res.send(updatedBook).status(201))
  .catch((error) => next(error).status(204))
}



module.exports = {
  getBooks,
  showBook,
  createBook,
  updateBook,
  deleteBook
}

