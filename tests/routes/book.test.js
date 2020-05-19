// Mongoose and mocking requests
const sinon = require('sinon');

const mongoose = require('mongoose')
mongoose.set('debug', true)
require('sinon-mongoose')

// initialize the app and models
const app = require('../../index.js')

// sending requests
const agent = require('supertest').agent(app);
// validating results
const expect = require('chai').expect;

// get the model
const Book = mongoose.model('Book')

var mock = sinon.mock(Book)

beforeEach(() => {
	mock.restore(); // Unwraps the spy
	mock = sinon.mock(Book)
});

afterEach( () => {
	mock.verify();
});

	const request = {
		"ISBN": "978-0-321-87758-1",
    "Title": "Essential C#5.0",
    "Author": "Mark Michaelis",
    "Price": 59.99,
    "SellerEmail": "someone@someplace.com",
    "Used": true,
    "Location": {
        "City": "Redmond",
        "Street": "156TH AVE NE"
    }
}
	
  const expected = {
    "ISBN": "978-0-321-87758-1",
    "Title": "Essential C#5.0",
    "Author": "Mark Michaelis",
    "Price": 59.99,
    "SellerEmail": "someone@someplace.com",
    "Used": true,
    "Location": {
        "City": "Redmond",
        "Street": "156TH AVE NE"
    }
}


describe('TESTS:', () => {

	describe('books.getBooks', ()  => {

		it('Should return an array of all books', (done) => {

			mock
			.expects('find')
			.chain('exec')
			.resolves([expected]);
	
			agent
			.get('/books')
			.end((err,res) => {
				expect(res.status).to.equal(200);
				expect(res.body).to.eql([expected]);
				done();
			});
		});

		it('Should return an object with the requested titlebook', (done) => {

			mock
			.expects('findOne')
			.chain('exec')
			.resolves(expected);
	
			agent
			.get('/books/Essential C#5.0')
			.end((err,res) => {
				expect(res.status).to.equal(200);
				expect(res.body).to.eql(expected);
				done();
			});
		});
	});


	describe('books.showBook', ()  => {

		it('Should return a book object', (done) => {

			mock
			.expects('findOne')
			.withArgs({"ISBN": "978-0-321-87758-1"})
			.chain('exec')
			.resolves(expected);
	
			agent
			.get('/books/978-0-321-87758-1')
			.end((err,res) => {

				expect(res.status).to.equal(200);
				expect(res.body).to.eql(expected);
				done();
			});
		});
	});

	describe('books.deleteBook', ()  => { 

		it('Should be able to delete a book', (done) => {

			mock
			.expects('deleteOne')
			.withArgs({"ISBN": "978-0-321-87758-1"})
			.chain('exec')
			.resolves(expected);

			agent
			.delete('/books/978-0-321-87758-1')
			.send(request)
			.end((err,res) => {
				expect(res.status).to.eql(200);
				done();
			});
		});

});

	describe('books.updateBook', ()  => { 

    it('Should be able to update a book', (done) => {

      mock
      .expects('findOneAndUpdate')
      .withArgs({"ISBN": "978-0-321-87758-1"}, request)
      .chain('exec')
      .resolves({ n: 1, nModified: 1, ok: 1 });

      agent
			.put('/books/978-0-321-87758-1')
      .send(request)
      .end((err,res) => {
        expect(res.status).to.eql(200);
        done();
      });
    });
  });


	describe('books.createBook', ()  => {

		it('Should be able to post one book', (done) => {
	
			mock
			.expects('create')
			.withArgs(request)
			.chain('exec')
			.resolves([expected]);
	
			agent
			.post('/books')
      .send(request)
			.end((err,res) => {
				expect(res.status).to.equal(201);
				expect(res.body).to.eql([expected]);
				done();
			});
		});
	});
})
