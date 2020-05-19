getBooks = (req, res, next) => {
  if(req.params.Title){
    req.models.Book.find({Title: req.body.title})
    .then((book) =>  res.send(book))
    .catch((error) => next(error))
  } else {
    req.models.Book.find()
    .then(books => res.send(books))
    .catch(error => next(error))
  }
}

showBook = (req, res, next) => {
  req.models.Book.findOne({ISBN: req.params.ISBN})
  .then(book => res.send(book))
  .catch(error => next(error))
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
  .catch(error => next(error))
}

deleteBook = (req, res, next) => {
    req.models.Book.deleteOne({ISBN: req.params.ISBN})
    .then(deleted => {
      if(deleted){
        res.sendStatus(202)
      } else {
        res.sendStatus(204)
      }
    })
    .catch(error => next(error))
}

updateBook = (req, res, next) => {
  const { ISBN, Title, Author, Price, SellerEmail, Used } = req.body
  const { City, Street } = req.body.Location
  req.models.Book.updateOne({ISBN: req.params.ISBN},
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
  }},
    {
    new: true,
    upsert: true,
    runvalidators: true,
    })
    .then(status => {
      if (status.upserted){
        res.status(201)
      } else if (status.nModified) {
        res.status(200)
      }
      else {
        res.status(204)
      }
      if(res.statusCode !== 204){
        req.models.Book.findOne({"ISBN": "978-0-321-87758-1"})
        .then(book => res.send(book))
        .catch(error => next(error))
      }
      res.send()
    })
    .catch(error => next(error))
}



module.exports = {
  getBooks,
  showBook,
  createBook,
  updateBook,
  deleteBook
}

