const Location = require('./location');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Locations', () => {
    describe('/GET location', () => {
        it('it should GET all the books', (done) => {
          chai.request('http://localhost:3000')
              .get('/location')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                done();
              });
        });
    });
    /*
    describe('/POST location', () => {
        it('it should POST a location', (done) => {
            let book = {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                year: 1954
            }
          chai.request(server)
              .post('/location/noimage')
              .send(book)
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('pages');
                    res.body.errors.pages.should.have.property('kind').eql('required');
                done();
              });
        });
  
    });*/
  
  });
  